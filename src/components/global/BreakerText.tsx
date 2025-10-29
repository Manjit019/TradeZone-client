import {View, Text, StyleSheet} from 'react-native';
import React, {FC} from 'react';
import CustomText from '@components/global/CustomText';
import { Colors } from '@constants/Colors';

const BreakerText: FC<{text: string}> = ({text}) => {
  return (
    <View style={styles.breakerContainer}>
      <View style={styles.horizontalLine} />
      <CustomText
        fontSize={12}
        style={styles.breakerText}>
        {text}
      </CustomText>
      <View style={styles.horizontalLine} />
    </View>
  );
};

const styles = StyleSheet.create({
     breakerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        overflow: "hidden",
        width: '100%',
        marginTop: 20,
        marginBottom: 10
    },
    horizontalLine: {
        height: 1,
        width: '100%',
        position: 'absolute',
        backgroundColor: Colors.border,
        zIndex: -1,
        opacity : 0.4
    },
    breakerText: {
        opacity: 0.8,
        backgroundColor: Colors.background,
        paddingHorizontal: 10
    },

})


export default BreakerText;
