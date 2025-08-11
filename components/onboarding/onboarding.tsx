import { ImageBackground } from "expo-image";
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
    <View className="relative">
      <ImageBackground
        source={onboardingProps.image}
        contentFit="cover"
        style={{ width, height }}
        className="relative"
      >
        <View className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-30" />

        <View
          className="flex gap-8 pl-4 pr-5"
          style={{
            marginTop: 420,
          }}
        >
          <Text
            className="text-[#FFFDC2]  text-[30px]"
            style={{ fontFamily: "Gt_Walsheim", fontWeight: 500 }}
          >
            {onboardingProps.title}
          </Text>
          <Text className="text-[#F4F8F9] font-work ">
            {onboardingProps.description}
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
}
