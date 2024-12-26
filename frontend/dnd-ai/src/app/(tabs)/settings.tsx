import React from 'react';
import { Button, Layout, Text } from '@ui-kitten/components';
import { firebaseAuth } from '@/FirebaseConfig';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function Page() {
  // TODO - subscribe to changes
  const user = firebaseAuth.currentUser;
  const router = useRouter();

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
      router.dismissAll();
    } catch (err) {
      Alert.alert('Failed to Sign-Out', err.toString());
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
      {user && (
        <Button
          appearance="outline"
          size="large"
          onPress={handleLogout}
        >
          Log Out
        </Button>
      )}
    </Layout>
  );
}
