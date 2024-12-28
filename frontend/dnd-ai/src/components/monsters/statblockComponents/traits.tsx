import { TMonsterStatblock } from '@/api/types';
import { Layout, Text } from '@ui-kitten/components';
import React from 'react';

type TProps = { traits: TMonsterStatblock['traits'] };

export default function Traits(props: TProps) {
  const { traits } = props;

  return (
    <Layout>
      <Text category="h5">Traits</Text>
      <Layout style={{ gap: 12, marginTop: 12 }}>
        {traits.map((trait) => {
          return (
            <Layout>
              <Text
                category="h6"
                style={{ marginBottom: 3 }}
              >
                {trait.name}
              </Text>
              <Text category="p1">{trait.description}</Text>
            </Layout>
          );
        })}
      </Layout>
    </Layout>
  );
}
