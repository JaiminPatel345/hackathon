import React from 'react';
import {Stack} from 'expo-router';
import {DefaultTheme, ThemeProvider} from '@react-navigation/native';
import '../styles/global.css';

export default function RootLayout() {

  return (
      <ThemeProvider value={DefaultTheme}>
        <Stack>
          <Stack.Screen
              name="index"
              options={{
                title: 'Home',
                headerShown: false
              }}
          />
        </Stack>
      </ThemeProvider>
  );
}
