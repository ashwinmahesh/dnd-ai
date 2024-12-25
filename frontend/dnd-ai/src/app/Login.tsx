import React from 'react';
import { Layout, Text, Button } from '@ui-kitten/components';
import { FirebaseAuth } from '@/FirebaseConfig';
import auth, { signInWithCredential } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const Login = () => {
  async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const signInResult = await GoogleSignin.signIn();

    // Try the new style of google-sign in result, from v13+ of that module
    const idToken = signInResult.data?.idToken;
    if (!idToken) {
      throw new Error('No ID token found');
    }

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return signInWithCredential(FirebaseAuth, googleCredential);
  }

  return (
    <Layout>
      <Button onPress={onGoogleButtonPress}>Google Sign In</Button>
    </Layout>
  );
};

export default Login;
