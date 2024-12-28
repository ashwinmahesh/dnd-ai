import { generateMonsterStatblockAPI } from '@/api/inference';
import { ActionStatus } from '@/api/types';
import useFetch from '@/api/useFetch';
import { Button, Divider, Input, Layout, Spinner, Text } from '@ui-kitten/components';
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

  const renderMonsterDetails = () => {
    const statblock = fetchGenerateStatblock.data.data;

    const renderStats = () => {
      const abilities = statblock.abilities;
      const output: React.ReactElement[] = [];

      Object.keys(abilities).map((ability) => {
        const modifier = Math.floor((abilities[ability] - 10) / 2);
        const modifierStr = modifier >= 0 ? `+${modifier}` : `${modifier}`;

        return (
          <Layout style={{ alignItems: 'flex-start', flexDirection: 'row' }}>
            <Text category="label">{ability.substring(0, 3).toUpperCase()}</Text>
            <Text>
              {abilities[ability]} {`(${modifierStr})`}
            </Text>
          </Layout>
        );
      });

      return output;
    };

    return (
      <Layout>
        <Divider />
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
        <Divider />

        <Layout style={{ flexDirection: 'row' }}></Layout>
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
          fetchGenerateStatblock.status == ActionStatus.FULFILLED &&
            // <Text>{JSON.stringify(fetchGenerateStatblock.data.data)}</Text>
            renderMonsterDetails()
          // renderMonsterDetails()
        }
      </ScrollView>
    </Layout>
  );
}
