import { generateLootTableAPI } from '@/api/inference';
import useFetch from '@/api/useFetch';
import LoadingButton from '@/components/common/LoadingButton';
import { LastGeneratedLootTable } from '@/constants/AsyncStorageKeys';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import {
  Button,
  CheckBox,
  Divider,
  IndexPath,
  Input,
  Layout,
  List,
  ListItem,
  Select,
  SelectItem,
  Text,
} from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';

const rarities = ['Common', 'Uncommon', 'Rare', 'Very Rare', 'Legendary'];

export default function LootTable() {
  const [selectedIndex, setSelectedIndex] = useState<IndexPath[]>([new IndexPath(1)]);
  const [crMin, setCrMin] = useState('1');
  const [crMax, setCrMax] = useState('');
  const [valMin, setValMin] = useState('50');
  const [valMax, setValMax] = useState('');
  const [includeMagicItems, setIncludeMagicItems] = useState(false);
  const [context, setContext] = useState('');

  const selectedRarities = selectedIndex.map((idx) => rarities[idx.row]);

  const { getItem, setItem } = useAsyncStorage(LastGeneratedLootTable);

  const fetchGenLootTable = useFetch(generateLootTableAPI, {
    onSuccess: async (data) => {
      try {
        await setItem(JSON.stringify(data.data));
      } catch (err) {
        console.error(`failed to store ${LastGeneratedLootTable} in storage`);
      }
    },
  });

  useEffect(() => {
    getItem().then((blob) => {
      if (!blob) return;
      fetchGenLootTable.setData((prev) => {
        const table = JSON.parse(blob);
        if (!prev) return { data: table, error: undefined };

        prev.data = table;
        return prev;
      });
    });
  }, []);

  const handleGenerate = async () => {
    if (!parseInt(crMin) || !parseInt(valMin)) {
      fetchGenLootTable.setError('CR Min and Val Min are required.');
      return;
    }
    fetchGenLootTable.execute({
      loot_cr_min: parseInt(crMin),
      loot_cr_max: parseInt(crMax) ? parseInt(crMax) : undefined,
      loot_val_min: parseInt(valMin),
      loot_val_max: parseInt(valMax) ? parseInt(valMax) : undefined,
      include_magic_items: includeMagicItems,
      context: context,
    });
  };

  const renderItem = ({ item, index }: { item: string; index: number }): React.ReactElement => {
    return (
      <ListItem
        title={`${item}`}
        key={item}
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
        <Text
          category="h5"
          style={{}}
        >
          Loot Tables
        </Text>
        <Layout
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 12,
            paddingVertical: 6,
          }}
        >
          <Input
            label="CR Min"
            style={{ flexGrow: 1 }}
            value={crMin}
            onChangeText={setCrMin}
            keyboardType="numeric"
          />
          <Input
            label="CR Max"
            style={{ flexGrow: 1 }}
            caption="Optional"
            value={crMax}
            onChangeText={setCrMax}
            keyboardType="numeric"
          />
          <Input
            label="Val Min (gp)"
            style={{ flexGrow: 1 }}
            value={valMin}
            onChangeText={setValMin}
            keyboardType="numeric"
          />
          <Input
            label="Val Max (gp)"
            style={{ flexGrow: 1 }}
            caption="Optional"
            onChangeText={setValMax}
            keyboardType="numeric"
            value={valMax}
          />
        </Layout>
        <Layout style={{ marginTop: 6 }}>
          <Layout style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 12 }}>
            <Select
              multiSelect
              selectedIndex={selectedIndex}
              onSelect={(index: IndexPath[]) => setSelectedIndex(index)}
              value={selectedRarities.join(', ')}
              label="Magic Item Rarities"
              style={{ flexGrow: 1 }}
            >
              {rarities.map((rarity) => (
                <SelectItem title={rarity} />
              ))}
            </Select>
            <CheckBox
              checked={includeMagicItems}
              onChange={(checked) => setIncludeMagicItems(checked)}
            >
              Include Magic Items
            </CheckBox>
          </Layout>
        </Layout>
        <Input
          multiline
          label="Area / Monster Descripton"
          style={{ marginTop: 12 }}
          placeholder="Optional"
          caption={'(Optional) Description of where the loot will be found'}
          value={context}
          onChangeText={setContext}
        />
        <LoadingButton
          style={{ marginTop: 12 }}
          onPress={handleGenerate}
          loading={fetchGenLootTable.isLoading}
        >
          Generate
        </LoadingButton>
        {fetchGenLootTable.error && <Text status="danger">{fetchGenLootTable.error}</Text>}
        {fetchGenLootTable.data?.data && (
          <List
            data={fetchGenLootTable.data.data}
            renderItem={renderItem}
            ItemSeparatorComponent={Divider}
          />
        )}
      </ScrollView>
    </Layout>
  );
}
