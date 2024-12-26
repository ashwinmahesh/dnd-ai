import React from 'react';
import { Layout, Text, Button } from '@ui-kitten/components';
// import { FirebaseAuth } from '@/FirebaseConfig';
import auth, { signInWithCredential, getAuth } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { useFirebaseInit } from '@/FirebaseConfig';

const Login = () => {
  // const { firebaseAuth } = useFirebaseInit();

  async function onGoogleButtonPress() {
    console.log('Calling function');
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    console.log('Waiting for google signin');
    const signInResult = await GoogleSignin.signIn();

    console.log('Sign In Result: ', signInResult);

    // Try the new style of google-sign in result, from v13+ of that module
    const idToken = signInResult.data?.idToken;
    if (!idToken) {
      throw new Error('No ID token found');
    }

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return signInWithCredential(getAuth(), googleCredential);
  }

  return (
    <SafeAreaView>
      <Layout
        className="flex-1 px-3 py-3 h-full w-full"
        style={{ flex: 1 }}
      >
        <Button onPress={onGoogleButtonPress}>Google Sign In</Button>
        <Text>TESTING IF THIS WORKS</Text>
      </Layout>
    </SafeAreaView>
  );
};

export default Login;
