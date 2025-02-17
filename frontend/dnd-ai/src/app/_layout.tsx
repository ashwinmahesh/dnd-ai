import '../global.css';

import { Stack } from 'expo-router/stack';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { darkerBackgrounds, forestGreen } from '@/theme/themes';
import { DarkTheme } from '@react-navigation/native';

export default function Layout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider
        {...eva}
        theme={{ ...eva.dark, ...forestGreen, ...darkerBackgrounds }}
      >
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: DarkTheme.colors.background },
            headerTintColor: DarkTheme.colors.text,
          }}
        >
          <Stack.Screen
            name="index"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="loading"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(auth)"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />
        </Stack>
      </ApplicationProvider>
    </SafeAreaView>
  );
}
