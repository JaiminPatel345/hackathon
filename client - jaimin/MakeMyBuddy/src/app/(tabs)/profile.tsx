import React, { useState, useEffect } from 'react';
import {
    View, Text, Image, ScrollView, TouchableOpacity,
    ActivityIndicator, Platform, Pressable, Alert
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { logout } from '@/redux/slices/authSlice';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { uploadImageToCloudinary } from '@/utils/cloudinaryUpload';
import { ThunkDispatch } from 'redux-thunk';

export default function Profile() {
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch<ThunkDispatch<RootState, unknown, any>>();
    const router = useRouter();
    
    // State for editing
    const [isEditing, setIsEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    
    // State for custom interest input
    const [newInterest, setNewInterest] = useState('');
    
    // User data state
    const [userData, setUserData] = useState({
        avatar: user?.avatar || 'https://via.placeholder.com/150',
        name: user?.name || '',
        username: user?.username || '',
        mobile: user?.mobile || '',
        goal: {
            title: user?.goal?.title || '',
            target: user?.goal?.target || '',
            year: user?.goal?.year?.toString() || '2026',
            level: user?.goal?.level || 'BEGINNER'
        },
        interests: user?.interests || []
    });
    
    // Level options
    const levelOptions = ['BEGINNER', 'INTERMEDIATE', 'EXPERT'];
    
    // Ensure availableInterests includes any custom interests the user might have
    const allAvailableInterests = React.useMemo(() => {
        const defaultInterests = ['DSA', 'UI', 'FLUTTER', 'WEB', 'MOBILE', 'DESIGN', 'AI', 'ML'];
        // Add user's interests that aren't in the default list
        if (user?.interests) {
            const customInterests = user.interests.filter(
                interest => !defaultInterests.includes(interest)
            );
            return [...defaultInterests, ...customInterests];
        }
        return defaultInterests;
    }, [user?.interests]);
    
    // Update userData when user data changes
    useEffect(() => {
        if (user) {
            setUserData({
                avatar: user.avatar || 'https://via.placeholder.com/150',
                name: user.name || '',
                username: user.username || '',
                mobile: user.mobile || '',
                goal: {
                    title: user.goal?.title || '',
                    target: user.goal?.target || '',
                    year: user.goal?.year?.toString() || '2026',
                    level: user.goal?.level || 'BEGINNER'
                },
                interests: user.interests || []
            });
        }
    }, [user]);
    
    const handleLogout = () => {
        dispatch(logout());
    };
    
    // Pick an image from gallery
    const pickImage = async () => {
        if (!isEditing) return;
        
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.7,
            });
            
            if (!result.canceled) {
                uploadImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to select image');
        }
    };
    
    // Upload image to Cloudinary
    const uploadImage = async (uri: string) => {
        setUploading(true);
        
        try {
            const cloudinaryUrl = await uploadImageToCloudinary(uri);
            setUserData({...userData, avatar: cloudinaryUrl});
            console.log('Image uploaded successfully:', cloudinaryUrl);
        } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            Alert.alert('Error', 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };
    
    // Toggle interest selection
    const toggleInterest = (interest: string) => {
        if (!isEditing) return;
        
        if (userData.interests.includes(interest)) {
            // Remove the interest
            setUserData({
                ...userData,
                interests: userData.interests.filter(item => item !== interest)
            });
        } else {
            // Add the interest
            setUserData({
                ...userData,
                interests: [...userData.interests, interest]
            });
        }
    };
    
    // Add custom interest
    const addCustomInterest = () => {
        if (!isEditing || !newInterest.trim()) return;
        
        const formattedInterest = newInterest.trim().toUpperCase();
        // Check if it already exists
        if (!userData.interests.includes(formattedInterest)) {
            setUserData({
                ...userData,
                interests: [...userData.interests, formattedInterest]
            });
        }
        
        // Clear input
        setNewInterest('');
    };
    // Remove an interest
    const removeInterest = (interest: string) => {
        if (!isEditing) return;
        
        setUserData({
            ...userData,
            interests: userData.interests.filter(item => item !== interest)
        });
    };
    
    // Save profile changes
    const saveProfile = async () => {
        try {
            // Create update payload
            const profileData = {
                name: userData.name,
                username: userData.username,
                mobile: userData.mobile,
                goal: userData.goal,
                interests: userData.interests,
            };
            
            console.log('Profile data to save:', profileData);
            
            // For now, simulate success
            Alert.alert('Success', 'Profile updated successfully');
            setIsEditing(false);
        } catch (error) {
            console.error('Save failed:', error);
            Alert.alert('Error', 'Failed to update profile');
        }
    };
    
    if (!user) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <Text className="text-xl font-semibold">Please login</Text>
                <Pressable 
                    onPress={() => router.push('/auth/login')}
                    className="mt-4 bg-sky-500 py-2 px-4 rounded-lg"
                >
                    <Text className="text-white font-semibold">Login</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="dark" />
            
            <ScrollView 
                className="flex-1" 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 30}}
            >
                {/* Header with edit toggle */}
                <View className="pt-12 px-6 pb-6 flex-row justify-between items-center">
                    <Text className="text-2xl font-bold text-black">Profile</Text>
                    <Pressable 
                        onPress={() => isEditing ? saveProfile() : setIsEditing(true)}
                        className="p-2"
                    >
                        <Ionicons 
                            name={isEditing ? "checkmark-circle" : "pencil"} 
                            size={24} 
                            color="#0ea5e9" 
                        />
                    </Pressable>
                </View>
                
                {/* Profile section */}
                <View className="px-6 mb-8 items-center">
                    <TouchableOpacity 
                        onPress={pickImage}
                        disabled={!isEditing || uploading}
                        className="relative mb-4"
                    >
                        <View className="h-32 w-32 rounded-full overflow-hidden border-4 border-sky-100">
                            <Image 
                                source={{uri: userData.avatar}} 
                                className="h-full w-full"
                            />
                            {isEditing && (
                                <View className="absolute bottom-0 right-0 bg-sky-500 rounded-full p-2">
                                    {uploading ? (
                                        <ActivityIndicator size="small" color="white" />
                                    ) : (
                                        <Ionicons name="camera" size={16} color="white" />
                                    )}
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                    
                    {isEditing ? (
                        <View className="w-full">
                            <Input
                                value={userData.name}
                                onChangeText={(text) => setUserData({...userData, name: text})}
                                className="text-center text-lg font-bold mb-1"
                                placeholder="Your Name"
                            />
                            <Input
                                value={userData.username}
                                onChangeText={(text) => setUserData({...userData, username: text})}
                                className="text-center text-gray-500"
                                placeholder="Username"
                            />
                        </View>
                    ) : (
                        <>
                            <Text className="text-xl font-bold">{userData.name}</Text>
                            <Text className="text-gray-500">@{userData.username}</Text>
                        </>
                    )}
                </View>
                {/* Buddies count with minimal design */}
                <View className="px-6 mb-12">
                    <View className="flex-row items-center mb-4">
                        <View className="w-1 h-6 bg-sky-500 rounded-full mr-3" />
                        <Text className="text-lg font-bold">My Buddies</Text>
                    </View>
                    
                    <View className="bg-gray-50 rounded-xl p-5 items-center justify-center">
                        <Text className="text-3xl font-bold text-sky-500 mb-1">
                            {user?.buddies?.length || 0}
                        </Text>
                        <Text className="text-gray-500">Total Buddies</Text>
                    </View>
                </View>
                {/* Goals section with minimal design */}
                <View className="px-6 mb-8">
                    <View className="flex-row items-center mb-4">
                        <View className="w-1 h-6 bg-sky-500 rounded-full mr-3" />
                        <Text className="text-lg font-bold">My Goal</Text>
                    </View>
                    
                    <View className="bg-gray-50 rounded-xl p-5">
                        {isEditing ? (
                            <>
                                <Input
                                    value={userData.goal.title}
                                    onChangeText={(text) => setUserData({
                                        ...userData, 
                                        goal: {...userData.goal, title: text}
                                    })}
                                    className="border-b border-gray-200 py-1 mb-3"
                                    placeholder="Goal Title"
                                />
                                
                                <Input
                                    value={userData.goal.target}
                                    onChangeText={(text) => setUserData({
                                        ...userData, 
                                        goal: {...userData.goal, target: text}
                                    })}
                                    className="border-b border-gray-200 py-1 mb-3"
                                    placeholder="Target"
                                />
                                
                                <View className="flex-row items-center mb-3">
                                    <Text className="mr-2 text-gray-500 w-20">Year:</Text>
                                    <Input
                                        value={userData.goal.year}
                                        onChangeText={(text) => setUserData({
                                            ...userData, 
                                            goal: {...userData.goal, year: text}
                                        })}
                                        className="flex-1 border-b border-gray-200 py-1"
                                        placeholder="2026"
                                        keyboardType="numeric"
                                    />
                                </View>
                                
                                <Text className="mb-2 text-gray-500">Level:</Text>
                                <View className="flex-row justify-between">
                                    {levelOptions.map((level) => (
                                        <TouchableOpacity
                                            key={level}
                                            onPress={() => setUserData({
                                                ...userData,
                                                goal: {...userData.goal, level}
                                            })}
                                            className={`
                                                py-2 px-3 rounded-full
                                                ${userData.goal.level === level 
                                                    ? 'bg-sky-500' 
                                                    : 'bg-gray-200'
                                                }
                                            `}
                                        >
                                            <Text className={userData.goal.level === level 
                                                ? 'text-white' 
                                                : 'text-gray-700'
                                            }>
                                                {level}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </>
                        ) : (
                            <>
                                <Text className="text-xl font-semibold mb-2">{userData.goal.title || 'No goal set'}</Text>
                                <Text className="text-gray-600 mb-4">{userData.goal.target || 'Target not set'}</Text>
                                
                                <View className="flex-row justify-between">
                                    <View className="items-center">
                                        <Text className="text-gray-500 text-xs mb-1">YEAR</Text>
                                        <Text className="font-bold">{userData.goal.year || '2026'}</Text>
                                    </View>
                                    
                                    <View className="h-full w-[1px] bg-gray-200" />
                                    
                                    <View className="items-center">
                                        <Text className="text-gray-500 text-xs mb-1">LEVEL</Text>
                                        <View className="bg-sky-100 px-3 py-1 rounded-full">
                                            <Text className="text-sky-800 font-medium">{userData.goal.level}</Text>
                                        </View>
                                    </View>
                                </View>
                            </>
                        )}
                    </View>
                </View>
                
                {/* Interests section */}
                <View className="px-6 mb-8">
                    <View className="flex-row items-center mb-4">
                        <View className="w-1 h-6 bg-sky-500 rounded-full mr-3" />
                        <Text className="text-lg font-bold">Interests</Text>
                    </View>
                    
                    {isEditing ? (
                        <>
                            {/* Add custom interest input */}
                            <View className="flex-row items-center mb-4">
                                <Input
                                    value={newInterest}
                                    onChangeText={setNewInterest}
                                    placeholder="Add interest"
                                    className="flex-1 border-b border-gray-200 py-1"
                                    autoCapitalize="characters"
                                />
                                <TouchableOpacity 
                                    onPress={addCustomInterest}
                                    disabled={!newInterest.trim()}
                                    className={`ml-2 p-2 rounded-full ${!newInterest.trim() ? 'opacity-50' : 'bg-sky-500'}`}
                                >
                                    <Ionicons 
                                        name="add" 
                                        size={22} 
                                        color="white"
                                    />
                                </TouchableOpacity>
                            </View>

                            <Text className="text-gray-500 text-xs mb-2">Available interests:</Text>
                            <View className="flex-row flex-wrap mb-4">
                                {allAvailableInterests.map(interest => (
                                    <TouchableOpacity
                                        key={interest}
                                        onPress={() => toggleInterest(interest)}
                                        className={`
                                            mr-2 mb-2 py-2 px-3 rounded-full
                                            ${userData.interests.includes(interest) 
                                                ? 'bg-sky-500' 
                                                : 'bg-gray-200'
                                            }
                                        `}
                                    >
                                        <Text className={userData.interests.includes(interest) 
                                            ? 'text-white' 
                                            : 'text-gray-700'
                                        }>
                                            {interest}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {userData.interests.length > 0 && (
                                <View>
                                    <Text className="text-gray-500 text-xs mb-2">Your interests:</Text>
                                    <View className="flex-row flex-wrap">
                                        {userData.interests.map(interest => (
                                            <View key={interest} className="bg-sky-500 mr-2 mb-2 rounded-full flex-row items-center px-3 py-1">
                                                <Text className="text-white mr-1">{interest}</Text>
                                                <TouchableOpacity onPress={() => removeInterest(interest)}>
                                                    <Ionicons name="close-circle" size={16} color="white" />
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}
                        </>
                    ) : (
                        userData.interests.length > 0 ? (
                            <View className="flex-row flex-wrap">
                                {userData.interests.map((interest, index) => (
                                    <View 
                                        key={index} 
                                        style={{ backgroundColor: getInterestColor(index) }}
                                        className="rounded-full px-4 py-2 mr-2 mb-2"
                                    >
                                        <Text className="text-white font-medium">{interest}</Text>
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <Text className="text-gray-500 italic">No interests selected</Text>
                        )
                    )}
                </View>
                
                {/* Contact info with minimal design */}
                <View className="px-6 mb-12">
                    <View className="flex-row items-center mb-4">
                        <View className="w-1 h-6 bg-sky-500 rounded-full mr-3" />
                        <Text className="text-lg font-bold">Contact</Text>
                    </View>
                    
                    <View className="flex-row items-center px-2">
                        <Ionicons name="call-outline" size={20} color="#0ea5e9" />
                        {isEditing ? (
                            <Input
                                value={userData.mobile}
                                onChangeText={(text) => setUserData({...userData, mobile: text})}
                                className="flex-1 ml-3 border-b border-gray-200 py-1"
                                placeholder="Phone Number"
                                keyboardType="phone-pad"
                            />
                        ) : (
                            <Text className="ml-3">{userData.mobile || 'No phone number'}</Text>
                        )}
                    </View>
                </View>
                
                
                
                {/* Logout button or Submit button based on edit mode */}
                <View className="px-6">
                    {isEditing ? (
                        <Pressable
                            onPress={saveProfile}
                            className="bg-sky-500 py-3 rounded-lg flex-row justify-center items-center"
                        >
                            <Ionicons name="save" size={20} color="white" className="mr-2" />
                            <Text className="text-white font-semibold ml-2">Save Changes</Text>
                        </Pressable>
                    ) : (
                        <Pressable
                            onPress={handleLogout}
                            className="border border-gray-300 py-3 rounded-lg flex-row justify-center items-center"
                        >
                            <Ionicons name="log-out" size={20} color="#0ea5e9" className="mr-2" />
                            <Text className="text-sky-500 font-semibold ml-2">Logout</Text>
                        </Pressable>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

// Helper function to get a color for each interest
function getInterestColor(index: number): string {
    const colors = ['#0ea5e9', '#14b8a6', '#8b5cf6', '#ec4899', '#f59e0b', '#84cc16'];
    return colors[index % colors.length];
}