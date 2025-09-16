import { PrimaryHeader } from "@/components/headers/primaryHeader";
import marketplaceService, {
  MarketplaceProduct,
} from "@/services/marketplaceService";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProductDetail() {
  const { slug } = useLocalSearchParams();
  const [product, setProduct] = useState<MarketplaceProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        // For now, we'll search for the product by slug
        // You might need to create a specific endpoint for product details
        const products = await marketplaceService.searchProducts(
          slug as string
        );
        if (products.length > 0) {
          setProduct(products[0]);
        } else {
          Alert.alert("Erreur", "Produit non trouvé");
          router.back();
        }
      } catch (error) {
        Alert.alert("Erreur", "Impossible de charger les détails du produit");
        console.error(error);
        router.back();
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadProduct();
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

  return (
    <View className="flex-1 bg-[#FEFDE8]">
      <SafeAreaView />
      <PrimaryHeader />

      <ScrollView className="flex-1 px-4">
        <View className="mt-4">
          <Image
            source={{ uri: product.image }}
            className="w-full h-64 rounded-lg mb-4"
            resizeMode="cover"
          />

          <View className="mb-4">
            <Text className="text-xs text-[#4D5962] mb-1">{product.brand}</Text>
            <Text className="text-xl font-semibold text-candlelight-700 mb-2">
              {product.name}
            </Text>
            <Text className="text-lg font-bold text-candlelight-700">
              {product.price}€
            </Text>
          </View>

          {product.category && (
            <View className="mb-4">
              <Text className="text-sm font-medium text-[#4D5962] mb-1">
                Catégorie
              </Text>
              <Text className="text-sm text-candlelight-700">
                {product.category}
              </Text>
            </View>
          )}

          <View className="mb-4">
            <Text className="text-sm font-medium text-[#4D5962] mb-2">
              Description
            </Text>
            <Text className="text-sm text-[#4D5962] leading-5">
              {product.short_description.replace(/<[^>]*>/g, "")}
            </Text>
          </View>

          {product.reason && (
            <View className="mb-4">
              <Text className="text-sm font-medium text-[#4D5962] mb-1">
                Pourquoi ce produit ?
              </Text>
              <Text className="text-sm text-candlelight-700">
                {product.reason}
              </Text>
            </View>
          )}

          <TouchableOpacity
            className="bg-candlelight-700 py-4 rounded-lg mb-8"
            onPress={() => {
              // Add to cart or redirect to purchase
              Alert.alert(
                "Ajouté au panier",
                "Le produit a été ajouté à votre panier"
              );
            }}
          >
            <Text className="text-white text-center font-semibold">
              Ajouter au panier
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
