import { TextInput, TextInputProps } from 'react-native';

export default function Input(props: TextInputProps) {
  return (
    <TextInput
      className="border border-gray-300 p-2 rounded-lg mb-2"
      {...props}
    />
  );
}