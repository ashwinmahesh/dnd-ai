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
        options={{ headerShown: true, headerTitle: 'Campaigns' }}
      />
      <Stack.Screen
        name="[...campaignParams]"
        options={{ headerShown: true, headerTitle: 'Create Campaign' }}
      />
      <Stack.Screen
        name="adventurer/[...params]"
        options={{ headerShown: true, headerTitle: 'Add Adventurer' }}
      />
    </Stack>
  );
}
