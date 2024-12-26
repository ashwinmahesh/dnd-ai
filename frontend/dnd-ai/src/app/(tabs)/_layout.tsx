import '../../global.css';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <FontAwesome
              size={28}
              name="home"
              color={color}
            />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="(campaigns)"
        options={{
          title: 'Campaigns',
          tabBarIcon: ({ color }) => (
            <FontAwesome
              size={28}
              name="database"
              color={color}
            />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <FontAwesome
              size={28}
              name="cog"
              color={color}
            />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
