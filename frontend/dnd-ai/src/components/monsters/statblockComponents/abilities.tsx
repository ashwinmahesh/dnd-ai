import { TMonsterStatblock } from '@/api/types';
import { Layout, Text } from '@ui-kitten/components';
import React from 'react';

type TProps = {
  abilities: TMonsterStatblock['abilities'];
};

const abilityTitleCategory = 'h6';

const Abilities = (props: TProps) => {
  const { abilities } = props;
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
        <Text category={abilityTitleCategory}>STR</Text>
        <Text>
          {abilities['strength']} {`(${getModifier(abilities['strength'])})`}
        </Text>
      </Layout>
      <Layout style={{ width: 60 }}>
        <Text category={abilityTitleCategory}>DEX</Text>
        <Text>
          {abilities['dexterity']} {`(${getModifier(abilities['dexterity'])})`}
        </Text>
      </Layout>
      <Layout style={{ width: 60 }}>
        <Text category={abilityTitleCategory}>CON</Text>
        <Text>
          {abilities['constitution']} {`(${getModifier(abilities['constitution'])})`}
        </Text>
      </Layout>
    </Layout>
  );
  output.push(
    <Layout style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 48 }}>
      <Layout style={{ width: 60 }}>
        <Text category={abilityTitleCategory}>WIS</Text>
        <Text>
          {abilities['wisdom']} {`(${getModifier(abilities['wisdom'])})`}
        </Text>
      </Layout>
      <Layout style={{ width: 60 }}>
        <Text category={abilityTitleCategory}>INT</Text>
        <Text>
          {abilities['intelligence']} {`(${getModifier(abilities['intelligence'])})`}
        </Text>
      </Layout>
      <Layout style={{ width: 60 }}>
        <Text category={abilityTitleCategory}>CHA</Text>
        <Text>
          {abilities['charisma']} {`(${getModifier(abilities['charisma'])})`}
        </Text>
      </Layout>
    </Layout>
  );

  return <Layout style={{ gap: 12 }}>{output}</Layout>;
};

export default Abilities;
