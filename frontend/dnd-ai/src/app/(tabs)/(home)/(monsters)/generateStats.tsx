import { generateMonsterStatblockAPI } from '@/api/inference';
import { ActionStatus, MonsterStatblock } from '@/api/types';
import useFetch from '@/api/useFetch';
import { LastGeneratedMonsterStatblock } from '@/constants/AsyncStorageKeys';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { Button, Divider, Input, Layout, Spinner, Text } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import { ImageProps, ScrollView, View, ViewProps } from 'react-native';

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
        const statblock: MonsterStatblock = JSON.parse(data);
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

  const renderMonsterDetails = () => {
    const statblock = fetchGenerateStatblock.data.data;

    const renderStats = () => {
      const abilities = statblock.abilities;
      const output: React.ReactElement[] = []; // 2 rows

      function getModifier(val: number) {
        const modifier = Math.floor((val - 10) / 2);
        return modifier >= 0 ? `+${modifier}` : `${modifier}`;
      }
      // row 1 = STR, DEX, CON
      // row 2 = WIS, INT, CHA

      output.push(
        <Layout style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 48 }}>
          <Layout style={{ width: 60 }}>
            <Text category="label">STR</Text>
            <Text>
              {abilities['strength']} {`(${getModifier(abilities['strength'])})`}
            </Text>
          </Layout>
          <Layout style={{ width: 60 }}>
            <Text category="label">DEX</Text>
            <Text>
              {abilities['dexterity']} {`(${getModifier(abilities['dexterity'])})`}
            </Text>
          </Layout>
          <Layout style={{ width: 60 }}>
            <Text category="label">CON</Text>
            <Text>
              {abilities['constitution']} {`(${getModifier(abilities['constitution'])})`}
            </Text>
          </Layout>
        </Layout>
      );
      output.push(
        <Layout style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 48 }}>
          <Layout style={{ width: 60 }}>
            <Text category="label">WIS</Text>
            <Text>
              {abilities['wisdom']} {`(${getModifier(abilities['wisdom'])})`}
            </Text>
          </Layout>
          <Layout style={{ width: 60 }}>
            <Text category="label">INT</Text>
            <Text>
              {abilities['intelligence']} {`(${getModifier(abilities['intelligence'])})`}
            </Text>
          </Layout>
          <Layout style={{ width: 60 }}>
            <Text category="label">CHA</Text>
            <Text>
              {abilities['charisma']} {`(${getModifier(abilities['charisma'])})`}
            </Text>
          </Layout>
        </Layout>
      );
      return output;
    };

    return (
      <Layout>
        <Divider style={{ marginVertical: 12 }} />
        <Text category="h5">{statblock.name}</Text>
        <Text category="p2">
          {statblock.size} {statblock.type}, {statblock.alignment}
        </Text>
        <Text>
          AC: {statblock.armor_class} | HP: {statblock.hit_points} ({statblock.hit_dice})
        </Text>
        <Text>
          Speed:{' '}
          {Object.keys(statblock.speed)
            .map((motion) => `${motion} ${statblock.speed[motion]} ft.`)
            .join(',')}
        </Text>
        <Divider style={{ marginVertical: 12 }} />

        <Layout style={{ gap: 12 }}>{renderStats()}</Layout>
        <Divider style={{ marginVertical: 12 }} />
      </Layout>
    );
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
        {
          fetchGenerateStatblock.data?.data &&
            // <Text>{JSON.stringify(fetchGenerateStatblock.data.data)}</Text>
            renderMonsterDetails()
          // renderMonsterDetails()
        }
      </ScrollView>
    </Layout>
  );
}
