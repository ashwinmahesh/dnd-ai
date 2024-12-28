import { TMonsterStatblock } from '@/api/types';
import { Layout, Text } from '@ui-kitten/components';
import React from 'react';

type TProps = {
  legendaryActions: TMonsterStatblock['legendary_actions'];
};

export default function LegendaryActions(props: TProps) {
  const { legendaryActions } = props;

  const renderAction = (action: (typeof legendaryActions)[number]) => {
    return (
      <Layout key={`legendary_action_${action.name}`}>
        <Text category="h6">
          {action.name}
          {action.cost ? ` (${action.cost} Actions)` : ''}
        </Text>
        <Text category="p1">{action.description}</Text>
      </Layout>
    );
  };

  return (
    <Layout>
      <Text category="h5">Legendary Actions</Text>
      <Layout style={{ gap: 12, marginTop: 12 }}>{legendaryActions.map(renderAction)}</Layout>
    </Layout>
  );
}
