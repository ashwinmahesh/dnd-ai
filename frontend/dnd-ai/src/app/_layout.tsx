import '../global.css';

import { Stack } from 'expo-router/stack';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Text } from '@ui-kitten/components';
import auth from '@react-native-firebase/auth';
import React, { useEffect, useState } from 'react';
import Login from './Login';

export default function Layout() {
  useEffect(() => {}, []);

  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  return (
    <ApplicationProvider
      {...eva}
      theme={eva.dark}
    >
      {user ? <Text>Hello {user.email}</Text> : <Login />}
    </ApplicationProvider>
  );

  return (
    <ApplicationProvider
      {...eva}
      theme={eva.dark}
    >
      <Stack>
        <Stack.Screen
          name="Login"
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
  );
}
