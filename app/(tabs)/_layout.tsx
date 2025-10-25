import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Image } from "expo-image";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const TabBarIcon = ({
    active,
    name,
    icon,
  }: {
    active: boolean;
    name: string;
    icon: string;
  }) => {
    return (
      <View
        style={[styles.iconContainer, active && styles.activeIconContainer]}
      >
        <Image
          source={icon}
          style={[styles.icon, { tintColor: active ? "#4D5962" : "#4D5962" }]}
        />
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: "#4D5962",
          tabBarInactiveTintColor: "#4D5962",
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: () => <View style={styles.tabBarBackground} />,
          tabBarLabelStyle: {
            paddingTop: 6,
            fontSize: 12,
            fontWeight: "500",
          },
          tabBarStyle:
            route.name === "chatbot"
              ? { display: "none" }
              : Platform.select({
                  ios: {
                    position: "absolute",
                    backgroundColor: "#FEFDE8",
                    borderTopWidth: 0,
                    elevation: 0,
                    shadowOpacity: 0,
                  },
                  default: {
                    backgroundColor: "#FEFDE8",
                    borderTopWidth: 0,
                    elevation: 0,
                    display: route.name === "chatbot" ? "none" : "flex",
                  },
                }),
        })}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Accueil",
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                active={focused}
                name="home"
                icon={require("/assets/icons/home.svg")}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="chatbot"
          options={{
            title: "Chatbot",
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                active={focused}
                name="chatbot"
                icon={require("/assets/icons/chat.svg")}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="explore"
          options={{
            title: "Explorer",
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                active={focused}
                name="explore"
                icon={require("/assets/icons/explore.svg")}
              />
            ),
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 38,
    height: 38,
    borderRadius: 16,
  },
  activeIconContainer: {
    backgroundColor: "#FFF987", // A light version of your candlelight color
  },
  icon: {
    width: 24,
    height: 24,
  },
  tabBarBackground: {
    backgroundColor: "#FEFDE8",
    flex: 1,
  },
});
