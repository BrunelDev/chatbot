import { ChatHeadBar } from "@/components/chat/chatHeadBar";
import PremiumSubscriptionModal from "@/components/modals/PremiumSubscriptionModal";
import { useImagePicker } from "@/hooks/useImagePicker";
import { useUser } from "@/hooks/useUser";
import {
  createConversationSession,
  getConversationHistory,
  getFullConversation,
  QuotaExceededError,
  Recommandation,
  StartConversationPayload,
  startOrContinueConversation,
} from "@/services/chatBotService";
import RevenueCatService from "@/services/revenueCatService";
import { uploadToSupabase } from "@/services/storage/uploadToSupabase";
import { Chat, defaultTheme, MessageType } from "@flyerhq/react-native-chat-ui";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { useFocusEffect } from "expo-router";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Linking,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Markdown from "react-native-markdown-display";

// Extension des types de messages pour inclure les messages avec image et texte
type ExtendedMessageType =
  | MessageType.Any
  | {
      id: string;
      type: "image_with_text" | "text";
      author: { id: string; imageUrl?: any };
      text: string;
      imageFile: string | null;
      createdAt: number;
      recommendations?: Recommandation[];
    }
  | (MessageType.Text & {
      recommendations?: Recommandation[];
      ai_analysis?: {
        recommendations?: Recommandation[];
      };
    });

const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// ID constant pour le message de typing
const TYPING_MESSAGE_ID = "typing-indicator-message";

