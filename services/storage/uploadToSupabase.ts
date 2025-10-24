import { supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";

// Define our own FileInfo type that includes size
type FileInfoWithSize = FileSystem.FileInfo & {
  size?: number;
};

type FileType = "image" | "video" | "document" | "audio";

interface UploadOptions {
  /**
   * The bucket name in Supabase storage
   */
  bucket: "bep-bucket";
  /**
   * The path within the bucket where the file will be stored
   */
  path?: string;
  /**
   * The type of file being uploaded - helps with setting proper content types
   */
  fileType?: FileType;
  /**
   * Optional file name override - if not provided, will use the original filename
   */
  fileName?: string;
  /**
   * Optional callback to track upload progress
   * @param progress Progress value between 0-1
   */
  onProgress?: (progress: number) => void;
  /**
   * Optional metadata to attach to the file
   */
  metadata?: Record<string, string>;
}

/**
 * Determines the MIME type based on file extension
 */
const getMimeType = (uri: string, fileType: FileType = "image"): string => {
  const extension = uri.split(".").pop()?.toLowerCase();

  const mimeTypes: Record<string, string> = {
    // Images
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",

    // Videos
    mp4: "video/mp4",
    mov: "video/quicktime",
    avi: "video/x-msvideo",
    webm: "video/webm",

    // Documents
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",

    // Audio
    mp3: "audio/mpeg",
    wav: "audio/wav",
    ogg: "audio/ogg",
    m4a: "audio/mp4",
  };

  if (extension && mimeTypes[extension]) {
    return mimeTypes[extension];
  }

  // Default mime types by file category
  const defaultMimes: Record<FileType, string> = {
    image: "image/jpeg",
    video: "video/mp4",
    document: "application/octet-stream",
    audio: "audio/mpeg",
  };

  return defaultMimes[fileType];
};

/**
 * Uploads a file from a local URI to Supabase Storage
 * @param uri Local URI of the file to upload
 * @param options Upload configuration options
 * @returns The Supabase storage URL of the uploaded file
 */
/**
 * Main function to upload files to Supabase Storage
 * Handles automatic fallback to different upload methods based on file size
 * @param uri Local URI of the file to upload
 * @param options Upload configuration options
 * @returns The public URL of the uploaded file
 */
export const uploadToSupabase = async (
  uri: string,
  options: UploadOptions
): Promise<string> => {
  console.log("file", uri, "----")
  if (uri.startsWith("http")) {
    return uri;
  }
  try {
    const fileInfo = (await FileSystem.getInfoAsync(uri, {
      size: true,
    })) as FileInfoWithSize;

    // For large files (>10MB), use the progress tracking version
    if (
      fileInfo.size &&
      fileInfo.size > 10 * 1024 * 1024 &&
      options.onProgress
    ) {
      return uploadFileWithProgress(uri, options);
    } else {
      return uploadFileToSupabase(uri, options);
    }
  } catch (error) {
    console.error("Error in uploadToSupabase:", error);
    throw error;
  }
};

/**
 * Uploads a file from a local URI to Supabase Storage
 * @param uri Local URI of the file to upload
 * @param options Upload configuration options
 * @returns The Supabase storage URL of the uploaded file
 */
export const uploadFileToSupabase = async (
  uri: string,
  options: UploadOptions
): Promise<string> => {
  if (uri.startsWith("http")) {
    return uri;
  }
  try {
    // Get the file info to extract the file name if not provided
    const fileInfo = await FileSystem.getInfoAsync(uri, { size: true });
    if (!fileInfo.exists) {
      throw new Error("File does not exist");
    }

    // Extract original filename from URI if not provided in options
    const originalFileName = uri.split("/").pop() || "file";
    const fileName = options.fileName || originalFileName;

    // Determine the final path for the file
    const filePath = options.path ? `${options.path}/${fileName}` : fileName;

    // Use Expo FileSystem to read the file as base64
    const base64Data = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Convert base64 to ArrayBuffer which is required by Supabase
    const arrayBuffer = decode(base64Data);

    // Get appropriate mime type
    const contentType = getMimeType(uri, options.fileType);

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(options.bucket)
      .upload(filePath, arrayBuffer, {
        contentType,
        upsert: true, // Overwrite if file with same path exists
        ...(options.metadata && { metadata: options.metadata }),
      });

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error("Upload failed - no data returned");
    }

    // Get the public URL of the uploaded file
    const {
      data: { publicUrl },
    } = supabase.storage.from(options.bucket).getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error("Error uploading file to Supabase:", error);

    // More detailed error logging
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error name:", error.name);
      console.error("Error stack:", error.stack);

      // Additional context for Supabase errors
      if ("statusCode" in error) {
        console.error("Status code:", (error as any).statusCode);
      }

      if ("details" in error) {
        console.error("Error details:", (error as any).details);
      }
    }

    throw error;
  }
};

/**
 * Uploads multiple files to Supabase Storage
 * @param uris Array of file URIs to upload
 * @param options Upload configuration options
 * @returns Array of public URLs for the uploaded files
 */
