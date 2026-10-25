import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  RoomJoin: undefined;
  Chat: { roomName: string; topic: string };
};

type RoomJoinScreenNavigationProp = StackNavigationProp<RootStackParamList, 'RoomJoin'>;

interface Props {
  navigation: RoomJoinScreenNavigationProp;
}

const RoomJoinScreen: React.FC<Props> = ({ navigation }) => {
  const [roomName, setRoomName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinRoom = async () => {
    if (!roomName.trim()) {
      Alert.alert('Error', 'Please enter a room name or topic hash');
      return;
    }

    setIsLoading(true);
    
    try {
      // Navigate to chat screen with room info
      navigation.navigate('Chat', {
        roomName: roomName.trim(),
        topic: roomName.trim(),
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to join room. Please try again.');
      console.error('Join room error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRandom = () => {
    const randomTopic = Math.random().toString(36).substring(2, 15);
    navigation.navigate('Chat', {
      roomName: `Random Room ${randomTopic.substring(0, 6)}`,
      topic: randomTopic,
    });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>BareChat Mobile</Text>
          <Text style={styles.subtitle}>Anonymous P2P Chat</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Room Name or Topic Hash</Text>
          <TextInput
            style={styles.input}
            value={roomName}
            onChangeText={setRoomName}
            placeholder="Enter room name or 64-char hex topic"
            placeholderTextColor="#666"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity
            style={[styles.button, styles.primaryButton, isLoading && styles.buttonDisabled]}
            onPress={handleJoinRoom}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Joining...' : 'Join Room'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleJoinRandom}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Create Random Room</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.info}>
          <Text style={styles.infoText}>
            Join an existing room by name or create a new anonymous chat room.
            No registration required - completely private and decentralized.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#fafafa',
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#34C759',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  info: {
    padding: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default RoomJoinScreen;