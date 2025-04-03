import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';
import { styled } from 'nativewind';

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ 
  title, 
  variant = 'primary', 
  className = '',
  ...props 
}) => {
  const baseButtonClasses = 'px-4 py-2 rounded-lg';
  const variantClasses = {
    primary: 'bg-blue-500',
    secondary: 'bg-gray-500',
  };

  return (
    <StyledTouchableOpacity
      className={`${baseButtonClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      <StyledText className="text-white text-center font-semibold">
        {title}
      </StyledText>
    </StyledTouchableOpacity>
  );
}; 