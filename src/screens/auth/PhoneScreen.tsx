import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  View,
  Platform,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import CustomText from '@components/global/CustomText';
import { useAppDispatch, useAppSelector } from '@store/reduxHook';
import { SendOTP, VerifyOTP } from '@store/actions/userAction';
import { selectUser } from '@store/reducers/userSlice';
import { FONTS } from '@constants/Fonts';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '@constants/Colors';
import CustomInput from '@components/inputs/CustomInput';
import { globalStyles } from '@styles/globalStyle';
import CustomButton from '@components/global/CustomButton';
import OtpTimer from '@components/auth/OtpTimer';
import OTPInput from '@components/inputs/OTPInput';
import { RFValue } from 'react-native-responsive-fontsize';

const OTP_LENGTH = 6;

const PhoneScreen = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const [phoneNumber, setPhoneNumber] = useState('9999999999');
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const [otpValues, setOtpValues] = useState(Array(OTP_LENGTH).fill(''));
  const inputsRef = useRef<Array<TextInput | null>>(
    Array(OTP_LENGTH).fill(null),
  );

  const handleChange = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return;
    setOtpError('');
    const updated = [...otpValues];
    updated[index] = text;
    setOtpValues(updated);
    
    if (text && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
    if (text.length < 1 ) {
      inputsRef.current[index - 1]?.focus();
    }
    setFocusedIndex(index-1);
  };

  const handleSendOtp = async () => {
    if (!phoneNumber) {
      setPhoneError('Please enter your phone number');
      return;
    }
    setLoading(true);
    await dispatch(
      SendOTP({
        email: user.email as string,
        otp_type: 'phone',
      }),
    );
    setOtpSent(true);
    setOtpValues(Array(OTP_LENGTH).fill(''));
    inputsRef.current[0]?.focus();
    setFocusedIndex(0);
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    const otp = otpValues.join('');
    if (!otp || otp.length < OTP_LENGTH) {
      setOtpError('Please enter complete OTP');
      return;
    }
    setLoading(true);
    await dispatch(
      VerifyOTP({
        email: user.email as string,
        otp_type: 'phone',
        otp,
        data: phoneNumber,
      }),
    );
    setLoading(false);
  };

  const handlePress = () => {
    if (otpSent) {
      handleVerifyOtp();
    } else {
      handleSendOtp();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={10}
      style={styles.keyboardContainer}
    >
      <CustomSafeAreaView>
        <View style={styles.flexRowBetween}>
          <View style={{ width: '100%',alignItems : 'center'}}>
            <CustomText fontFamily={FONTS.Medium} variant="h2">
              {otpSent ? 'Verify Your Phone Number' : 'Enter Your Phone Number'}
            </CustomText>
            <CustomText variant="h6" style={{ opacity: 0.57 }}>
              {otpSent
                ? <>
                  <CustomText>Enter the OTP sent to {phoneNumber}{' '}</CustomText>
                  <Icon name='create-outline' size={RFValue(12)} color={Colors.themeColor}/>
                </>
                : 'Phone number is required to invest in India.'}
            </CustomText>
          </View>
          <View style={styles.headerIcon}>
            <Icon
              name={otpSent ? 'lock-closed' : 'phone-portrait-outline'}
              size={40}
              color={'#fff'}
            />
          </View>
        </View>

        {otpSent ? (
          <>
            <View>
              <View style={styles.inputRow}>
                {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                  <TextInput
                    key={index}
                    ref={ref => {
                      inputsRef.current[index] = ref;
                    }}
                    value={otpValues[index]}
                    onChangeText={text => handleChange(text, index)}
                    maxLength={1}
                    keyboardType="number-pad"
                    style={styles.otpInput}
                    returnKeyType="next"
                  />
                ))}
              </View>
              <OTPInput
                focusedIndex={focusedIndex}
                otpValues={otpValues}
                error={otpError}
              />
            </View>
            {otpError ? (
              <CustomText variant="h6" style={{ color: Colors.loss }}>
                {otpError}
              </CustomText>
            ) : null}

            <View>
              <OtpTimer onPress={handleSendOtp} type="phone" />
            </View>
          </>
        ) : (
          <CustomInput
            placeholder=" 9999999999"
            returnKeyType="done"
            value={phoneNumber}
            focusable={true}
            error={phoneError}
            onChangeText={text => {
              setPhoneNumber(text);
              setPhoneError('');
            }}
            leftIcon={
              <CustomText
                style={{ color: '#fff', paddingBottom: 4 }}
                variant="h5"
                fontFamily={FONTS.Bold}
              >
                +91
              </CustomText>
            }
          />
        )}

        <View style={globalStyles.absoluteBottom}>
          <CustomButton
            text={otpSent ? 'Verify OTP' : 'Send OTP'}
            disabled={loading}
            loading={loading}
            onPress={handlePress}
            textStyle={{ color: '#10181cff' }}
            icon={<Icon name="caret-forward" size={16} />}
            iconPosition="right"
          />
        </View>
      </CustomSafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default PhoneScreen;

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  flexRowBetween: {
    flexDirection: 'column-reverse',
    justifyContent: 'space-between',
    alignItems : 'center',
    gap  : 10
  },
  headerIcon: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#0b2f4143',
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 24,
    position: 'absolute',
  },
  otpInput: {
    width: 50,
    height: 50,
    marginHorizontal: 6,
    backgroundColor: '#0000008a',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 20,
    color: 'transparent',
  },
});
