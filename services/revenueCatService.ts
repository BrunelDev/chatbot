import Constants from "expo-constants";
import { Platform } from "react-native";

// Import conditionnel de RevenueCat pour éviter les erreurs en développement
let Purchases: any = null;
let CustomerInfo: any = null;
let PURCHASES_ERROR_CODE: any = null;
let PurchasesOffering: any = null;
let PurchasesPackage: any = null;
let PurchasesError: any = null;

try {
  const RevenueCatModule = require("react-native-purchases");
  Purchases = RevenueCatModule.default || RevenueCatModule.Purchases;
  CustomerInfo = RevenueCatModule.CustomerInfo;
  PURCHASES_ERROR_CODE = RevenueCatModule.PURCHASES_ERROR_CODE;
  PurchasesOffering = RevenueCatModule.PurchasesOffering;
  PurchasesPackage = RevenueCatModule.PurchasesPackage;
  PurchasesError = RevenueCatModule.PurchasesError;
} catch (error) {
  console.warn(
    "RevenueCat n'est pas disponible dans cet environnement:",
    error
  );
}

export interface SubscriptionInfo {
  isActive: boolean;
  productIdentifier?: string;
  originalPurchaseDate?: string;
  expirationDate?: string;
  isTrialPeriod?: boolean;
  isSandbox?: boolean;
}

class RevenueCatService {
  private static instance: RevenueCatService;
  private isInitialized = false;
  private isRevenueCatAvailable = false;

  // Clés API RevenueCat (remplacez par vos vraies clés)
  private static readonly API_KEYS = {
    ANDROID: "rcat_android_key_here", // Remplacez par votre clé Android
    IOS: "appl_EQydqfvsncAoKXNhSbzwIUUPaRb",
  };

  // Identifiants des produits d'abonnement
  public static readonly PRODUCT_IDS = {
    MONTHLY: "premium_monthly",
    YEARLY: "premium_yearly",
  };

  public static readonly ENTITLEMENT_ID = "premium_features";

  public static getInstance(): RevenueCatService {
    if (!RevenueCatService.instance) {
      RevenueCatService.instance = new RevenueCatService();
    }
    return RevenueCatService.instance;
  }

  /**
   * Vérifie si RevenueCat est disponible dans l'environnement actuel
   */
  private checkRevenueCatAvailability(): boolean {
    if (!Purchases) {
      console.warn("RevenueCat n'est pas disponible dans cet environnement");
      return false;
    }

    // Vérifier si on est dans Expo Go
    if (Constants.appOwnership === "expo") {
      console.warn(
        "RevenueCat n'est pas supporté dans Expo Go. Utilisez un développement build ou EAS Build."
      );
      return false;
    }

    return true;
  }

  /**
   * Initialise RevenueCat avec les clés API
   */
  async initialize(userId?: string): Promise<void> {
    if (this.isInitialized) {
      console.log("RevenueCat déjà initialisé");
      return;
    }

    // Vérifier la disponibilité de RevenueCat
    this.isRevenueCatAvailable = this.checkRevenueCatAvailability();

    if (!this.isRevenueCatAvailable) {
      console.warn("RevenueCat non disponible, mode simulation activé");
      this.isInitialized = true;
      return;
    }

    try {
      const apiKey =
        Platform.OS === "android"
          ? RevenueCatService.API_KEYS.ANDROID
          : RevenueCatService.API_KEYS.IOS;

      await Purchases.configure({ apiKey });

      // Définir l'ID utilisateur si fourni
      if (userId) {
        await Purchases.logIn(userId);
      }

      this.isInitialized = true;
      console.log("RevenueCat initialisé avec succès");
    } catch (error) {
      console.error("Erreur lors de l'initialisation de RevenueCat:", error);
      // En cas d'erreur, on active le mode simulation
      this.isRevenueCatAvailable = false;
      this.isInitialized = true;
      console.warn("Basculement vers le mode simulation RevenueCat");
    }
  }

  /**
   * Récupère les offres d'abonnement disponibles
   */
  async getOfferings(): Promise<any | null> {
    if (!this.isRevenueCatAvailable) {
      console.warn("Mode simulation : retour d'offres factices");
      return null;
    }

    try {
      const offerings = await Purchases.getOfferings();
      return offerings.current;
    } catch (error) {
      console.error("Erreur lors de la récupération des offres:", error);
      return null;
    }
  }

