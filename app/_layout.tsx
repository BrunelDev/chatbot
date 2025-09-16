import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "./global.css";

import { useColorScheme } from "@/hooks/useColorScheme";
import AdMobService from "@/services/adMobService";
import { useEffect } from "react";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Initialize AdMob when app starts
  useEffect(() => {
    AdMobService.initialize();
  }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <GluestackUIProvider mode="light">
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="page" options={{ headerShown: false }} />
          <Stack.Screen
            name="profil_capillaire"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="notifications" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
          <Stack.Screen name="chatbotPage" options={{ headerShown: false }} />
          <Stack.Screen name="product" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
