import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ParamListBase, RouteProp, useRoute } from '@react-navigation/native'
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';

interface ParamsType {
  msg : string;
}
const TransactionSuccess = () => {

  const route = useRoute<RouteProp<ParamListBase>>();

  const msg = (route.params as ParamsType)?.msg || null;

  return (
    <CustomSafeAreaView>
      <Text>TransactionSuccess</Text>
    </CustomSafeAreaView>
  )
}

export default TransactionSuccess

const styles = StyleSheet.create({})