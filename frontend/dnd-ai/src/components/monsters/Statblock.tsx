import { TMonsterStatblock } from '@/api/types';
import { Divider, Layout, Text } from '@ui-kitten/components';
import React from 'react';

type TProps = {
  statblock: TMonsterStatblock;
};

const MonsterStatblock = (props: TProps) => {
  const { statblock } = props;

  const renderStats = () => {
    const abilities = statblock.abilities;
    const output: React.ReactElement[] = []; // 2 rows

    function getModifier(val: number) {
      const modifier = Math.floor((val - 10) / 2);
      return modifier >= 0 ? `+${modifier}` : `${modifier}`;
    }
    // row 1 = STR, DEX, CON
    // row 2 = WIS, INT, CHA

    output.push(
      <Layout style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 48 }}>
        <Layout style={{ width: 60 }}>
          <Text category="label">STR</Text>
          <Text>
            {abilities['strength']} {`(${getModifier(abilities['strength'])})`}
          </Text>
        </Layout>
        <Layout style={{ width: 60 }}>
          <Text category="label">DEX</Text>
          <Text>
            {abilities['dexterity']} {`(${getModifier(abilities['dexterity'])})`}
          </Text>
        </Layout>
        <Layout style={{ width: 60 }}>
          <Text category="label">CON</Text>
          <Text>
            {abilities['constitution']} {`(${getModifier(abilities['constitution'])})`}
          </Text>
        </Layout>
      </Layout>
    );
    output.push(
      <Layout style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 48 }}>
        <Layout style={{ width: 60 }}>
          <Text category="label">WIS</Text>
          <Text>
            {abilities['wisdom']} {`(${getModifier(abilities['wisdom'])})`}
          </Text>
        </Layout>
        <Layout style={{ width: 60 }}>
          <Text category="label">INT</Text>
          <Text>
            {abilities['intelligence']} {`(${getModifier(abilities['intelligence'])})`}
          </Text>
        </Layout>
        <Layout style={{ width: 60 }}>
          <Text category="label">CHA</Text>
          <Text>
            {abilities['charisma']} {`(${getModifier(abilities['charisma'])})`}
          </Text>
        </Layout>
      </Layout>
    );
    return output;
  };

  const renderBasicInformation = () => {};

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

      <Layout style={{ gap: 12 }}>{renderStats()}</Layout>
      <Divider style={{ marginVertical: 12 }} />
    </Layout>
  );
};

export default MonsterStatblock;
