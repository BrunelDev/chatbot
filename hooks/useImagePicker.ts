import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { Alert, Platform } from "react-native";

export const useImagePicker = () => {
  // Demander les permissions pour accéder à la galerie
  const requestPermissions = async (): Promise<boolean> => {
    try {
      // Sur le web, pas besoin de permissions spéciales
      if (Platform.OS === "web") {
        return true;
      }

      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission requise",
          "Nous avons besoin d'accéder à vos photos pour changer votre photo de profil.",
          [{ text: "OK" }]
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error("Erreur lors de la demande de permissions:", error);
      // Sur certaines plateformes, on peut continuer même en cas d'erreur de permissions
      return Platform.OS === "web";
    }
  };

  // Sélectionner une image depuis la galerie
  const pickImageFromGallery = async (): Promise<string | null> => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return null;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Aspect carré pour la photo de profil
        quality: 0.8,
        base64: false,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
      }

      const selectedImage = result.assets[0];
      return selectedImage.uri;
    } catch (error) {
      console.error("Erreur lors de la sélection de l'image:", error);
      Alert.alert(
        "Erreur",
        "Impossible de sélectionner l'image. Veuillez réessayer.",
        [{ text: "OK" }]
      );
      return null;
    }
  };

  // Sélectionner une image pour le chat (sans édition forcée)
  const pickImageForChat = async (): Promise<{
    uri: string;
    name: string;
    size: number;
  } | null> => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return null;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // Pas d'édition forcée pour le chat
        quality: 0.8,
        base64: false,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
      }

      const selectedImage = result.assets[0];
      return {
        uri: selectedImage.uri,
        name: selectedImage.fileName || "image.jpg",
        size: selectedImage.fileSize || 0,
      };
    } catch (error) {
      console.error("Erreur lors de la sélection de l'image:", error);
      Alert.alert(
        "Erreur",
        "Impossible de sélectionner l'image. Veuillez réessayer.",
        [{ text: "OK" }]
      );
      return null;
    }
  };

  // Sauvegarder l'image localement
  const saveImageLocally = async (
    imageUri: string,
    fileName?: string
  ): Promise<string | null> => {
    try {
      // Utiliser l'ancienne API pour plus de compatibilité
      const appDirectory = `${FileSystem.documentDirectory}images/`;

      // Créer le dossier s'il n'existe pas
      const dirInfo = await FileSystem.getInfoAsync(appDirectory);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(appDirectory, {
          intermediates: true,
        });
      }

      // Générer un nom de fichier unique avec timestamp
      const timestamp = Date.now();
      const finalFileName = fileName || `profile_image_${timestamp}.jpg`;
      const localUri = `${appDirectory}${finalFileName}`;

      // Supprimer l'ancienne image de profil si elle existe
      const oldImageUri = await getImageUri();
      if (oldImageUri) {
        try {
          const oldFileInfo = await FileSystem.getInfoAsync(oldImageUri);
          if (oldFileInfo.exists) {
            await FileSystem.deleteAsync(oldImageUri);
          }
        } catch (deleteError) {
          console.warn(
            "Impossible de supprimer l'ancienne image:",
            deleteError
          );
        }
      }

      // Copier l'image vers le stockage local
      await FileSystem.copyAsync({
        from: imageUri,
        to: localUri,
      });

      return localUri;
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'image:", error);
      Alert.alert(
        "Erreur",
        "Impossible de sauvegarder l'image. Veuillez réessayer.",
        [{ text: "OK" }]
      );
      return null;
    }
  };

  // Sauvegarder l'URI de l'image dans AsyncStorage
  const saveImageUri = async (imageUri: string): Promise<void> => {
    try {
      await AsyncStorage.setItem("profileImageUri", imageUri);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'URI de l'image:", error);
    }
  };

  // Récupérer l'URI de l'image depuis AsyncStorage
  const getImageUri = async (): Promise<string | null> => {
    try {
      const imageUri = await AsyncStorage.getItem("profileImageUri");

      // Vérifier si le fichier existe toujours
      if (imageUri) {
        try {
          const fileInfo = await FileSystem.getInfoAsync(imageUri);
          if (fileInfo.exists) {
            return imageUri;
          } else {
            // Supprimer l'URI si le fichier n'existe plus
            await AsyncStorage.removeItem("profileImageUri");
          }
        } catch (fileError) {
          // Si l'URI n'est pas valide, supprimer de AsyncStorage
          await AsyncStorage.removeItem("profileImageUri");
        }
      }

      return null;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de l'URI de l'image:",
        error
      );
      return null;
    }
  };

  // Fonction complète pour sélectionner et sauvegarder une image
  const selectAndSaveImage = async (): Promise<string | null> => {
    try {
      // Sélectionner l'image
      const selectedImageUri = await pickImageFromGallery();
      if (!selectedImageUri) return null;

      // Supprimer l'ancienne image de profil avant de sauvegarder la nouvelle
      await removeProfileImage();

      // Sauvegarder l'image localement
      const localImageUri = await saveImageLocally(selectedImageUri);
      if (!localImageUri) return null;

      // Sauvegarder l'URI dans AsyncStorage
      await saveImageUri(localImageUri);

      // Nettoyer les anciennes images
      await cleanupOldImages();

      return localImageUri;
    } catch (error) {
      console.error(
        "Erreur lors de la sélection et sauvegarde de l'image:",
        error
      );
      return null;
    }
  };

  // Supprimer l'image de profil
  const removeProfileImage = async (): Promise<void> => {
    try {
      const imageUri = await getImageUri();
      if (imageUri) {
        try {
          // Supprimer le fichier avec l'ancienne API
          const fileInfo = await FileSystem.getInfoAsync(imageUri);
          if (fileInfo.exists) {
            await FileSystem.deleteAsync(imageUri);
          }
        } catch (fileError) {
          console.warn("Impossible de supprimer le fichier:", fileError);
        }

        // Supprimer l'URI d'AsyncStorage
        await AsyncStorage.removeItem("profileImageUri");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'image:", error);
    }
  };

  // Fonction utilitaire pour nettoyer les anciennes images
  const cleanupOldImages = async (): Promise<void> => {
    try {
      const appDirectory = `${FileSystem.documentDirectory}images/`;
      const dirInfo = await FileSystem.getInfoAsync(appDirectory);

      if (dirInfo.exists) {
        const files = await FileSystem.readDirectoryAsync(appDirectory);
        const profileImages = files.filter((file) =>
          file.startsWith("profile_image_")
        );

        // Garder seulement les 3 images les plus récentes
        if (profileImages.length > 3) {
          const sortedImages = profileImages.sort().reverse();
          const imagesToDelete = sortedImages.slice(3);

          for (const image of imagesToDelete) {
            try {
              await FileSystem.deleteAsync(`${appDirectory}${image}`);
            } catch (error) {
              console.warn(`Impossible de supprimer ${image}:`, error);
            }
          }
        }
      }
    } catch (error) {
      console.warn("Erreur lors du nettoyage des anciennes images:", error);
    }
  };

  return {
    selectAndSaveImage,
    getImageUri,
    removeProfileImage,
    pickImageFromGallery,
    pickImageForChat,
    saveImageLocally,
    saveImageUri,
    cleanupOldImages,
  };
};
