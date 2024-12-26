import React from 'react';
import { Layout, Spinner, Text } from '@ui-kitten/components';

const Loading = () => {
  return (
    <Layout className="flex-1 px-3 py-3">
      <Spinner size="large" />
      <Text>Loading configurations...</Text>
    </Layout>
  );
};

export default Loading;
