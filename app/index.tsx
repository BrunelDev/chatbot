import { Onboarding } from "@/components/onboarding/onboarding";
import { useRouter } from "expo-router";
import { ArrowLeft, ArrowRight } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSession } from "../ctx";

export default function HomeScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();
  const { session, isLoading } = useSession();

  // Rediriger vers l'app si l'utilisateur est déjà connecté
  useEffect(() => {
    if (!isLoading && session) {
      router.replace("/(tabs)/home");
    }
  }, [session, isLoading, router]);

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
        "Pose tes questions, partage tes habitudes, et reçois des recommandations précises selon ton type de cheveux, tes objectifs et ta routine.Tout est personnalisé, rien n'est standard.",
    },
    {
      image: require("../assets/images/onboarding3.png"),
      title: "Parlons un peu de tes cheveux",
      description:
        "Pour mieux t'accompagner, j'ai besoin de mieux te connaître.En quelques questions simples, on définit ensemble ton profil capillaire.",
    },
  ];
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNextSlide = () => {
    if (currentIndex < onboardindScreens.length - 1) {
      const nextIndex = currentIndex + 1;
      console.log("Going to next slide:", nextIndex, "from:", currentIndex);
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: nextIndex * width,
          animated: true,
        });
        console.log("scrollTo called with x:", nextIndex * width);
      } else {
        console.log("scrollViewRef.current is null");
      }
    } else {
      // On est à la dernière slide, naviguer vers la page de connexion
      router.replace("/(auth)/login");
    }
  };

  const goToPreviousSlide = () => {
    if (scrollViewRef.current) {
      if (currentIndex > 0) {
        const prevIndex = currentIndex - 1;
        console.log(
          "Going to previous slide:",
          prevIndex,
          "from:",
          currentIndex
        );
        scrollViewRef.current.scrollTo({
          x: prevIndex * width,
          animated: true,
        });
        console.log("scrollTo called with x:", prevIndex * width);
      }
    }
  };

  return (
    <View className="relative bg-[#FEFDE8]">
      {isLoading && (
        <View className="absolute inset-0 flex-1 justify-center items-center z-10 bg-[#FEFDE8]">
          <ActivityIndicator size="large" color="#587950" />
          <Text className="text-[#4D5962] mt-4 font-worksans">
            Vérification...
          </Text>
        </View>
      )}

      <View style={{ width: width, height: "100%" }}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          style={{ height: "100%" }}
          onMomentumScrollEnd={(e) => {
            const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
            console.log(
              "onMomentumScrollEnd - newIndex:",
              newIndex,
              "currentIndex:",
              currentIndex
            );
            if (
              newIndex !== currentIndex &&
              newIndex >= 0 &&
              newIndex < onboardindScreens.length
            ) {
              setCurrentIndex(newIndex);
            }
          }}
          className="rounded-br-full overflow-hidden"
        >
          {onboardindScreens.map((item, index) => (
            <View key={index} style={{ width: width, height: "100%" }}>
              <Onboarding onboardingProps={item} />
            </View>
          ))}
        </ScrollView>
        <View className="absolute bottom-[110px] px-4 pt-6">
          <View className="absolute bottom-28 pl-5 w-24 flex-row justify-center gap-2">
            {onboardindScreens.map((_, index) => (
              <View
                key={index}
                className={`h-1 w-5 rounded-full ${
                  currentIndex === index ? "bg-[#587950] w-4" : "bg-gray-300"
                }`}
              />
            ))}
          </View>
        </View>
        <View className="absolute bottom-[90px] px-4 pt-6">
          <View className="flex flex-row items-center gap-2 pt-14">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={goToPreviousSlide}
              className={`${
                currentIndex === 0 ? "bg-[#fffdc29c]" : "bg-[#FFFDC2]"
              } flex h-[60px] w-[60px] items-center justify-center rounded-full`}
            >
              <ArrowLeft size={20} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={goToNextSlide}
              className={`flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#FFFDC2]`}
            >
              <ArrowRight size={20} />
            </TouchableOpacity>
          </View>
        </View>
        <View className="absolute bottom-[50px] px-4 pt-6">
          <View className="flex w-full flex-row items-center justify-between">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                router.replace("/(auth)/login");
              }}
              className="ml-auto"
            >
              <Text className="text-[#4D5962] font-worksans">Passer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
