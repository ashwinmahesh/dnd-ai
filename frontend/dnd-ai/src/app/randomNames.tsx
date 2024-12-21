import React, { useState } from "react";
import { getRandomNamesAPI } from "./api/inference";
import { Button, Input, Layout, List, ListItem, Divider, Spinner} from '@ui-kitten/components';

const RandomNames = () => {
  const [loading, setLoading] = useState(false)
  const [randomNames, setRandomNames] = useState<{title: string}[]>([])
  const [descrition, setDescription] = useState('')

  const getRandomNames = async () => {
    setLoading(true)
    const names = await getRandomNamesAPI('Chultan')
    setRandomNames(names.map((name) => {
      return {title: name}
    }))
    setLoading(false)
  }

  const renderItem = ({item, index}: {item: {title: string}; index: number}): React.ReactElement => {
    return <ListItem title={`${index + 1} | ${item.title}`}/>
  }

  return (
    <Layout className="flex-1 px-3 py-3">
      <Layout className="flex flex-row justify-between items-center space-x-4">
        <Input placeholder={'One Word Description'} value={descrition} onChangeText={setDescription} className="flex-1"/>
        <Button onPress={getRandomNames} className="flex-shrink-0">Generate</Button>
      </Layout>
        {
          loading ?
            (<Layout className="flex-1 flex justify-middle items-center border-x-2 border-y-2 border-white pt-6" >
              <Spinner size="giant" className="mt-6"/> 
            </Layout>) :  
            <List 
              data={randomNames} 
              renderItem={renderItem}
              ItemSeparatorComponent={Divider}
            />
        }
    </Layout>
  );
}

export default RandomNames