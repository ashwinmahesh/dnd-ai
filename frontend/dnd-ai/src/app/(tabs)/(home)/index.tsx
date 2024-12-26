import React from 'react';
import { Button, Layout } from '@ui-kitten/components';
import { router } from 'expo-router';

export default function Page() {
  return (
    <Layout
      className="flex flex-1 align-middle p-8 w-full"
      level="1"
      style={{ flex: 1, padding: 16 }}
    >
      <Button onPress={() => router.push('/(tabs)/(home)/randomNames')}>Random Names</Button>
      <Button
        onPress={() => router.push('/(tabs)/(home)/randomEncounters')}
        style={{ marginTop: 16 }}
      >
        Random Encounters
      </Button>
      <Button
        onPress={() => router.push('/')}
        style={{ marginTop: 16 }}
      >
        Quest Hooks
      </Button>
    </Layout>
  );
}
