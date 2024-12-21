import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
  // Button, Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getRandomNamesAPI } from '../../api/inference';
import { Button, Layout, Text } from '@ui-kitten/components';
import { router } from 'expo-router';

export default function Page() {
  return (
    <Layout
      className="flex flex-1 align-middle p-8 w-full"
      level="1"
    >
      <Button onPress={() => router.push('/randomNames')}>Random Names</Button>
      <Button
        onPress={() => router.push('/randomEncounters')}
        className="mt-8"
      >
        Random Encounters
      </Button>
    </Layout>
  );
}
