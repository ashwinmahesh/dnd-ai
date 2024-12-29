import { DarkTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';

export default function CampaignsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="index"
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitle: 'Campaigns',
          headerStyle: { backgroundColor: DarkTheme.colors.background },
          headerTintColor: DarkTheme.colors.text,
        }}
      />
      <Stack.Screen
        name="[...campaignParams]"
        options={{
          headerShown: true,
          headerTitle: 'Create Campaign',
          headerStyle: { backgroundColor: DarkTheme.colors.background },
          headerTintColor: DarkTheme.colors.text,
        }}
      />
      <Stack.Screen
        name="adventurer/[...params]"
        options={{
          headerShown: true,
          headerTitle: 'Add Adventurer',
          headerStyle: { backgroundColor: DarkTheme.colors.background },
          headerTintColor: DarkTheme.colors.text,
        }}
      />
    </Stack>
  );
}
