import React from 'react';
import { Image } from 'react-native';

type TProps = {
  size: number;
  alt?: boolean;
};

export default function Logo(props: TProps) {
  const { size, alt } = props;
  return (
    <Image
      source={alt ? require('@/images/alt_logo.png') : require('@/images/logo.png')}
      style={{ resizeMode: 'contain', height: size, width: size }}
    />
  );
}
