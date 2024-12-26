import { createCampaignDB, getCampaignsDB, TCampaign } from '@/database/campaigns';
import { generateRandomString } from '@/utils/string';
import { Button, Icon, IconElement, IndexPath, Layout, Select, SelectItem, Text } from '@ui-kitten/components';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';

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

  const [selectedIndex, setSelectedIndex] = useState<IndexPath>(new IndexPath(0));

  const router = useRouter();

  const getCampaigns = async () => {
    try {
      setCampaignsLoading(true);
      setFetchCampaignsErr('');
      let res = await getCampaignsDB();
      setCampaigns(res);
    } catch (err) {
      setFetchCampaignsErr(err.toString());
    } finally {
      setCampaignsLoading(false);
    }
  };

  useEffect(() => {
    getCampaigns();
  }, []);

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
          onSelect={(index: IndexPath) => {
            setSelectedIndex(index);
          }}
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
      {/* <Button
        onPress={() => {
          createCampaignDB({ name: 'Frontend Test', overview: 'Something happens' });
        }}
      >
        Click
      </Button> */}
      <ScrollView></ScrollView>
    </Layout>
  );
};

export default Campaigns;
