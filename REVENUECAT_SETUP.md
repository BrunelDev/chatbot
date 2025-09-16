# Configuration RevenueCat - Solution aux erreurs NativeEventEmitter

## Problème résolu

L'erreur `NativeEventEmitter requires a non-null argument` qui se produisait lors de l'utilisation de RevenueCat dans un environnement Expo Go ou de développement a été corrigée.

## Solutions implémentées

### 1. Import conditionnel de RevenueCat

Le service RevenueCat utilise maintenant un import conditionnel qui évite les erreurs lors du chargement du module :

```typescript
// Import conditionnel de RevenueCat pour éviter les erreurs en développement
let Purchases: any = null;
// ... autres imports

try {
  const RevenueCatModule = require("react-native-purchases");
  Purchases = RevenueCatModule.default || RevenueCatModule.Purchases;
  // ... autres assignments
} catch (error) {
  console.warn(
    "RevenueCat n'est pas disponible dans cet environnement:",
    error
  );
}
```

### 2. Vérification de l'environnement

Le service vérifie maintenant si RevenueCat est disponible et si l'application n'est pas en mode Expo Go :

```typescript
private checkRevenueCatAvailability(): boolean {
  if (!Purchases) {
    console.warn("RevenueCat n'est pas disponible dans cet environnement");
    return false;
  }

  // Vérifier si on est dans Expo Go
  if (Constants.appOwnership === "expo") {
    console.warn("RevenueCat n'est pas supporté dans Expo Go. Utilisez un développement build ou EAS Build.");
    return false;
  }

  return true;
}
```

### 3. Mode simulation

Quand RevenueCat n'est pas disponible, le service fonctionne en mode simulation :

- **Initialisation** : Réussit sans erreur
- **Achats** : Simule un achat réussi
- **Vérification premium** : Retourne toujours `false`
- **Restauration** : Simule une restauration réussie

### 4. Configuration app.json

Le plugin RevenueCat a été ajouté à la configuration :

```json
{
  "plugins": [
    // ... autres plugins
    "react-native-purchases"
  ]
}
```

## Environnements supportés

### ✅ Fonctionne avec simulation

- **Expo Go** : Mode simulation activé
- **Développement local** : Mode simulation si les modules natifs ne sont pas disponibles

### ✅ Fonctionne complètement

- **EAS Build** : RevenueCat fonctionne normalement
- **Expo Development Build** : RevenueCat fonctionne normalement
- **Production** : RevenueCat fonctionne normalement

## Utilisation

Le service fonctionne de manière transparente. Vous pouvez utiliser toutes les méthodes normalement :

```typescript
import RevenueCatService from "../services/revenueCatService";

// Initialisation (fonctionne toujours)
await RevenueCatService.initialize(userId);

// Vérification du statut premium
const isPremium = await RevenueCatService.isPremiumUser();

// Vérifier si RevenueCat est disponible
const isAvailable = RevenueCatService.isAvailable();
```

## Messages de log

Le service affiche des messages informatifs pour indiquer le mode de fonctionnement :

- `"RevenueCat initialisé avec succès"` : Fonctionnement normal
- `"RevenueCat non disponible, mode simulation activé"` : Mode simulation
- `"Mode simulation : [action] simulée"` : Actions en mode simulation

## Configuration des clés API

N'oubliez pas de remplacer les clés de test dans `revenueCatService.ts` :

```typescript
private static readonly API_KEYS = {
  ANDROID: "your_android_key_here", // Remplacez par votre vraie clé
  IOS: "your_ios_key_here", // Remplacez par votre vraie clé
};
```

## Prochaines étapes pour la production

1. **Créer un EAS Build** ou **Expo Development Build** pour tester RevenueCat complètement
2. **Configurer les produits** dans RevenueCat Dashboard
3. **Remplacer les clés API** par les vraies clés de production
4. **Tester les achats** en mode sandbox puis production

## Dépannage

Si vous rencontrez encore des erreurs :

1. Vérifiez que `expo-constants` est installé
2. Assurez-vous que le plugin est dans `app.json`
3. Redémarrez le serveur de développement après modification de `app.json`
4. Pour les tests complets, utilisez un development build plutôt qu'Expo Go

Cette solution permet à votre application de fonctionner sans erreur dans tous les environnements, avec une dégradation gracieuse quand RevenueCat n'est pas disponible.
