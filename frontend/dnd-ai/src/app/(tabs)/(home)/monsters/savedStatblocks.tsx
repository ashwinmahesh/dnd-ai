import IconButton from '@/components/common/IconButton';
import { StatblockToView } from '@/constants/AsyncStorageKeys';
import { deleteSavedStatblockDB, getSavedStatblocksDB, TStatblock } from '@/database/statblocks';
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
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteErr, setDeleteErr] = useState('');

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

  const handleDelete = async (index: number, id: string, name: string) => {
    const confirm = await new Promise((resolve) => {
      Alert.alert('Confirm Deletion', `Are you sure you want to delete the statblock for ${name}?`, [
        { text: 'Confirm', onPress: () => resolve(true) },
        { text: 'Cancel', onPress: () => resolve(false), style: 'cancel' },
      ]);
    });
    if (!confirm) return;
    try {
      setDeleteLoading(true);
      setDeleteErr('');
      await deleteSavedStatblockDB(id);
      setStatblocks((prev) => {
        return [...prev.slice(0, index), ...prev.slice(index + 1)];
      });
    } catch (error) {
      setDeleteErr(error.toString());
    } finally {
      setDeleteLoading(false);
    }
  };

  const renderItem = ({ item, index }: { item: TStatblock; index: number }): React.ReactElement => (
    <ListItem
      title={`${item.name} (CR ${item.cr})`}
      description={`${item.description}`}
      onPress={() => {
        handleStatblockPress(item);
      }}
      onLongPress={() => handleDelete(index, item.id, item.name)}
      disabled={deleteLoading}
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
        {deleteErr && (
          <Text
            status="danger"
            style={{ marginHorizontal: 12, marginVertical: 6 }}
          >
            {deleteErr}
          </Text>
        )}
        <List
          data={statblocks}
          renderItem={renderItem}
          ItemSeparatorComponent={Divider}
        />
      </ScrollView>
    </Layout>
  );
}
