import React from 'react';
import { View, Text } from 'react-native';
import { styled } from 'nativewind';
import { Button } from '@/components/Button';

const StyledView = styled(View);
const StyledText = styled(Text);

export default function HomeScreen() {
  return (
    <StyledView className="flex-1 items-center justify-center bg-white p-4">
      <StyledText className="text-2xl font-bold text-gray-800 mb-8">
        Welcome to My App
      </StyledText>
      
      <Button 
        title="Primary Button" 
        variant="primary"
        className="mb-4"
        onPress={() => console.log('Primary button pressed')}
      />
      
      <Button 
        title="Secondary Button" 
        variant="secondary"
        onPress={() => console.log('Secondary button pressed')}
      />
    </StyledView>
  );
} 