  /**
   /**
    * Effectue un achat d'abonnement
    */
  async purchasePackage(packageToPurchase: any): Promise<{
    success: boolean;
    customerInfo?: any;
    error?: string;
  }> {
    if (!this.isRevenueCatAvailable) {
      console.warn("Mode simulation : achat simulé avec succès");
      return {
        success: true,
        error: "Mode simulation - achat simulé",
      };
    }

    try {
      const { customerInfo } = await Purchases.purchasePackage(
        packageToPurchase
      );
      return {
        success: true,
        customerInfo,
      };
    } catch (error: any) {
      console.error("Erreur lors de l'achat:", error);

      if (error instanceof PurchasesError) {
        // Gestion des erreurs spécifiques
        if (error.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED) {
          return {
            success: false,
            error: "Achat annulé par l'utilisateur",
          };
        } else if (error.code === PURCHASES_ERROR_CODE.PAYMENT_PENDING) {
          return {
            success: false,
            error: "Paiement en attente",
          };
        }
      }

      return {
        success: false,
        error: "Erreur lors de l'achat",
      };
    }
  }

  /**
   * Récupère les informations d'abonnement de l'utilisateur
   */
  async getSubscriptionInfo(): Promise<SubscriptionInfo> {
    if (!this.isRevenueCatAvailable) {
      console.warn("Mode simulation : retour d'infos d'abonnement factices");
      return { isActive: false };
    }

    try {
      const customerInfo = await Purchases.getCustomerInfo();
      const entitlement =
        customerInfo.entitlements.active[RevenueCatService.ENTITLEMENT_ID];

      if (entitlement) {
        return {
          isActive: true,
          productIdentifier: entitlement.productIdentifier,
          originalPurchaseDate: entitlement.originalPurchaseDate,
          expirationDate: entitlement.expirationDate,
          isTrialPeriod: entitlement.isTrialPeriod,
          isSandbox: entitlement.isSandbox,
        };
      }

      return { isActive: false };
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des infos d'abonnement:",
        error
      );
      return { isActive: false };
    }
  }

  /**
   * Vérifie si l'utilisateur a un abonnement actif
   */
  async isPremiumUser(): Promise<boolean> {
    if (!this.isRevenueCatAvailable) {
      console.warn("Mode simulation : utilisateur non premium");
      return false;
    }

    try {
      const customerInfo = await Purchases.getCustomerInfo();
      return (
        customerInfo.entitlements.active[RevenueCatService.ENTITLEMENT_ID] !==
        undefined
      );
    } catch (error) {
      console.error("Erreur lors de la vérification du statut premium:", error);
      return false;
    }
  }

  /**
   * Restaure les achats précédents
   */
  async restorePurchases(): Promise<{
    success: boolean;
    customerInfo?: any;
    error?: string;
  }> {
    if (!this.isRevenueCatAvailable) {
      console.warn("Mode simulation : restauration simulée");
      return {
        success: true,
        error: "Mode simulation - restauration simulée",
      };
    }

    try {
      const customerInfo = await Purchases.restorePurchases();
      return {
        success: true,
        customerInfo,
      };
    } catch (error) {
      console.error("Erreur lors de la restauration des achats:", error);
      return {
        success: false,
        error: "Erreur lors de la restauration des achats",
      };
    }
  }

  /**
   * Connecte un utilisateur à RevenueCat
   */
  async loginUser(userId: string): Promise<void> {
    if (!this.isRevenueCatAvailable) {
      console.warn("Mode simulation : connexion utilisateur simulée");
      return;
    }

    try {
      await Purchases.logIn(userId);
      console.log("Utilisateur connecté à RevenueCat:", userId);
    } catch (error) {
      console.error("Erreur lors de la connexion utilisateur:", error);
      throw error;
    }
  }

  /**
   * Déconnecte l'utilisateur de RevenueCat
   */
  async logoutUser(): Promise<void> {
    if (!this.isRevenueCatAvailable) {
      console.warn("Mode simulation : déconnexion utilisateur simulée");
      return;
    }

    try {
      await Purchases.logOut();
      console.log("Utilisateur déconnecté de RevenueCat");
    } catch (error) {
      console.error("Erreur lors de la déconnexion utilisateur:", error);
      throw error;
    }
  }

  /**
   * Configure les attributs utilisateur pour l'analytics
   */
  async setUserAttributes(attributes: {
    [key: string]: string | null;
  }): Promise<void> {
    if (!this.isRevenueCatAvailable) {
      console.warn("Mode simulation : configuration des attributs simulée");
      return;
    }

    try {
      await Purchases.setAttributes(attributes);
    } catch (error) {
      console.error("Erreur lors de la configuration des attributs:", error);
    }
  }

  /**
   * Vérifie si RevenueCat est disponible
   */
  isAvailable(): boolean {
    return this.isRevenueCatAvailable;
  }
}

export default RevenueCatService.getInstance();
