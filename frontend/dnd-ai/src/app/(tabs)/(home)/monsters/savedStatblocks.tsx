import IconButton from '@/components/common/IconButton';
import { getSavedStatblocksDB, TStatblock } from '@/database/statblocks';
import { Button, Divider, Layout, List, ListItem, Text } from '@ui-kitten/components';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView } from 'react-native';

export default function MonstersHome() {
  const router = useRouter();

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

  const renderItem = ({ item }: { item: TStatblock; index: number }): React.ReactElement => (
    <ListItem
      title={`${item.name} (CR ${item.cr})`}
      description={`${item.description}`}
      onPress={() => router.push(`/(tabs)/(home)/monsters/${item.id}`)}
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
