import accountService, { AuthResponse } from "@/services/accountService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export const useUser = () => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  useEffect(() => {
    const fun = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("userInfo");
        if (storedUser) {
          setUser(JSON.parse(storedUser) as AuthResponse);
        } 
      } catch (e) {
        console.error("Failed to load user info from storage", e);
      }
    };
    fun();
  }, []);
  return { user, setUser };
};
