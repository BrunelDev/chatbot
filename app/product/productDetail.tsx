import { GoBack } from "@/components/headers/goBack";
import marketplaceService, {
  ProductDetail,
} from "@/services/marketplaceService";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProductDetailView() {
  const { slug } = useLocalSearchParams();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { height, width } = useWindowDimensions();

  // Données par défaut à afficher en cas d'erreur
  const defaultProduct: ProductDetail = {
    id: 123,
    slug: "shea-moisture-coconut-hibiscus-curl-enhancing-smoothie",
    name: "Shea Moisture Coconut & Hibiscus Curl Enhancing Smoothie",
    description:
      "A thick, moisturizing styling cream that helps to define curls while reducing frizz. Made with natural and organic ingredients.",
    brand: "Shea Moisture",
    price: 29.99,
    sale_price: 24.99,
    images: [
      {
        id: 1,
        url: "https://example.com/images/product123_1.jpg",
        alt: "Front view of product",
      },
      {
        id: 2,
        url: "https://example.com/images/product123_2.jpg",
        alt: "Ingredients list",
      },
    ],
    categories: [
      {
        id: 45,
        name: "Styling Creams",
        slug: "styling-creams",
      },
    ],
    hair_types: ["3a", "3b", "3c", "4a", "4b", "4c"],
    hair_concerns: ["dryness", "frizz", "definition"],
    ingredients:
      "Aqua, Cocos Nucifera Oil, Butyrospermum Parkii Butter, Cetearyl Alcohol...",
    size: "340g",
    in_stock: true,
    stock_quantity: 150,
    rating_average: 4.7,
    rating_count: 856,
    is_featured: true,
    created_at: "2025-01-15T08:30:00Z",
    updated_at: "2025-09-15T14:22:31Z",
    tags: ["moisturizing", "defining", "natural ingredients"],
    key_benefits: [
      "Defines and enhances natural curl pattern",
      "Reduces frizz and flyaways",
      "Provides lasting moisture",
    ],
    how_to_use: "Apply to damp hair in sections. Style as desired.",
  };

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        console.log("slug", slug);
        const productDetail = await marketplaceService.getProductBySlug(
          slug as string
        );
        console.log("productDetail", productDetail);
        setProduct(productDetail);
      } catch (error) {
        console.warn(
          "Erreur lors du chargement du produit, utilisation des données par défaut:",
          error
        );
        // Utiliser les données par défaut au lieu d'afficher une erreur
        setProduct(defaultProduct);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadProduct();
    } else {
      setLoading(false);
    }
  }, [slug]);

  if (loading) {
    return (
      <View className="flex-1 bg-[#FEFDE8] justify-center items-center">
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 bg-[#FEFDE8] justify-center items-center">
        <Text>Produit non trouvé</Text>
      </View>
    );
  }

  const handleOpenWebsite = () => {
    if (product?.slug) {
      // Créer un lien basé sur le slug
      const productUrl = `https://cheveuxtextures.com/${product.slug}`;
      Linking.openURL(productUrl);
    } else {
      Alert.alert("Information", "Lien du produit en cours de préparation");
    }
  };

  return (
    <View className="flex-1 bg-candlelight-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        className="flex-1 bg-candlelight-50"
        bounces={false}
        overScrollMode="never"
      >
        <SafeAreaView
          className="flex-1"
          style={{ backgroundColor: '#ffffff' }}
          edges={["right", "top", "left"]}
        >
          <View
            className="px-4"
            style={{  height: height * 0.5, }}
          
          >
            <GoBack />

            {/* Image du produit centrée */}
            <View className="flex-1 justify-center items-center">
              <View className="w-48 h-48 justify-center items-center">
                <Image
                  source={product.featured_image ? product.featured_image : require("../../assets/images/product-img.png")}
                  style={{ width: width/1.5, height: width / 1.6 }}
                  contentFit="contain"
                  placeholder={require("../../assets/images/product-img.png")}
                />
              </View>
            </View>
          </View>

          {/* Section informations avec fond beige */}
          <View className="flex-1 bg-[#FEFDE8] rounded-t-3xl px-6 pt-6">
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Catégorie */}
              <Text className="text-[#A46C04] text-sm font-medium mb-2">
                {product.categories[0]?.name || "Soins capillaires"}
              </Text>

              {/* Nom du produit */}
              <Text className="text-[#A46C04] text-2xl font-bold mb-2 font-borna">
                {product.name}
              </Text>

              {/* Type de cheveux */}
              <Text className="text-[#4D5962] text-sm mb-4">
                {product.hair_types.length > 0
                  ? `Cheveux ${product.hair_types.join(", ")}`
                  : "Tous types de cheveux"}
              </Text>

              {/* Prix */}
              <View className="flex-row items-center mb-4">
                {product.sale_price ? (
                  <>
                    <Text className="text-[#A46C04] text-lg font-bold mr-2 font-borna">
                      {product.sale_price}€
                    </Text>
                    <Text className="text-[#4D5962] text-sm line-through">
                      {product.price}€
                    </Text>
                  </>
                ) : (
                  <Text className="text-[#A46C04] text-lg font-bold">
                    {product.price}€
                  </Text>
                )}
              </View>

              {/* Description */}
              <Text className="text-[#4D5962] text-sm leading-6 mb-6">
                {product.description}
              </Text>

              {/* Bienfaits */}
              {product.key_benefits.length > 0 && (
                <>
                  <Text className="text-envy-500 text-sm mb-2">
                    Bienfaits :
                  </Text>
                  <View className="bg-[#EFC40329] rounded-lg p-4 mb-6 flex flex-col gap-3">
                    {product.key_benefits.map((benefit, index) => (
                      <View
                        key={index}
                        className="flex-row items-center mb-2 last:mb-0"
                      >
                        <View className="w-1 h-1 bg-candlelight-800 rounded-full mr-3" />
                        <Text className="text-[#4D5962] text-xs flex-1">
                          {benefit}
                        </Text>
                      </View>
                    ))}
                  </View>
                </>
              )}

              {/* Conseils d'utilisation */}
              {product.how_to_use && (
                <>
                  <Text className="text-envy-500 text-sm mb-2">
                    Conseils d'utilisation
                  </Text>
                  <Text className="text-[#4D5962] text-sm leading-6 mb-6">
                    {product.how_to_use}
                  </Text>
                </>
              )}

              {/* Ingrédients */}
              {product.ingredients && (
                <>
                  <Text className="text-envy-500 text-sm mb-2">
                    Ingrédients
                  </Text>
                  <Text className="text-[#4D5962] text-sm leading-6 mb-6">
                    {product.ingredients}
                  </Text>
                </>
              )}
            </ScrollView>
          </View>
        </SafeAreaView>
      </ScrollView>
      {/* Bouton voir sur le site */}
      <TouchableOpacity
        className="shadow-hard-1 rounded-lg py-4 mb-8"
        onPress={handleOpenWebsite}
        activeOpacity={1}
      >
        <Text className="text-envy-500 text-sm  text-center">
          Voir le produit sur le site
        </Text>
      </TouchableOpacity>
    </View>
  );
}
