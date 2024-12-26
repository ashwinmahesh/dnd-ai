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
      <Button onPress={() => router.push('/randomNames')}>Random Names</Button>
      <Button
        onPress={() => router.push('/randomEncounters')}
        className="mt-8"
        style={{ marginTop: 16 }}
      >
        Random Encounters
      </Button>
      <Button onPress={() => router.push('/loading')}>Fake</Button>
    </Layout>
  );
}
