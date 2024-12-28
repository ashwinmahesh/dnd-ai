import { TMonsterStatblock } from '@/api/types';
import { Layout, Text } from '@ui-kitten/components';
import React from 'react';

type TProps = {
  actions: TMonsterStatblock['actions'];
};

export default function Actions(props: TProps) {
  const { actions } = props;

  const renderAction = (action: (typeof actions)[number]) => {
    const renderSecondLine = () => {
      const output = [];
      if (action.type) output.push(action.type);
      if (action.attack_bonus) {
        const sign = action.attack_bonus >= 0 ? '+' : '';
        output.push(`${sign}${action.attack_bonus} to Hit`);
      }
      if (action.reach) output.push(`Reach ${action.reach} ft.`);
      if (action.range) output.push(`Range ${action.range} ft.`);
      if (action.target) output.push(action.target);
      if (action.damage) {
        let workingStr = action.damage;
        if (action.damage_type) workingStr += ` ${action.damage_type}`;
        else workingStr += ` damage`;

        output.push(`Hit ${workingStr}`);
      }

      return output.join(', ');
    };

    return (
      <Layout>
        <Text category="h6">
          {action.name}
          {action.recharge ? ` (Recharge ${action.recharge})` : ''}
        </Text>
        <Text category="p1">
          {renderSecondLine()}
          {action.additional_effects ? ` - ${action.additional_effects}` : ''}
        </Text>
      </Layout>
    );
  };

  return (
    <Layout>
      <Text category="h5">Actions</Text>
      <Layout style={{ gap: 12, marginTop: 12 }}>{actions.map(renderAction)}</Layout>
    </Layout>
  );
}
