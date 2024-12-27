import { createCampaignDB } from '@/database/campaigns';
import { Button, Input, Layout, Text } from '@ui-kitten/components';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SelectedCampaignKey } from '@/constants/AsyncStorageKeys';

export default function CreateCampaign() {
  const [name, setName] = useState('');
  const [overview, setOverview] = useState('');

  const [loading, setLoading] = useState(false);
  const [apiError, setAPIError] = useState('');

  const router = useRouter();

  const createCampaign = async () => {
    setLoading(true);
    setAPIError('');
    try {
      const docID = await createCampaignDB({ name, overview, major_events: [], members: {} });
      try {
        await AsyncStorage.setItem(SelectedCampaignKey, docID);
      } catch (err) {
        console.error('Failed to update selected campaign: ', err);
      }
      router.back();
    } catch (err) {
      setAPIError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ flex: 1, padding: 12, display: 'flex', gap: 12 }}>
      <Input
        value={name}
        onChangeText={setName}
        placeholder="Campaign Name"
        style={{ marginTop: 32 }}
      />
      <Input
        value={overview}
        onChangeText={setOverview}
        placeholder="Campaign Overview"
        caption="This information will be provided as context to all inference requests made. The better the description, the better the results"
        multiline
        textStyle={{ minHeight: 128 }}
      />
      <Button
        onPress={createCampaign}
        disabled={loading}
      >
        Create
      </Button>
      <Text status="danger">{apiError}</Text>
    </Layout>
  );
}
