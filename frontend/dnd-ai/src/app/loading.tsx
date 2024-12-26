import React, { useState, useEffect } from 'react';
import { Layout, Spinner, Text } from '@ui-kitten/components';
import { useNavigation, useRouter } from 'expo-router';
// import { useFirebaseInit } from '@/FirebaseConfig';
import auth, { FirebaseAuthTypes, getAuth } from '@react-native-firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import Login from './(auth)/login';

const Loading = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>();

  const router = useRouter();
  const nav = useNavigation();

  useEffect(() => {
    if (initializing) return;
    if (user) router.replace('/(tabs)');
    else router.replace('/(auth)/login');
  }, [user, initializing]);

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing)
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Layout
          className="flex-1 px-3 py-3 justify-center align-middle h-full w-full"
          style={{ flex: 1 }}
        >
          <Spinner size="large" />
          <Text>Loading configurations...</Text>
        </Layout>
      </SafeAreaView>
    );

  if (!user)
    return (
      <Layout style={{ flex: 1 }}>
        <Text>No user found.. redirecting to login</Text>
      </Layout>
    );

  return (
    <Layout style={{ flex: 1 }}>
      <Text>Found user...</Text>
    </Layout>
  );

  // if (!user) return <Login />;

  // return <Layout>Welcome User!</Layout>;

  // return (
  //   <SafeAreaView style={{ flex: 1 }}>
  //     <AuthenticatedStack />
  //     <UnauthenticatedStack />
  //   </SafeAreaView>
  // );

  // useEffect(() => {
  //   // setTimeout(() => {
  //   //   router.replace('/login');
  //   // }, 2000);
  // }, []);

  // useEffect(() => {
  //   if (!initialized) return;
  //   const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
  //   return subscriber; // unsubscribe on unmount
  // }, [initialized]);

  // useEffect(() => {
  //   if (!initialized) return;
  //   if (!user) {
  //     router.replace('/login');
  //   } else {
  //     router.replace('/(tabs)');
  //   }
  // }, [initialized]);

  return (
    <SafeAreaView>
      {/* <Layout className="flex-1 px-3 py-3 justify-center align-middle h-full w-full">
        <Spinner size="large" />
        <Text>Loading configurations...</Text>
      </Layout> */}
    </SafeAreaView>
  );
};

export default Loading;
