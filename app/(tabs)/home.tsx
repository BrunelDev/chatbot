import React from 'react';
import { View, Alert, Text } from 'react-native';
import { PrimaryButton } from '@/components/buttons/primaryButton';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      router.replace('/(auth)/login');
      Alert.alert('Logout', 'You have been logged out successfully.');
    } catch (error) {
      console.error('Failed to logout:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action is permanent.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {
            console.log('Account deletion initiated');
            // Implement account deletion logic here
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <View className="flex-1 justify-center items-center p-5 bg-white">
      <Text className="text-2xl font-bold mb-5">Home Screen</Text>
      <PrimaryButton
        title="Logout"
        handlePress={handleLogout}
        className="w-full"
      />
      <View className="h-5" />
      <PrimaryButton
        title="Delete Account"
        handlePress={handleDeleteAccount}
        className="w-full"
      />
    </View>
  );
}