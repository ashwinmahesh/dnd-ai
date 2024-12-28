import { generateMonsterStatblockAPI } from '@/api/inference';
import { TMonsterStatblock } from '@/api/types';
import useFetch from '@/api/useFetch';
import MonsterStatblock from '@/components/monsters/Statblock';
import { LastGeneratedMonsterStatblock } from '@/constants/AsyncStorageKeys';
import { saveStatblockDB } from '@/database/statblocks';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { Button, Icon, IconElement, Input, Layout, Spinner, Text } from '@ui-kitten/components';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

const LoadingIndicator = (props): React.ReactElement => (
  <View style={[props.style, { justifyContent: 'center', alignItems: 'center' }]}>
    <Spinner size="small" />
  </View>
);

export default function GenerateMonsterStatblock() {
  const { getItem, setItem } = useAsyncStorage(LastGeneratedMonsterStatblock);
  const router = useRouter();

  const [description, setDescription] = useState('');
  const [cr, setCR] = useState('');

  const [saveLoading, setSaveLoading] = useState(false);
  const [saveErr, setSaveErr] = useState('');

  const fetchGenerateStatblock = useFetch(generateMonsterStatblockAPI, {
    onSuccess: async (data) => {
      try {
        await setItem(JSON.stringify({ ...data.data, cr }));
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
        const statblock: TMonsterStatblock & { cr: string } = JSON.parse(data);
        fetchGenerateStatblock.setData((prev) => {
          setCR(statblock.cr);
          if (!prev) return { data: statblock, error: null };

          prev.data = statblock;
          return prev;
        });
      } catch (err) {
        console.error(`failed to parse last statblock. Statblock=${data}\nErr=${err}`);
      }
    });
  }, []);

  const handleGenerate = async () => {
    if (!description || !cr) {
      return;
    }
    fetchGenerateStatblock.execute(description, parseInt(cr));
  };

  const handleSave = async () => {
    if (!fetchGenerateStatblock.data?.data) return;
    try {
      setSaveLoading(true);
      await saveStatblockDB({ ...fetchGenerateStatblock.data.data, cr: parseInt(cr) });
      router.back();
    } catch (err) {
      setSaveErr(err.toString());
    } finally {
      setSaveLoading(false);
    }
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
          <Layout>
            <MonsterStatblock statblock={fetchGenerateStatblock.data.data} />
            <Button
              style={{ marginTop: 6 }}
              onPress={handleSave}
              disabled={saveLoading}
              accessoryLeft={saveLoading ? LoadingIndicator : null}
              status="success"
              appearance="outline"
            >
              {!saveLoading ? 'SAVE' : ''}
            </Button>
            {saveErr && <Text status="danger">{saveErr}</Text>}
          </Layout>
        )}
      </ScrollView>
    </Layout>
  );
}
