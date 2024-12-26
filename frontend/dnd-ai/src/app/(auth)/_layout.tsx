import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // header: () => null,
        animation: 'slide_from_right', // Optional: adds nice transition
      }}
    >
      <Stack.Screen
        name="register"
        options={{ headerShown: true, headerTitle: 'Register' }}
      />
      <Stack.Screen
        name="login"
        options={{ headerShown: true, headerTitle: 'Login' }}
      />
    </Stack>
  );
}
