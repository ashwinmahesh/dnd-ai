import { TMonsterStatblock } from '@/api/types';
import { Layout, Text } from '@ui-kitten/components';
import React, { act } from 'react';

type TProps = {
  reactions: TMonsterStatblock['reactions'];
};

export default function Reactions(props: TProps) {
  const { reactions } = props;

  const renderAction = (action: (typeof reactions)[number]) => {
    return (
      <Layout key={`reaction_${action.name}`}>
        <Text category="h6">{action.name}</Text>
        <Text category="p1">{action.description}</Text>
      </Layout>
    );
  };

  return (
    <Layout>
      <Text category="h5">Reactions</Text>
      <Layout style={{ gap: 12, marginTop: 12 }}>{reactions.map(renderAction)}</Layout>
    </Layout>
  );
}
