import { TMonsterStatblock } from '@/api/types';
import { capitalize } from '@/utils/string';
import { Layout, Text } from '@ui-kitten/components';
import React from 'react';

type TProps = {
  statblock: TMonsterStatblock;
};

const textCategory = 'p1';
const titleCategory = 's1';

export default function BasicInfo(props: TProps) {
  const { statblock } = props;
  return (
    <Layout>
      {/* Saving Throws */}
      {statblock.saving_throws && (
        <Layout style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text category={titleCategory}>Saving Throws:</Text>
          <Text
            category={textCategory}
            style={{ flexWrap: 'wrap' }}
            numberOfLines={4}
          >
            {Object.keys(statblock.saving_throws)
              .map((ability) => {
                const val = statblock.saving_throws[ability];
                return `${ability.toUpperCase().substring(0, 3)} ` + (val >= 0 ? '+' : '') + val;
              })
              .join(', ')}
          </Text>
        </Layout>
      )}

      {/* Skills */}
      {statblock.skills && (
        <Layout style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text category={titleCategory}>Skills:</Text>
          <Text category={textCategory}>
            {Object.keys(statblock.skills)
              .map((ability) => {
                const val = statblock.skills[ability];
                return `${capitalize(ability)} ` + (val >= 0 ? '+' : '') + val;
              })
              .join(', ')}
          </Text>
        </Layout>
      )}

      {/* Damage Resistances */}
      {statblock.damage_resistances && (
        <Layout style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text category={titleCategory}>Damage Resistances:</Text>
          <Text category={textCategory}>{statblock.damage_resistances.join(', ')}</Text>
        </Layout>
      )}

      {/* Damage Immunities */}
      {statblock.damage_immunities && (
        <Layout style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text category={titleCategory}>Damage Immunities:</Text>
          <Text category={textCategory}>{statblock.damage_immunities.join(', ')}</Text>
        </Layout>
      )}

      {/* Condition Immunities  */}
      {statblock.condition_immunities && (
        <Layout style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text category={titleCategory}>Condition Immunities:</Text>
          <Text category={textCategory}>{statblock.condition_immunities.join(', ')}</Text>
        </Layout>
      )}

      {/* Senses */}
      <Layout style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text category={titleCategory}>Senses:</Text>
        <Text category={textCategory}>
          Passive Perception: {statblock.senses.passive_perception}
          {statblock.senses.darkvision ? `, Darkvision ${statblock.senses.darkvision} ft.` : ''}
        </Text>
      </Layout>

      {/* Languages  */}
      {statblock.languages && (
        <Layout style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text category={titleCategory}>Languages:</Text>
          <Text category={textCategory}>{statblock.languages.join(', ')}</Text>
        </Layout>
      )}
    </Layout>
  );
}
