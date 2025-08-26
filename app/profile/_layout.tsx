import { useColorScheme } from "@/hooks/useColorScheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function SearchLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="profilePage"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="resumeCapillaire"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="stepOne"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="stepTwo"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="stepThree"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="stepFour"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="stepFive"
          options={{ headerShown: false }}
        />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
