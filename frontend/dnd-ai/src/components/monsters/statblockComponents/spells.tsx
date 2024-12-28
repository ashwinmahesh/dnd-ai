import { TMonsterStatblock } from '@/api/types';
import { Layout, Text } from '@ui-kitten/components';
import React from 'react';

type TProps = {
  spells: TMonsterStatblock['spells'];
};

export default function Spells(props: TProps) {
  const { spells } = props;

  const renderSpellLevel = (spell: (typeof spells)[number]) => {
    return (
      <Layout key={`spell_level_${spell.level}`}>
        <Text category="p1">
          {spell.level > 0 ? `Level ${spell.level} - ` : 'Cantrip - '}
          {spell.spells.join(', ')}
        </Text>
      </Layout>
    );
  };

  return (
    <Layout>
      <Text category="h5">Spells</Text>
      <Layout style={{ gap: 12, marginTop: 12 }}>{spells.map(renderSpellLevel)}</Layout>
    </Layout>
  );
}
