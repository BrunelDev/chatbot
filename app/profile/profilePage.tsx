import { PrimaryButton } from "@/components/buttons/primaryButton";
import { GoBack } from "@/components/headers/goBack";
import { useUser } from "@/hooks/useUser";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useCallback, useRef } from "react";
import {
  Alert,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { height } = useWindowDimensions();
  const options: {
    title: string;
    href: "/(auth)/forgetPassword";
    icon: string;
  }[] = [
    {
      title: "Mot de passe",
      href: "/(auth)/forgetPassword",
      icon: require("../../assets/icons/lock.svg"),
    },
    {
      title: "Assistance client",
      href: "/(auth)/forgetPassword",
      icon: require("../../assets/icons/message-question.svg"),
    },
    {
      title: "Sécurité et confidentialité",
      href: "/(auth)/forgetPassword",
      icon: require("../../assets/icons/shield.svg"),
    },
  ];
  const { user } = useUser();
  const handleLogout = async () => {
    Alert.alert(
      "Se déconnecter",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Se déconnecter",
          onPress: async () => {
            await AsyncStorage.multiRemove([
              "accountType",
              "isOnboardingComplete",
              "userInfo",
            ]);
            router.replace("/(auth)/login");
          },
        },
      ]
    );
  };

  const handleDeleteAccount = async () => {
    try {
      //await deleteAccount();
      Alert.alert("Succès", "Votre compte a été supprimé avec succès.", [
        {
          text: "OK",
          onPress: async () => {
            await AsyncStorage.multiRemove([
              "accountType",
              "isOnboardingComplete",
              "userInfo",
            ]);
            router.replace("/(auth)/register");
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        "Erreur",
        error.message || "Impossible de supprimer le compte."
      );
    }
  };

  const bottomSheetRef = useRef<BottomSheet>(null);
  const handleSheetChanges = useCallback((index: number) => {
    // You can handle sheet state changes here if needed in the future
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="bg-candlelight-50 h-full w-full">
        <View
          className="px-4 bg-envy-200"
          style={{
            height: height * 0.45,
          }}
        >
          <SafeAreaView />

          <GoBack title="Profil" />

          <View className="flex flex-1 flex-col items-center justify-center">
            <View>
              <View className="w-[140px] h-[140px] rounded-full overflow-hidden border-2 border-envy-400 mb-2">
                <Image
                  source={require("../../assets/images/userProfile-img.png")}
                  style={{ width: 140, height: 140 }}
                />
              </View>
              <TouchableOpacity className="flex items-center justify-center w-[36px] h-[36px] bg-candlelight-100 rounded-full border border-envy-400 absolute bottom-0 right-0">
                <Image
                  source={require("../../assets/icons/image.svg")}
                  style={{ width: 16, height: 16 }}
                />
              </TouchableOpacity>
            </View>

            <Text className="text-envy-700 text-xl font-medium">
              {user?.user.username}
            </Text>

            <Text className="text-[#4D5962] text-sm ">{user?.user.email}</Text>
          </View>
        </View>

        <View className="px-4 mt-6 flex flex-col gap-10">
          <TouchableOpacity
            className="bg-candlelight-100 h-[60px] flex flex-row items-center justify-between px-4 rounded-xl"
            onPress={() => router.push("/profile/resumeCapillaire")}
            activeOpacity={0.7}
          >
            <View className="flex flex-row items-center gap-x-3">
              <Image
                source={require("../../assets/icons/clipboard.svg")}
                style={{ width: 16, height: 16 }}
              />
              <Text className="text-envy-800 text-sm">Résumé capillaire</Text>
            </View>
            <Image
              source={require("../../assets/icons/chevronRight.svg")}
              style={{ width: 20, height: 20 }}
            />
          </TouchableOpacity>
          <View className="flex flex-col gap-y-6">
            {options.map((option, index) => (
              <Option
                key={index}
                title={option.title}
                href={option.href}
                icon={option.icon}
              />
            ))}
          </View>
        </View>

        <View className="px-4 flex flex-col mt-10 gap-4">
          <TouchableOpacity className="px-4" onPress={handleLogout}>
            <View className="flex flex-row items-center gap-x-3">
              <Image
                source={require("../../assets/icons/logout.svg")}
                style={{ width: 16, height: 16 }}
              />
              <Text className="text-candlelight-700 text-sm font-medium">
                Se deconnecter
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              bottomSheetRef.current?.expand();
            }}
            className="px-5 flex flex-row items-center justify-center gap-x-3 py-4 rounded-2xl bg-envy-200"
          >
            <Text className="text-center text-envy-700">
              Supprimer le compte
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1} // Start closed
        enablePanDownToClose={true}
        onChange={handleSheetChanges}
        snapPoints={[300]}
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: "#FEFDE8",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
      >
        <BottomSheetView style={{ flex: 1 }}>
          <ConfirmDeletion
            onDelete={handleDeleteAccount}
            bottomSheetRef={bottomSheetRef}
          />
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const Option = ({
  title,
  href,
  icon,
}: {
  title: string;
  href: "/(auth)/forgetPassword";
  icon: string;
}) => {
  return (
    <TouchableOpacity
      onPress={() => router.push(href)}
      className="flex flex-row items-center justify-between pb-4 border-b border-envy-200 px-2"
    >
      <View className="flex flex-row items-center gap-x-3">
        <Image source={icon} style={{ width: 16, height: 16 }} />
        <Text className="text-envy-800 text-sm">{title}</Text>
      </View>
      <Image
        source={require("../../assets/icons/chevronRight.svg")}
        style={{ width: 20, height: 20 }}
      />
    </TouchableOpacity>
  );
};

const ConfirmDeletion = ({
  onDelete,
  bottomSheetRef,
}: {
  onDelete: () => Promise<void>;
  bottomSheetRef: React.RefObject<BottomSheet | null>;
}) => {
  return (
    <View className="flex flex-col h-fit gap-8 px-4 relative">
      <Text className="text-xl font-black text-big_stone text-center">
        Êtes-vous sûr de vouloir supprimer votre compte ?
      </Text>
      <Text className="text-gray-600">
        Cette action est irréversible. Veillez bien confirmer la suppression de
        votre compte.
      </Text>
      <View className="flex flex-row justify-between items-center w-full">
        <View className="w-[48%]">
          <TouchableOpacity
            className={`relative flex justify-center items-center bg-envy-200 gap-3 w-full text-center `}
            style={{ borderRadius: 12, height: 52, width: "100%" }}
            onPress={async () => {
              await onDelete();
              bottomSheetRef?.current?.close();
            }}
          >
            <Text className="text-[#4D5962] font-medium">Supprimer</Text>
          </TouchableOpacity>
        </View>
        <View className="w-[48%]">
          <PrimaryButton
            title="Annuler"
            handlePress={async () => {
              bottomSheetRef?.current?.close();
            }}
          />
        </View>
      </View>
    </View>
  );
};
