import { createCampaignDB, getCampaignsDB, TCampaign, updateCampaignDB } from '@/database/campaigns';
import { formatTimestamp, generateRandomString } from '@/utils/string';
import {
  Button,
  Card,
  Divider,
  Icon,
  IconElement,
  IndexPath,
  Input,
  Layout,
  List,
  ListItem,
  Modal,
  Select,
  SelectItem,
  Text,
} from '@ui-kitten/components';
import { useRouter, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { SelectedCampaignKey } from '@/constants/AsyncStorageKeys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IconButton from '@/components/common/IconButton';

const StarIcon = (props): IconElement => (
  <Icon
    {...props}
    name="star"
  />
);

const PlusIcon = (props): IconElement => (
  <Icon
    {...props}
    name="plus"
  />
);

const DynamicInputMajorEvents = ({ handleSave }: { handleSave: (inputs: string[]) => void }) => {
  const [inputs, setInputs] = useState<string[]>([]);

  const addInputField = () => {
    setInputs((prev) => [...prev, '']);
  };

  const updateInput = (val: string, index: number) => {
    setInputs((prev) => {
      const newInputs = [...prev];
      newInputs[index] = val;
      return newInputs;
    });
  };

  const removeInputField = (idx: number) => {
    setInputs((prev) => {
      return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
    });
  };

  return (
    <Layout>
      {inputs.map((input, idx) => {
        return (
          <Layout style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Input
              placeholder={`Major Event ${idx + 1}`}
              value={input}
              onChangeText={(text) => updateInput(text, idx)}
              style={{ marginBottom: 12, flexGrow: 1 }}
              textStyle={{ minHeight: 60 }}
              multiline
            />
            <IconButton
              icon="close-outline"
              size="small"
              appearance="ghost"
              onPress={() => removeInputField(idx)}
            />
          </Layout>
        );
      })}
      <Layout style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
        <IconButton
          appearance="ghost"
          status="basic"
          onPress={addInputField}
          style={{ flexGrow: 1 }}
          icon="plus"
        />
        {inputs.length > 0 && (
          <IconButton
            icon="checkmark-outline"
            appearance="ghost"
            status="success"
            style={{ flexGrow: 1 }}
            onPress={() => handleSave(inputs)}
          />
        )}
      </Layout>
    </Layout>
  );
};

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<TCampaign[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [fetchCampaignsErr, setFetchCampaignsErr] = useState('');

  const [selectedIndex, setSelectedIndex] = useState<IndexPath>(new IndexPath(-1));

  const router = useRouter();

  const getCampaigns = async () => {
    try {
      setCampaignsLoading(true);
      setFetchCampaignsErr('');
      let res = await getCampaignsDB();
      setCampaigns(res);
      // Find current selected
      try {
        const storedCampaignNameBlob = await AsyncStorage.getItem(SelectedCampaignKey);
        if (storedCampaignNameBlob) {
          const storedCampaignName = storedCampaignNameBlob;
          const idx = res.findIndex((campaign) => campaign.name === storedCampaignName);
          if (idx >= 0) setSelectedIndex(new IndexPath(idx));
        }
      } catch (err) {
        console.error('Failed to get selected campaign Index');
      }
    } catch (err) {
      setFetchCampaignsErr(err.toString());
    } finally {
      setCampaignsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getCampaigns();
    }, [])
  );

  const onUpdateSelectedCampaign = (index: IndexPath) => {
    setSelectedIndex(index);
    const selectedValue = campaigns[index.row]?.name;
    if (!selectedValue) return;
    AsyncStorage.setItem(SelectedCampaignKey, selectedValue).catch((err) => {
      console.error(`Failed to update selected index to ${index.row}: ${err}`);
    });
  };

  const handleUpdateMajorEvents = (entries: string[]) => {
    const selectedCampaign = campaigns[selectedIndex.row];
    try {
      updateCampaignDB(selectedCampaign.id, { major_events: entries });
    } catch (err) {}
  };

  const renderMajorEventItem = ({ item, index }: { item: string; index: number }): React.ReactElement => {
    return (
      <ListItem
        description={item}
        key={`major_event_${index}`}
        accessoryLeft={StarIcon}
      />
    );
  };

  const renderPartyMemberItem = ({ item, index }: { item: { memberName: string; details: string }; index: number }) => {
    return (
      <ListItem
        description={item.details}
        title={item.memberName}
        key={`party_member_${index}`}
        accessoryLeft={StarIcon}
      />
    );
  };

  const renderSelectedCampaignDetails = useCallback(() => {
    if (campaignsLoading || !campaigns?.[selectedIndex.row]) {
      return <></>;
    }
    const selectedCampaign = campaigns[selectedIndex.row];

    return (
      <Layout style={{ display: 'flex', gap: 12, padding: 12 }}>
        <Text
          category="label"
          style={{ marginBottom: 12 }}
        >
          CAMPAIGN OVERVIEW
        </Text>
        <Text>{selectedCampaign.overview}</Text>
        <Divider />
        <Text
          category="label"
          style={{ marginBottom: 12 }}
        >
          MAJOR EVENTS
        </Text>
        <List
          data={selectedCampaign.major_events || []}
          renderItem={renderMajorEventItem}
        />
        <DynamicInputMajorEvents handleSave={handleUpdateMajorEvents} />
        <Divider />
        <Text
          category="label"
          style={{ marginBottom: 12 }}
        >
          ADVENTURERS
        </Text>
        <List
          data={
            Object.keys(selectedCampaign.members || []).map((memberName) => ({
              memberName,
              details: selectedCampaign.members[memberName],
            })) || []
          }
          renderItem={renderPartyMemberItem}
        />
        <Button
          accessoryLeft={PlusIcon}
          appearance="ghost"
          status="basic"
        />
        <Divider />
        <Text category="label">CREATED AT</Text>
        <Text>{formatTimestamp(selectedCampaign.createdAt)}</Text>
        <Text
          category="label"
          style={{ marginTop: 12 }}
        >
          LAST UPDATED
        </Text>
        <Text>{formatTimestamp(selectedCampaign.updatedAt)}</Text>
      </Layout>
    );
  }, [selectedIndex, campaignsLoading]);

  return (
    <Layout style={{ flex: 1, padding: 6 }}>
      <ScrollView>
        <Layout
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: 12,
          }}
        >
          <Select
            label="Current Campaign"
            selectedIndex={selectedIndex}
            onSelect={onUpdateSelectedCampaign}
            disabled={campaignsLoading || !!fetchCampaignsErr}
            value={campaigns[selectedIndex.row]?.name || 'No Campaign Selected'}
            style={{ flexGrow: 1 }}
          >
            {campaigns.map((c) => {
              return (
                <SelectItem
                  title={c.name}
                  accessoryLeft={StarIcon}
                  key={c.name + generateRandomString(4)}
                />
              );
            })}
          </Select>
          <Button
            appearance="outline"
            accessoryLeft={PlusIcon}
            style={{ marginLeft: 12 }}
            onPress={() => {
              router.push('/(tabs)/(campaigns)/createCampaign');
            }}
          />
        </Layout>
        {renderSelectedCampaignDetails()}
      </ScrollView>
    </Layout>
  );
};

export default Campaigns;
