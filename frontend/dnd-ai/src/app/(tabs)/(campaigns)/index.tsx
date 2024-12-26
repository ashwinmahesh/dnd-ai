import { createCampaignDB, getCampaignsDB, TCampaign } from '@/database/campaigns';
import { generateRandomString } from '@/utils/string';
import {
  Button,
  Card,
  Icon,
  IconElement,
  IndexPath,
  Layout,
  List,
  ListItem,
  Select,
  SelectItem,
  Text,
} from '@ui-kitten/components';
import { useRouter, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { SelectedCampaignKey } from '@/constants/AsyncStorageKeys';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      <Layout style={{ display: 'flex', gap: 12 }}>
        <Card>
          <Text
            category="label"
            style={{ marginBottom: 12 }}
          >
            CAMPAIGN OVERVIEW
          </Text>
          <Text>{selectedCampaign.overview}</Text>
        </Card>
        <Card>
          <Text
            category="label"
            style={{ marginBottom: 12 }}
          >
            MAJOR EVENTS
          </Text>
          <ScrollView style={{ maxHeight: 180 }}>
            <List
              data={selectedCampaign.major_events || []}
              renderItem={renderMajorEventItem}
            />
            <Button
              accessoryLeft={PlusIcon}
              appearance="ghost"
              status="basic"
            />
          </ScrollView>
        </Card>
        <Card>
          <Text
            category="label"
            style={{ marginBottom: 12 }}
          >
            ADVENTURERS
          </Text>
          <ScrollView style={{ maxHeight: 180 }}>
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
          </ScrollView>
        </Card>
        <Card>
          <Text category="label">CREATED AT</Text>
          <Text>{selectedCampaign.createdAt}</Text>
          <Text
            category="label"
            style={{ marginTop: 12 }}
          >
            LAST UPDATED
          </Text>
          <Text>{selectedCampaign.updatedAt}</Text>
        </Card>
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
