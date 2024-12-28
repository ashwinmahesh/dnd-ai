import { TMonsterStatblock } from '@/api/types';
import { Divider, Layout, Text } from '@ui-kitten/components';
import React from 'react';
import { Abilities, Actions, BasicInfo, BonusActions, LegendaryActions, Spells, Traits } from './statblockComponents';
import { capitalize } from '@/utils/string';

type TProps = {
  statblock: TMonsterStatblock;
};

const MonsterStatblock = (props: TProps) => {
  const { statblock } = props;

  return (
    <Layout>
      <Divider style={{ marginBottom: 12 }} />
      <Layout style={{ gap: 3 }}>
        <Text category="h4">{statblock.name}</Text>
        <Text category="p1">
          {statblock.size} {statblock.type}, {statblock.alignment}
        </Text>
        <Text category="p1">
          AC: {statblock.armor_class} | HP: {statblock.hit_points} ({statblock.hit_dice})
        </Text>
        <Text category="p1">
          Speed:{' '}
          {Object.keys(statblock.speed || {})
            .map((motion) => `${capitalize(motion)} ${statblock.speed[motion]} ft.`)
            .join(',')}
        </Text>
      </Layout>
      <Divider style={{ marginVertical: 12 }} />
      <Text>{statblock.description}</Text>
      <Divider style={{ marginVertical: 12 }} />
      <Abilities abilities={statblock.abilities} />
      <Divider style={{ marginVertical: 12 }} />
      <BasicInfo statblock={statblock} />
      <Divider style={{ marginVertical: 12 }} />
      {statblock.traits && <Traits traits={statblock.traits} />}
      <Divider style={{ marginVertical: 12 }} />
      {statblock.actions && <Actions actions={statblock.actions} />}
      <Divider style={{ marginVertical: 12 }} />
      {statblock.bonus_actions && <BonusActions bonusActions={statblock.bonus_actions} />}
      <Divider style={{ marginVertical: 12 }} />
      {statblock.legendary_actions && <LegendaryActions legendaryActions={statblock.legendary_actions} />}
      <Divider style={{ marginVertical: 12 }} />
      {statblock.spells && statblock.spells.length > 0 && <Spells spells={statblock.spells} />}
      <Divider style={{ marginVertical: 12 }} />
    </Layout>
  );
};

export default MonsterStatblock;
