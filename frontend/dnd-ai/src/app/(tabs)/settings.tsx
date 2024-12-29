import React, { useState } from 'react';
import { Button, Layout, Text, useTheme } from '@ui-kitten/components';
import { firebaseAuth } from '@/FirebaseConfig';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AllKeys } from '@/constants/AsyncStorageKeys';
import Logo from '@/images/logo';

export default function Page() {
  const user = firebaseAuth.currentUser;
  const router = useRouter();

  const theme = useTheme();

  const [cacheClearLoading, setCacheClearLoading] = useState(false);

  const handleLogout = async () => {
    const confirm = await new Promise((resolve) => {
      Alert.alert('Confirm Logut', 'Are you sure you want to logout?', [
        { text: 'Confirm', onPress: () => resolve(true) },
        { text: 'Cancel', onPress: () => resolve(false), style: 'cancel' },
      ]);
    });
    if (!confirm) return;
    try {
      await firebaseAuth.signOut();
      await AsyncStorage.multiRemove(AllKeys);
      router.replace('/loading');
    } catch (err) {
      Alert.alert('Failed to Sign-Out', err.toString());
    }
  };

  const handleClearCache = async () => {
    const confirm = await new Promise((resolve) => {
      Alert.alert('Clear Cache', 'Are you sure you want to clear the cache?', [
        { text: 'Confirm', onPress: () => resolve(true) },
        { text: 'Cancel', onPress: () => resolve(false), style: 'cancel' },
      ]);
    });
    if (!confirm) return;
    try {
      setCacheClearLoading(true);
      await AsyncStorage.multiRemove(AllKeys);
    } catch (err) {
      Alert.alert('Failed to Clear Cache', err.toString());
    } finally {
      setCacheClearLoading(false);
    }
  };

  return (
    <Layout
      className="flex flex-1 align-middle"
      level="1"
      style={{ flex: 1, display: 'flex', justifyContent: 'space-between', padding: 12 }}
    >
      <Layout>
        {user && <Text>Current User: {user.email}</Text>}
        <Text
          style={{ marginTop: 12 }}
          appearance="hint"
        >
          More Features Coming Soon...
        </Text>
      </Layout>
      <Logo
        image="protector"
        size={300}
        style={{
          shadowColor: theme['color-primary-500'],
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1,
          shadowRadius: 10,
        }}
      />
      <Layout style={{ gap: 12 }}>
        {user && (
          <Button
            appearance="outline"
            onPress={handleLogout}
          >
            Log Out
          </Button>
        )}
        <Button
          appearance="outline"
          status="warning"
          onPress={handleClearCache}
          disabled={cacheClearLoading}
        >
          Clear Cache
        </Button>
      </Layout>
    </Layout>
  );
}
