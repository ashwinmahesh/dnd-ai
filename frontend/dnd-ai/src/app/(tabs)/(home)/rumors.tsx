import { generateRumors, TGenRumorsAPI } from '@/api/inference';
import useFetch from '@/api/useFetch';
import LoadingButton from '@/components/common/LoadingButton';
import { LastGeneratedRumors } from '@/constants/AsyncStorageKeys';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { Divider, Input, Layout, Text } from '@ui-kitten/components';
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

  return (
    <Layout style={{ flex: 1, padding: 12 }}>
      <ScrollView>
        <Layout style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 16 }}>
          <Input
            value={quest_giver}
            onChangeText={setQuestGiver}
            label="Quest Giver"
            style={{ flex: 1, flexShrink: 0 }}
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
            alignItems: 'flex-start',
            gap: 16,
            marginTop: 8,
          }}
        >
          <Input
            value={location}
            onChangeText={setLocation}
            label="Location"
            style={{ flex: 1, flexShrink: 0 }}
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
          <Layout>
            {fetchRumors.data.data.map((rumor, idx) => {
              return (
                <Layout>
                  <Divider />
                  <Layout style={{ flexDirection: 'row', alignItems: 'center', gap: 18, paddingVertical: 18 }}>
                    <Text category="h6">{idx + 1}</Text>
                    <Layout style={{ flex: 1 }}>
                      <Text category="s1">"{rumor.rumor}"</Text>
                      <Text
                        category="label"
                        style={{ marginTop: 12, marginBottom: 6 }}
                      >
                        Quest Hook
                      </Text>
                      <Text category="p2">{rumor.quest_hook}</Text>
                      <Text
                        category="label"
                        style={{ marginTop: 12, marginBottom: 6 }}
                      >
                        Objective
                      </Text>
                      <Text category="p2">{rumor.quest_objective}</Text>
                    </Layout>
                  </Layout>
                </Layout>
              );
            })}
          </Layout>
        )}
      </ScrollView>
    </Layout>
  );
}
