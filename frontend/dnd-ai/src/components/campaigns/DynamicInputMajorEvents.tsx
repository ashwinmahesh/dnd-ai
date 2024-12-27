import { Input, Layout } from '@ui-kitten/components';
import React, { useState } from 'react';
import IconButton from '@/components/common/IconButton';

const DynamicInputMajorEvents = ({
  handleSave,
  disabled,
}: {
  handleSave: (inputs: string[]) => Promise<void>;
  disabled: boolean;
}) => {
  const [inputs, setInputs] = useState<string[]>([]);

  const addInputField = () => {
    setInputs((prev) => [...prev, '']);
  };

  const updateInput = (val: string, index: number) => {
    setInputs((prev) => {
      const newInputs = [...prev];
      newInputs[index] = val;
      return newInputs;
    });
  };

  const removeInputField = (idx: number) => {
    setInputs((prev) => {
      return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
    });
  };

  return (
    <Layout>
      {inputs.map((input, idx) => {
        return (
          <Layout style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Input
              placeholder={`Major Event`}
              value={input}
              onChangeText={(text) => updateInput(text, idx)}
              style={{ marginBottom: 12, flexGrow: 1 }}
              textStyle={{ minHeight: 60 }}
              multiline
            />
            <IconButton
              icon="close-outline"
              size="small"
              appearance="ghost"
              onPress={() => removeInputField(idx)}
            />
          </Layout>
        );
      })}
      <Layout style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
        <IconButton
          appearance="ghost"
          status="basic"
          onPress={addInputField}
          style={{ flexGrow: 1 }}
          icon="plus"
          disabled={disabled}
        />
        {inputs.length > 0 && (
          <IconButton
            icon="checkmark-outline"
            appearance="ghost"
            status="success"
            style={{ flexGrow: 1 }}
            onPress={() =>
              handleSave(inputs).then(() => {
                setInputs([]);
              })
            }
            disabled={disabled}
          />
        )}
      </Layout>
    </Layout>
  );
};

export default DynamicInputMajorEvents;
