import React, { useEffect, useState } from 'react';
import { getRandomNamesAPI } from '../../../api/inference';
import { Button, Input, Layout, List, ListItem, Divider, Spinner, Text } from '@ui-kitten/components';
import { ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LastRandomNamesKey } from '@/constants/AsyncStorageKeys';

// const storageKey = 'RANDOM_NAMES';

const RandomNames = () => {
  const [loading, setLoading] = useState(true);
  const [randomNames, setRandomNames] = useState<{ title: string }[]>([]);
  const [description, setDescription] = useState('');

  useEffect(() => {
    AsyncStorage.getItem(LastRandomNamesKey)
      .then((namesStr?: string) => {
        if (!namesStr) {
          return;
        }
        setRandomNames(JSON.parse(namesStr));
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getRandomNames = async () => {
    setLoading(true);
    try {
      const names = await getRandomNamesAPI({ descriptor: description });
      const mappedNames = names.map((name) => {
        return { title: name };
      });
      setRandomNames(mappedNames);
      try {
        await AsyncStorage.setItem(LastRandomNamesKey, JSON.stringify(mappedNames));
      } catch (err) {
        console.error('failed to store last retrieved random names in async storage: %v', err);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item, index }: { item: { title: string }; index: number }): React.ReactElement => {
    return (
      <ListItem
        title={`${item.title}`}
        key={item.title}
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
    <Layout
      className="flex-1 px-3 py-3"
      style={{ flex: 1, paddingHorizontal: 12, paddingVertical: 12 }}
    >
      <ScrollView style={{ flex: 1 }}>
        <Layout
          className="flex"
          style={{ display: 'flex', flex: 1 }}
        >
          <Input
            placeholder={'One Word Description'}
            value={description}
            onChangeText={setDescription}
          />
          <Button
            onPress={getRandomNames}
            style={{ marginTop: 6 }}
          >
            Generate
          </Button>
        </Layout>
        {loading ? (
          <Layout
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 18,
              flexDirection: 'row',
            }}
          >
            <Spinner
              size="giant"
              style={{ marginTop: 3 }}
            />
          </Layout>
        ) : (
          <List
            data={randomNames}
            renderItem={renderItem}
            ItemSeparatorComponent={Divider}
          />
        )}
      </ScrollView>
    </Layout>
  );
};

export default RandomNames;
