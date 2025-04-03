import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchResources } from '../../redux/slices/resourceSlice';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { Resource, ResourceType } from '../../types/resource';
import AddResourceModal from '../../components/resources/AddResourceModal';
import ResourceItem from '../../components/resources/ResourceItem';

export default function ResourcesScreen() {
  const [activeTab, setActiveTab] = useState<ResourceType>('image');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const { resources, loading } = useSelector((state: RootState) => state.resources);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchResources());
  }, []);

  // src/app/(tabs)/resources.tsx (continuing from where it left off)
const filteredResources = resources.filter(resource =>
  resource.type === activeTab &&
  resource.title.toLowerCase().includes(searchQuery.toLowerCase())
);

return (
  <View className="flex-1 bg-white p-4">
    <View className="flex-row items-center bg-gray-100 rounded-lg p-2 mb-4">
      <Ionicons name="search" size={20} color="gray" />
      <TextInput
        className="flex-1 ml-2"
        placeholder="Search resources..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    </View>

    <View className="flex-row justify-between mb-4">
      {(['image', 'pdf', 'link'] as ResourceType[]).map((type) => (
        <TouchableOpacity
          key={type}
          className={`py-2 px-4 rounded-lg ${activeTab === type ? 'bg-blue-500' : 'bg-gray-200'}`}
          onPress={() => setActiveTab(type)}
        >
          <Text className={`${activeTab === type ? 'text-white' : 'text-gray-800'}`}>
            {type.charAt(0).toUpperCase() + type.slice(1)}s
          </Text>
        </TouchableOpacity>
      ))}
    </View>

    {loading ? (
      <ActivityIndicator size="large" color={Colors.primary} />
    ) : (
      <FlatList
        data={filteredResources}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ResourceItem resource={item} />}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-8">No resources found</Text>
        }
      />
    )}

    <TouchableOpacity
      className="absolute bottom-6 right-6 bg-blue-500 w-14 h-14 rounded-full items-center justify-center"
      onPress={() => setShowAddModal(true)}
    >
      <Ionicons name="add" size={30} color="white" />
    </TouchableOpacity>

    <AddResourceModal
      visible={showAddModal}
      resourceType={activeTab}
      onClose={() => setShowAddModal(false)}
    />
  </View>
);
}