import React from 'react';
import { Button, Layout } from '@ui-kitten/components';
import { router } from 'expo-router';

import { generateLootTableAPI, generateMonsterStatblockAPI } from '@/api/inference';
import { Image, ScrollView } from 'react-native';
import Logo from '@/images/logo';

export default function Page() {
  return (
    <Layout
      className="flex flex-1 align-middle p-8 w-full"
      level="1"
      style={{ flex: 1, padding: 16 }}
    >
      <ScrollView>
        <Layout style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
          <Logo size={150} />
        </Layout>
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
          disabled
          style={{ marginTop: 16 }}
        >
          Quest Hooks
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
