import "../global.css";

import { Stack } from 'expo-router/stack';
import * as eva from '@eva-design/eva'
import {ApplicationProvider} from '@ui-kitten/components'

export default function Layout() {
  return (
    <ApplicationProvider {...eva} theme={eva.dark}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: true, headerTitle:'Home' }}/>
        <Stack.Screen name="randomNames" options={{headerShown: true, headerTitle: 'Random Names'}} />
      </Stack>
    </ApplicationProvider>
  );
}