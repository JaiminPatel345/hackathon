    import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, Pressable } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

interface AchievementCardProps {
  title: string;
  description: string;
  icon: string; // FontAwesome5 icon name
  progress?: number; // 0-100
  unlocked?: boolean;
  color?: string;
  onPress?: () => void;
}

export default function AchievementCard({
  title,
  description,
  icon,
  progress = 0,
  unlocked = false,
  color = '#3b82f6',
  onPress,
}: AchievementCardProps) {
  // Animation values
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 1000,
        useNativeDriver: false,
        easing: Easing.out(Easing.ease),
      }),
    ]).start();
  }, []);

  // Update progress animation when progress changes
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 800,
      useNativeDriver: false,
      easing: Easing.out(Easing.ease),
    }).start();
  }, [progress]);

  const handlePress = () => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      // Button press animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5)),
        }),
      ]).start();
      
      onPress();
    }
  };

  // Determine gradient colors based on state
  const getGradientColors = () => {
    if (unlocked) {
      // Brighter gradient for unlocked achievements
      return [
        color,
        adjustBrightness(color, -30),
      ] as [string, string];
    } else {
      // Darker, more muted gradient for locked achievements
      return [
        '#6e6e6e',
        '#555555',
      ] as [string, string];
    }
  };

  // Helper function to adjust color brightness
  const adjustBrightness = (hex: string, percent: number) => {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = (num >> 16) + percent;
    const g = ((num >> 8) & 0x00FF) + percent;
    const b = (num & 0x0000FF) + percent;
    
    const newR = r > 255 ? 255 : r < 0 ? 0 : r;
    const newG = g > 255 ? 255 : g < 0 ? 0 : g;
    const newB = b > 255 ? 255 : b < 0 ? 0 : b;
    
    return '#' + (newB | (newG << 8) | (newR << 16)).toString(16).padStart(6, '0');
  };

  return (
    <Animated.View
      style={{
        opacity: opacityAnim,
        transform: [{ scale: scaleAnim }],
      }}
    >
      <Pressable onPress={handlePress} disabled={!onPress}>
        <View className="mx-2 my-1 overflow-hidden rounded-xl">
          <LinearGradient
            colors={getGradientColors()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="p-4 rounded-xl relative"
          >
            {/* Locked overlay */}
            {!unlocked && (
              <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/40 z-10" />
            )}
            
            <View className="flex-row items-center">
              <View className={`w-12 h-12 rounded-full ${unlocked ? 'bg-white/30' : 'bg-white/10'} items-center justify-center mr-3`}>
                <FontAwesome5 
                  name={icon} 
                  size={20} 
                  color={unlocked ? 'white' : '#BBB'} 
                />
              </View>
              
              <View className="flex-1">
                <Text className={`font-bold text-base ${unlocked ? 'text-white' : 'text-gray-300'}`}>
                  {title}
                </Text>
                <Text className={`text-xs ${unlocked ? 'text-white/80' : 'text-gray-400'}`} numberOfLines={2}>
                  {description}
                </Text>
              </View>
              
              {unlocked && (
                <View className="ml-2">
                  <FontAwesome5 name="check-circle" size={20} color="white" />
                </View>
              )}
              {!unlocked && (
                <View className="ml-2">
                  <FontAwesome5 name="lock" size={16} color="#BBB" />
                </View>
              )}
            </View>
            
            {/* Progress bar (only if not yet unlocked) */}
            {!unlocked && progress > 0 && (
              <View className="mt-3">
                <View className="bg-white/10 h-2 rounded-full w-full overflow-hidden">
                  <Animated.View 
                    className="bg-white/50 h-full rounded-full"
                    style={{ width: progressAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                    }) }}
                  />
                </View>
                <Text className="text-xs text-white/60 mt-1 text-right">
                  {progress}%
                </Text>
              </View>
            )}
          </LinearGradient>
        </View>
      </Pressable>
    </Animated.View>
  );
} 