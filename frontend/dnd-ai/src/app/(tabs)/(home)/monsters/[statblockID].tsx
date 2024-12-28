import MonsterStatblock from '@/components/monsters/Statblock';
import { StatblockToView } from '@/constants/AsyncStorageKeys';
import { TStatblock } from '@/database/statblocks';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { Layout, Text } from '@ui-kitten/components';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView } from 'react-native';

export default function ViewStatblock() {
  const [statblock, setStatblock] = useState<TStatblock>();
  const { getItem } = useAsyncStorage(StatblockToView);

  const getStatblockDetails = async () => {
    try {
      const statblockBlob = await getItem();
      setStatblock(JSON.parse(statblockBlob));
    } catch (err) {
      Alert.alert('Failed to Get Statblock', `Could not load statblock data: ${err}`);
    }
  };

  useEffect(() => {
    getStatblockDetails();
  }, []);

  return (
    <Layout style={{ flex: 1, padding: 12 }}>
      <ScrollView>{statblock && <MonsterStatblock statblock={statblock} />}</ScrollView>
    </Layout>
  );
}
