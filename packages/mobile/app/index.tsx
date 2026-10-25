import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GiftedChat, IMessage, SystemMessage, Send, InputToolbar } from "react-native-gifted-chat";
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function Index() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [roomId, setRoomId] = useState("");
  const [status, setStatus] = useState("Initializing P2P Worklet...");

  const [isReady, setIsReady] = useState(false);
  const [backend, setBackend] = useState<any>(null);

  const appendSystemMessage = useCallback((text: string) => {
    setMessages((previousMessages) =>
      GiftedChat.append(
        previousMessages,
        [
          {
            _id: Math.random().toString(),
            text,
            createdAt: new Date(),
            system: true,
            user: { _id: 0 },
          },
        ],
        false
      )
    );
  }, []);

  useEffect(() => {
    async function doAsyncStuff() {
      try {
        const { initBareKit } = require('../packages/core')
        const b = await initBareKit(
          (topic: string) => {
            setRoomId(topic);
            setStatus(`Room: ${topic.substring(0, 12)}...`);
            appendSystemMessage(`Joined chat room: ${topic}`);
          },
          (msg: any) => {
            const senderId = msg.sender || 'Peer';
            setMessages((previousMessages) =>
              GiftedChat.append(
                previousMessages,
                [
                  {
                    _id: Math.random().toString(),
                    text: msg.message,
                    createdAt: msg.timestamp ? new Date(msg.timestamp) : new Date(),
                    user: { _id: senderId, name: senderId },
                  },
                ],
                false
              )
            );
          },
          (statusUpdate: { peersCount?: number; systemMessage?: string }) => {
            if (typeof statusUpdate.peersCount === 'number') {
              setStatus(`Connected peers: ${statusUpdate.peersCount}`);
            }
            if (statusUpdate.systemMessage) {
              appendSystemMessage(statusUpdate.systemMessage);
            }
          }
        )
        setBackend(b)
        setStatus("Ready (No room joined)");
      } catch (e) {
        console.warn('Init error:', e);
        setStatus("Worklet initialization error");
      } finally {
        setIsReady(true);
      }
    }

    doAsyncStuff();
  }, [appendSystemMessage]);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hide();
    }
  }, [isReady]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Welcome to BareChat! Create a new room or join an existing one.",
        createdAt: new Date(),
        system: true,
        user: { _id: 0 },
      },
    ]);
  }, []);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    if (backend && newMessages.length > 0) {
      backend.sendMessage(newMessages[0].text)
    }
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages, false)
    );
  }, [backend]);

  const handleJoin = async () => {
    if (backend) {
      try {
        setStatus("Joining room...");
        const res = await backend.joinRoom(roomId.trim());
        if (!res?.done) {
          setStatus("Failed to join room");
          appendSystemMessage("Failed to join chat room");
        }
      } catch (e) {
        console.error('Join error:', e)
        setStatus("Join error");
      }
    }
  };

  const handleInfo = async () => {
    if (backend?.getInfo) {
      try {
        const info = await backend.getInfo();
        if (info?.error) {
          appendSystemMessage(`Error: ${info.error}`);
          return;
        }
        appendSystemMessage(
          `BareChat v.${info.version}\nCurrent room: ${info.topic || 'None'}\nConnected peers: ${info.peersCount}`
        );
      } catch (e) {
        console.error('Info error:', e);
      }
    }
  };

  const renderSystemMessage = (props: any) => {
    return (
      <SystemMessage
        {...props}
        containerStyle={styles.systemMessageContainer}
        textStyle={styles.systemMessageText}
      />
    );
  };

  const renderSend = (props: any) => {
    return (
      <Send {...props} containerStyle={styles.sendContainer}>
        <View style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </View>
      </Send>
    );
  };

  const renderInputToolbar = (props: any) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={styles.inputToolbar}
        primaryStyle={{ alignItems: 'center' }}
      />
    );
  };

  if (!isReady) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "BareChat Mobile",
          headerTitleStyle: { fontWeight: "bold", fontSize: 24, color: "#333" },
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#fff" },
        }}
      />


      {/* Room ID Section */}
      <View style={styles.roomSection}>
        <TextInput
          style={styles.input}
          placeholder="Enter room ID to join..."
          value={roomId}
          onChangeText={setRoomId}
        />
        <TouchableOpacity style={styles.button} onPress={handleJoin}>
          <Text style={styles.buttonText}>Join</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleInfo}>
          <Text style={styles.buttonText}>Info</Text>
        </TouchableOpacity>
      </View>

      {/* Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>{status}</Text>
      </View>

      {/* Chat Area */}
      <View style={{ flex: 1 }}>
        <GiftedChat
          messages={messages}
          onSend={(msgs) => onSend(msgs)}
          user={{
            _id: 1,
          }}
          renderSystemMessage={renderSystemMessage}
          renderSend={renderSend}
          renderInputToolbar={renderInputToolbar}
          textInputProps={{
            placeholder: "Type your message...",
          }}
          isInverted={false}
          listProps={{
            contentContainerStyle: { flexGrow: 1 }
          }}


        />

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  roomSection: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingHorizontal: 10,
    marginRight: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#3b3936",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 4,
    marginLeft: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  statusBar: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  statusText: {
    color: "#333",
    fontSize: 14,
  },
  systemMessageContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 40,
    minWidth: '60%',
  },
  systemMessageText: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 18,
  },
  inputToolbar: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  sendContainer: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#3b3936",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 4,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

