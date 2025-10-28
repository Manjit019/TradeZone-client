import { View, Text, StyleSheet, Platform, Animated } from 'react-native';
import React, { FC } from 'react';
import { Colors } from '../../constants/Colors';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomText from './CustomText';
import { FONTS } from '../../constants/Fonts';

interface Props {
  type: 'warningToast'|'successToast'|'normalToast';
  msg: string;
}

const CustomToastMessage: FC<Props> = ({ type, msg }) => {
  let bgColor = `${Colors.dark_background_light}`;
  let textColor = Colors.dark_text;

  switch (type) {
    case 'warningToast':
      bgColor = '#b88804ff';
      textColor = Colors.light_text;
      break;
    case 'successToast':
      bgColor = '#06b644ff';
      textColor = Colors.light_text;
      break;
    case 'normalToast':
      bgColor = '#27293fff';
      textColor = Colors.light_text;
      break;
    default:
      break;
  }

  return (
    <Animated.View style={[styles.modal, { backgroundColor: bgColor }]}>
      <View style={styles.subContainer}>
        {type == 'successToast' && (
          <Icon
            name="checkmark-circle-sharp"
            size={RFValue(16)}
            color={'#8effb6ff'}
          />
        )}
        {type == 'warningToast' && (
          <Icon
            name="warning-outline"
            size={RFValue(16)}
            color={'#fff4b6ff'}
          />
        )}

        <CustomText
          style={{ color: textColor }}
          variant="h7"
          fontFamily={FONTS.Medium}
          numberOfLines={3}
        >
          {msg}
        </CustomText>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  subContainer: {
    width : '98%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  text: {
    color: Colors.dark_text,
  },
  modal: {
    paddingTop: 18,
    paddingBottom: Platform.OS === 'ios' ? RFPercentage(4.5) : 18,
    paddingHorizontal: RFPercentage(3.5),
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default CustomToastMessage;
