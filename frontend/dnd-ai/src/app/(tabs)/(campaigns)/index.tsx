import { createCampaignDB, getCampaignsDB, TCampaign } from '@/database/campaigns';
import { Button, Icon, IconElement, IndexPath, Layout, Select, SelectItem, Text } from '@ui-kitten/components';
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
      <Layout style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Select
          label="Current Campaign"
          selectedIndex={selectedIndex}
          onSelect={(index: IndexPath) => {
            setSelectedIndex(index);
          }}
          disabled={campaignsLoading || !!fetchCampaignsErr}
          value={campaigns[selectedIndex.row].name || 'No Campaign Selected'}
          style={{ flexGrow: 1 }}
        >
          {campaigns.map((c) => {
            return (
              <SelectItem
                title={c.name}
                accessoryLeft={StarIcon}
              />
            );
          })}
        </Select>
        <Button
          appearance="outline"
          accessoryLeft={PlusIcon}
        />
      </Layout>
      <Button
        onPress={() => {
          createCampaignDB({ name: 'Frontend Test', overview: 'Something happens' });
        }}
      >
        Click
      </Button>
      <ScrollView></ScrollView>
    </Layout>
  );
};

export default Campaigns;
