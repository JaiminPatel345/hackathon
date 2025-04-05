import {Tabs} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';

export default function TabsLayout() {
  return (
      <Tabs screenOptions={{tabBarActiveTintColor: '#007BFF'}}>
        <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({color, size}) => (
                  <Ionicons name="home" color={color} size={size}/>
              ),
            }}
        />
        <Tabs.Screen
            name="chat"
            options={{
              title: 'Chat',
              tabBarIcon: ({color, size}) => (
                  <Ionicons name="chatbubbles" color={color} size={size}/>
              ),
            }}
        />
        <Tabs.Screen
            name="resource"
            options={{
              title: 'Resources',
              tabBarIcon: ({color, size}) => (
                  <Ionicons name="folder" color={color} size={size}/>
              ),
            }}
        />
        <Tabs.Screen
            name="profile"
            options={{
              title: 'Profile',
              tabBarIcon: ({color, size}) => (
                  <Ionicons name="person" color={color} size={size}/>
              ),
            }}
        />
      </Tabs>
  );
}