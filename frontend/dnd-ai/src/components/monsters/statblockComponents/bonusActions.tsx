import { TMonsterStatblock } from '@/api/types';
import { Layout, Text } from '@ui-kitten/components';
import React from 'react';

type TProps = {
  bonusActions: TMonsterStatblock['bonus_actions'];
};

export default function BonusActions(props: TProps) {
  const { bonusActions } = props;

  const renderAction = (bonusAction: (typeof bonusActions)[number]) => {
    return (
      <Layout key={`bonus_action_${bonusAction.name}`}>
        <Text category="h6">
          {bonusAction.name}
          {bonusAction.recharge ? ` (Recharge ${bonusAction.recharge})` : ''}
        </Text>
        <Text category="p1">{bonusAction.description}</Text>
      </Layout>
    );
  };

  return (
    <Layout>
      <Text category="h5">Bonus Actions</Text>
      <Layout style={{ gap: 12, marginTop: 12 }}>{bonusActions.map(renderAction)}</Layout>
    </Layout>
  );
}
