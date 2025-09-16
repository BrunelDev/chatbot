import { ChatHeadBar } from "@/components/chat/chatHeadBar";
import PremiumSubscriptionModal from "@/components/modals/PremiumSubscriptionModal";
import { useUser } from "@/hooks/useUser";
import {
  createConversationSession,
  getFullConversation,
  StartConversationPayload,
  startOrContinueConversation,
} from "@/services/chatBotService";
import InterstitialAdService from "@/services/interstitialAdService";
import { Chat, defaultTheme, MessageType } from "@flyerhq/react-native-chat-ui";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import React, { ReactNode, useCallback, useState } from "react";
import { Text, View } from "react-native";

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
  const [messages, setMessages] = useState<MessageType.Any[]>([]);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const { user: userData } = useUser();
  /**
   * createdAt?: number;
       firstName?: string;
       id: string;
       imageUrl?: ImageURISource['uri'];
       lastName?: string;
       lastSeen?: number;
       metadata?: Record<string, any>;
       role?: 'admin' | 'agent' | 'moderator' | 'user';
       updatedAt?: number;
   */
  const user = {
    id: "06c33e8b-e835-4736-80f4-63f44b66666c",
    imageUrl: require("@/assets/images/userProfile-img.png"),
  };

  const renderBubble = ({
    child,
    message,
    nextMessageInGroup,
  }: {
    child: ReactNode;
    message: MessageType.Any;
    nextMessageInGroup: boolean;
  }) => {
    return (
      <View
        style={{
          backgroundColor:
            user.id !== message.author.id ? "transparent" : "#FFFDC2",
          borderColor: "transparent",
          borderWidth: 0,
          overflow: "hidden",
        }}
        className={`${
          user.id !== message.author.id ? "rounded-none" : "rounded-2xl"
        }  text-international_orange-200 px-2 py-3`}
      >
        <Text className="text-[#4D5962] text-[12px]">
          {message.type === "text" ? message.text : child}
        </Text>
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
            console.log(conversation);
            /**
         *  author: User;
                 createdAt?: number;
                 id: string;
                 metadata?: Record<string, any>;
                 roomId?: string;
                 status?: 'delivered' | 'error' | 'seen' | 'sending' | 'sent';
                 type: 'custom' | 'file' | 'image' | 'text' | 'unsupported';
                 updatedAt?: number;
         */
            setMessages(
              conversation.messages.reverse().map((message) => ({
                id: message.id.toString(),
                type: "text",
                author:
                  message.message_type === "user" ? user : { id: "assistant" },
                text: message.content,
              }))
            );
          }
        } catch (error) {
          console.error("Error loading chatId:", error);
        }
      };
      loadChatId();

      // Load interstitial ad when chatbot screen is focused
      InterstitialAdService.loadAd();
    }, [])
  );

  const handleSendPress = async (message: MessageType.PartialText) => {
    // Check if user is premium, if not show subscription modal
    if (
      !userData?.user?.is_premium &&
      !userData?.user?.can_use_premium_features
    ) {
      setShowSubscriptionModal(true);
      return;
    }

    // Show interstitial ad occasionally (every 3rd message)
    const messageCount = messages.length;
    if (
      messageCount > 0 &&
      messageCount % 3 === 0 &&
      InterstitialAdService.isAdLoaded()
    ) {
      await InterstitialAdService.showAd();
    }

    try {
      // Add user message
      const textMessage: MessageType.Text = {
        author: user,
        createdAt: Date.now(),
        id: uuidv4(),
        text: message.text,
        type: "text",
      };

      // Update messages with user's message
      setMessages((currentMessages) => [textMessage, ...currentMessages]);

      // Get bot response
      const response = await sendMessageToRag(message.text, currentChatId);

      // Create bot response message
      const responseMessage: MessageType.Text = {
        author: {
          id: "06c33e8b-e835-4736-80f4-63f44b",
          firstName: "Hair bot",
          lastName: "Assistant",
          imageUrl: require("@/assets/images/chatbot.png"),
        },
        createdAt: Date.now(),
        id: uuidv4(),
        text: response?.ai_response.content!,
        type: "text",
      };

      // Update messages with bot's response
      setMessages((currentMessages) => [responseMessage, ...currentMessages]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Add error message to chat
      const errorMessage: MessageType.Text = {
        author: {
          id: "06c33e8b-e835-4736-80f4-63f44b",
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

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    setIsSidebarOpen(false);
    // Here you would typically load the messages for the selected chat
  };

  const handleUpgradeToPremium = () => {
    // TODO: Implement premium upgrade logic
    console.log("Upgrade to premium clicked");
    setShowSubscriptionModal(false);
    // You can navigate to a subscription page or handle payment here
  };

  return (
    <View className="bg-candlelight-50 h-full w-full">
      <View className="mt-[50px] px-4">
        <ChatHeadBar onMenuPress={() => setIsSidebarOpen(true)} />
      </View>
      <View className="flex-1">
        <Chat
          sendButtonVisibilityMode="always"
          emptyState={() => (
            <Text className="font-medium text-3xl text-envy-500">
              Bonjour Emilie, je suis ton coach capillaire
            </Text>
          )}
          messages={messages}
          onSendPress={handleSendPress}
          showUserAvatars={true}
          user={user}
          renderBubble={(props) => renderBubble(props)}
          theme={{
            ...defaultTheme,
            colors: {
              ...defaultTheme.colors,
              primary: "#FFEED3",
              background: "#FEFDE8",
              inputBackground: "#FEFDE8",
            },
          }}
          textInputProps={{
            placeholder: "Envoyer un message",
            placeholderTextColor: "#999",
            style: {
              fontFamily: "Urbanist",
              fontSize: 16,
              color: "black",
            },
          }}
        />
      </View>

      {/* Premium Subscription Modal */}
      <PremiumSubscriptionModal
        visible={true}
        onClose={() => setShowSubscriptionModal(false)}
        onUpgrade={handleUpgradeToPremium}
      />
    </View>
  );
};

export default Chatbot;
/**
 * 
 * @param message 
 * @returns 
 *  message?: string;
  session_id?: string;
  image_url?: string;
 */

const sendMessageToRag = async (message: string, session_id?: string) => {
  try {
    const payload: StartConversationPayload = {
      message,
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
