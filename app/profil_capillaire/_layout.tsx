import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

export default function ProfilCapillaireLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="formOne" options={{ headerShown: false }} />
        <Stack.Screen name="formTwo" options={{ headerShown: false }} />
        <Stack.Screen name="formThree" options={{ headerShown: false }} />
        <Stack.Screen name="formFour" options={{ headerShown: false }} />
        <Stack.Screen name="formFive" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
