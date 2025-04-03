// src/components/resources/AddResourceModal.tsx
import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { ResourceType } from '../../types/resource';
import { addResource } from '../../redux/slices/resourceSlice';
import { AppDispatch } from '../../redux/store';
import * as DocumentPicker from 'expo-document-picker';

interface AddResourceModalProps {
  visible: boolean;
  resourceType: ResourceType;
  onClose: () => void;
}

export default function AddResourceModal({ visible, resourceType, onClose }: AddResourceModalProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<DocumentPicker.DocumentResult | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: resourceType === 'pdf' ? 'application/pdf' : 'image/*',
        copyToCacheDirectory: true
      });

      if (result.type === 'success') {
        setFile(result);
        setTitle(result.name || '');
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const handleAddResource = () => {
    if (resourceType === 'link') {
      if (!title || !url) return;
      dispatch(addResource({
        title,
        type: resourceType,
        url,
      }));
    } else {
      if (!file || file.type !== 'success') return;
      dispatch(addResource({
        title,
        type: resourceType,
        fileUri: file.uri,
      }));
    }

    // Reset and close
    setTitle('');
    setUrl('');
    setFile(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
    >
      <View className="flex-1 justify-end bg-black bg-opacity-50">
        <View className="bg-white p-4 rounded-t-xl">
          <Text className="text-xl font-bold mb-4">
            Add {resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}
          </Text>

          <TextInput
            className="bg-gray-100 p-3 rounded-lg mb-3"
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />

          {resourceType === 'link' ? (
            <TextInput
              className="bg-gray-100 p-3 rounded-lg mb-3"
              placeholder="URL"
              value={url}
              onChangeText={setUrl}
              autoCapitalize="none"
            />
          ) : (
            <TouchableOpacity
              className="bg-gray-100 p-3 rounded-lg mb-3 items-center"
              onPress={handlePickDocument}
            >
              <Text>{file?.type === 'success' ? file.name : `Select ${resourceType}`}</Text>
            </TouchableOpacity>
          )}

          <View className="flex-row justify-end">
            <TouchableOpacity
              className="bg-gray-200 p-3 rounded-lg mr-2"
              onPress={onClose}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-blue-500 p-3 rounded-lg"
              onPress={handleAddResource}
            >
              <Text className="text-white">Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}