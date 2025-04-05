import React, { useRef, useState } from 'react';
import {
  TouchableOpacity, 
  Text, 
  View, 
  ActivityIndicator, 
  GestureResponderEvent,
  Animated,
  Easing,
  Pressable
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

// Enhanced props interface with more customization options
interface ButtonProps {
    title: string;
    onPress: (event: GestureResponderEvent) => void;
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'glass';
    size?: 'sm' | 'md' | 'lg';
    leftIcon?: keyof typeof Feather.glyphMap;
    rightIcon?: keyof typeof Feather.glyphMap;
    isLoading?: boolean;
    disabled?: boolean;
    className?: string;
    textClassName?: string;
    fullWidth?: boolean;
    withHaptics?: boolean;
    elevated?: boolean;
}

export default function Button({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    leftIcon,
    rightIcon,
    isLoading = false,
    disabled = false,
    className = '',
    textClassName = '',
    fullWidth = false,
    withHaptics = true,
    elevated = true,
}: ButtonProps) {
    // Animation state
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const [isPressed, setIsPressed] = useState(false);

    // Variant styles
    const variantStyles = {
        primary: 'bg-blue-500 active:bg-blue-600',
        secondary: 'bg-gray-500 active:bg-gray-600',
        success: 'bg-green-500 active:bg-green-600',
        danger: 'bg-red-500 active:bg-red-600',
        outline: 'bg-transparent border border-blue-500',
        glass: 'bg-white/10 backdrop-blur-lg',
    };

    // Get gradient colors based on variant
    const getGradientColors = () => {
        switch (variant) {
            case 'primary':
                return ['#3b82f6', '#2563eb'] as [string, string];
            case 'secondary':
                return ['#6b7280', '#4b5563'] as [string, string];
            case 'success':
                return ['#22c55e', '#16a34a'] as [string, string];
            case 'danger':
                return ['#ef4444', '#dc2626'] as [string, string];
            case 'outline':
                return ['transparent', 'transparent'] as [string, string];
            case 'glass':
                return ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)'] as [string, string];
            default:
                return ['#3b82f6', '#2563eb'] as [string, string];
        }
    };

    // Size styles
    const sizeStyles = {
        sm: 'py-1.5 px-3',
        md: 'py-3 px-4',
        lg: 'py-4 px-6',
    };

    // Text size styles
    const textSizeStyles = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
    };

    // Text color based on variant
    const textColorStyles = {
        primary: 'text-white',
        secondary: 'text-white',
        success: 'text-white',
        danger: 'text-white',
        outline: 'text-blue-500',
        glass: 'text-white',
    };

    // Shadow effect
    const shadowStyle = (variant !== 'outline' && variant !== 'glass' && elevated) ? 'shadow-md' : '';

    // Width style
    const widthStyle = fullWidth ? 'w-full' : '';

    // Disabled style
    const disabledStyle = disabled ? 'opacity-50' : '';

    // Handle press animation
    const handlePressIn = () => {
        setIsPressed(true);
        
        // Provide haptic feedback if enabled
        if (withHaptics && !disabled && !isLoading) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        
        Animated.timing(scaleAnim, {
            toValue: 0.96,
            duration: 100,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
        }).start();
    };

    const handlePressOut = () => {
        setIsPressed(false);
        
        Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
            easing: Easing.out(Easing.back(1.5)),
        }).start();
    };

    const handlePress = (e: GestureResponderEvent) => {
        if (!disabled && !isLoading) {
            onPress(e);
        }
    };

    // Decide whether to use gradient or solid background
    const shouldUseGradient = variant !== 'outline' && variant !== 'glass';

    return (
        <Animated.View
            style={{
                transform: [{ scale: scaleAnim }],
                width: fullWidth ? '100%' : 'auto',
            }}
        >
            <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={handlePress}
                disabled={disabled || isLoading}
                className={`
                    ${sizeStyles[size]} 
                    ${shadowStyle}
                    ${widthStyle}
                    ${disabledStyle}
                    rounded-lg overflow-hidden
                    ${className}
                    ${variant === 'outline' ? 'border border-blue-500' : ''}
                    ${variant === 'glass' ? 'border border-white/20' : ''}
                `}
                style={{
                    position: 'relative',
                }}
            >
                {shouldUseGradient ? (
                    <LinearGradient
                        colors={getGradientColors()}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        className="absolute top-0 left-0 right-0 bottom-0"
                    />
                ) : null}
                
                <View className="flex-row items-center justify-center">
                    {isLoading ? (
                        <ActivityIndicator
                            size="small"
                            color={variant === 'outline' ? '#3b82f6' : '#ffffff'}
                            className="py-1"
                        />
                    ) : (
                        <View className="flex-row items-center justify-center">
                            {leftIcon && (
                                <View className="mr-2">
                                    <Feather
                                        name={leftIcon}
                                        size={size === 'sm' ? 14 : size === 'md' ? 16 : 18}
                                        color={variant === 'outline' ? '#3b82f6' : '#ffffff'}
                                    />
                                </View>
                            )}

                            <Text className={`
                                ${textColorStyles[variant]} 
                                ${textSizeStyles[size]} 
                                font-medium
                                ${textClassName}
                            `}>
                                {title}
                            </Text>

                            {rightIcon && (
                                <View className="ml-2">
                                    <Feather
                                        name={rightIcon}
                                        size={size === 'sm' ? 14 : size === 'md' ? 16 : 18}
                                        color={variant === 'outline' ? '#3b82f6' : '#ffffff'}
                                    />
                                </View>
                            )}
                        </View>
                    )}
                </View>
            </Pressable>
        </Animated.View>
    );
}