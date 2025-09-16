import { Tip } from "@/components/astuce";
import { PrimaryHeader } from "@/components/headers/primaryHeader";
import { Produit } from "@/components/produit";
import accountService from "@/services/accountService";
import marketplaceService, {
  MarketplaceDashboardResponse,
  MarketplaceProduct,
} from "@/services/marketplaceService";
import profileService, { HomeResponse } from "@/services/profile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Explore() {
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
  const [marketplaceData, setMarketplaceData] =
    useState<MarketplaceDashboardResponse | null>(null);
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    "Toutes les catégories"
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load marketplace dashboard data
        const marketplaceResponse = await marketplaceService.getDashboard();
        console.log(marketplaceResponse);
        setMarketplaceData(marketplaceResponse);
        setProducts(marketplaceResponse.recommendations);

        // Load home data for tips
        const homeResponse = await profileService.getHome();
        setHomeData(homeResponse);
      } catch (error) {
        Alert.alert(
          "Erreur",
          "Une erreur est survenue lors de la récupération des données."
        );
        console.error(error);
      }
    };
    loadData();
  }, []);

  // Load products when category changes


  return (
    <View className="flex-1 bg-[#FEFDE8]">
      <SafeAreaView />
      <PrimaryHeader />
      <View className="flex-1 px-4 mt-5 gap-4">
        <Text>Explorer</Text>
        <Text>
          Découvrez de nouvelles astuces et produits adaptés à ses cheveux.
        </Text>
        <View className="flex flex-row gap-x-2">
          <Onglet
            label={"Produits"}
            isActive={!showTips}
            handlePress={function (): void {
              setShowTips(false);
            }}
          />
          <Onglet
            label={"Astuces"}
            isActive={showTips}
            handlePress={function (): void {
              setShowTips(true);
            }}
          />
        </View>
        <CategoryChooser
          selectedCategory={selectedCategory}
          setSelectedCategory={() => setShowCategoryModal(true)}
        />

        <CategoryModal
          showModal={showCategoryModal}
          setShowModal={setShowCategoryModal}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          marketplaceData={marketplaceData}
        />

        {showTips ? (
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
        ) : (
          <FlatList
            data={selectedCategory === "Toutes les catégories" ? products : products.filter((product) => product.category === selectedCategory)}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Produit
                category={item.category || "Non catégorisé"}
                name={item.name}
                description={item.short_description.replace(/<[^>]*>/g, "")} // Remove HTML tags
                image={item.image}
                link={`/product/${item.slug}`}
                id={item.id.toString()}
              />
            )}
          />
        )}
      </View>
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
  selectedCategory,
  setSelectedCategory,
}: {
  selectedCategory: string;
  setSelectedCategory: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={setSelectedCategory}
      className={`rounded-full px-4 py-2 border border-[#AEC3CB] flex flex-row justify-between items-center`}
    >
      <Text>{selectedCategory}</Text>
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
  marketplaceData,
}: {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  marketplaceData: MarketplaceDashboardResponse | null;
}) => {
  // Extract unique categories from products
  const productCategories =
    marketplaceData?.recommendations
      ?.map((product) => product.category)
      .filter((category): category is string => category !== null)
      .filter((category, index, array) => array.indexOf(category) === index) ||
    [];

  const categories = ["Toutes les catégories", ...productCategories];

  return (
    <Modal
      visible={showModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowModal(false)}
    >
      <View className="bg-[#FEFDE8] w-full rounded-3xl  p-6 shadow-lg mt-auto">
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setSelectedCategory(category);
              setShowModal(false);
            }}
            className={`py-3`}
          >
            <Text
              className={`text-xs font-medium ${
                index === 0
                  ? "text-candlelight-700 font-semibold"
                  : "text-[#4D5962]"
              }`}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );
};
