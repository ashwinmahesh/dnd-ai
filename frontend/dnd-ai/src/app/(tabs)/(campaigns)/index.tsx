import { deleteMajorEventDB, getCampaignsDB, TCampaign, updateCampaignDB } from '@/database/campaigns';
import { formatSecondsSinceEpoch, generateRandomString } from '@/utils/string';
import {
  Button,
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
import { Alert, ScrollView } from 'react-native';
import { SelectedCampaignKey } from '@/constants/AsyncStorageKeys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IconButton from '@/components/common/IconButton';
import SelectedCampaignDetails from '@/components/campaigns/SelectedCampaignDetails';

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

const DynamicInputMajorEvents = ({
  handleSave,
  disabled,
}: {
  handleSave: (inputs: string[]) => Promise<void>;
  disabled: boolean;
}) => {
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
              placeholder={`Major Event`}
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
          disabled={disabled}
        />
        {inputs.length > 0 && (
          <IconButton
            icon="checkmark-outline"
            appearance="ghost"
            status="success"
            style={{ flexGrow: 1 }}
            onPress={() =>
              handleSave(inputs).then(() => {
                setInputs([]);
              })
            }
            disabled={disabled}
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

  // Major Event Updaates
  const [updateEventsLoading, setUpdateEventsLoading] = useState(false);
  const [updateEventsErr, setUpdateEventsErr] = useState('');
  const [deleteMajorEventLoading, setDeleteMajorEventLoading] = useState(false);
  const [deleteMajorEventErr, setDeleteMajorEventErr] = useState('');

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

  const handleUpdateMajorEvents = async (entries: string[]) => {
    setUpdateEventsErr('');
    setUpdateEventsLoading(true);
    const selectedCampaign = campaigns[selectedIndex.row];
    console.log('Calling function');
    try {
      await updateCampaignDB(selectedCampaign.id, { major_events: entries });
      campaigns[selectedIndex.row].major_events.push(...entries);
    } catch (err) {
      setUpdateEventsErr(err.toString());
      console.error('Error:', err);
    } finally {
      setUpdateEventsLoading(false);
    }
  };

  const handleMajorEventDelete = async (index: number, item: string) => {
    const selectedCampaign = campaigns[selectedIndex.row];

    const confirm = await new Promise((resolve) => {
      Alert.alert('Confirm Deletion', 'Are you sure you want to delete this major event?', [
        { text: 'Confirm', onPress: () => resolve(true) },
        { text: 'Cancel', onPress: () => resolve(false), style: 'cancel' },
      ]);
    });
    if (!confirm) return;
    try {
      setDeleteMajorEventLoading(true);
      setDeleteMajorEventErr('');
      await deleteMajorEventDB(selectedCampaign.id, item);
      campaigns[selectedIndex.row].major_events = [
        ...campaigns[selectedIndex.row].major_events.slice(0, index),
        ...campaigns[selectedIndex.row].major_events.slice(index + 1),
      ];
    } catch (error) {
      setDeleteMajorEventErr(error);
    } finally {
      setDeleteMajorEventLoading(false);
    }
  };

  const renderMajorEventItem = ({ item, index }: { item: string; index: number }): React.ReactElement => {
    return (
      <ListItem
        title={item}
        key={`major_event_${index}`}
        accessoryLeft={(props) => (
          <Icon
            {...props}
            name="chevron-right-outline"
          />
        )}
        onLongPress={() => {
          handleMajorEventDelete(index, item);
        }}
        disabled={deleteMajorEventLoading}
      />
    );
  };

  const renderPartyMemberItem = ({ item, index }: { item: { memberName: string; details: string }; index: number }) => {
    return (
      <ListItem
        description={item.details}
        title={item.memberName}
        key={`party_member_${index}`}
        accessoryLeft={(props) => (
          <Icon
            {...props}
            name="arrow-right-outline"
          />
        )}
      />
    );
  };

  const renderSelectedCampaignDetails = useCallback(() => {
    if (campaignsLoading || !campaigns?.[selectedIndex.row]) {
      return <></>;
    }
    const selectedCampaign = campaigns[selectedIndex.row];

    console.log('Selected Campaign:', selectedCampaign);

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
        <Text category="label">MAJOR EVENTS</Text>
        {updateEventsErr && <Text status="danger">{updateEventsErr}</Text>}
        {deleteMajorEventErr && <Text status="danger">{deleteMajorEventErr}</Text>}
        <List
          data={selectedCampaign.major_events || []}
          renderItem={renderMajorEventItem}
        />
        <DynamicInputMajorEvents
          handleSave={handleUpdateMajorEvents}
          disabled={updateEventsLoading}
        />
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
          onPress={() => router.push('/(tabs)/(campaigns)/addAdventurer')}
        />
        <Divider />
        <Text category="label">CREATED AT</Text>
        <Text>{formatSecondsSinceEpoch(selectedCampaign.createdAt?.seconds || -1)}</Text>
        <Text
          category="label"
          style={{ marginTop: 12 }}
        >
          LAST UPDATED
        </Text>
        <Text>{formatSecondsSinceEpoch(selectedCampaign.updatedAt?.seconds || -1)}</Text>
      </Layout>
    );
  }, [selectedIndex, campaignsLoading, updateEventsLoading, deleteMajorEventLoading]);

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
        {/* {renderSelectedCampaignDetails()} */}
        <SelectedCampaignDetails
          selectedCampaign={campaigns[selectedIndex.row]}
          selectedIndex={selectedIndex.row}
          updateCampaigns={setCampaigns}
        />
      </ScrollView>
    </Layout>
  );
};

export default Campaigns;
