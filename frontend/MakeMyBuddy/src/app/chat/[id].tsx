import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View className="flex-1 p-4">
      <Text className="text-2xl mb-4">Chat {id}</Text>
      <Text>Messages (To be implemented)</Text>
    </View>
  );
}
