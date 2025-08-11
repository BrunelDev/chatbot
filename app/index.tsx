import { Onboarding } from "@/components/onboarding/onboarding";
import { useRouter } from "expo-router";
import { ArrowLeft, ArrowRight } from "lucide-react-native";
import { useRef, useState } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

export default function HomeScreen() {
  const flatListRef = useRef<FlatList>(null);
  const onboardindScreens = [
    {
      image: require("../assets/images/onboarding1.png"),
      title: "Bienvenue sur Boucles en Poésie",
      description:
        "Un espace pensé pour toi, pour mieux comprendre, soigner et aimer tes cheveux texturés, bouclés ou crépus.Découvre des conseils personnalisés, adaptés à ta vraie nature capillaire.",
    },
    {
      image: require("../assets/images/onboarding2.png"),
      title: "Des conseils qui te ressemblent",
      description:
        "Pose tes questions, partage tes habitudes, et reçois des recommandations précises selon ton type de cheveux, tes objectifs et ta routine.Tout est personnalisé, rien n’est standard.",
    },
    {
      image: require("../assets/images/onboarding3.png"),
      title: "Parlons un peu de tes cheveux",
      description:
        "Pour mieux t’accompagner, j’ai besoin de mieux te connaître.En quelques questions simples, on définit ensemble ton profil capillaire.",
    },
  ];
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const goToNextSlide = () => {
    if (currentIndex < onboardindScreens.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };
  const goToPreviousSlide = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
    }
  };
  const router = useRouter();

  return (
    <View className="relative bg-[#FEFDE8]">
      <FlatList
        ref={flatListRef}
        bounces={false}
        overScrollMode="never"
        horizontal
        style={{ width: width }}
        pagingEnabled
        className="rounded-br-full overflow-hidden"
        data={onboardindScreens}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => <Onboarding onboardingProps={item} />}
        onScroll={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(newIndex);
        }}
        showsHorizontalScrollIndicator={false}
      />
      <View className="absolute bottom-10 px-4">
        <View className="absolute bottom-28 w-24 flex-row justify-center gap-2">
          {onboardindScreens.map((_, index) => (
            <View
              key={index}
              className={`h-1 w-5 rounded-full ${
                currentIndex === index ? "bg-[#587950] w-4" : "bg-gray-300"
              }`}
            />
          ))}
        </View>
        <View className="flex flex-row items-center gap-2">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={goToPreviousSlide}
            className={`${currentIndex === 0 ? "bg-[#fffdc29c]" : "bg-[#FFFDC2]"} flex h-[60px] w-[60px] items-center justify-center rounded-full`}
          >
            <ArrowLeft size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={goToNextSlide}
            className={`${currentIndex === onboardindScreens.length - 1 ? "bg-[#fffdc29c]" : "bg-[#FFFDC2]"} flex h-[60px] w-[60px] items-center justify-center rounded-full`}
          >
            <ArrowRight size={20} />
          </TouchableOpacity>
        </View>
        <View className="flex w-full flex-row items-center justify-between">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              router.push("/(auth)/login");
            }}
            className="ml-auto"
          >
            <Text className="text-[#4D5962]">Passer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
