import { ChatHeadBar } from "@/components/chat/chatHeadBar";
import { sendMessageToRag } from "@/services/ragService";
import { Chat, defaultTheme, MessageType } from "@flyerhq/react-native-chat-ui";
import React, { ReactNode, useState } from "react";
import { Text, View } from "react-native";

const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const ChatPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | undefined>();
  const [messages, setMessages] = useState<MessageType.Any[]>([]);
  const user = { id: "06c33e8b-e835-4736-80f4-63f44b66666c" };

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
            user.id !== message.author.id ? "#F3F9FF" : "#ffbc6d",
          borderColor: "#FFEED3",
          borderWidth: 1,
          overflow: "hidden",
        }}
        className={`${
          user.id !== message.author.id ? "rounded-tl-none" : "rounded-br-none"
        } rounded-2xl text-international_orange-200`}
      >
        {child}
      </View>
    );
  };

  const handleSendPress = async (message: MessageType.PartialText) => {
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
      const response = await sendMessageToRag({
        message: message.text,
        profile: "Client",
      });

      // Create bot response message
      const responseMessage: MessageType.Text = {
        author: {
          id: "06c33e8b-e835-4736-80f4-63f44b",
          firstName: "UniSafe",
          lastName: "Assistant",
        },
        createdAt: Date.now(),
        id: uuidv4(),
        text: response.response,
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
          firstName: "UniSafe",
          lastName: "Assistant",
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

  return (
    <View className="bg-candlelight-50 h-full w-full">
      <View className="mt-[50px] px-4">
        <ChatHeadBar onMenuPress={() => setIsSidebarOpen(true)} />
      </View>
      <View className="flex-1">
        <Chat
          emptyState={() => (
            <Text className="font-medium text-3xl text-envy-500">
              Bonjour Emilie, je suis ton coach capillaire
            </Text>
          )}
          messages={messages}
          onSendPress={handleSendPress}
          user={user}
          renderBubble={renderBubble}
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
    </View>
  );
};

export default ChatPage;
