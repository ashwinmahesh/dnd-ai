import { Layout } from '@ui-kitten/components';
import React from 'react';
import { Image } from 'react-native';
import images from './images';

type TImage = keyof typeof images;

type TProps = {
  image: TImage;
  size: number;
};

export default function Logo(props: TProps) {
  const { size, image } = props;
  return (
    <Layout
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
      }}
    >
      <Image
        source={images[image]}
        style={{
          resizeMode: 'contain',
          height: size,
          width: size,
          // borderRadius: 1000,
          // borderColor: 'white',
          // borderWidth: 1,
          // backgroundColor: 'white',
        }}
      />
    </Layout>
  );
}
