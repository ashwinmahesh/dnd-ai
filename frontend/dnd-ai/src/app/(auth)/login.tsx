import React, { useState } from 'react';
import { Layout, Text, Button, Input, Icon } from '@ui-kitten/components';
// import { FirebaseAuth } from '@/FirebaseConfig';
import auth, { signInWithCredential, getAuth } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
// import { useFirebaseInit } from '@/FirebaseConfig';

const Login = () => {
  // const { firebaseAuth } = useFirebaseInit();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const handleLogin = async () => {
    console.log(`Username ${username}, Password ${password}`);
  };

  // async function onGoogleButtonPress() {
  //   console.log('Calling function');
  //   // Check if your device supports Google Play
  //   await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  //   // Get the users ID token
  //   console.log('Waiting for google signin');
  //   const signInResult = await GoogleSignin.signIn();

  //   console.log('Sign In Result: ', signInResult);

  //   // Try the new style of google-sign in result, from v13+ of that module
  //   const idToken = signInResult.data?.idToken;
  //   if (!idToken) {
  //     throw new Error('No ID token found');
  //   }

  //   // Create a Google credential with the token
  //   const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  //   // Sign-in the user with the credential
  //   return signInWithCredential(getAuth(), googleCredential);
  // }

  return (
    <Layout
      className="flex-1 px-3 py-3 h-full w-full"
      style={{ flex: 1, padding: 12 }}
    >
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
        onPress={() => {}}
        style={{ marginTop: 16 }}
      >
        Login
      </Button>
      <Button
        style={{ marginTop: 16 }}
        appearance="ghost"
        onPress={() => {
          router.push('/(auth)/register');
        }}
      >
        Register
      </Button>
    </Layout>
  );
};

export default Login;
