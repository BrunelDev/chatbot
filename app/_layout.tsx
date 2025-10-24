import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, Text } from "react-native";
import "react-native-reanimated";
import "./global.css";

import Purchases, { LOG_LEVEL } from "react-native-purchases";

import { useColorScheme } from "@/hooks/useColorScheme";
import AdMobService from "@/services/adMobService";
import { useEffect } from "react";
import { SessionProvider, useSession } from "../ctx";
import { SplashScreenController } from "../splash";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    WorkSans: require("../assets/fonts/WorkSans-VariableFont_wght.ttf"),
    Borna: require("../assets/fonts/borna-medium.otf"),
  });

  // Initialize AdMob when app starts
  useEffect(() => {
    AdMobService.initialize();
  }, []);

  useEffect(() => {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

    if (Platform.OS === "ios") {
      Purchases.configure({
        apiKey: "appl_EQydqfvsncAoKXNhSbzwIUUPaRb",
      });
    } else if (Platform.OS === "android") {
      console.log("Android");
    }
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
    <GluestackUIProvider mode="light">
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <SessionProvider>
          <SplashScreenController />
          <RootNavigator />
        </SessionProvider>
        <StatusBar style="dark" backgroundColor="#FEFDE8" />
      </ThemeProvider>
    </GluestackUIProvider>
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
