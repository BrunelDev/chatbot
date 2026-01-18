import { Tip } from "@/components/astuce";
import { PrimaryHeader } from "@/components/headers/primaryHeader";
import { Produit } from "@/components/produit";
import { useUser } from "@/hooks/useUser";
import accountService from "@/services/accountService";
import marketplaceService, {
  MarketplaceDashboardResponse,
  MarketplaceProduct,
} from "@/services/marketplaceService";
import profileService, { HomeResponse } from "@/services/profile";
import { deleteAllUserData, deleteSessionData } from "@/utils/dataCleanup";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "../../ctx";

export default function HomeScreen() {
  const { signOut } = useSession();

  const handleLogout = async () => {
    try {
      await deleteSessionData();
      signOut(); // Utilise le contexte d'authentification
      Alert.alert("Déconnexion", "Vous avez été déconnecté avec succès.");
    } catch (error) {
      console.error("Failed to logout:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la déconnexion. Veuillez réessayer.";
      Alert.alert("Erreur", errorMessage);
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
              await deleteAllUserData();
              Alert.alert("Suppression de compte réussie.", response.message);
              signOut(); // Utilise le contexte d'authentification
            } catch (error: any) {
              Alert.alert(
                "Erreur",
                error instanceof Error
                  ? error.message
                  : "Une erreur est survenue lors de la suppression de votre compte."
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
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const getHome = async () => {
      try {
        setIsLoading(true);
        const response = await profileService.getHome();
        setHomeData(response);
        const marketplaceResponse = await marketplaceService.getDashboard();
        console.log(marketplaceResponse);
        setMarketplaceData(marketplaceResponse);
        setProducts(marketplaceResponse.recommendations);
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
    getHome();
  }, []);

  const onRefresh = async () => {
    try {
      setIsRefreshing(true);
      const response = await profileService.getHome();
      setHomeData(response);
      const marketplaceResponse = await marketplaceService.getDashboard();
      console.log(marketplaceResponse);
      setMarketplaceData(marketplaceResponse);
      setProducts(marketplaceResponse.recommendations);
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
  const [showCategoryList, setShowCategoryList] = useState(false);
  const { user } = useUser();

  return (
    <View className="flex-1 bg-[#FEFDE8]">
      <SafeAreaView />
      <PrimaryHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={["#587950"]}
            tintColor="#587950"
          />
        }
      >
        <View className="flex-1 flex flex-col gap-5 px-4 mt-5">
          <Text className="font-medium text-[20px] text-envy-700 font-borna">
            Bonjour {user?.user.username},
          </Text>
          <Text className="text-[16px] font-medium text-[#4D5962] font-borna">
            {products.length > 0
              ? "Produits conseillés"
              : "Aucun produit conseillé"}
          </Text>

          {isLoading ? (
            <View className="flex-1 justify-center items-center py-8">
              <ActivityIndicator size="large" color="#587950" />
              <Text className="text-[#4D5962] mt-4 font-worksans">
                Chargement des produits...
              </Text>
            </View>
          ) : (
            <FlatList
              data={products}
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
            />
          )}

          <Text className="text-lg font-medium text-[#4D5962] font-borna">
            {homeData?.daily_tips && homeData.daily_tips.length > 0
              ? "Astuces du jour"
              : "Aucune astuce du jour"}
          </Text>

          {isLoading ? (
            <View className="flex-1 justify-center items-center py-8">
              <ActivityIndicator size="large" color="#587950" />
              <Text className="text-[#4D5962] mt-4 font-worksans">
                Chargement des astuces...
              </Text>
            </View>
          ) : (
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
            />
          )}
        </View>
      </ScrollView>
      <CategoryModal
        showModal={showCategoryList}
        setShowModal={setShowCategoryList}
        selectedCategory={""}
        setSelectedCategory={function (): void {
          throw new Error("Function not implemented.");
        }}
        setShowTips={function (show: boolean): void {
          throw new Error("Function not implemented.");
        }}
        showTips={false}
      />
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
