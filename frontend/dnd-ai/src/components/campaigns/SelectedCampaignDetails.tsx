import { deleteAdventurerDB, deleteMajorEventDB, TCampaign, updateCampaignDB } from '@/database/campaigns';
import { formatSecondsSinceEpoch } from '@/utils/string';
import { Divider, Icon, Layout, List, ListItem, Text } from '@ui-kitten/components';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert } from 'react-native';
import IconButton from '@/components/common/IconButton';
import DynamicInputMajorEvents from './DynamicInputMajorEvents';

type TProps = {
  selectedCampaign: TCampaign;
  updateCampaigns: React.Dispatch<React.SetStateAction<TCampaign[]>>;
  selectedIndex: number;
};

export default function SelectedCampaignDetails(props: TProps) {
  const { selectedCampaign, selectedIndex, updateCampaigns } = props;
  const router = useRouter();
  // Major Event Updaates
  const [updateEventsLoading, setUpdateEventsLoading] = useState(false);
  const [updateEventsErr, setUpdateEventsErr] = useState('');
  const [deleteMajorEventLoading, setDeleteMajorEventLoading] = useState(false);
  const [deleteMajorEventErr, setDeleteMajorEventErr] = useState('');

  // Adventurer Updates
  const [deleteAdventurerLoading, setDeleteAdventurerLoading] = useState(false);
  const [deleteAdventurerErr, setDeleteAdventurerErr] = useState('');

  const handleUpdateMajorEvents = async (entries: string[]) => {
    setUpdateEventsErr('');
    setUpdateEventsLoading(true);
    try {
      await updateCampaignDB(selectedCampaign.id, { major_events: entries });
      updateCampaigns((prev) => {
        prev[selectedIndex].major_events.push(...entries);
        return prev;
      });
    } catch (err) {
      setUpdateEventsErr(err.toString());
    } finally {
      setUpdateEventsLoading(false);
    }
  };

  const handleMajorEventDelete = async (index: number, item: string) => {
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
      updateCampaigns((campaigns) => {
        campaigns[selectedIndex].major_events = [
          ...campaigns[selectedIndex].major_events.slice(0, index),
          ...campaigns[selectedIndex].major_events.slice(index + 1),
        ];
        return campaigns;
      });
    } catch (error) {
      setDeleteMajorEventErr(error);
    } finally {
      setDeleteMajorEventLoading(false);
    }
  };

  const handleAdventurerDelete = async (name: string) => {
    const confirm = await new Promise((resolve) => {
      Alert.alert('Confirm Deletion', `Are you sure you want to delete adventurer ${name}?`, [
        { text: 'Confirm', onPress: () => resolve(true) },
        { text: 'Cancel', onPress: () => resolve(false), style: 'cancel' },
      ]);
    });
    if (!confirm) return;
    try {
      setDeleteAdventurerLoading(true);
      setDeleteAdventurerErr('');
      await deleteAdventurerDB(selectedCampaign.id, name);
      updateCampaigns((campaigns) => {
        delete campaigns[selectedIndex].members[name];
        return campaigns;
      });
    } catch (error) {
      setDeleteAdventurerErr(error);
    } finally {
      setDeleteAdventurerLoading(false);
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
            name="person-outline"
          />
        )}
        onLongPress={() => {
          handleAdventurerDelete(item.memberName);
        }}
        onPress={() => {
          router.push(
            `/(tabs)/(campaigns)/adventurer/${selectedCampaign.id}/${encodeURIComponent(
              item.memberName
            )}/${encodeURIComponent(item.details)}`
          );
        }}
        disabled={deleteAdventurerLoading}
      />
    );
  };

  return (
    <Layout style={{ display: 'flex', gap: 12, padding: 12 }}>
      <Text
        category="label"
        style={{ marginBottom: 12 }}
      >
        CAMPAIGN OVERVIEW
      </Text>
      <Text
        onLongPress={() => {
          router.push(
            `/(tabs)/(campaigns)/${selectedCampaign.id}/${encodeURIComponent(
              selectedCampaign.name
            )}/${encodeURIComponent(selectedCampaign.overview)}`
          );
        }}
      >
        {selectedCampaign.overview}
      </Text>
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
      {deleteAdventurerErr && <Text status="danger">{deleteAdventurerErr}</Text>}
      <List
        data={Object.keys(selectedCampaign.members || []).map((memberName) => ({
          memberName,
          details: selectedCampaign.members[memberName],
        }))}
        renderItem={renderPartyMemberItem}
      />
      <IconButton
        appearance="ghost"
        icon="plus"
        status="basic"
        onPress={() => router.push(`/(tabs)/(campaigns)/adventurer/${selectedCampaign.id}`)}
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
}
