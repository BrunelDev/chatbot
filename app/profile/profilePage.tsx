import { PrimaryButton } from "@/components/buttons/primaryButton";
import { GoBack } from "@/components/headers/goBack";
import { useImagePicker } from "@/hooks/useImagePicker";
import { useUser } from "@/hooks/useUser";
import accountService from "@/services/accountService";
import { deleteAllUserData, deleteSessionData } from "@/utils/dataCleanup";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "../../ctx";

export default function Profile() {
  const { height } = useWindowDimensions();
  const { user } = useUser();
  const { selectAndSaveImage, getImageUri } = useImagePicker();
  const { signOut } = useSession();
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
  const options: {
    title: string;
    href: string;
    icon: string;
    extern?: boolean;
  }[] = [
    {
      title: "Mot de passe",
      href: "/(auth)/forgetPassword",
      icon: require("../../assets/icons/lock.svg"),
      extern: false,
    },
    {
      title: "Assistance client",
      href: "mailto:contact@cheveuxtextures.com",
      icon: require("../../assets/icons/message-question.svg"),
      extern: true,
    },
    {
      title: "Sécurité et confidentialité",
      href: "https://cheveuxtextures.com/politique-de-confidentialite/",
      icon: require("../../assets/icons/shield.svg"),
      extern: true,
    },
    {
      title: "Conditions générales d'utilisation",
      href: "https://cheveuxtextures.com/conditions-generales-dutilisation/",
      icon: require("../../assets/icons/cgu.svg"),
      extern: true,
    },
  ];

  // Charger l'image de profil au montage du composant
  useEffect(() => {
    const loadProfileImage = async () => {
      const imageUri = await getImageUri();
      setProfileImageUri(imageUri);
    };

    loadProfileImage();
  }, []);

  // Fonction pour gérer la sélection d'image
  const handleImageSelection = async () => {
    try {
      const imageUri = await selectAndSaveImage();
      if (imageUri) {
        setProfileImageUri(imageUri);
        Alert.alert(
          "Succès",
          "Votre photo de profil a été mise à jour avec succès !",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Erreur lors de la sélection de l'image:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la mise à jour de votre photo de profil.";
      Alert.alert("Erreur", errorMessage, [{ text: "OK" }]);
    }
  };
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
            await deleteSessionData();
            signOut(); // Utilise le contexte d'authentification
          },
        },
      ]
    );
  };

  const handleDeleteAccount = async () => {
    try {
      // Supprimer le compte côté serveur
      await accountService.deleteAccount();

      // Supprimer toutes les données locales
      await deleteAllUserData();

      Alert.alert("Succès", "Votre compte a été supprimé avec succès.", [
        {
          text: "OK",
          onPress: async () => {
            signOut(); // Utilise le contexte d'authentification
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        "Erreur",
        error instanceof Error
          ? error.message
          : "Impossible de supprimer le compte."
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
                key={profileImageUri || "default"} // Force la mise à jour de l'image
                source={
                  profileImageUri
                    ? { uri: profileImageUri }
                    : require("../../assets/images/userProfile-img.png")
                }
                style={{ width: 140, height: 140 }}
                contentFit="cover"
              />
            </View>
            <TouchableOpacity
              className="flex items-center justify-center w-[36px] h-[36px] bg-candlelight-100 rounded-full border border-envy-400 absolute bottom-0 right-0"
              onPress={handleImageSelection}
              activeOpacity={0.7}
            >
              <Image
                source={require("../../assets/icons/image.svg")}
                style={{ width: 16, height: 16 }}
              />
            </TouchableOpacity>
          </View>

          <Text className="text-envy-700 text-xl font-medium font-borna">
            {user?.user.username}
          </Text>

          <Text className="text-[#4D5962] text-sm ">{user?.user.email}</Text>
        </View>
      </View>
      <ScrollView
        className="bg-candlelight-50 flex-1 w-full"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}
      >
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

          {/* Bouton Premium */}
          <TouchableOpacity
            className="bg-gradient-to-r from-envy-200 to-envy-300 h-[70px] flex flex-row items-center justify-between px-4 rounded-xl border border-envy-400"
            onPress={() => {
              // TODO: Implémenter la navigation vers la page premium
              // Alert.alert("Premium", "Fonctionnalité premium à venir !");
            }}
            activeOpacity={0.7}
            style={{
              backgroundColor: "#C9D6C4",
              borderWidth: 1,
              borderColor: "#587950",
            }}
          >
            <View className="flex flex-row items-center gap-x-3">
              <View className="w-8 h-8 bg-gradient-to-r from-envy-400 to-envy-500 rounded-full flex items-center justify-center">
                <Text className="text-envy-800 font-bold text-sm">★</Text>
              </View>
              <View className="flex flex-col">
                <Text className="text-envy-800 text-sm font-semibold">
                  Passer à Premium
                </Text>
                <Text className="text-envy-700 text-xs">
                  Dites non au publicités
                </Text>
              </View>
            </View>
            <View className="flex flex-row items-center gap-x-2">
              <Image
                source={require("../../assets/icons/chevronRight.svg")}
                style={{ width: 20, height: 20, tintColor: "#587950" }}
              />
            </View>
          </TouchableOpacity>

          <View className="flex flex-col gap-y-6">
            {options.map((option, index) => (
              <Option
                key={index}
                title={option.title}
                href={option.href}
                icon={option.icon}
                extern={option.extern}
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
              <Text className="text-candlelight-700 font-borna text-sm font-medium">
                Se déconnecter
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
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const Option = ({
  title,
  href,
  icon,
  extern,
}: {
  title: string;
  href: string;
  icon: string;
  extern?: boolean; // if true, the option will be opened in a web view
}) => {
  return (
    <TouchableOpacity
      onPress={async () => {
        if (href.startsWith("mailto:") && extern) {
          console.log("click");
          await Linking.openURL(href);
        } else if (extern) {
          console.log(href);
          await WebBrowser.openBrowserAsync(href);
        } else {
          router.push(href as any);
        }
      }}
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
      <Text className="text-xl font-black text-big_stone text-center font-borna">
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
