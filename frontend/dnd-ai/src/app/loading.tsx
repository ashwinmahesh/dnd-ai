import React, { useState, useEffect } from 'react';
import { Layout } from '@ui-kitten/components';
import { useNavigation, useRouter } from 'expo-router';
import auth from '@react-native-firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import Logo from '@/images/logo';

const Loading = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>();

  const router = useRouter();
  const nav = useNavigation();

  useEffect(() => {
    if (initializing) return;
    if (user) router.replace('/(tabs)/(home)');
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
          style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <Logo
            size={250}
            image="protector"
          />
        </Layout>
      </SafeAreaView>
    );

  return <Layout style={{ flex: 1 }}></Layout>;
};

export default Loading;
