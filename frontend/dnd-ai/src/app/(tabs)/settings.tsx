import React, { useState } from 'react';
import { Button, Layout, Text, useTheme } from '@ui-kitten/components';
import { firebaseAuth } from '@/FirebaseConfig';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AllKeys } from '@/constants/AsyncStorageKeys';
import Logo from '@/images/logo';
import { deleteAllRecordsForUser } from '@/database/deleteUser';

export default function Page() {
  const user = firebaseAuth.currentUser;
  const router = useRouter();

  const theme = useTheme();

  const [cacheClearLoading, setCacheClearLoading] = useState(false);
  const [deleteAccountLoading, setDeleteAccountLoading] = useState(false);

  const [deleteAccountErr, setDeleteAccountErr] = useState('');

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

  const handlePasswordSubmit = async (password: string) => {
    const user = firebaseAuth.currentUser;
    const credential = auth.EmailAuthProvider.credential(user.email, password);
    try {
      await user.reauthenticateWithCredential(credential);
      return true;
    } catch (err) {
      console.warn('Invalid password');
      setDeleteAccountErr('Account not deleted - invalid password entered');
      return false;
    }
  };

  const handleDelete = async () => {
    setDeleteAccountErr('');
    const confirm = await new Promise((resolve) => {
      Alert.alert('Delete Account', 'Are you sure you want to delete your account? This action cannot be undone', [
        {
          text: 'Confirm',
          onPress: () => {
            Alert.prompt(
              'Confirm Deletion',
              'Please enter your password to delete your account:',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Delete',
                  onPress: async (password: string) => {
                    const ok = await handlePasswordSubmit(password);
                    resolve(ok);
                  },
                  style: 'destructive',
                },
              ],
              'secure-text'
            );
          },
        },
        { text: 'Cancel', onPress: () => resolve(false), style: 'cancel' },
      ]);
    });
    if (!confirm) return;
    setDeleteAccountLoading(true);
    const user = firebaseAuth.currentUser;
    if (!user) {
      console.error('no user found');
      setDeleteAccountLoading(false);
      return;
    }

    try {
      await deleteAllRecordsForUser();
      await user.delete();
      try {
        await AsyncStorage.multiRemove(AllKeys);
      } catch (err) {
        console.error('failed to clear cache:', err.ToString());
      }
      setDeleteAccountLoading(false);
      router.replace('/loading');
    } catch (err) {
      Alert.alert('Failed to Delete Account', err.ToString());
      setDeleteAccountLoading(false);
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
        {deleteAccountErr && <Text status="danger">{deleteAccountErr}</Text>}
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
        <Button
          appearance="ghost"
          status="danger"
          onPress={handleDelete}
          disabled={deleteAccountLoading}
        >
          Delete Account
        </Button>
      </Layout>
    </Layout>
  );
}
