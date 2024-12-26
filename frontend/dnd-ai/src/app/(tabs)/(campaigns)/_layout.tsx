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
      {/* <Stack.Screen
        name="randomNames"
        options={{ headerShown: true, headerTitle: 'Random Names' }}
      />
      <Stack.Screen
        name="randomEncounters"
        options={{ headerShown: true, headerTitle: 'Random Encounters' }}
      /> */}
    </Stack>
  );
}
