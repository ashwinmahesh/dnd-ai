import '../../global.css';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { DarkTheme } from '@react-navigation/native';
import { useTheme } from '@ui-kitten/components';

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme['color-primary-500'],
        tabBarStyle: { backgroundColor: DarkTheme.colors.card },
        tabBarInactiveTintColor: 'white',
      }}
    >
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
