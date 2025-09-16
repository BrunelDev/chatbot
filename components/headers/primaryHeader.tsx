import { Image } from "expo-image";
import { router } from "expo-router";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { useUser } from "@/hooks/useUser";

export function PrimaryHeader() {
  const { user } = useUser();
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
        <View className="rounded-full overflow-hidden w-[48px] h-[48px]">
          <Image
            source={require("@/assets/images/userProfile-img.png")}
            contentFit="cover"
            placeholder={require("@/assets/images/profile-img.png")}
            style={{ width: 48, height: 48 }}
          />
        </View>
        <View className="flex-row items-center gap-x-2">
          <Text className="font-medium text-[#4D5962] text-sm">
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
          <View className="w-2.5 h-2.5 rounded-full bg-[#F24E1E] absolute top-0 right-0" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
