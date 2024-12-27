import React from 'react';
import { Button, Layout } from '@ui-kitten/components';
import { router } from 'expo-router';

import { generateMonsterStatblockAPI } from '@/api/inference';

export default function Page() {
  return (
    <Layout
      className="flex flex-1 align-middle p-8 w-full"
      level="1"
      style={{ flex: 1, padding: 16 }}
    >
      <Button onPress={() => router.push('/(tabs)/(home)/randomNames')}>Names</Button>
      <Button
        onPress={() => router.push('/(tabs)/(home)/randomEncounters')}
        style={{ marginTop: 16 }}
      >
        Encounters
      </Button>
      <Button
        // disabled
        style={{ marginTop: 16 }}
        onPress={() => {
          generateMonsterStatblockAPI('A normally good creature which is corrupted by a dark magic', 12);
        }}
      >
        Monster Statblock
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
        Loot Tables
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
    </Layout>
  );
}
