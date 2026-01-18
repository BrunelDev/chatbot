import { Tip } from "@/components/astuce";
import { PrimaryHeader } from "@/components/headers/primaryHeader";
import { Produit } from "@/components/produit";
import marketplaceService, {
  MarketplaceDashboardResponse,
  MarketplaceProduct,
} from "@/services/marketplaceService";
import profileService, { HomeResponse } from "@/services/profile";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Explore() {
  const [showTips, setShowTips] = useState(true);
  const [homeData, setHomeData] = useState<HomeResponse | null>(null);
  const [marketplaceData, setMarketplaceData] =
    useState<MarketplaceDashboardResponse | null>(null);
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    "Toutes les catégories"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Load marketplace dashboard data
        const marketplaceResponse = await marketplaceService.getDashboard();
        console.log(marketplaceResponse);
        setMarketplaceData(marketplaceResponse);
        setProducts(marketplaceResponse.recommendations);

        // Load home data for tips
        const homeResponse = await profileService.getHome();
        setHomeData(homeResponse);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors de la récupération des données.";
        Alert.alert("Erreur", errorMessage);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const onRefresh = async () => {
    try {
      setIsRefreshing(true);
      // Load marketplace dashboard data
      const marketplaceResponse = await marketplaceService.getDashboard();
      console.log(marketplaceResponse);
      setMarketplaceData(marketplaceResponse);
      setProducts(marketplaceResponse.recommendations);

      // Load home data for tips
      const homeResponse = await profileService.getHome();
      setHomeData(homeResponse);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la récupération des données.";
      Alert.alert("Erreur", errorMessage);
      console.error(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Load products when category changes

  return (
    <View className="flex-1 bg-[#FEFDE8]">
      <SafeAreaView />
      <PrimaryHeader />
      <View className="flex-1 px-4 mt-5 gap-4">
        <Text className="font-medium text-[20px] text-envy-700 font-borna">
          Explorer
        </Text>
        <Text className="text-xs text-[#4D5962] font-worksans">
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
        <Text className="font-medium text-xl text-envy-700 font-borna">
          Recommandés pour vous
        </Text>
        {!showTips && (
          <CategoryChooser
            selectedCategory={selectedCategory}
            setSelectedCategory={() => setShowCategoryModal(true)}
          />
        )}

        <CategoryModal
          showModal={showCategoryModal}
          setShowModal={setShowCategoryModal}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          marketplaceData={marketplaceData}
        />

        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#587950" />
            <Text className="text-[#4D5962] mt-4 font-worksans">
              Chargement...
            </Text>
          </View>
        ) : showTips ? (
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
            ItemSeparatorComponent={() => <View className="h-4" />}
            ListEmptyComponent={() => (
              <View className="flex-1 justify-center items-center py-8">
                <Text className="text-[#4D5962] text-center font-worksans">
                  Aucune astuce disponible
                </Text>
              </View>
            )}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                colors={["#587950"]}
                tintColor="#587950"
              />
            }
          />
        ) : (
          <FlatList
            data={
              selectedCategory === "Toutes les catégories"
                ? products
                : products.filter(
                    (product) => product.category === selectedCategory
                  )
            }
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Produit
                category={item.category || "Non catégorisé"}
                name={item.name}
                description={item.short_description.replace(/<[^>]*>/g, "")} // Remove HTML tags
                image={item.image}
                link={`/product/${item.slug}`}
                id={item.id.toString()}
                slug={item.slug}
              />
            )}
            ItemSeparatorComponent={() => <View className="h-4" />}
            ListEmptyComponent={() => (
              <View className="flex-1 justify-center items-center py-8">
                <Text className="text-[#4D5962] text-center font-worksans">
                  Aucun produit disponible
                </Text>
              </View>
            )}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                colors={["#587950"]}
                tintColor="#587950"
              />
            }
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
      activeOpacity={1}
      onPress={handlePress}
      className={` rounded-full px-4 py-2   ${
        isActive
          ? "bg-candlelight-200 border border-candlelight-200"
          : "border border-[#AEC3CB]"
      }`}
    >
      <Text className="font-worksans">{label}</Text>
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
      <Text className="font-medium text-xs text-[#4D5962] font-worksans">
        {selectedCategory}
      </Text>
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
      <TouchableOpacity
        className="flex-1 justify-end"
        activeOpacity={1}
        onPress={() => setShowModal(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {}} // Prevent closing when clicking on modal content
          className="bg-[#FEFDE8] w-full rounded-3xl p-6 shadow-lg"
        >
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
                className={`text-xs font-medium font-worksans ${
                  index === 0
                    ? "text-candlelight-700 font-semibold"
                    : "text-[#4D5962]"
                }`}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};
