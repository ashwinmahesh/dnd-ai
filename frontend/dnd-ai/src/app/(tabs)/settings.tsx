import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
  // Button, Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getRandomNamesAPI } from '../../api/inference';
import { Button, Layout, Text } from '@ui-kitten/components';

export default function Page() {
  return (
    <Layout
      className="flex flex-1 align-middle"
      level="1"
    >
      <Layout className="">
        <Text>Not Implemented</Text>
      </Layout>
    </Layout>
  );
}
