import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";

import { useColorScheme } from "@/hooks/useColorScheme";
import RevenueCatService from "@/services/revenueCatService";
import React, { useEffect } from "react";
import { SessionProvider, useSession } from "../ctx";
import { SplashScreenController } from "../splash";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    WorkSans: require("../assets/fonts/WorkSans-VariableFont_wght.ttf"),
    Borna: require("../assets/fonts/borna-medium.otf"),
  });

  useEffect(() => {
    // Initialisation via le service (import conditionnel + compat Expo Go)
    RevenueCatService.initialize();
  }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  const RNText = Text as any;
  RNText.defaultProps = RNText.defaultProps || {};
  RNText.defaultProps.allowFontScaling = false;
  const existingStyle = RNText.defaultProps.style;
  if (Array.isArray(existingStyle)) {
    RNText.defaultProps.style = [...existingStyle, { fontFamily: "WorkSans" }];
  } else if (existingStyle) {
    RNText.defaultProps.style = [existingStyle, { fontFamily: "WorkSans" }];
  } else {
    RNText.defaultProps.style = { fontFamily: "WorkSans" };
  }

  // Set up the auth context and render your layout inside of it.
  return (
    <SafeAreaProvider>
      <GluestackUIProvider mode="light">
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <SessionProvider>
            <SplashScreenController />
            <RootNavigator />
          </SessionProvider>
          <StatusBar style="dark" backgroundColor="#FEFDE8" />
        </ThemeProvider>
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}

// Create a new component that can access the SessionProvider context later.
function RootNavigator() {
  const { session } = useSession();

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />

      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="page" options={{ headerShown: false }} />
        <Stack.Screen
          name="profil_capillaire"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="chatbotPage" options={{ headerShown: false }} />
        <Stack.Screen name="product" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
