import { router, Tabs } from "expo-router";
import React from "react";
import { Platform, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { useColorScheme } from "@/hooks/useColorScheme";

import { Image } from "expo-image";

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
      <TouchableWithoutFeedback
        onPress={() => {
          if (name === "chatbot") {
            console.log("name", name);

            router.push("/chatbotPage");
          }
        }}
        className={`flex items-center justify-center w-fit  rounded-full ${
          active ? "bg-candlelight-200" : ""
        }`}
      >
        <Image  source={icon} style={{ width: 24, height: 24 }} />
      </TouchableWithoutFeedback>
    );
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#4D5962",
        tabBarInactiveTintColor: "#4D5962",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: () => (
          <View className="bg-[#FEFDE8]" />
        ),
        // Add space between icon and label
        tabBarLabelStyle: { paddingTop: 6 },
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
            backgroundColor: "#FEFDE8",
          },
          default: {
            backgroundColor: "#FEFDE8",
          },
        }),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              active={focused}
              name="Accueil"
              icon={require("/assets/icons/home.svg")}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="chatbot"
        options={{
          title: "Chatbot",
          tabBarIcon: ({ color, focused }) => (
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
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              active={focused}
              name="explore"
              icon={require("/assets/icons/explore.svg")}
            />
          ),
        }}
      />
    </Tabs>
  );
}
