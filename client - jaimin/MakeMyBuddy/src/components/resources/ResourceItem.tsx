// src/components/resources/ResourceItem.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Resource } from '../../types/resource';
import { Ionicons } from '@expo/vector-icons';
import * as FileViewer from 'react-native-file-viewer';
import * as Linking from 'expo-linking';

interface ResourceItemProps {
  resource: Resource;
}

export default function ResourceItem({ resource }: ResourceItemProps) {
  const handlePress = async () => {
    try {
      if (resource.type === 'link' && resource.url) {
        await Linking.openURL(resource.url);
      } else if (resource.fileUri) {
        await FileViewer.open(resource.fileUri);
      }
    } catch (error) {
      console.error('Error opening resource:', error);
    }
  };

  return (
    <TouchableOpacity
      className="flex-row items-center p-3 mb-2 bg-gray-50 rounded-lg"
      onPress={handlePress}
    >
      {resource.type === 'image' && resource.fileUri ? (
        <Image
          source={{ uri: resource.fileUri }}
          className="w-12 h-12 rounded mr-3"
        />
      ) : (
        <View className="w-12 h-12 rounded bg-gray-200 items-center justify-center mr-3">
          <Ionicons
            name={
              resource.type === 'pdf' ? 'document-text' :
              resource.type === 'link' ? 'link' : 'image'
            }
            size={24}
            color="gray"
          />
        </View>
      )}

      <View className="flex-1">
        <Text className="font-medium">{resource.title}</Text>
        {resource.type === 'link' && resource.url && (
          <Text className="text-gray-500 text-xs" numberOfLines={1}>{resource.url}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}