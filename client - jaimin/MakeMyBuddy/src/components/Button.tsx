import { TouchableOpacity, Text, GestureResponderEvent } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  className?: string;
}

export default function Button({ title, onPress, className = '' }: ButtonProps) {
  return (
    <TouchableOpacity
      className={`bg-blue-500 p-3 rounded-lg ${className}`}
      onPress={onPress}
    >
      <Text className="text-white text-center">{title}</Text>
    </TouchableOpacity>
  );
}