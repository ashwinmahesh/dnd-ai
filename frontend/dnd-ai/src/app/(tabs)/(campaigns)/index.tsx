import { createCampaignDB, getCampaignsDB, TCampaign } from '@/database/campaigns';
import { generateRandomString } from '@/utils/string';
import { Button, Icon, IconElement, IndexPath, Layout, Select, SelectItem, Text } from '@ui-kitten/components';
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

  return (
    <Layout style={{ flex: 1, padding: 6 }}>
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
    </Layout>
  );
};

export default Campaigns;
