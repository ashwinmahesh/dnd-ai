import '../global.css';

import { Stack } from 'expo-router/stack';
import { Slot, useNavigation, useRouter } from 'expo-router';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Spinner, Text, IconRegistry } from '@ui-kitten/components';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
// import AuthenticatedStack from './authenticatedStack';
// import UnauthenticatedStack from './unauthenticatedStack';
// import { useFirebaseInit } from '@/FirebaseConfig';

export default function Layout() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>();

  const router = useRouter();
  const nav = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider
        {...eva}
        theme={eva.dark}
      >
        <Stack initialRouteName="loading">
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
        </Stack>
      </ApplicationProvider>
    </SafeAreaView>
  );
}
