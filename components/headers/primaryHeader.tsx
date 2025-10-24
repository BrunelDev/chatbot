import { useImagePicker } from "@/hooks/useImagePicker";
import { useNotificationCount } from "@/hooks/useNotificationCount";
import { useUser } from "@/hooks/useUser";
import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";

export function PrimaryHeader() {
  const { user } = useUser();
  const { getImageUri } = useImagePicker();
  const { unreadCount } = useNotificationCount();
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);

  // Fonction pour charger l'image de profil
  const loadProfileImage = useCallback(async () => {
    const imageUri = await getImageUri();
    setProfileImageUri(imageUri);
  }, [getImageUri]);

  // Charger l'image à chaque fois que l'écran est focalisé
  useFocusEffect(
    useCallback(() => {
      loadProfileImage();
    }, [loadProfileImage])
  );
  return (
    <View
      className="w-full flex-row justify-between items-center px-4"
      style={{
        paddingTop: Platform.OS === "android" ? 32 : 0,
      }}
    >
      <TouchableOpacity
        className="flex-row items-center gap-x-3"
        onPress={() => {
          router.push("/profile/profilePage");
        }}
      >
        <View className="rounded-full overflow-hidden w-[48px] h-[48px] border border-envy-300">
          <Image
            key={profileImageUri || "default"} // Force la mise à jour de l'image
            source={
              profileImageUri
                ? { uri: profileImageUri }
                : require("@/assets/images/userProfile-img.png")
            }
            contentFit="cover"
            placeholder={require("@/assets/images/profile-img.png")}
            style={{ width: 48, height: 48 }}
          />
        </View>
        <View className="flex-row items-center gap-x-2">
          <Text className="font-medium text-[#4D5962] text-sm font-worksans">
            {user?.user.username}
          </Text>
          <Image
            source={require("@/assets/icons/chevronRight.svg")}
            style={{ width: 16, height: 16 }}
          />
        </View>
      </TouchableOpacity>

      <View className="flex-row items-center gap-x-4">
        <TouchableOpacity
          onPress={() => router.push("/notifications/notificationsPage")}
          className="relative"
          activeOpacity={0.7}
        >
          <Image
            source={require("@/assets/icons/bell.svg")}
            style={{ width: 24, height: 24 }}
          />
          {unreadCount > 0 && (
            <View className="absolute -top-1 -right-1 bg-[#F24E1E] rounded-full min-w-[18px] h-[18px] justify-center items-center px-1">
              <Text className="text-white text-xs font-bold text-center">
                {unreadCount > 9 ? "9+" : unreadCount.toString()}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
