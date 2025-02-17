import React from 'react';
import { Button, Layout, Text, useTheme } from '@ui-kitten/components';
import { router } from 'expo-router';

import { ScrollView } from 'react-native';
import Logo from '@/images/logo';

export default function Page() {
  const theme = useTheme();
  return (
    <Layout
      className="flex flex-1 align-middle p-8 w-full"
      level="1"
      style={{ flex: 1, padding: 16 }}
    >
      <ScrollView>
        <Logo
          image="protector"
          size={150}
          style={{
            shadowColor: theme['color-primary-500'],
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 1,
            shadowRadius: 10,
          }}
        />
        <Text
          style={{ textAlign: 'center', marginVertical: 12 }}
          category="h2"
        >
          Dungeons & Dragons Session Guardian
        </Text>
        <Button onPress={() => router.push('/(tabs)/(home)/randomNames')}>Names</Button>
        <Button
          onPress={() => router.push('/(tabs)/(home)/randomEncounters')}
          style={{ marginTop: 16 }}
        >
          Encounters
        </Button>
        <Button
          style={{ marginTop: 16 }}
          onPress={() => router.push('/(tabs)/(home)/monsters/savedStatblocks')}
        >
          Monster Statblocks
        </Button>
        <Button
          style={{ marginTop: 16 }}
          onPress={() => router.push('/(tabs)/(home)/lootTable')}
        >
          Loot Tables
        </Button>
        <Button
          style={{ marginTop: 16 }}
          onPress={() => router.push('/(tabs)/(home)/rumors')}
        >
          Rumors
        </Button>
        <Button
          disabled
          style={{ marginTop: 16 }}
        >
          NPCs
        </Button>
        <Button
          disabled
          style={{ marginTop: 16 }}
        >
          Dungeon
        </Button>
        <Button
          disabled
          style={{ marginTop: 16 }}
        >
          Images
        </Button>
        <Button
          disabled
          style={{ marginTop: 16 }}
        >
          Riddle
        </Button>
      </ScrollView>
    </Layout>
  );
}
