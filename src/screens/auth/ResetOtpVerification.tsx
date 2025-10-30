import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import React, { FC, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@store/reduxHook';
import { selectUser } from '@store/reducers/userSlice';
import { useTheme } from '@react-navigation/native';
import { SendOTP, VerifyOTP } from '@store/actions/userAction';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import CustomText from '@components/global/CustomText';
import OTPInputCentered from '@components/inputs/OTPInputCentered';
import CustomNumberPad from '@components/inputs/CustomNumberPad';
import { navigate } from '@utils/NavigationUtil';
import { Colors } from '@constants/Colors';
import { RFValue } from 'react-native-responsive-fontsize';
import { FONTS } from '@constants/Fonts';
import Icon from 'react-native-vector-icons/Ionicons';
import OTPInput from '@components/inputs/OTPInput';

interface pin {
  pin: string;
}

const ResetOtpVerification: FC<pin> = ({ pin }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState<null | string>('');
  const [otp, setOtp] = useState('');
  const { colors } = useTheme();

  const handleVerification = async () => {
    setLoading(true);
    if (!otp) {
      setLoading(false);
      setOtpError('Enter OTP');
      return;
    }

    await dispatch(
      VerifyOTP({
        email: user.email || '',
        otp_type: 'reset_pin',
        otp,
        data: pin,
      }),
    );
    setLoading(false);
  };

  const handleChange = (text: string) => {
    setOtp(text);
    setOtpError(null);
  };

  const handleResendOtp = async () => {
    await dispatch(SendOTP({ email: user.email || '', otp_type: 'reset_pin' }));
  };

   const [otpValues, setOtpValues] = useState(['', '', '', '','','']);
    const [focusedIndex, setFocusedIndex] = useState(0);
  
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
        navigate('', {
          pin: otpValues.toString(),
        });
      }
    };

  return (
    <KeyboardAvoidingView
        keyboardVerticalOffset={10}
        behavior='padding'
        style={styles.keyboardContainer}
    >
      <CustomSafeAreaView>
      <View style={styles.container}>
        <View style={styles.icon}>
          <Icon name="lock-closed" size={RFValue(26)} color={'#34c342ff'} />
        </View>
        <CustomText fontFamily={FONTS.Bold} variant="h3">
          Verify Your Identity
        </CustomText>
        <CustomText style={{width : '90%',opacity : 0.7,textAlign : 'center'}}>
          Enter the OTP sent to your registered email.
        </CustomText>
        <OTPInput
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
    </KeyboardAvoidingView>
  );
};

export default ResetOtpVerification;

const styles = StyleSheet.create({
  keyboardContainer : {
    flex : 1
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
   icon: {
      borderRadius: 60,
      padding: 8,
      borderColor: Colors.profit,
      borderWidth : 1,
      backgroundColor : '#086b2234'
    },
});
