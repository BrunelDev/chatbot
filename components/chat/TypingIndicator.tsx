import React, { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";

interface TypingIndicatorProps {
  isVisible: boolean;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ isVisible }) => {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;
  const containerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isVisible) {
      // Réinitialiser les animations quand l'indicateur n'est pas visible
      dot1.setValue(0.3);
      dot2.setValue(0.3);
      dot3.setValue(0.3);
      containerOpacity.setValue(0);
      return;
    }

    // Animation d'apparition du conteneur
    Animated.timing(containerOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    const createAnimation = (dot: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.delay(200), // Pause entre les cycles
        ])
      );
    };

    const animation1 = createAnimation(dot1, 0);
    const animation2 = createAnimation(dot2, 150);
    const animation3 = createAnimation(dot3, 300);

    animation1.start();
    animation2.start();
    animation3.start();

    return () => {
      animation1.stop();
      animation2.stop();
      animation3.stop();
    };
  }, [isVisible, dot1, dot2, dot3, containerOpacity]);

  if (!isVisible) return null;

  return (
    <Animated.View
      style={{ opacity: containerOpacity }}
      className="flex-row items-center px-4 py-2"
    >
      <View className="bg-candlelight-100 rounded-2xl px-4 py-3 shadow-sm">
        <View className="flex-row items-center">
          <Text className="text-envy-600 text-sm font-worksans mr-2">
            🤖 Le bot écrit
          </Text>
          <View className="flex-row items-center space-x-1">
            <Animated.View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: "#587950",
                opacity: dot1,
                marginRight: 2,
              }}
            />
            <Animated.View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: "#587950",
                opacity: dot2,
                marginRight: 2,
              }}
            />
            <Animated.View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: "#587950",
                opacity: dot3,
              }}
            />
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export default TypingIndicator;
