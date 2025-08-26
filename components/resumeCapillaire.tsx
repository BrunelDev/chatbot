import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";

export function Resume({}) {
  return (
    <View className="p-3 bg-candlelight-100 rounded-xl flex flex-col gap-3">
      <View className="flex flex-row items-center gap-x-2">
        <Image
          source={require("@/assets/icons/info.svg")}
          style={{ width: 16, height: 16 }}
        />
        <Text className="text-envy-700 font-medium text-sm">À propos de Emile</Text>
      </View>
      <Text className="text-[#4D5962] text-xs">
        Émilie a des cheveux très crépus. Ses cheveux sont actuellement mi-longs
        et elle souhaite avant tout favoriser la pousse et réduire la casse.
        Elle rencontre quelques problèmes de cuir chevelu sec et de casse
        excessive, ce qui rend ses soins capillaires particulièrement sensibles.
        Actuellement, Émilie n’a pas de routine bien définie, mais elle est
        motivée à en mettre une en place. Elle est donc à la recherche de
        recommandations simples et efficaces, adaptées à son type de cheveux et
        à son niveau d’expérience.
      </Text>
    </View>
  );
}
