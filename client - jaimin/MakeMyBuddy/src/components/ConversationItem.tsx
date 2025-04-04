import { View, Text, TouchableOpacity } from 'react-native';
import { IConversation } from '../types/chat';
import { useRouter } from 'expo-router';

interface ConversationItemProps {
  conversation: IConversation;
}

export default function ConversationItem({ conversation }: ConversationItemProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      className="p-4 border-b border-gray-200"
      onPress={() => router.push(`/chat/${conversation._id}`)}
    >
      <Text className="text-lg">
        {conversation.title || conversation.participants.map(p => p.username).join(', ')}
      </Text>
      <Text className="text-gray-500">{conversation.type}</Text>
    </TouchableOpacity>
  );
}