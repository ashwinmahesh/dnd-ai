import React, { useState } from 'react';
import { Layout, Button, Input, Icon } from '@ui-kitten/components';
import { useRouter } from 'expo-router';
import { firebaseAuth } from '@/FirebaseConfig';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  const router = useRouter();

  const handleRegister = async () => {
    try {
      setError('');
      const userCredentials = await firebaseAuth.createUserWithEmailAndPassword(email, password);
      await firebaseAuth.signInWithEmailAndPassword(email, password);
      // router.dismissAll();
      router.replace('/(tabs)');
    } catch (errMsg) {
      setError(errMsg.toString());
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
        onChangeText={setEmail}
        autoComplete="email"
        autoCapitalize="none"
        caption={error}
        status={error ? 'danger' : undefined}
      />
      <Input
        placeholder="Password"
        secureTextEntry
        style={{ marginTop: 16 }}
        value={password}
        onChangeText={setPassword}
        autoComplete="password"
        autoCapitalize="none"
        status={error ? 'danger' : undefined}
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
