import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export interface ProductProps {
  id: string;
  category: string;
  name: string;
  description: string;
  image: string;
  link: string;
}

export function Produit({
  id,
  category,
  name,
  description,
  image,
  link,
}: ProductProps) {
  return (
    <TouchableOpacity
      className="flex flex-row justify-between items-center w-full"
      activeOpacity={0.7}
      onPress={() =>
        router.push({
          pathname: "/product/productDetail",
          params: { slug: id },
        })
      }
    >
      <Image source={image} style={{ width: 67, height: 67 }} />
      <View className="px-4 pt-1 flex flex-col gap-y-2 flex-1">
        <Text
          className="text-xs underline text-[#4D5962]"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {category}
        </Text>
        <Text
          className="text-candlelight-700 font-medium text-sm"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {name}
        </Text>
        <Text
          className="text-[#4D5962] text-xs"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {description}
        </Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() =>
          router.push({
            pathname: "/product/productDetail",
            params: { slug: id },
          })
        }
      >
        <Image
          source={require("../assets/icons/arrow-right.svg")}
          style={{ width: 20, height: 20 }}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
