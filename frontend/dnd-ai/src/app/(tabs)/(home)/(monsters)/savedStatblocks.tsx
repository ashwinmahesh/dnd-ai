import { Button, Layout, Text } from '@ui-kitten/components';
import { useRouter } from 'expo-router';
import React from 'react';

export default function MonstersHome() {
  const router = useRouter();

  return (
    <Layout style={{ flex: 1 }}>
      <Text>Monsters page</Text>
      <Button onPress={() => router.push('/(tabs)/(home)/(monsters)/generateStats')}>Create Monster</Button>
    </Layout>
  );
}
