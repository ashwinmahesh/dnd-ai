import { addOrUpdateAdventurerDB } from '@/database/campaigns';
import { Button, Input, Layout, Text } from '@ui-kitten/components';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';

export default function AddAdventurer() {
  const { campaignID }: { campaignID: string } = useLocalSearchParams();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [apiError, setAPIError] = useState('');

  const router = useRouter();

  const addAdventurer = async () => {
    setLoading(true);
    setAPIError('');
    try {
      await addOrUpdateAdventurerDB(campaignID, name, description);
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
        placeholder="Adventurer Name"
        style={{ marginTop: 32 }}
      />
      <Input
        value={description}
        onChangeText={setDescription}
        placeholder="Story"
        caption="This information will be provided as context to all inference requests made. The better the description, the better the results"
        multiline
        textStyle={{ minHeight: 128 }}
      />
      <Button
        onPress={addAdventurer}
        disabled={loading}
      >
        Create
      </Button>
      <Text status="danger">{apiError}</Text>
    </Layout>
  );
}
