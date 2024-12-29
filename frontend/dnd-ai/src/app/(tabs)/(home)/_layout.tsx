import { DarkTheme } from '@react-navigation/native';
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
        options={{
          headerShown: true,
          headerTitle: 'Home',
          headerStyle: { backgroundColor: DarkTheme.colors.background },
          headerTintColor: DarkTheme.colors.text,
        }}
      />
      <Stack.Screen
        name="randomNames"
        options={{
          headerShown: true,
          headerTitle: 'Random Names',
          headerStyle: { backgroundColor: DarkTheme.colors.background },
          headerTintColor: DarkTheme.colors.text,
        }}
      />
      <Stack.Screen
        name="randomEncounters"
        options={{
          headerShown: true,
          headerTitle: 'Random Encounters',
          headerStyle: { backgroundColor: DarkTheme.colors.background },
          headerTintColor: DarkTheme.colors.text,
        }}
      />
      <Stack.Screen
        name="monsters/savedStatblocks"
        options={{
          headerShown: true,
          headerTitle: 'Monsters',
          headerStyle: { backgroundColor: DarkTheme.colors.background },
          headerTintColor: DarkTheme.colors.text,
        }}
      />
      <Stack.Screen
        name="monsters/generateStats"
        options={{
          headerShown: true,
          headerTitle: 'Generate Statblock',
          headerStyle: { backgroundColor: DarkTheme.colors.background },
          headerTintColor: DarkTheme.colors.text,
        }}
      />
      <Stack.Screen
        name="monsters/[statblockID]"
        options={{
          headerShown: true,
          headerTitle: 'Statblock',
          headerStyle: { backgroundColor: DarkTheme.colors.background },
          headerTintColor: DarkTheme.colors.text,
        }}
      />
      <Stack.Screen
        name="lootTable"
        options={{
          headerShown: true,
          headerTitle: 'Loot Table',
          headerStyle: { backgroundColor: DarkTheme.colors.background },
          headerTintColor: DarkTheme.colors.text,
        }}
      />
      <Stack.Screen
        name="rumors"
        options={{
          headerShown: true,
          headerTitle: 'Rumors',
          headerStyle: { backgroundColor: DarkTheme.colors.background },
          headerTintColor: DarkTheme.colors.text,
        }}
      />
    </Stack>
  );
}
