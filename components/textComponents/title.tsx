import { View, Text } from 'react-native'
import React from 'react'

export  function Title({title}: {title: string}) {
  return (
    <View>
      <Text className="text-3xl font-medium text-candlelight-800">{title}</Text>
    </View>
  )
}

export function SubTitle({title}: {title: string}) {
  return (
    <View>
      <Text className="text-[#4D5962] text-sm">{title}</Text>
    </View>
  )
}