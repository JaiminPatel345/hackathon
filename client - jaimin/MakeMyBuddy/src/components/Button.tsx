import React from 'react';
import {TouchableOpacity, Text, View, ActivityIndicator, GestureResponderEvent} from 'react-native';
import {Feather} from '@expo/vector-icons';

// Enhanced props interface with more customization options
interface ButtonProps {
    title: string;
    onPress: (event: GestureResponderEvent) => void;
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    leftIcon?: string;
    rightIcon?: string;
    isLoading?: boolean;
    disabled?: boolean;
    className?: string;
    textClassName?: string;
    fullWidth?: boolean;
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
                               }: ButtonProps) {

    // Variant styles
    const variantStyles = {
        primary: 'bg-blue-500 active:bg-blue-600',
        secondary: 'bg-gray-500 active:bg-gray-600',
        success: 'bg-green-500 active:bg-green-600',
        danger: 'bg-red-500 active:bg-red-600',
        outline: 'bg-transparent border border-blue-500',
    };

    // Size styles
    const sizeStyles = {
        sm: 'py-1 px-3',
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
    };

    // Shadow effect
    const shadowStyle = variant !== 'outline' ? 'shadow-md' : '';

    // Width style
    const widthStyle = fullWidth ? 'w-full' : '';

    // Disabled style
    const disabledStyle = disabled ? 'opacity-50' : '';

    return (
        <TouchableOpacity
            className={`
        ${variantStyles[variant]} 
        ${sizeStyles[size]} 
        ${shadowStyle}
        ${widthStyle}
        ${disabledStyle}
        rounded-lg flex-row items-center justify-center
        ${className}
      `}
            onPress={onPress}
            disabled={disabled || isLoading}
            activeOpacity={0.8}
        >
            {isLoading ? (
                <ActivityIndicator
                    size="small"
                    color={variant === 'outline' ? '#3b82f6' : '#ffffff'}
                />
            ) : (
                <View className="flex-row items-center justify-center">
                    {leftIcon && (
                        <View className="mr-2">
                            <Feather
                                icon={leftIcon}
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
                                icon={rightIcon}
                                size={size === 'sm' ? 14 : size === 'md' ? 16 : 18}
                                color={variant === 'outline' ? '#3b82f6' : '#ffffff'}
                            />
                        </View>
                    )}
                </View>
            )}
        </TouchableOpacity>
    );
}