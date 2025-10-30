import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import CustomText from '@components/global/CustomText';
import { FONTS } from '@constants/Fonts';
import CenteredLogo from '@components/global/CenteredLogo';
import Icon from 'react-native-vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';
import OTPInputCentered from '@components/inputs/OTPInputCentered';
import { navigate } from '@utils/NavigationUtil';
import CustomNumberPad from '@components/inputs/CustomNumberPad';
import { Colors } from '@constants/Colors';

const ResetPin = () => {
  const [otpValues, setOtpValues] = useState(['', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [otpError, setOtpError] = useState<string | null>(null);

  const handlePressNumber = (number: number | string) => {
    if (focusedIndex < otpValues.length) {
      setFocusedIndex(focusedIndex + 1);
      const newOtpValues = [...otpValues];
      newOtpValues[focusedIndex] = number.toString();
      setOtpError(null);
      setOtpValues(newOtpValues);
    }
  };

  const handlePressBackspace = () => {
    if (focusedIndex > 0) {
      setFocusedIndex(focusedIndex - 1);
      const newOtpValues = [...otpValues];
      newOtpValues[focusedIndex - 1] = '';
      setOtpValues(newOtpValues);
    }
  };

  const handlePressCheckmark = () => {
    let valid = false;
    const isNotEmpty = otpValues.map(i => {
      if (i == '') {
        valid = true;
        setOtpError('Enter all PIN');
      }
    });
    if (!valid) {
      navigate('ConfirmPinScreen', {
        pin: otpValues.toString(),
      });
    }
  };

  return (
    <CustomSafeAreaView>
      <View style={styles.container}>
        <View style={styles.icon}>
          <Icon name="lock-closed" size={RFValue(26)} color={'#fff'} />
        </View>
        <CustomText fontFamily={FONTS.Bold} variant="h3">
          Reset Your Pin
        </CustomText>
        <CustomText style={{width : '90%',opacity : 0.7,textAlign : 'center'}}>
          Set a new PIN to keep your investment safe & secure.
        </CustomText>
        <OTPInputCentered
          focusedIndex={focusedIndex}
          otpValues={otpValues}
          error={otpError}
        />
      </View>
      <CustomNumberPad
        onPressBackspace={handlePressBackspace}
        onPressCheckmark={handlePressCheckmark}
        onPressNumber={handlePressNumber}
      />
    </CustomSafeAreaView>
  );
};

export default ResetPin;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
   icon: {
      borderRadius: 60,
      padding: 8,
      borderColor: Colors.border,
      borderWidth : 1,
    },
});
