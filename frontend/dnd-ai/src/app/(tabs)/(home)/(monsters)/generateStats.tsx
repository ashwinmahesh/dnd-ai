import { generateMonsterStatblockAPI } from '@/api/inference';
import { ActionStatus } from '@/api/types';
import useFetch from '@/api/useFetch';
import { Button, Input, Layout, Spinner, Text } from '@ui-kitten/components';
import React, { useState } from 'react';
import { ImageProps, ScrollView, View, ViewProps } from 'react-native';

const LoadingIndicator = (props): React.ReactElement => (
  <View style={[props.style, { justifyContent: 'center', alignItems: 'center' }]}>
    <Spinner size="small" />
  </View>
);

export default function GenerateMonsterStatblock() {
  const fetchGenerateStatblock = useFetch(generateMonsterStatblockAPI);
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
        {fetchGenerateStatblock.status == ActionStatus.FULFILLED && (
          <Text>{JSON.stringify(fetchGenerateStatblock.data.data)}</Text>
        )}
      </ScrollView>
    </Layout>
  );
}
