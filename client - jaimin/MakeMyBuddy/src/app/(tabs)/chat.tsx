import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchChats, setCurrentChat } from '../../redux/slices/chatSlice';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { Chat } from '../../types/chat';

export default function ChatScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { chats, loading } = useSelector((state: RootState) => state.chat);
  const { currentBuddy } = useSelector((state: RootState) => state.buddy);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchChats());
  }, []);

  const handleChatPress = (chat: Chat) => {
    dispatch(setCurrentChat(chat));
    router.push(`/chat/${chat.id}`);
  };

  const filteredChats = searchQuery
    ? chats.filter(chat =>
        chat.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : chats;

  const renderChatItem = ({ item }: { item: Chat }) => {
    const isUnread = false; // This should be determined by your app logic
    return (
      <TouchableOpacity
        className={`flex-row items-center p-4 border-b border-gray-200 ${isUnread ? 'bg-blue-50' : ''}`}
        onPress={() => handleChatPress(item)}
      >
        <View className="w-12 h-12 bg-blue-200 rounded-full items-center justify-center">
          <Text className="text-xl font-bold text-blue-600">
            {item.name?.charAt(0) || 'C'}
          </Text>
        </View>

        <View className="ml-3 flex-1">
          <View className="flex-row justify-between">
            <Text className={`font-bold ${isUnread ? 'text-blue-600' : 'text-gray-800'}`}>
              {item.name || (item.isGroup ? 'Group Chat' : 'Chat')}
            </Text>
            {item.lastMessage && (
              <Text className="text-xs text-gray-500">
                {new Date(item.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            )}
          </View>

          <Text
            className={`text-sm ${isUnread ? 'text-gray-800 font-medium' : 'text-gray-500'}`}
            numberOfLines={1}
          >
            {item.lastMessage?.content || 'No messages yet'}
          </Text>
        </View>

        {isUnread && (
          <View className="w-3 h-3 bg-blue-600 rounded-full" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <View className="px-4 pt-6 pb-2">
        <View className="flex-row items-center bg-gray-100 px-4 py-2 rounded-lg">
          <Ionicons name="search" size={20} color={Colors.gray} />
          <TextInput
            className="flex-1 ml-2 text-gray-800"
            placeholder="Search chats"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={Colors.gray} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Buddy Chat Shortcut */}
      {currentBuddy && (
        <TouchableOpacity
          className="flex-row items-center p-4 bg-blue-50 border-b border-gray-200"
          onPress={() => {
            // Find or create buddy chat and navigate to it
            const buddyChat = chats.find(chat =>
              !chat.isGroup && chat.participants.includes(currentBuddy.id)
            );
            if (buddyChat) {
              handleChatPress(buddyChat);
            } else {
              // You might want to create a new chat with the buddy here
              router.push('/create-chat');
            }
          }}
        >
          <View className="w-12 h-12 bg-blue-200 rounded-full items-center justify-center">
            <Text className="text-xl font-bold text-blue-600">
              {currentBuddy.name.charAt(0)}
            </Text>
          </View>

          <View className="ml-3 flex-1">
            <Text className="font-bold text-blue-600">
              {currentBuddy.name} (Study Buddy)
            </Text>
            <Text className="text-sm text-gray-600">Chat with your study buddy</Text>
          </View>

          <Ionicons name="chevron-forward" size={24} color={Colors.primary} />
        </TouchableOpacity>
      )}

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : filteredChats.length > 0 ? (
        <FlatList
          data={filteredChats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <View className="flex-1 justify-center items-center p-6">
          <Ionicons name="chatbubbles-outline" size={64} color={Colors.gray} />
          <Text className="text-lg text-gray-600 mt-4 text-center">
            No chats found. Start a conversation with your buddy or join a community.
          </Text>
          <TouchableOpacity
            className="mt-6 bg-blue-600 px-6 py-3 rounded-lg"
            onPress={() => router.push('/create-chat')}
          >
            <Text className="text-white font-medium">Start a New Chat</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-blue-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={() => router.push('/create-chat')}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}