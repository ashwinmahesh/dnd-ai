import '../global.css';

import { Stack } from 'expo-router/stack';
import { Slot, useNavigation, useRouter } from 'expo-router';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Spinner, Text } from '@ui-kitten/components';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthenticatedStack from './authenticatedStack';
import UnauthenticatedStack from './unauthenticatedStack';
// import { useFirebaseInit } from '@/FirebaseConfig';

export default function Layout() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>();

  const router = useRouter();
  const nav = useNavigation();

  // const { initialized } = useFirebaseInit();

  // if (!initialized) {
  //   return <Spinner size="large" />;
  // }

  // Handle user state changes
  // function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
  //   // setUser(user);
  //   // if (initializing) setInitializing(false);
  //   if (!user) {
  //     router.replace('/login');
  //   }
  // }

  // useEffect(() => {
  //   if (!initialized) return;
  //   const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
  //   return subscriber; // unsubscribe on unmount
  // }, [initialized]);

  // useEffect(() => {
  //   if (!user) {
  //     router.replace('/login');
  //   }
  // }, []);

  // if (initializing) return null;

  // return (
  //   <ApplicationProvider
  //     {...eva}
  //     theme={eva.dark}
  //   >
  //     <Stack>
  //       <Stack.Screen name="Login" />
  //     </Stack>
  //     {/* {user ? <Text>Hello {user.email}</Text> : <Login />} */}
  //     {/* <Text style={{ color: 'red' }}>Load something</Text> */}
  //   </ApplicationProvider>
  // );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ApplicationProvider
        {...eva}
        theme={eva.dark}
      >
        <Stack>
          <Stack.Screen
            name="login"
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
