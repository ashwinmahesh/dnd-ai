import { Stack } from 'expo-router';

export default function CampaignsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ headerShown: true, headerTitle: 'Campaigns' }}
      />
      <Stack.Screen
        name="createCampaign"
        options={{ headerShown: true, headerTitle: 'Create Campaign' }}
      />
      <Stack.Screen
        name="addAdventurer"
        options={{ headerShown: true, headerTitle: 'Add Adventurer' }}
      />
    </Stack>
  );
}
