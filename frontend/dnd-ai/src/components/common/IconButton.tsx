import { Button, Icon, ButtonProps } from '@ui-kitten/components';
import React from 'react';

export default function IconButton(props: ButtonProps & { icon: string }) {
  const { icon, ...buttonProps } = props;
  return (
    <Button
      {...buttonProps}
      accessoryLeft={(accessoryProps) => (
        <Icon
          {...accessoryProps}
          name={icon}
        />
      )}
    />
  );
}
