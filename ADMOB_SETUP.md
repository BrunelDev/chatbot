# Google AdMob Setup Guide

## 🎯 Overview

This guide covers the complete Google AdMob integration for your React Native Expo app "Boucles en Poésie".

## 📦 What's Installed

- `react-native-google-mobile-ads` - Official Google Mobile Ads SDK
- Configured with test ad unit IDs for development

## 🔧 Configuration Files

### 1. App Configuration (`app.json`)

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": "ca-app-pub-3940256099942544~3347511713",
          "iosAppId": "ca-app-pub-3940256099942544~1458002511"
        }
      ]
    ]
  }
}
```

### 2. AdMob Service (`services/adMobService.ts`)

- Handles AdMob initialization
- Contains test ad unit IDs
- Platform-specific ad unit management

### 3. Ad Components Created

- **BannerAdComponent** (`components/ads/BannerAdComponent.tsx`)
- **InterstitialAdService** (`services/interstitialAdService.ts`)
- **RewardedAdService** (`services/rewardedAdService.ts`)

## 🚀 Integration Points

### Banner Ads

- **Home Screen**: Banner ad displayed at the top
- **Location**: `app/(tabs)/home.tsx`

### Interstitial Ads

- **Chatbot**: Shows every 3rd message sent
- **Location**: `app/(tabs)/chatbot.tsx`

### Rewarded Ads

- **Available**: Service ready for implementation
- **Use Case**: Could be used for premium features or extra chatbot messages

## 🧪 Testing

### Test Screen

Use `components/test/AdMobTestScreen.tsx` to test all ad types:

- Banner ads
- Interstitial ads
- Rewarded ads
- Ad loading status

### Test Ad Unit IDs

Currently using Google's test ad unit IDs:

- **Banner**: `ca-app-pub-3940256099942544/6300978111`
- **Interstitial**: `ca-app-pub-3940256099942544/1033173712`
- **Rewarded**: `ca-app-pub-3940256099942544/5224354917`

## 📱 Production Setup

### 1. Create AdMob Account

1. Go to [AdMob Console](https://apps.admob.com/)
2. Create a new app
3. Get your real app IDs and ad unit IDs

### 2. Update Configuration

Replace test IDs in `services/adMobService.ts`:

```typescript
static readonly AD_UNITS = {
  BANNER: {
    ANDROID: 'ca-app-pub-XXXXXXXXXX/XXXXXXXXXX', // Your real Android banner ID
    IOS: 'ca-app-pub-XXXXXXXXXX/XXXXXXXXXX',     // Your real iOS banner ID
  },
  // ... other ad types
};
```

### 3. Update App IDs

Update `app.json` with your real app IDs:

```json
{
  "androidAppId": "ca-app-pub-XXXXXXXXXX~XXXXXXXXXX",
  "iosAppId": "ca-app-pub-XXXXXXXXXX~XXXXXXXXXX"
}
```

## 💰 Monetization Strategy

### Current Implementation

- **Banner Ads**: Non-intrusive, always visible
- **Interstitial Ads**: Every 3rd chatbot message
- **Premium Users**: No ads (subscription modal instead)

### Optimization Tips

1. **Frequency Capping**: Don't show too many interstitial ads
2. **User Experience**: Ensure ads don't interrupt critical user flows
3. **A/B Testing**: Test different ad placements and frequencies
4. **Revenue Tracking**: Monitor ad performance in AdMob console

## 🔍 Troubleshooting

### Common Issues

1. **Ads not showing**: Check if test IDs are correct
2. **App crashes**: Ensure AdMob is properly initialized
3. **No fill**: Normal in development, will work in production

### Debug Commands

```bash
# Check if AdMob is properly installed
npx expo install react-native-google-mobile-ads

# Rebuild app after configuration changes
npx expo run:android
npx expo run:ios
```

## 📊 Analytics

Monitor your ad performance in:

- AdMob Console
- Google Analytics (if integrated)
- App Store Connect (iOS)
- Google Play Console (Android)

## 🎉 Next Steps

1. Test the implementation with test ads
2. Create real AdMob account and get production IDs
3. Replace test IDs with production IDs
4. Monitor ad performance and optimize
5. Consider implementing rewarded ads for premium features

---

**Note**: This setup uses test ad unit IDs for development. Replace with your real AdMob IDs before publishing to app stores.