export const uploadMultipleFilesToSupabase = async (
  uris: string[],
  options: UploadOptions
): Promise<string[]> => {
  try {
    const uploadPromises = uris.map(async (uri, index) => {
      // Create a unique file name if not provided
      const fileName = options.fileName
        ? `${index}_${options.fileName}`
        : undefined;

      return uploadFileToSupabase(uri, {
        ...options,
        fileName,
      });
    });

    return Promise.all(uploadPromises);
  } catch (error) {
    console.error("Error uploading multiple files to Supabase:", error);
    throw error;
  }
};

/**
 * Uploads a file with progress tracking
 * @param uri Local URI of the file to upload
 * @param options Upload configuration options
 * @returns The Supabase storage URL of the uploaded file
 */
export const uploadFileWithProgress = async (
  uri: string,
  options: UploadOptions
): Promise<string> => {
  try {
    // For large files requiring progress tracking, we need a different approach
    // First, get a signed URL for direct upload
    const originalFileName = uri.split("/").pop() || "file";
    const fileName = options.fileName || originalFileName;
    const filePath = options.path ? `${options.path}/${fileName}` : fileName;

    // Create a signed URL for the file upload
    const { data: signedURLData, error: signedURLError } =
      await supabase.storage
        .from(options.bucket)
        .createSignedUploadUrl(filePath, { upsert: true });

    if (signedURLError) {
      throw signedURLError;
    }

    // Note: Supabase returns 'signedUrl' (lowercase 'u')
    const { signedUrl, path } = signedURLData;

    // Use Expo's FileSystem.uploadAsync to upload with progress tracking
    // Using a workaround for the uploadProgress typing issue
    const uploadOptions: any = {
      httpMethod: "PUT",
      uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
      headers: {
        "Content-Type": getMimeType(uri, options.fileType),
      },
      sessionType: FileSystem.FileSystemSessionType.BACKGROUND,
    };

    // Add uploadProgress if available
    if (options.onProgress) {
      uploadOptions.uploadProgress = ({
        totalBytesWritten,
        totalBytesExpectedToWrite,
      }: {
        totalBytesWritten: number;
        totalBytesExpectedToWrite: number;
      }) => {
        const progress = totalBytesWritten / totalBytesExpectedToWrite;
        options.onProgress?.(progress);
      };
    }

    const uploadResult = await FileSystem.uploadAsync(
      signedUrl,
      uri,
      uploadOptions
    );

    if (uploadResult.status < 200 || uploadResult.status >= 300) {
      throw new Error(`Upload failed with status code ${uploadResult.status}`);
    }

    // Get the public URL of the uploaded file
    const {
      data: { publicUrl },
    } = supabase.storage.from(options.bucket).getPublicUrl(path);

    return publicUrl;
  } catch (error) {
    console.error("Error uploading file with progress:", error);
    throw error;
  }
};

/**
 * Deletes a file from Supabase Storage
 * @param bucket The bucket name in Supabase storage
 * @param path The full path of the file to delete
 * @returns True if deletion was successful
 */
export const deleteFileFromSupabase = async (
  bucket: string,
  path: string
): Promise<boolean> => {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error deleting file from Supabase:", error);

    // Check if it's a "not found" error which we can consider as a successful deletion
    if (error instanceof Error && error.message.includes("Object not found")) {
      return true; // Consider this a success since the file doesn't exist anyway
    }

    return false;
  }
};

/**
 * Example usage of the upload functions
 */
/* 
Example 1: Basic file upload

import { uploadToSupabase } from '@/services/storage/uploadToSupabase';

// After selecting an image from image picker or taking a photo
const handleUploadImage = async (uri: string) => {
  try {
    const imageUrl = await uploadToSupabase(uri, {
      bucket: 'profile-pictures',
      path: `user-${userId}`,
      fileType: 'image',
    });
    
        return imageUrl;
  } catch (error) {
    console.error('Failed to upload image:', error);
    throw error;
  }
};

Example 2: Upload with progress tracking

import { uploadToSupabase } from '@/services/storage/uploadToSupabase';
import { useState } from 'react';

const UploadComponent = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const handleUploadVideo = async (uri: string) => {
    try {
      const videoUrl = await uploadToSupabase(uri, {
        bucket: 'videos',
        path: 'trip-recordings',
        fileType: 'video',
        fileName: `trip-${tripId}-${Date.now()}.mp4`,
        onProgress: (progress) => {
          setUploadProgress(Math.round(progress * 100));
        },
        metadata: {
          tripId: tripId,
          recordedBy: userName,
          timestamp: new Date().toISOString(),
        },
      });
      
            return videoUrl;
    } catch (error) {
      console.error('Video upload failed:', error);
      throw error;
    }
  };
  
  return (
    <View>
      <Button title="Upload Video" onPress={() => handleUploadVideo(videoUri)} />
      {uploadProgress > 0 && uploadProgress < 100 && (
        <Text>Uploading: {uploadProgress}%</Text>
      )}
    </View>
  );
};
*/
