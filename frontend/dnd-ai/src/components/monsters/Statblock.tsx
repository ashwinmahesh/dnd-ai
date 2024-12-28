import { TMonsterStatblock } from '@/api/types';
import { Divider, Layout, Text } from '@ui-kitten/components';
import React from 'react';
import { Abilities, BasicInfo, Traits } from './statblockComponents';
import { capitalize } from '@/utils/string';

type TProps = {
  statblock: TMonsterStatblock;
};

const MonsterStatblock = (props: TProps) => {
  const { statblock } = props;

  return (
    <Layout>
      <Divider style={{ marginVertical: 12 }} />
      <Layout style={{ gap: 3 }}>
        <Text category="h5">{statblock.name}</Text>
        <Text category="p2">
          {statblock.size} {statblock.type}, {statblock.alignment}
        </Text>
        <Text category="p2">
          AC: {statblock.armor_class} | HP: {statblock.hit_points} ({statblock.hit_dice})
        </Text>
        <Text category="p2">
          Speed:{' '}
          {Object.keys(statblock.speed)
            .map((motion) => `${capitalize(motion)} ${statblock.speed[motion]} ft.`)
            .join(',')}
        </Text>
      </Layout>
      <Divider style={{ marginVertical: 12 }} />
      <Abilities abilities={statblock.abilities} />
      <Divider style={{ marginVertical: 12 }} />
      <BasicInfo statblock={statblock} />
      <Divider style={{ marginVertical: 12 }} />
      {statblock.traits && <Traits traits={statblock.traits} />}
    </Layout>
  );
};

export default MonsterStatblock;
