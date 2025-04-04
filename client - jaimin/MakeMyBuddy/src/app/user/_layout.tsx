import {Stack} from 'expo-router';

export default function UserLayout() {
  return (
      <Stack>
        <Stack.Screen
            name="profile/[id]"
            options={{
              title: "User Profile",
              headerBackTitle: "Back"
            }}
        />
      </Stack>
  );
}