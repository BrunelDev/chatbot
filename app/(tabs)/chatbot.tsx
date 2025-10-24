import { ChatHeadBar } from "@/components/chat/chatHeadBar";
import PremiumSubscriptionModal from "@/components/modals/PremiumSubscriptionModal";
import { useImagePicker } from "@/hooks/useImagePicker";
import { useUser } from "@/hooks/useUser";
import {
  createConversationSession,
  getFullConversation,
  StartConversationPayload,
  startOrContinueConversation,
} from "@/services/chatBotService";
import InterstitialAdService from "@/services/interstitialAdService";
import { uploadToSupabase } from "@/services/storage/uploadToSupabase";
import { Chat, defaultTheme, MessageType } from "@flyerhq/react-native-chat-ui";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { useFocusEffect } from "expo-router";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import {
  Alert,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Purchases from "react-native-purchases";

// Extension des types de messages pour inclure les messages avec image et texte
type ExtendedMessageType =
  | MessageType.Any
  | {
      id: string;
      type: "image_with_text";
      author: { id: string; imageUrl?: any };
      text: string;
      imageFile: string | null;
      createdAt: number;
    };

const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const Chatbot = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | undefined>();
  // Fonction pour convertir ExtendedMessageType en MessageType.Any pour le composant Chat
  const convertToChatMessages = (
    messages: ExtendedMessageType[]
  ): MessageType.Any[] => {
    return messages.map((message) => {
      if (message.type === "image_with_text") {
        // Pour les messages avec image et texte, on les traite comme des messages texte
        return {
          id: message.id,
          type: "text" as const,
          author: message.author,
          text: message.text,
          createdAt: message.createdAt,
        };
      }
      return message as MessageType.Any;
    });
  };
  const [messages, setMessages] = useState<ExtendedMessageType[]>([]);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    uri: string;
    name: string;
    size: number;
  } | null>(null);
  const { user: userData } = useUser();
  const { pickImageForChat } = useImagePicker();

  const user = {
    id: "06c33e8b-e835-4736-80f4-63f44b66666c",
    imageUrl: require("@/assets/images/userProfile-img.png"),
  };

  // ✅ Vérifier le statut premium au chargement
  useEffect(() => {
    checkPremiumStatus();
  }, []);

  const checkPremiumStatus = async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      const isPremiumUser =
        typeof customerInfo.entitlements.active["premium"] !== "undefined";
      setIsPremium(isPremiumUser);
      console.log("Premium status:", isPremiumUser);
    } catch (error) {
      console.error("Error checking premium status:", error);
    }
  };

  const renderBubbleAdvanced = ({
    child,
    message,
    nextMessageInGroup,
  }: {
    child: ReactNode;
    message: ExtendedMessageType;
    nextMessageInGroup: boolean;
  }) => {
    const isUserMessage = user.id === message.author.id;
    const isImageMessage = message.type === "image";
    const isTextMessage = message.type === "text";
    const isImageWithTextMessage = message.type === "image_with_text";

    return (
      <View
        style={{
          backgroundColor: isUserMessage ? "#FFFDC2" : "transparent",
          borderColor: "transparent",
          borderWidth: 0,
          overflow: "hidden",
          maxWidth: isImageMessage || isImageWithTextMessage ? 250 : undefined,
        }}
        className={`${
          isUserMessage ? "rounded-2xl" : "rounded-none"
        } text-international_orange-200`}
      >
        {isImageWithTextMessage ? (
          <View className="flex gap-2">
            <View className="px-2 py-3">
              {/* Texte au-dessus de l'image */}
              <Text className="text-[#4D5962] text-[14px] font-worksans mb-2">
                {message.text || ""}
              </Text>
            </View>
            {/* Image */}
            <View
              className={`${
                isUserMessage ? "rounded-xl" : "rounded-lg"
              } overflow-hidden`}
            >
              <View style={{ position: "relative" }}>
                <Image
                  source={{ uri: message.imageFile || "" }}
                  style={{
                    width: width - 32,
                    height: width / 1.5,
                    borderRadius: 8,
                  }}
                />
                {isUserMessage && (
                  <View
                    style={{
                      position: "absolute",
                      bottom: 4,
                      right: 4,
                      backgroundColor: "rgba(0,0,0,0.6)",
                      borderRadius: 8,
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                    }}
                  >
                    <Text style={{ color: "white", fontSize: 10 }}>📷</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        ) : isImageMessage ? (
          <View
            className={`${
              isUserMessage ? "rounded-xl" : "rounded-lg"
            } overflow-hidden`}
          >
            <View style={{ position: "relative" }}>
              {child}
              {isUserMessage && (
                <View
                  style={{
                    position: "absolute",
                    bottom: 4,
                    right: 4,
                    backgroundColor: "rgba(0,0,0,0.6)",
                    borderRadius: 8,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                  }}
                >
                  <Text style={{ color: "white", fontSize: 10 }}>📷</Text>
                </View>
              )}
            </View>
          </View>
        ) : isTextMessage ? (
          <View className="px-2 py-3">
            <Text className="text-[#4D5962] text-[14px] font-worksans">
              {message.text || ""}
            </Text>
          </View>
        ) : (
          <View className="px-2 py-3">{child}</View>
        )}
      </View>
    );
  };

  useFocusEffect(
    useCallback(() => {
      const loadChatId = async () => {
        console.log("start");
        try {
          const chatId = await AsyncStorage.getItem("chatId");
          if (chatId) {
            setCurrentChatId(chatId);
          } else {
            const newChatId = await createConversationSession({
              title: "Chat",
            });
            setCurrentChatId(newChatId.session_id);
            await AsyncStorage.setItem("chatId", newChatId.session_id);
          }
          if (chatId) {
            const conversation = await getFullConversation(chatId!);
            console.log(conversation.messages);
            setMessages(
              conversation.messages.reverse().map((message) => ({
                id: message.id.toString(),
                type: message.image_file ? "image_with_text" : "text",
                author:
                  message.message_type === "user" ? user : { id: "assistant" },
                text: message.content,
                imageFile: message.image_file,
                createdAt: Date.now(),
              }))
            );
          }
        } catch (error) {
          console.error("Error loading chatId:", error);
        }
      };
      loadChatId();

      InterstitialAdService.loadAd();
    }, [])
  );

  const handleSendPress = async (message: MessageType.PartialText) => {
    const messageCount = messages.length;
    if (
      messageCount > 0 &&
      messageCount % 3 === 0 &&
      InterstitialAdService.isAdLoaded()
    ) {
      await InterstitialAdService.showAd();
    }

    try {
      let uploadedImageUrl: string | undefined;

      if (selectedImage) {
        uploadedImageUrl = await uploadToSupabase(selectedImage.uri, {
          bucket: "bep-bucket",
          path: `chat-conversation/user-${user?.id}`,
          fileType: "image",
        });
      }

      const messagesToAdd: ExtendedMessageType[] = [];

      if (selectedImage && uploadedImageUrl) {
        const imageMessage: MessageType.Image = {
          author: user,
          createdAt: Date.now(),
          id: uuidv4(),
          type: "image",
          uri: uploadedImageUrl,
          name: selectedImage.name,
          size: selectedImage.size,
        };
        messagesToAdd.push(imageMessage);
      }

      const textMessage: MessageType.Text = {
        author: user,
        createdAt: Date.now(),
        id: uuidv4(),
        text: message.text,
        type: "text",
      };
      messagesToAdd.push(textMessage);

      setMessages((currentMessages) => [...messagesToAdd, ...currentMessages]);

      const response = await sendMessageToRag(
        message.text,
        currentChatId,
        uploadedImageUrl
      );

      setSelectedImage(null);

      const responseMessage: MessageType.Text = {
        author: {
          id: "assistant",
          firstName: "Hair bot",
          lastName: "Assistant",
          imageUrl: require("../../assets/images/chatbot.png"),
        },
        createdAt: Date.now(),
        id: uuidv4(),
        text: response?.ai_response.content!,
        type: "text",
      };

      setMessages((currentMessages) => [responseMessage, ...currentMessages]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: MessageType.Text = {
        author: {
          id: "assistant",
          firstName: "Hair bot",
          lastName: "Assistant",
          imageUrl: require("@/assets/images/chatbot.png"),
        },
        createdAt: Date.now(),
        id: uuidv4(),
        text: "Désolé, une erreur s'est produite. Veuillez réessayer.",
        type: "text",
      };
      setMessages((currentMessages) => [errorMessage, ...currentMessages]);
    }
  };

  const handleAttachmentPress = async () => {
    try {
      const imageData = await pickImageForChat();
      if (imageData) {
        setSelectedImage({
          uri: imageData.uri,
          name: imageData.name,
          size: imageData.size,
        });
      }
    } catch (error) {
      console.error("Error handling attachment:", error);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    setIsSidebarOpen(false);
  };

  const handleUpgradeToPremium = async () => {
    try {
      console.log("🔍 Fetching offerings...");
      const offerings = await Purchases.getOfferings();

      // ✅ Debug complet
      console.log("📦 Available offerings:", offerings);
      console.log("📦 Current offering:", offerings.current);
      console.log("📦 All offerings:", offerings.all);

      if (!offerings.current) {
        console.error("❌ No current offering found");
        Alert.alert(
          "Erreur",
          "Aucune offre disponible. Vérifiez votre configuration RevenueCat."
        );
        return;
      }

      const availablePackages = offerings.current.availablePackages;
      console.log("📦 Available packages:", availablePackages);
      console.log(
        "📦 Package identifiers:",
        availablePackages.map((p) => p.identifier)
      );

      if (availablePackages.length === 0) {
        console.error("❌ No packages found in current offering");
        Alert.alert(
          "Erreur",
          "Aucun abonnement disponible. Contactez le support."
        );
        return;
      }

      // ✅ Utilise le premier package ou cherche par identifier
      // Option 1: Prendre le premier package disponible
      console.log(
        "📦 Purchasing first available package...",
        availablePackages
      );
      const packageToPurchase = availablePackages[0];

      // Option 2: Ou chercher par identifier spécifique (ex: "$rc_monthly")
      // const packageToPurchase = availablePackages.find(
      //   (p) => p.identifier === "$rc_monthly" || p.identifier === "monthly"
      // );

      if (!packageToPurchase) {
        console.error("❌ No suitable package found");
        Alert.alert("Erreur", "Aucun abonnement mensuel trouvé.");
        return;
      }

      console.log("💳 Attempting purchase of:", packageToPurchase.identifier);
      const { customerInfo } = await Purchases.purchasePackage(
        packageToPurchase
      );

      console.log("✅ Purchase successful");
      console.log("👤 Customer info:", customerInfo);
      console.log("🎁 Active entitlements:", customerInfo.entitlements.active);

      if (typeof customerInfo.entitlements.active["premium"] !== "undefined") {
        setIsPremium(true);
        setShowSubscriptionModal(false);
        Alert.alert("Succès", "Vous êtes maintenant premium ! 🎉");
      } else {
        console.warn(
          "⚠️ Purchase completed but 'premium' entitlement not found"
        );
        Alert.alert(
          "Attention",
          "Achat effectué mais l'accès premium n'est pas encore actif. Veuillez patienter quelques instants."
        );
      }
    } catch (e: any) {
      console.error("❌ Purchase error:", e);
      if (!e.userCancelled) {
        Alert.alert(
          "Erreur",
          e.message || "Une erreur est survenue lors de l'achat."
        );
      } else {
        console.log("ℹ️ User cancelled purchase");
      }
    }
  };

  const { width, height } = useWindowDimensions();

  return (
    <View className="bg-candlelight-50 h-full w-full">
      <View className="mt-[50px] px-4">
        <ChatHeadBar onMenuPress={() => setIsSidebarOpen(true)} />
      </View>
      <View className="flex-1">
        <Chat
          sendButtonVisibilityMode="always"
          emptyState={() => (
            <Text className="font-medium text-3xl text-envy-500 font-borna">
              Bonjour {userData?.user?.username}, je suis ton coach capillaire
            </Text>
          )}
          messages={messages}
          onSendPress={handleSendPress}
          onAttachmentPress={handleAttachmentPress}
          user={user}
          renderBubble={(props) => renderBubbleAdvanced(props)}
          theme={{
            ...defaultTheme,
            colors: {
              ...defaultTheme.colors,
              primary: "#FFEED3",
              background: "#FEFDE8",
              inputBackground: "#FEFDE8",
            },
            icons: {
              sendButtonIcon: () => (
                <View className="bg-candlelight-500 rounded-full p-2">
                  <Image
                    source={require("@/assets/icons/send.svg")}
                    style={{ width: 20, height: 20 }}
                  />
                </View>
              ),
              attachmentButtonIcon: () => (
                <Image
                  source={require("@/assets/icons/paperclip.svg")}
                  style={{ width: 20, height: 20 }}
                  className="mr-6"
                />
              ),
            },
          }}
          textInputProps={{
            placeholder: " Envoyer un message",
            placeholderTextColor: "#99AFBB",
            style: {
              fontFamily: "WorkSans",
              fontSize: 14,
              color: "#121C12",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#E5E7EB",
              paddingHorizontal: 16,
              paddingTop: 7,
              paddingBottom: 7,
              marginHorizontal: 8,
              marginVertical: 8,
              backgroundColor: "#f3f4f6",
            },
          }}
        />

        {selectedImage && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 8,
              backgroundColor: "#FEFDE8",
              borderRadius: 12,
              padding: 8,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
            className="bg-candlelight-50"
          >
            <View style={{ position: "relative" }}>
              <Image
                source={{ uri: selectedImage.uri }}
                style={{
                  width: width - 32,
                  height: width / 1.5,
                  borderRadius: 8,
                }}
              />
              <TouchableOpacity
                onPress={handleRemoveImage}
                style={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  backgroundColor: "#EF4444",
                  borderRadius: 12,
                  width: 24,
                  height: 24,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
                >
                  ×
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <PremiumSubscriptionModal
        visible={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        onUpgrade={handleUpgradeToPremium}
      />
    </View>
  );
};

export default Chatbot;

const sendMessageToRag = async (
  message: string,
  session_id?: string,
  imageUrl?: string
) => {
  try {
    const payload: StartConversationPayload = {
      message,
      image_url: imageUrl,
    };
    if (session_id) {
      payload.session_id = session_id;
    }
    const response = await startOrContinueConversation(payload);
    return response;
  } catch (error) {
    console.error("Error sending message:", error);
    return null;
  }
};
