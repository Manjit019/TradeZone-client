import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomSafeAreaView from '@components/global/CustomSafeAreaView'

const ResetPin = () => {
  return (
    <CustomSafeAreaView>
      <View style={styles.container}>
        <Text>ResetPin</Text>
      </View>
    </CustomSafeAreaView>
  )
}

export default ResetPin

const styles = StyleSheet.create({
    container : {
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor : '#ccc'
    }
})