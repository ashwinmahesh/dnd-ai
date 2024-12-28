import { Button, ButtonProps, Spinner } from '@ui-kitten/components';
import React from 'react';
import { View } from 'react-native';

type TProps = ButtonProps & { loading?: boolean };

const LoadingIndicator = (props): React.ReactElement => (
  <View style={[props.style, { justifyContent: 'center', alignItems: 'center' }]}>
    <Spinner size="small" />
  </View>
);

export default function LoadingButton(props: TProps) {
  const { loading, ...buttonProps } = props;
  return (
    <Button
      {...buttonProps}
      disabled={loading || buttonProps.disabled}
      accessoryLeft={loading ? LoadingIndicator : null}
    >
      {!loading ? buttonProps.children : ''}
    </Button>
  );
}
