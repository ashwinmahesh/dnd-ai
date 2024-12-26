import React, { useState } from 'react';
import { Layout, Text, Button, Input, Icon } from '@ui-kitten/components';
// import { FirebaseAuth } from '@/FirebaseConfig';
import auth, { signInWithCredential, getAuth } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { firebaseAuth, app } from '@/FirebaseConfig';
// import { useFirebaseInit } from '@/FirebaseConfig';

const Register = () => {
  // const { firebaseAuth } = useFirebaseInit();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  const router = useRouter();

  const handleRegister = async () => {
    try {
      const ok = await firebaseAuth.createUserWithEmailAndPassword(username, password);
    } catch (errMsg) {
      setError(errMsg);
    }
  };

  return (
    <Layout style={{ flex: 1, padding: 12 }}>
      <Icon
        name="shield"
        style={{ height: 80, marginTop: 16 }}
        fill="#8F9BB3"
      />
      <Input
        placeholder="Email"
        style={{ marginTop: 16 }}
        onChangeText={setUsername}
        autoComplete="email"
        autoCapitalize="none"
      />
      <Input
        placeholder="Password"
        secureTextEntry
        style={{ marginTop: 16 }}
        value={password}
        onChangeText={setPassword}
        autoComplete="password"
        autoCapitalize="none"
      />
      <Button
        onPress={() => {
          handleRegister();
        }}
        style={{ marginTop: 16 }}
      >
        Register
      </Button>
      <Button
        style={{ marginTop: 16 }}
        appearance="ghost"
        onPress={() => {
          router.back();
        }}
      >
        Back to Login
      </Button>
    </Layout>
  );
};

export default Register;