const Chatbot = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | undefined>();
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  // ✅ Component d'animation interne pour les points
  const TypingDots = () => {
    const dot1 = useRef(new Animated.Value(0.3)).current;
    const dot2 = useRef(new Animated.Value(0.3)).current;
    const dot3 = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
      const createAnimation = (dot: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(dot, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(dot, {
              toValue: 0.3,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.delay(200),
          ]),
        );
      };

      const animation1 = createAnimation(dot1, 0);
      const animation2 = createAnimation(dot2, 150);
      const animation3 = createAnimation(dot3, 300);

      animation1.start();
      animation2.start();
      animation3.start();

      return () => {
        animation1.stop();
        animation2.stop();
        animation3.stop();
      };
    }, []);

    return (
      <View className="flex-row items-center space-x-1">
        <Animated.View
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: "#587950",
            opacity: dot1,
            marginRight: 2,
          }}
        />
        <Animated.View
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: "#587950",
            opacity: dot2,
            marginRight: 2,
          }}
        />
        <Animated.View
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: "#587950",
            opacity: dot3,
          }}
        />
      </View>
    );
  };

  // Fonction pour convertir ExtendedMessageType en MessageType.Any pour le composant Chat
  const convertToChatMessages = (
    messages: ExtendedMessageType[],
  ): MessageType.Any[] => {
    return messages.map((message) => {
      if (message.type === "image_with_text") {
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
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
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

  const assistantUser = {
    id: "assistant",
    firstName: "Hair bot",
    lastName: "Assistant",
    imageUrl: require("@/assets/images/chatbot.png"),
  };

  // ✅ Vérifier le statut premium au chargement
  useEffect(() => {
    checkPremiumStatus();
  }, []);

  const checkPremiumStatus = async () => {
    try {
      const isPremiumUser = await RevenueCatService.isPremiumUser();
      setIsPremium(isPremiumUser);
      console.log("Premium status:", isPremiumUser);
      if (isPremiumUser) {
        setShowSubscriptionModal(false);
      }
    } catch (error) {
      console.error("Error checking premium status:", error);
    }
  };

  // ✅ Fonction utilitaire pour convertir Markdown en texte brut
  const stripMarkdown = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1") // Bold
      .replace(/\*(.*?)\*/g, "$1") // Italic
      .replace(/__(.*?)__/g, "$1") // Bold
      .replace(/_(.*?)_/g, "$1") // Italic
      .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Links
      .replace(/`(.*?)`/g, "$1") // Inline code
      .replace(/#{1,6}\s/g, "") // Headers
      .replace(/>\s/g, "") // Blockquotes
      .replace(/[-*+]\s/g, "") // Lists
      .replace(/\d+\.\s/g, ""); // Numbered lists
  };

  // ✅ Fonction pour ouvrir le lien d'une recommandation
  const handleRecommendationPress = async (url: string) => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Erreur", "Impossible d'ouvrir ce lien");
      }
    } catch (error) {
      console.error("Error opening URL:", error);
      const errorMessage =
        error instanceof Error ?
          error.message
        : "Une erreur est survenue lors de l'ouverture du lien";
      Alert.alert("Erreur", errorMessage);
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

    // ✅ Afficher l'indicateur de typing avec animation pour le message spécial
    if (message.id === TYPING_MESSAGE_ID) {
      return <TypingDots />;
    }

    return (
      <>
        {isImageWithTextMessage ?
          <>
            <View
              style={{
                backgroundColor: isUserMessage ? "#FFFDC2" : "transparent",
                borderColor: "transparent",
                borderWidth: 0,
                overflow: "hidden",
                maxWidth:
                  isImageMessage || isImageWithTextMessage ? 250 : undefined,
              }}
              className={`${
                isUserMessage ? "rounded-2xl" : "rounded-none"
              } text-international_orange-200 w-fit`}
            >
              <View className="px-2 py-3">
                {/* ✅ Option 1: Markdown avec sélection (limité) */}
                <Text selectable={true}>
                  <Markdown>{message.text || ""}</Markdown>
                </Text>

                {/* ✅ Option 2: Texte brut entièrement sélectionnable (recommandé)
                <Text selectable={true} style={{ fontSize: 14, lineHeight: 20 }}>
                  {stripMarkdown(message.text || "")}
                </Text>
                */}
              </View>
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
          </>
        : isImageMessage ?
          <View
            style={{
              backgroundColor: isUserMessage ? "#FFFDC2" : "transparent",
              borderColor: "transparent",
              borderWidth: 0,
              overflow: "hidden",
              maxWidth:
                isImageMessage || isImageWithTextMessage ? 250 : undefined,
            }}
            className={`${
              isUserMessage ? "rounded-2xl" : "rounded-none"
            } text-international_orange-200`}
          >
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
          </View>
        : isTextMessage ?
          <>
            <View
              style={{
                backgroundColor: isUserMessage ? "#FFFDC2" : "transparent",
                borderColor: "transparent",
                borderWidth: 0,
                overflow: "hidden",
                maxWidth:
                  isImageMessage || isImageWithTextMessage ? 250 : undefined,
              }}
              className={`${
                isUserMessage ? "rounded-2xl" : "rounded-none"
              } text-international_orange-200`}
            >
              <View className="px-2 py-3 relative">
                <Markdown>{message.text || ""}</Markdown>

                <Text
                  className="text-transparent absolute top-0 left-0 h-full w-full"
                  selectable={true}
                >
                  {stripMarkdown(message.text || "")}
                </Text>
              </View>
            </View>
            {/* Afficher les boutons de recommandations pour les messages du bot */}
            {!isUserMessage &&
              (() => {
                // Récupérer les recommandations depuis recommendations ou ai_analysis.recommendations
                let recommendations: Recommandation[] | undefined;

                if (
                  "recommendations" in message &&
                  message.recommendations &&
                  message.recommendations.length > 0
                ) {
                  recommendations = message.recommendations;
                } else if (
                  "ai_analysis" in message &&
                  message.ai_analysis?.recommendations &&
                  message.ai_analysis.recommendations.length > 0
                ) {
                  recommendations = message.ai_analysis.recommendations;
                }

                return recommendations && recommendations.length > 0 ?
                    <View className="mt-2 gap-2">
                      {recommendations.map((recommendation) => (
                        <TouchableOpacity
                          key={recommendation.id}
                          onPress={() =>
                            handleRecommendationPress(recommendation.url)
                          }
                          activeOpacity={0.7}
                          className="bg-white rounded-lg p-3 border border-envy-200"
                          style={{
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.1,
                            shadowRadius: 2,
                            elevation: 2,
                          }}
                        >
                          <View className="flex-row items-center gap-3">
                            {recommendation.image_url && (
                              <Image
                                source={{ uri: recommendation.image_url }}
                                style={{
                                  width: 50,
                                  height: 50,
                                  borderRadius: 8,
                                }}
                                contentFit="cover"
                              />
                            )}
                            <View className="flex-1">
                              <Text
                                className="font-semibold text-sm text-envy-800"
                                numberOfLines={1}
                              >
                                {recommendation.name}
                              </Text>
                              <Text
                                className="text-xs text-envy-600 mt-1"
                                numberOfLines={1}
                              >
                                {recommendation.brand}
                              </Text>
                              <View className="flex-row items-center gap-2 mt-1">
                                <Text className="text-xs font-semibold text-envy-700">
                                  {recommendation.price}€
                                </Text>
                                {recommendation.rating > 0 && (
                                  <Text className="text-xs text-envy-600">
                                    ⭐ {recommendation.rating}
                                  </Text>
                                )}
                              </View>
                              {recommendation.reason && (
                                <Text
                                  className="text-xs text-envy-600 mt-1"
                                  numberOfLines={2}
                                >
                                  {recommendation.reason}
                                </Text>
                              )}
                            </View>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  : null;
              })()}
          </>
        : <View
            style={{
              backgroundColor: isUserMessage ? "#FFFDC2" : "transparent",
              borderColor: "transparent",
              borderWidth: 0,
              overflow: "hidden",
              maxWidth:
                isImageMessage || isImageWithTextMessage ? 250 : undefined,
            }}
            className={`${
              isUserMessage ? "rounded-2xl" : "rounded-none"
            } text-international_orange-200`}
          >
            <View className="px-2 py-3">{child}</View>
          </View>
        }
      </>
    );
  };

  useFocusEffect(
    useCallback(() => {
      const loadChatId = async () => {
        setIsLoadingMessages(true);
        console.log("start");
        const isPremiumUser = await RevenueCatService.isPremiumUser();
        setIsPremium(isPremiumUser);

        const fetchAndSetMessages = async (id: string) => {
          const conversation = await getFullConversation(id);
          // console.log("messages :", JSON.stringify(conversation, null, 2));
          setMessages(
            conversation.messages.reverse().map((message) => ({
              id: message.id.toString(),
              type: message.image_file ? "image_with_text" : "text",
              author: message.message_type === "user" ? user : assistantUser,
              text: message.content,
              imageFile: message.image_file,
              createdAt: Date.now(),
              recommendations: message.ai_analysis?.recommendations,
              ai_analysis:
                message.ai_analysis ?
                  {
                    recommendations: message.ai_analysis.recommendations,
                  }
                : undefined,
            })),
          );
        };

        try {
          let chatId = await AsyncStorage.getItem("chatId");

          if (chatId) {
            console.log("Current Session ID:", chatId);
            setCurrentChatId(chatId);
            try {
              await fetchAndSetMessages(chatId);
            } catch (conversationError: any) {
              if (
                conversationError?.status === 404 ||
                conversationError?.message?.includes("Session non trouvée") ||
                conversationError?.response?.status === 404
              ) {
                console.log(
                  "Session not found, checking API for latest session...",
                );
                // Session not found in storage, check API for latest session
                try {
                  const history = await getConversationHistory();
                  if (history.results && history.results.length > 0) {
                    // Sort by updated_at to get the most recent session
                    const sortedSessions = [...history.results].sort(
                      (a, b) =>
                        new Date(b.updated_at).getTime() -
                        new Date(a.updated_at).getTime(),
                    );
                    const latestSession = sortedSessions[0];
                    chatId = latestSession.session_id;
                    setCurrentChatId(chatId);
                    await AsyncStorage.setItem("chatId", chatId);
                    await fetchAndSetMessages(chatId);
                  } else {
                    // No sessions in API, create new one
                    console.log(
                      "No sessions found in API, creating a new one...",
                    );
                    const newSession = await createConversationSession({
                      title: "Chat",
                    });
                    chatId = newSession.session_id;
                    setCurrentChatId(chatId);
                    await AsyncStorage.setItem("chatId", chatId);
                    setMessages([]);
                  }
                } catch (historyError) {
                  console.error(
                    "Error fetching conversation history:",
                    historyError,
                  );
                  // If history fetch fails, create new session
                  const newSession = await createConversationSession({
                    title: "Chat",
                  });
                  chatId = newSession.session_id;
                  setCurrentChatId(chatId);
                  await AsyncStorage.setItem("chatId", chatId);
                  setMessages([]);
                }
              } else {
                throw conversationError;
              }
            }
          } else {
            // No chatId in storage, check API for latest session
            console.log(
              "No chatId in storage, checking API for latest session...",
            );
            try {
              const history = await getConversationHistory();
              if (history.results && history.results.length > 0) {
                // Sort by updated_at to get the most recent session
                const sortedSessions = [...history.results].sort(
                  (a, b) =>
                    new Date(b.updated_at).getTime() -
                    new Date(a.updated_at).getTime(),
                );
                const latestSession = sortedSessions[0];
                chatId = latestSession.session_id;
                setCurrentChatId(chatId);
                await AsyncStorage.setItem("chatId", chatId);
                await fetchAndSetMessages(chatId);
              } else {
                // No sessions in API, create new one
                console.log("No sessions found in API, creating a new one...");
                const newChatId = await createConversationSession({
                  title: "Chat",
                });
                setCurrentChatId(newChatId.session_id);
                await AsyncStorage.setItem("chatId", newChatId.session_id);
              }
            } catch (historyError) {
              console.error(
                "Error fetching conversation history:",
                historyError,
              );
              // If history fetch fails, create new session
              const newChatId = await createConversationSession({
                title: "Chat",
              });
              setCurrentChatId(newChatId.session_id);
              await AsyncStorage.setItem("chatId", newChatId.session_id);
            }
          }
        } catch (error) {
          console.error("Error loading chatId:", error);
        } finally {
          setIsLoadingMessages(false);
        }
      };
      loadChatId();
    }, []),
  );

  const handleSendPress = async (message: MessageType.PartialText) => {
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

      const typingMessage: MessageType.Text = {
        author: assistantUser,
        createdAt: Date.now(),
        id: TYPING_MESSAGE_ID,
        text: "",
        type: "text",
      };

      setMessages((currentMessages) => [typingMessage, ...currentMessages]);
      setIsTyping(true);

      const response = await sendMessageToRag(
        message.text,
        currentChatId,
        uploadedImageUrl,
      );

      setMessages((currentMessages) =>
        currentMessages.filter((msg) => msg.id !== TYPING_MESSAGE_ID),
      );
      setIsTyping(false);

      setSelectedImage(null);

      const responseMessage: ExtendedMessageType = {
        author: assistantUser,
        createdAt: Date.now(),
        id: uuidv4(),
        text: response?.ai_response.content!,
        type: "text",
        recommendations: response?.ai_analysis?.recommendations,
        ai_analysis:
          response?.ai_analysis ?
            {
              recommendations: response.ai_analysis.recommendations,
            }
          : undefined,
      };

      setMessages((currentMessages) => [responseMessage, ...currentMessages]);
    } catch (error: any) {
      console.error("Error sending message:", error);

      setMessages((currentMessages) =>
        currentMessages.filter((msg) => msg.id !== TYPING_MESSAGE_ID),
      );
      setIsTyping(false);

      // const { QuotaExceededError } = require("@/services/chatBotService");
      if (error instanceof QuotaExceededError) {
        const quotaData = error.quotaData;

        const quotaErrorMessage: MessageType.Text = {
          author: assistantUser,
          createdAt: Date.now(),
          id: uuidv4(),
          text: `⚠️ ${quotaData.message}\n\n📊 Quota: ${quotaData.remaining_requests}/${quotaData.daily_quota} requêtes restantes\n🤖 Modèle: ${quotaData.ai_model}`,
          type: "text",
        };
        setMessages((currentMessages) => [
          quotaErrorMessage,
          ...currentMessages,
        ]);

        if (quotaData.upgrade_required) {
          setShowSubscriptionModal(true);
        }
      } else {
        const errorMessageText =
          error instanceof Error ?
            error.message
          : "Désolé, une erreur s'est produite. Veuillez réessayer.";

        const errorMessage: MessageType.Text = {
          author: assistantUser,
          createdAt: Date.now(),
          id: uuidv4(),
          text: errorMessageText,
          type: "text",
        };
        setMessages((currentMessages) => [errorMessage, ...currentMessages]);
      }
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

  const [isPurchasing, setIsPurchasing] = useState(false);

  const handleUpgradeToPremium = async () => {
    if (isPurchasing) return;
    setIsPurchasing(true);

    try {
      console.log("🔍 Fetching offerings...");
      const currentOffering = await RevenueCatService.getOfferings();

      if (!currentOffering?.availablePackages?.length) {
        Alert.alert(
          "Erreur",
          "Aucune offre disponible pour le moment. Réessayez plus tard.",
        );
        return;
      }

      // Chercher le package mensuel spécifique ou prendre le premier
      const packageToPurchase =
        currentOffering.availablePackages.find(
          (pkg) => pkg.identifier === "$rc_monthly",
        ) || currentOffering.availablePackages[0];

      console.log("💳 Attempting purchase:", packageToPurchase.identifier);
      const purchaseResult =
        await RevenueCatService.purchasePackage(packageToPurchase);

      if (!purchaseResult.success) {
        // Le service gère déjà les messages d'erreur
        return;
      }

      console.log("✅ Purchase successful, verifying premium status...");

      // Attendre la synchronisation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const nowPremium = await RevenueCatService.isPremiumUser();

      setIsPremium(true); // on active tout de suite
      setShowSubscriptionModal(false);

      if (nowPremium) {
        Alert.alert("Succès", "Vous êtes maintenant premium ! 🎉");
      } else {
        // Retry silencieux en arrière-plan
        setTimeout(async () => {
          const retryCheck = await RevenueCatService.isPremiumUser();
          if (!retryCheck) {
            console.warn("⚠️ Premium status not confirmed after retry");
          }
        }, 3000);

        Alert.alert(
          "Presque terminé",
          "Votre abonnement est activé ! Si certaines fonctionnalités ne sont pas accessibles, redémarrez l'app.",
        );
      }
    } catch (e: any) {
      console.error("❌ Purchase error:", e);

      // Messages d'erreur plus spécifiques
      const errorMessage =
        e?.code === "PURCHASE_CANCELLED" ?
          "Achat annulé"
        : e?.message || "Une erreur est survenue lors de l'achat.";

      Alert.alert("Erreur", errorMessage);
    } finally {
      setIsPurchasing(false);
    }
  };

  const { width, height } = useWindowDimensions();

  return (
    <View className="bg-candlelight-50 h-full w-full">
      <View className="mt-[50px] px-4">
        <ChatHeadBar
          onMenuPress={() => setIsSidebarOpen(true)}
          isPremium={isPremium}
        />
      </View>
      <View className="flex-1">
        {isLoadingMessages ?
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#587950" />
          </View>
        : <>
            <Chat
              sendButtonVisibilityMode="always"
              emptyState={() => (
                <Text className="font-medium text-3xl text-envy-500 font-borna">
                  Bonjour {userData?.user?.username}, je suis ton coach
                  capillaire. Comment puis-je t'aider aujourd'hui ?
                </Text>
              )}
              messages={convertToChatMessages(messages)}
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
                  paddingBottom: 10,
                  paddingTop: 5,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                  paddingHorizontal: 16,
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
                      style={{
                        color: "white",
                        fontSize: 16,
                        fontWeight: "bold",
                      }}
                    >
                      ×
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        }
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
  imageUrl?: string,
) => {
  try {
    const payload: StartConversationPayload = {
      message,
      image_url: imageUrl,
    };
    if (session_id) {
      payload.session_id = session_id;
    }
    console.log("payload message : ", payload);
    const response = await startOrContinueConversation(payload);
    return response;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
