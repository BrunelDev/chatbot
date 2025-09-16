import BannerAdComponent from "@/components/ads/BannerAdComponent";
import { Tip } from "@/components/astuce";
import { PrimaryHeader } from "@/components/headers/primaryHeader";
import { Produit } from "@/components/produit";
import { useUser } from "@/hooks/useUser";
import accountService from "@/services/accountService";
import profileService, { HomeResponse } from "@/services/profile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");
      router.replace("/(auth)/login");
      Alert.alert("Déconnexion", "Vous avez été déconnecté avec succès.");
    } catch (error) {
      console.error("Failed to logout:", error);
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la déconnexion. Veuillez réessayer."
      );
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Supprimer le compte",
      "Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible.",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              const response = await accountService.deleteAccount();
              Alert.alert("Suppression de compte réussie.", response.message);
              await AsyncStorage.removeItem("accessToken");
              await AsyncStorage.removeItem("refreshToken");
              router.replace("/(auth)/login");
            } catch (error: any) {
              Alert.alert(
                "Erreur",
                error.message ||
                  "Une erreur est survenue lors de la suppression de votre compte."
              );
            }
          },
        },
      ]
    );
  };

  const tips = [
    {
      category: "Hydratation & soins",
      title: "Astuces pour maintenir l’hydratation",
      description:
        "Eviter la sécheresse et sceller l’eau dans la fibre capillaire. Applique ton leave-in sur cheveux humides puis une huile légère pour sceller l’hydratation.",
      link: "cheveuxcrepus.fr",
      id: "1",
    },
    {
      category: "Hydratation & soins",
      title: "Astuces pour maintenir l’hydratation",
      description:
        "Eviter la sécheresse et sceller l’eau dans la fibre capillaire. Applique ton leave-in sur cheveux humides puis une huile légère pour sceller l’hydratation.",
      link: "cheveuxcrepus.fr",
      id: "2",
    },
    {
      category: "Hydratation & soins",
      title: "Astuces pour maintenir l’hydratation",
      description:
        "Eviter la sécheresse et sceller l’eau dans la fibre capillaire. Applique ton leave-in sur cheveux humides puis une huile légère pour sceller l’hydratation.",
      link: "cheveuxcrepus.fr",
      id: "3",
    },
    {
      category: "Hydratation & soins",
      title: "Astuces pour maintenir l’hydratation",
      description:
        "Eviter la sécheresse et sceller l’eau dans la fibre capillaire. Applique ton leave-in sur cheveux humides puis une huile légère pour sceller l’hydratation.",
      link: "cheveuxcrepus.fr",
      id: "4",
    },
    {
      category: "Hydratation & soins",
      title: "Astuces pour maintenir l’hydratation",
      description:
        "Eviter la sécheresse et sceller l’eau dans la fibre capillaire. Applique ton leave-in sur cheveux humides puis une huile légère pour sceller l’hydratation.",
      link: "cheveuxcrepus.fr",
      id: "5",
    },
  ];
  const [showTips, setShowTips] = useState(true);
  const [homeData, setHomeData] = useState<HomeResponse | null>(null);

  useEffect(() => {
    const getHome = async () => {
      try {
        const response = await profileService.getHome();
        setHomeData(response);
      } catch (error) {
        Alert.alert(
          "Erreur",
          "Une erreur est survenue lors de la récupération des données."
        );
        console.error(error);
      }
    };
    getHome();
  }, []);
  const [showCategoryList, setShowCategoryList] = useState(false);
  const {user} = useUser();

  return (
    <View className="flex-1 bg-[#FEFDE8]">
      <SafeAreaView />
      <PrimaryHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="flex-1 flex flex-col gap-5 px-4 mt-5">
          {/* Banner Ad */}
          <BannerAdComponent className="mb-0" />
          <Text>Bonjour, {user?.user.username}</Text>

          
         

          <FlatList
            data={homeData?.recommended_products}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%" }}
            renderItem={({ item, index }) => (
              <Produit
                category={item.brand}
                name={item.name}
                description={item.description}
                image={item.image}
                link={"cheveuxcrepus.fr"}
                id={item.id.toString()}
              />

            )}
            ItemSeparatorComponent={() => <View className="h-4" />}
          />

          <FlatList
            data={homeData?.daily_tips}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <Tip
                category={item.category}
                title={item.title}
                description={item.description}
                link={"cheveuxcrepus.fr"}
                id={index.toString()}
              />
            )}
          />
        </View>
      </ScrollView>
      <CategoryModal
        showModal={showCategoryList}
        setShowModal={setShowCategoryList}
        selectedCategory={""}
        setSelectedCategory={function (): void {
          throw new Error("Function not implemented.");
        } } setShowTips={function (show: boolean): void {
          throw new Error("Function not implemented.");
        } } showTips={false}      />
    </View>
  );
}

const Onglet = ({
  label,
  isActive,
  handlePress,
}: {
  label: string;
  isActive: boolean;
  handlePress: () => void;
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      className={` rounded-full px-4 py-2   ${
        isActive
          ? "bg-candlelight-200 border border-candlelight-200"
          : "border border-[#AEC3CB]"
      }`}
    >
      <Text>{label}</Text>
    </TouchableOpacity>
  );
};

const CategoryChooser = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}: {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={setSelectedCategory}
      className={`rounded-full px-4 py-2 border border-[#AEC3CB] flex flex-row justify-between items-center`}
    >
      <Text>Toutes les catégories</Text>
      <Image
        source={require("../../assets/icons/chevronDown.svg")}
        style={{ width: 10.560012817382812, height: 4.7316999435424805 }}
      />
    </TouchableOpacity>
  );
};

const CategoryModal = ({
  showModal,
  setShowModal,
  selectedCategory,
  setSelectedCategory,
  setShowTips,
  showTips,
}: {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  setShowTips: (show: boolean) => void;
  showTips: boolean;
}) => {
  const tips = [
    {
      label: "Nettoyage",
    },
    {
      label: "Hydratation & soins",
    },
    {
      label: "Scellants & nutrition",
    },
    {
      label: "Définition & coiffage",
    },
    {
      label: "Protection & entretien",
    },
    {
      label: "Accessoires associés",
    },
  ];
  
  return (
    <Modal
      visible={showModal}
      animationType="slide"
      onRequestClose={() => setShowModal(false)}
    >
      <View className="flex-1 bg-[#FEFDE8]">
        <SafeAreaView />
        <PrimaryHeader />
        <View className="flex-1 px-4 mt-5">
        
          <View className="flex flex-row gap-x-2">
            <Onglet
              label={"Produits"}
              isActive={showTips}
              handlePress={function (): void {
                setShowTips(true);
              }}
            />
            <Onglet
              label={"Astuces"}
              isActive={!showTips}
              handlePress={function (): void {
                setShowTips(false);
              }}
            />
          </View>
          <CategoryChooser
            categories={[]}
            selectedCategory={""}
            setSelectedCategory={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        </View>
      </View>
    </Modal>
  );
};
