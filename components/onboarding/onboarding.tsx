import { Image, ImageBackground } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import {
  ImageSourcePropType,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

export function Onboarding({
  onboardingProps,
}: {
  onboardingProps: {
    image: ImageSourcePropType;
    title: string;
    description: string;
  };
}) {
  const { width, height } = useWindowDimensions();
  return (
    <View className="relative rounded-br-full overflow-hidden">
    <ImageBackground
      source={onboardingProps.image}
      contentFit="cover"
      style={{ width, height }}
      className="relative"
    >
      <Image
        contentFit="cover"
        style={{ height: 540, width }}
        alt="onboarding image"
        className="bg-red-600 p-2 h-fit"
      />
      

      <View className="flex gap-8 px-2 mt-4">
        <Text
          className="text-[#FFFDC2]  text-[30px]"
          style={{ fontFamily: "Gt_Super", fontWeight: 100 }}
        >
          {onboardingProps.title}
        </Text>
        <Text className="text-[#F4F8F9] font-urbanist">
          {onboardingProps.description}
        </Text>
      </View>
    </ImageBackground>
    </View>
  );
}
