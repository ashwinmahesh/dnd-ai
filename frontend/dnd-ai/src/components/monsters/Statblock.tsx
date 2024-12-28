import { TMonsterStatblock } from '@/api/types';
import { Divider, Layout, Text } from '@ui-kitten/components';
import React from 'react';
import { Abilities, BasicInfo } from './statblockComponents';

type TProps = {
  statblock: TMonsterStatblock;
};

const MonsterStatblock = (props: TProps) => {
  const { statblock } = props;

  return (
    <Layout>
      <Divider style={{ marginVertical: 12 }} />
      <Text category="h5">{statblock.name}</Text>
      <Text category="p2">
        {statblock.size} {statblock.type}, {statblock.alignment}
      </Text>
      <Text>
        AC: {statblock.armor_class} | HP: {statblock.hit_points} ({statblock.hit_dice})
      </Text>
      <Text>
        Speed:{' '}
        {Object.keys(statblock.speed)
          .map((motion) => `${motion} ${statblock.speed[motion]} ft.`)
          .join(',')}
      </Text>
      <Divider style={{ marginVertical: 12 }} />
      <Abilities abilities={statblock.abilities} />
      <Divider style={{ marginVertical: 12 }} />
      <BasicInfo statblock={statblock} />
      <Divider style={{ marginVertical: 12 }} />
    </Layout>
  );
};

export default MonsterStatblock;
