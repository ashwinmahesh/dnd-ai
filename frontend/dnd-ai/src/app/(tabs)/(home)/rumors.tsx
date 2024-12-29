import { generateRumors, TGenRumorsAPI } from '@/api/inference';
import useFetch from '@/api/useFetch';
import LoadingButton from '@/components/common/LoadingButton';
import { LastGeneratedRumors } from '@/constants/AsyncStorageKeys';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { Divider, Input, Layout, List, ListItem, Text } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';

export default function Rumors() {
  const [party_level, setPartyLevel] = useState('1');
  const [location, setLocation] = useState('');
  const [quest_giver, setQuestGiver] = useState('');
  const [num_rumors, setNumRumors] = useState('6');

  const { getItem, setItem } = useAsyncStorage(LastGeneratedRumors);

  const fetchRumors = useFetch(generateRumors, {
    onSuccess: async (data) => {
      try {
        await setItem(JSON.stringify(data.data));
      } catch (err) {
        console.error('failed to store rumors: ', err);
      }
    },
  });

  useEffect(() => {
    getItem()
      .then((blob) => {
        if (!blob) return;
        try {
          const rumors: TGenRumorsAPI = JSON.parse(blob);
          fetchRumors.setData((prev) => {
            if (!prev) return { data: rumors, error: undefined };

            prev.data = rumors;
            return prev;
          });
        } catch (err) {
          console.error('failed to parse stored rumors:', blob, ', err:', err);
        }
      })
      .catch((err) => {
        console.error('failed to load rumors from storage');
      });
  }, []);

  const renderItem = ({ item, index }: { item: TGenRumorsAPI[number]; index: number }): React.ReactElement => {
    return (
      <ListItem
        title={`${item.rumor}`}
        description={(props) => {
          return (
            <Layout>
              <Text {...props}>Quest Hook - {item.quest_hook}</Text>
              <Text {...props}>Objective - {item.quest_objective}</Text>
            </Layout>
          );
        }}
        key={`rumor_${item.rumor}`}
        accessoryLeft={(props) => (
          <Text
            {...props}
            category="h6"
          >
            {index + 1}
          </Text>
        )}
      />
    );
  };

  return (
    <Layout style={{ flex: 1, padding: 12 }}>
      <ScrollView>
        <Layout style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 16 }}>
          <Input
            value={quest_giver}
            onChangeText={setQuestGiver}
            label="Quest Giver"
            style={{ flexGrow: 1 }}
            multiline
          />
          <Input
            value={num_rumors}
            onChangeText={setNumRumors}
            label="Count"
            keyboardType="numeric"
            style={{ width: 60 }}
          />
        </Layout>
        <Layout
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: 16,
            marginTop: 8,
          }}
        >
          <Input
            value={location}
            onChangeText={setLocation}
            label="Location"
            style={{ flexGrow: 1 }}
            multiline
          />
          <Input
            value={party_level}
            onChangeText={setPartyLevel}
            label="Level"
            keyboardType="numeric"
            style={{ width: 60 }}
          />
        </Layout>
        <LoadingButton
          onPress={() =>
            fetchRumors.execute({
              party_level: parseInt(party_level),
              location,
              quest_giver,
              num_rumors: parseInt(num_rumors) || undefined,
            })
          }
          style={{ marginTop: 16 }}
          loading={fetchRumors.isLoading}
        >
          Generate
        </LoadingButton>
        {fetchRumors.error && <Text status="danger">{fetchRumors.error}</Text>}
        {fetchRumors.data?.data && (
          <List
            ItemSeparatorComponent={Divider}
            data={fetchRumors.data.data}
            renderItem={renderItem}
          />
        )}
      </ScrollView>
    </Layout>
  );
}
