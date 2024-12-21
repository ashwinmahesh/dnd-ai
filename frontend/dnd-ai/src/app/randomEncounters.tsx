import React, { useState } from 'react';
import { getRandomEncounters, getRandomNamesAPI } from '../api/inference';
import {
  Button,
  Input,
  Layout,
  List,
  ListItem,
  Divider,
  Spinner,
  Select,
  SelectItem,
  IndexPath,
  Text,
} from '@ui-kitten/components';
import useFetch from '@/api/useFetch';
import { ActionStatus } from '@/api/types';

const RandomEncounters = () => {
  const [partyLevel, setPartyLevel] = useState<IndexPath>(new IndexPath(0));
  const [numEncounters, setNumEncounters] = useState<IndexPath>(new IndexPath(9));
  const [scenario, setScenario] = useState('');

  const fetchRandomEncounters = useFetch(getRandomEncounters);

  const renderItem = ({
    item,
    index,
  }: {
    item: { encounter: string; context: string };
    index: number;
  }): React.ReactElement => {
    return (
      <ListItem
        title={`${index + 1} | ${item.encounter}`}
        description={item.context}
      />
    );
  };

  return (
    <Layout className="flex-1 px-3 py-3">
      <Layout>
        <Select
          label={'Party Level'}
          selectedIndex={partyLevel}
          onSelect={(idx: IndexPath) => setPartyLevel(idx)}
          value={partyLevel.row + 1}
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <SelectItem title={`${i + 1}`} />
          ))}
        </Select>
        <Select
          className="mt-3"
          label={'Num Encounters'}
          selectedIndex={numEncounters}
          onSelect={(idx: IndexPath) => setNumEncounters(idx)}
          value={numEncounters.row + 1}
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <SelectItem title={`${i + 1}`} />
          ))}
        </Select>
        <Input
          label="Scenario"
          value={scenario}
          onChangeText={setScenario}
        />
        <Button
          className="mt-3"
          onPress={() =>
            fetchRandomEncounters.execute({
              party_level: partyLevel.row + 1,
              num_encounters: numEncounters.row + 1,
              scenario,
            })
          }
        >
          Generate
        </Button>
      </Layout>
      {fetchRandomEncounters.isLoading && (
        <Layout className="flex-1 flex justify-middle items-center pt-6">
          <Spinner
            size="giant"
            className="mt-6"
          />
        </Layout>
      )}
      {fetchRandomEncounters.error && (
        <Layout className="flex-1 flex justify-middle items-center pt-6">
          <Text status="danger">{fetchRandomEncounters.error}</Text>
        </Layout>
      )}
      {fetchRandomEncounters.status === ActionStatus.FULFILLED && (
        <List
          data={fetchRandomEncounters.data.data}
          ItemSeparatorComponent={Divider}
          renderItem={renderItem}
        />
      )}
    </Layout>
  );
};

export default RandomEncounters;
