import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  BackHandler,
} from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { StackNavigationProp } from '@react-navigation/stack';
import { MobileP2PService } from '../services/P2PService';
import { Message } from '../types';

type RootStackParamList = {
  RoomJoin: undefined;
  Chat: { roomName: string; topic: string };
};

type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Chat'>;

interface Props {
  navigation: ChatScreenNavigationProp;
  route: {
    params: {
      roomName: string;
      topic: string;
    };
  };
}

const ChatScreen: React.FC<Props> = ({ navigation, route }) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [peerCount, setPeerCount] = useState(0);
  const [p2pService] = useState(() => new MobileP2PService());

  const { roomName, topic } = route.params;

  useEffect(() => {
    navigation.setOptions({
      title: roomName,
      headerRight: () => (
        <View style={styles.headerInfo}>
          <Text style={styles.peerCount}>{peerCount} peers</Text>
          <View style={[styles.statusDot, isConnected ? styles.connected : styles.disconnected]} />
        </View>
      ),
    });
  }, [navigation, peerCount, isConnected]);

  useEffect(() => {
    let mounted = true;

    const initializeChat = async () => {
      try {
        await p2pService.connect(topic);
        
        if (mounted) {
          setIsConnected(true);
          setPeerCount(p2pService.getPeers().length);
        }

        // Set up event listeners
        p2pService.onMessage((message: Message) => {
          if (mounted) {
            const giftedMessage: IMessage = {
              _id: message._id,
              text: message.text,
              createdAt: message.createdAt,
              user: {
                _id: message.user._id,
                name: message.user.name,
                avatar: message.user.avatar,
              },
            };
            setMessages(prevMessages => GiftedChat.append(prevMessages, [giftedMessage]));
          }
        });

        p2pService.onPeerConnect(() => {
          if (mounted) {
            setPeerCount(p2pService.getPeers().length);
          }
        });

        p2pService.onPeerDisconnect(() => {
          if (mounted) {
            setPeerCount(p2pService.getPeers().length);
          }
        });

      } catch (error) {
        if (mounted) {
          Alert.alert('Connection Error', 'Failed to connect to the chat room. Please try again.');
          console.error('Chat initialization error:', error);
          navigation.goBack();
        }
      }
    };

    initializeChat();

    return () => {
      mounted = false;
      p2pService.disconnect();
    };
  }, [p2pService, topic, navigation]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      p2pService.disconnect();
      navigation.goBack();
      return true;
    });

    return () => backHandler.remove();
  }, [p2pService, navigation]);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    const message = newMessages[0];
    if (message && message.text) {
      try {
        p2pService.sendMessage(message.text);
        setMessages(prevMessages => GiftedChat.append(prevMessages, newMessages));
      } catch (error) {
        Alert.alert('Send Error', 'Failed to send message. Please try again.');
        console.error('Send message error:', error);
      }
    }
  }, [p2pService]);

  const renderConnectionStatus = () => {
    if (!isConnected) {
      return (
        <View style={styles.connectionStatus}>
          <Text style={styles.connectionText}>Connecting to chat room...</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {renderConnectionStatus()}
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: p2pService.getUserPeerId(),
          name: p2pService.getUserPeerId(),
        }}
        placeholder="Type a message..."
        showUserAvatar={false}
        renderUsernameOnMessage={true}
        isLoading={!isConnected}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  peerCount: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  connected: {
    backgroundColor: '#34C759',
  },
  disconnected: {
    backgroundColor: '#FF3B30',
  },
  connectionStatus: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FF3B30',
    padding: 10,
    alignItems: 'center',
    zIndex: 1,
  },
  connectionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ChatScreen;