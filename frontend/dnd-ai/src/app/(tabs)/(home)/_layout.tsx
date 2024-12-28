import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ headerShown: true, headerTitle: 'Home' }}
      />
      <Stack.Screen
        name="randomNames"
        options={{ headerShown: true, headerTitle: 'Random Names' }}
      />
      <Stack.Screen
        name="randomEncounters"
        options={{ headerShown: true, headerTitle: 'Random Encounters' }}
      />
      <Stack.Screen
        name="monsters/savedStatblocks"
        options={{ headerShown: true, headerTitle: 'Monsters' }}
      />
      <Stack.Screen
        name="monsters/generateStats"
        options={{ headerShown: true, headerTitle: 'Generate Statblock' }}
      />
      <Stack.Screen
        name="monsters/[statblockID]"
        options={{ headerShown: true, headerTitle: 'Statblock' }}
      />
      <Stack.Screen
        name="lootTable"
        options={{ headerShown: true, headerTitle: 'Loot Table' }}
      />
    </Stack>
  );
}
