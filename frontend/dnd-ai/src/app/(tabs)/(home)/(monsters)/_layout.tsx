import { Stack } from 'expo-router';

export default function MonstersLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ headerShown: true, headerTitle: 'Monsters' }}
      />
      <Stack.Screen
        name="savedStatblocks"
        options={{ headerShown: true, headerTitle: 'Monsters' }}
      />
      <Stack.Screen
        name="generateStats"
        options={{ headerShown: true, headerTitle: 'Generate Statblock' }}
      />
    </Stack>
  );
}
