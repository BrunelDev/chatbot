import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";

/**
 * Supprime toutes les données stockées localement lors de la suppression du compte
 */
export const deleteAllUserData = async (): Promise<void> => {
  try {
    console.log(
      "🧹 Début de la suppression de toutes les données utilisateur...",
    );

    // 1. Supprimer toutes les données AsyncStorage
    const asyncStorageKeys = [
      "accessToken",
      "refreshToken",
      "userInfo",
      "accountType",
      "isOnboardingComplete",
      "profileImageUri",
      "hairProfile",
      "chatId",
    ];

    console.log("🗑️ Suppression des données AsyncStorage...");
    await AsyncStorage.multiRemove(asyncStorageKeys);

    // 2. Supprimer la photo de profil et toutes les images stockées localement
    console.log("🖼️ Suppression des images de profil...");
    await deleteAllProfileImages();

    // 3. Supprimer le dossier images s'il est vide
    await cleanupImagesDirectory();

    console.log("✅ Suppression de toutes les données terminée avec succès");
  } catch (error) {
    console.error("❌ Erreur lors de la suppression des données:", error);
    throw error;
  }
};

/**
 * Supprime toutes les images de profil stockées localement
 */
const deleteAllProfileImages = async (): Promise<void> => {
  try {
    const appDirectory = `${FileSystem.documentDirectory}images/`;
    const dirInfo = await FileSystem.getInfoAsync(appDirectory);

    if (dirInfo.exists) {
      const files = await FileSystem.readDirectoryAsync(appDirectory);
      const profileImages = files.filter((file) =>
        file.startsWith("profile_image_"),
      );

      console.log(
        `📸 Suppression de ${profileImages.length} image(s) de profil...`,
      );

      // Supprimer toutes les images de profil
      for (const image of profileImages) {
        try {
          await FileSystem.deleteAsync(`${appDirectory}${image}`);
          console.log(`✅ Image supprimée: ${image}`);
        } catch (error) {
          console.warn(`⚠️ Impossible de supprimer ${image}:`, error);
        }
      }
    }
  } catch (error) {
    console.error("❌ Erreur lors de la suppression des images:", error);
    throw error;
  }
};

/**
 * Nettoie le dossier images s'il est vide après suppression
 */
const cleanupImagesDirectory = async (): Promise<void> => {
  try {
    const appDirectory = `${FileSystem.documentDirectory}images/`;
    const dirInfo = await FileSystem.getInfoAsync(appDirectory);

    if (dirInfo.exists) {
      const files = await FileSystem.readDirectoryAsync(appDirectory);

      // Si le dossier est vide, le supprimer
      if (files.length === 0) {
        await FileSystem.deleteAsync(appDirectory);
        console.log("📁 Dossier images supprimé (vide)");
      } else {
        console.log(
          `📁 Dossier images conservé (${files.length} fichier(s) restant(s))`,
        );
      }
    }
  } catch (error) {
    console.warn("⚠️ Erreur lors du nettoyage du dossier images:", error);
    // Ne pas faire échouer la suppression pour cette étape
  }
};

/**
 * Supprime uniquement les données de session (pour logout)
 */
export const deleteSessionData = async (): Promise<void> => {
  try {
    console.log("🚪 Suppression des données de session...");

    const sessionKeys = [
      "accessToken",
      "refreshToken",
      "userInfo",
      "accountType",
      "isOnboardingComplete",
      //"chatId",
    ];

    await AsyncStorage.multiRemove(sessionKeys);
    console.log("✅ Données de session supprimées");
  } catch (error) {
    console.error(
      "❌ Erreur lors de la suppression des données de session:",
      error,
    );
    throw error;
  }
};
