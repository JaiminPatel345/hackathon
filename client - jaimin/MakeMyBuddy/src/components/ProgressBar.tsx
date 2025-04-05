import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';

interface ProgressBarProps {
  progress: number | string; // Can be a number (0-100) or text string like "In progress"
  color?: string;
  height?: number;
  label?: string;
  showPercentage?: boolean;
}

export default function ProgressBar({
  progress,
  color = '#3b82f6', // Default blue color
  height = 8,
  label,
  showPercentage = true,
}: ProgressBarProps) {
  // Check if progress is a number or string
  const isNumeric = typeof progress === 'number' || !isNaN(Number(progress));
  
  // Ensure numeric progress is between 0-100
  const clampedProgress = isNumeric 
    ? Math.min(Math.max(0, Number(progress)), 100) 
    : 0;
  
  // Determine width for progress bar - if text is provided, show a small indication (10%)
  const progressWidth = isNumeric ? clampedProgress : 10;
  
  // Animated value
  const widthAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Animate the progress bar filling
    Animated.timing(widthAnim, {
      toValue: progressWidth,
      duration: 800,
      easing: Easing.out(Easing.exp),
      useNativeDriver: false, // Width changes aren't supported by native driver
    }).start();
    
    // Fade in the text
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [progressWidth]);

  // Determine if progress is high, medium, or low for color intensity
  const getProgressGradient = () => {
    if (!isNumeric) return color;
    if (clampedProgress > 75) return `${color}`;
    if (clampedProgress > 40) return `${color}dd`;
    return `${color}aa`;
  };
  
  return (
    <View className="mb-2">
      {label && (
        <Animated.Text 
          style={{ opacity: fadeAnim }}
          className="text-gray-700 text-xs mb-1 font-medium"
        >
          {label}
        </Animated.Text>
      )}
      <View className="relative w-full">
        <View 
          className="w-full rounded-full bg-gray-200 overflow-hidden"
          style={{ height }}
        >
          <Animated.View 
            className="absolute top-0 left-0 rounded-full"
            style={{ 
              backgroundColor: getProgressGradient(),
              width: widthAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
              height,
            }}
          />
        </View>
      </View>
      
      {isNumeric ? (
        // Show percentage for numeric progress
        showPercentage && (
          <Animated.Text 
            style={{ opacity: fadeAnim }}
            className="text-xs text-gray-500 mt-1 text-right"
          >
            {clampedProgress}%
          </Animated.Text>
        )
      ) : (
        // Show text progress
        <Animated.Text 
          style={{ opacity: fadeAnim }}
          className="text-xs text-gray-500 mt-1 text-right"
          numberOfLines={1} 
          ellipsizeMode="tail"
        >
          {progress}
        </Animated.Text>
      )}
    </View>
  );
} 