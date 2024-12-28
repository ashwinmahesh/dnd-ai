import IconButton from '@/components/common/IconButton';
import { StatblockToView } from '@/constants/AsyncStorageKeys';
import { getSavedStatblocksDB, TStatblock } from '@/database/statblocks';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { Button, Divider, Layout, List, ListItem, Text } from '@ui-kitten/components';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView } from 'react-native';

export default function MonstersHome() {
  const router = useRouter();
  const { setItem } = useAsyncStorage(StatblockToView);

  const [statblocks, setStatblocks] = useState<TStatblock[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const getStatblocks = async () => {
    try {
      setLoading(true);
      setErr('');
      let res = await getSavedStatblocksDB();
      setStatblocks(res);
    } catch (err) {
      setErr(err.toString());
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getStatblocks();
    }, [])
  );

  const handleStatblockPress = async (statblock: TStatblock) => {
    try {
      await setItem(JSON.stringify(statblock));
      router.push(`/(tabs)/(home)/monsters/${statblock.id}`);
    } catch (err) {
      Alert.alert('View Statblock Error', `Could not navigate to statblock details page: ${err}`);
    }
  };

  const renderItem = ({ item }: { item: TStatblock; index: number }): React.ReactElement => (
    <ListItem
      title={`${item.name} (CR ${item.cr})`}
      description={`${item.description}`}
      onPress={() => {
        handleStatblockPress(item);
      }}
    />
  );

  return (
    <Layout style={{ flex: 1 }}>
      <ScrollView>
        <Layout
          style={{
            flexDirection: 'row',
            gap: 32,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{ margin: 12 }}
            category="h5"
          >
            Statblocks
          </Text>
          <IconButton
            icon="plus"
            style={{ flexGrow: 0.5 }}
            appearance="outline"
            onPress={() => router.push('/(tabs)/(home)/monsters/generateStats')}
          />
        </Layout>
        <List
          data={statblocks}
          renderItem={renderItem}
          ItemSeparatorComponent={Divider}
        />
      </ScrollView>
    </Layout>
  );
}
