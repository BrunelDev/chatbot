import { Platform } from "react-native";
import Purchases, {
  CustomerInfo,
  LOG_LEVEL,
  PURCHASES_ERROR_CODE,
  PurchasesError,
  PurchasesOffering,
  PurchasesPackage,
} from "react-native-purchases";

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
    ANDROID: "appl_JLyEKfDVGgKXZihkSOPEBsaRbSJ",
    IOS: "appl_JLyEKfDVGgKXZihkSOPEBsaRbSJ",
  };

  // Identifiants des produits d'abonnement
  public static readonly PRODUCT_IDS = {
    MONTHLY: "monthly_bep",
  };

  /**
   * Identifiant d'entitlement RevenueCat.
   * Doit correspondre EXACTEMENT à l'entitlement configuré dans le dashboard.
   */
  public static readonly ENTITLEMENT_ID = "bep-premium";

  public static getInstance(): RevenueCatService {
    if (!RevenueCatService.instance) {
      RevenueCatService.instance = new RevenueCatService();
    }
    return RevenueCatService.instance;
  }
  /**
   * Initialise RevenueCat avec les clés API
   */
  async initialize(userId?: string): Promise<void> {
    if (this.isInitialized) {
      console.log("RevenueCat déjà initialisé");
      return;
    }

    try {
      const apiKey =
        Platform.OS === "android" ?
          RevenueCatService.API_KEYS.ANDROID
        : RevenueCatService.API_KEYS.IOS;

      // Activer des logs verbeux (utile en dev)
      Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

      Purchases.configure({ apiKey });

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
  async getOfferings(): Promise<PurchasesOffering | null> {
    // if (!this.isRevenueCatAvailable) {
    //   console.warn("Mode simulation : retour d'offres factices");
    //   return null;
    // }

    try {
      const offerings = await Purchases.getOfferings();
      return offerings.current;
    } catch (error) {
      console.error("Erreur lors de la récupération des offres:", error);
      return null;
    }
  }

  /**
   * Effectue un achat d'abonnement
   */
  async purchasePackage(packageToPurchase: PurchasesPackage): Promise<{
    success: boolean;
    customerInfo?: CustomerInfo;
    error?: string;
  }> {
    // if (!this.isRevenueCatAvailable) {
    //   console.warn("Mode simulation : achat simulé avec succès");
    //   return {
    //     success: true,
    //     error: "Mode simulation - achat simulé",
    //   };
    // }

    try {
      const { customerInfo } =
        await Purchases.purchasePackage(packageToPurchase);
      return {
        success: true,
        customerInfo,
      };
    } catch (error: unknown) {
      console.error("Erreur lors de l'achat:", error);

      const purchasesError = error as PurchasesError;

      if (purchasesError.code) {
        // Gestion des erreurs spécifiques
        if (
          purchasesError.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR
        ) {
          return {
            success: false,
            error: "Achat annulé par l'utilisateur",
          };
        } else if (
          purchasesError.code === PURCHASES_ERROR_CODE.PAYMENT_PENDING_ERROR
        ) {
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
    // if (!this.isRevenueCatAvailable) {
    //   console.warn("Mode simulation : retour d'infos d'abonnement factices");
    //   return { isActive: false };
    // }

    try {
      const customerInfo = await Purchases.getCustomerInfo();
      const entitlement =
        customerInfo.entitlements.active[RevenueCatService.ENTITLEMENT_ID];

      if (entitlement) {
        return {
          isActive: true,
          productIdentifier: entitlement.productIdentifier,
          originalPurchaseDate: entitlement.originalPurchaseDate,
          expirationDate: entitlement.expirationDate as string,
          isTrialPeriod: entitlement.periodType === "TRIAL",
          isSandbox: entitlement.isSandbox,
        };
      }

      return { isActive: false };
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des infos d'abonnement:",
        error,
      );
      return { isActive: false };
    }
  }

  /**
   * Vérifie si l'utilisateur a un abonnement actif
   */
  async isPremiumUser(): Promise<boolean> {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      console.log(
        "[RevenueCat] Checking premium status for App User ID:",
        customerInfo.originalAppUserId,
      );
      console.log(
        "[RevenueCat] Active entitlements:",
        Object.keys(customerInfo.entitlements.active),
      );
      console.log(
        "isPremium ? :",
        customerInfo.entitlements.active[RevenueCatService.ENTITLEMENT_ID],
      );
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
    customerInfo?: CustomerInfo;
    error?: string;
  }> {
    // if (!this.isRevenueCatAvailable) {
    //   console.warn("Mode simulation : restauration simulée");
    //   return {
    //     success: true,
    //     error: "Mode simulation - restauration simulée",
    //   };
    // }

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
    // if (!this.isRevenueCatAvailable) {
    //   console.warn("Mode simulation : connexion utilisateur simulée");
    //   return;
    // }

    try {
      const { customerInfo, created } = await Purchases.logIn(userId);
      console.log("[RevenueCat] login result:", {
        userId,
        created,
        originalAppUserId: customerInfo.originalAppUserId,
      });
      console.log("[RevenueCat] Utilisateur connecté à RevenueCat:", userId);
    } catch (error) {
      console.error("Erreur lors de la connexion utilisateur:", error);
      throw error;
    }
  }

  /**
   * Déconnecte l'utilisateur de RevenueCat
   */
  async logoutUser(): Promise<void> {
    // if (!this.isRevenueCatAvailable) {
    //   console.warn("Mode simulation : déconnexion utilisateur simulée");
    //   return;
    // }

    try {
      const info = await Purchases.logOut();
      console.log(
        "[RevenueCat] Utilisateur déconnecté. Nouvel ID anonyme:",
        info.originalAppUserId,
      );
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
    // if (!this.isRevenueCatAvailable) {
    //   console.warn("Mode simulation : configuration des attributs simulée");
    //   return;
    // }

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
