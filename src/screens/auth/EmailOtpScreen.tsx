import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import CenteredLogo from '@components/global/CenteredLogo';
import CustomText from '@components/global/CustomText';
import CustomInput from '@components/inputs/CustomInput';
import { useRoute, useTheme } from '@react-navigation/native';
import CustomButton from '@components/global/CustomButton';
import { useAppDispatch, useAppSelector } from '@store/reduxHook';
import { validatePassword } from '@utils/ValidationUtil';
import { LoginWithEmail, SendOTP, VerifyOTP } from '@store/actions/userAction';
import Icon from 'react-native-vector-icons/Ionicons';
import { screenWidth } from '@utils/Scaling';
import { RFValue } from 'react-native-responsive-fontsize';
import { FONTS } from '@constants/Fonts';
import { globalStyles } from '@styles/globalStyle';
import OTPInput from '@components/inputs/OTPInput';
import CustomNumberPad from '@components/inputs/CustomNumberPad';
import { Colors } from '@constants/Colors';
import { navigate } from '@utils/NavigationUtil';
import { selectUser } from '@store/reducers/userSlice';

const EmailOtpScreen = () => {
  const route = useRoute();
  const { email } = (route.params as any) || '';
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState<null | string>('');
  const [otp, setOtp] = useState('');

  const handleVerification = async () => {
    setLoading(true);
    if (!otp) {
      setLoading(false);
      setOtpError('Enter OTP');
      return;
    }

    await dispatch(
      VerifyOTP({
        email: email,
        otp_type: 'email',
        otp,
      }),
    );
    setLoading(false);
  };

  const handleChange = (text: string) => {
    setOtp(text);
    setOtpError(null);
  };

  const handleResendOtp = async () => {
    await dispatch(SendOTP({ email: email, otp_type: 'email' }));
  };

  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
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
      handleVerification();
    }
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={10}
      behavior="padding"
      style={styles.keyboardContainer}
    >
      <CustomSafeAreaView>
          <CenteredLogo />
        <View style={styles.container}>
          <View style={styles.icon}>
            <Icon name="lock-closed" size={RFValue(26)} color={'#34c342ff'} />
          </View>
          <CustomText fontFamily={FONTS.Bold} variant="h3">
            Verify Your Email
          </CustomText>
          <CustomText
            style={{ width: '90%', opacity: 0.7, textAlign: 'center' }}
          >
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

export default EmailOtpScreen;

const styles = StyleSheet.create({
  container: {
    padding: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top : -36
  },
  keyboardContainer: {
    flex: 1,
  },
  icon: {
    borderRadius: 60,
    padding: 8,
    borderColor: Colors.border,
    borderWidth: 1,
    backgroundColor: '#000000ff',
  },
});
