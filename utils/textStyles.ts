import { StyleSheet } from "react-native";

// Configuration globale des styles
export const globalStyles = StyleSheet.create({
  defaultText: {
    fontFamily: "WorkSans",
  },
  titleText: {
    fontFamily: "Borna",
  },
});

// Fonction utilitaire pour combiner les styles avec la police par défaut
export const getTextStyle = (customStyle?: any) => {
  if (Array.isArray(customStyle)) {
    return [globalStyles.defaultText, ...customStyle];
  }
  return [globalStyles.defaultText, customStyle];
};

// Fonction utilitaire pour les titres avec Borna
export const getTitleStyle = (customStyle?: any) => {
  if (Array.isArray(customStyle)) {
    return [globalStyles.titleText, ...customStyle];
  }
  return [globalStyles.titleText, customStyle];
};
