import { generateMonsterStatblockAPI } from '@/api/inference';
import { TMonsterStatblock } from '@/api/types';
import useFetch from '@/api/useFetch';
import MonsterStatblock from '@/components/monsters/Statblock';
import { LastGeneratedMonsterStatblock } from '@/constants/AsyncStorageKeys';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { Button, Input, Layout, Spinner, Text } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

const LoadingIndicator = (props): React.ReactElement => (
  <View style={[props.style, { justifyContent: 'center', alignItems: 'center' }]}>
    <Spinner size="small" />
  </View>
);

export default function GenerateMonsterStatblock() {
  const { getItem, setItem } = useAsyncStorage(LastGeneratedMonsterStatblock);

  const fetchGenerateStatblock = useFetch(generateMonsterStatblockAPI, {
    onSuccess: async (data) => {
      try {
        await setItem(JSON.stringify(data.data));
      } catch (err) {
        console.error('Failed to store last generated statblock: ', err);
      }
    },
  });

  useEffect(() => {
    getItem((err, data) => {
      if (err) console.error('failed to get last statblock from storage:', err);
      if (!data) return;
      try {
        const statblock: TMonsterStatblock = JSON.parse(data);
        fetchGenerateStatblock.setData((prev) => {
          if (!prev) return { data: statblock, error: null };

          prev.data = statblock;
          return prev;
        });
      } catch (err) {
        console.error(`failed to parse last statblock. Statblock=${data}\nErr=${err}`);
      }
    });
  }, []);

  const [description, setDescription] = useState('');
  const [cr, setCR] = useState('');

  const handleGenerate = async () => {
    if (!description || !cr) {
      return;
    }
    fetchGenerateStatblock.execute(description, parseInt(cr));
  };

  return (
    <Layout style={{ flex: 1, padding: 12 }}>
      <ScrollView>
        <Layout style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
          <Input
            multiline
            style={{ flex: 5 }}
            value={description}
            onChangeText={setDescription}
            placeholder="What sort of monster?"
            label="Monster Description"
          />
          <Input
            label="CR"
            style={{ flex: 1 }}
            value={cr}
            onChangeText={setCR}
            keyboardType="numeric"
          />
        </Layout>
        <Button
          style={{ marginTop: 6 }}
          onPress={handleGenerate}
          disabled={fetchGenerateStatblock.isLoading}
          accessoryLeft={fetchGenerateStatblock.isLoading ? LoadingIndicator : null}
        >
          {!fetchGenerateStatblock.isLoading ? 'Generate' : ''}
        </Button>
        {fetchGenerateStatblock.error && <Text status="danger">{fetchGenerateStatblock.error}</Text>}
        {fetchGenerateStatblock.data?.data && (
          // <Text>{JSON.stringify(fetchGenerateStatblock.data.data)}</Text>
          <MonsterStatblock statblock={fetchGenerateStatblock.data.data} />
        )}
      </ScrollView>
    </Layout>
  );
}
