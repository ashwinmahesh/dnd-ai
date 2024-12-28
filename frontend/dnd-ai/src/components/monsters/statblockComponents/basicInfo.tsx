import { TMonsterStatblock } from '@/api/types';
import { capitalize } from '@/utils/string';
import { Layout, Text } from '@ui-kitten/components';
import React from 'react';

type TProps = {
  statblock: TMonsterStatblock;
};

export default function BasicInfo(props: TProps) {
  const { statblock } = props;
  return (
    <Layout>
      {/* Saving Throws */}
      {statblock.saving_throws && (
        <Layout style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text category="label">Saving Throws:</Text>
          <Text>
            {Object.keys(statblock.saving_throws)
              .map((ability) => {
                const val = statblock.saving_throws[ability];
                return `${ability.toUpperCase()} ` + (val >= 0 ? '+' : '') + val;
              })
              .join(', ')}
          </Text>
        </Layout>
      )}

      {/* Skills */}
      {statblock.skills && (
        <Layout style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text category="label">Skills:</Text>
          <Text>
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
          <Text category="label">Damage Resistances:</Text>
          <Text>{statblock.damage_resistances.join(', ')}</Text>
        </Layout>
      )}

      {/* Damage Immunities */}
      {statblock.damage_immunities && (
        <Layout style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text category="label">Damage Immunities:</Text>
          <Text>{statblock.damage_immunities.join(', ')}</Text>
        </Layout>
      )}

      {/* Condition Immunities  */}
      {statblock.condition_immunities && (
        <Layout style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text category="label">Condition Immunities:</Text>
          <Text>{statblock.condition_immunities.join(', ')}</Text>
        </Layout>
      )}

      {/* Senses */}
      <Layout style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text category="label">Senses:</Text>
        <Text>
          Passive Perception: {statblock.senses.passive_perception}
          {statblock.senses.darkvision ? `, Darkvision ${statblock.senses.darkvision} ft.` : ''}
        </Text>
      </Layout>

      {/* Languages  */}
      {statblock.languages && (
        <Layout style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text category="label">Languages:</Text>
          <Text>{statblock.languages.join(', ')}</Text>
        </Layout>
      )}
    </Layout>
  );
}
