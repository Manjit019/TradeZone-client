import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import DotLoading from '@components/global/DotLoading';

const SplashScreen = () => {
  return (
    <CustomSafeAreaView>
      <View style={styles.container}>
        <DotLoading />
      </View>
    </CustomSafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
