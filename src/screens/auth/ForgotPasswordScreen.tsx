import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { useTheme } from '@react-navigation/native';
import { useAppDispatch } from '@store/reduxHook';
import { validatePasswordEntry } from '@utils/ValidationUtil';
import { SendOTP, VerifyOTP } from '@store/actions/userAction';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import BackButton from '@components/global/BackButton';
import CustomText from '@components/global/CustomText';
import { FONTS } from '@constants/Fonts';
import CustomInput from '@components/inputs/CustomInput';
import { globalStyles } from '@styles/globalStyle';
import CustomButton from '@components/global/CustomButton';
import Icon from 'react-native-vector-icons/Ionicons';
import OtpTimer from '@components/auth/OtpTimer';
import GuidelineText from '@components/global/GuidelineText';

interface PasswordInputs {
  password: string;
  confirmPassword: string;
  otp: string;
}

const ForgotPasswordScreen = ({ route }: any) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const [otpSent, setOtpSent] = useState(false);
  const [inputs, setInputs] = useState<PasswordInputs>({
    password: '',
    confirmPassword: '',
    otp: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>();
  const [loading, setLoading] = useState(false);

  const handleOnChange = (text: string, fieldName: string) => {
    setInputs(prevInputs => ({
      ...prevInputs,
      [fieldName]: text,
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [fieldName]: undefined,
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string | undefined } = {};
    if (!inputs.password.trim()) {
      newErrors.password = 'Enter new password';
    }
    if (!inputs.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Enter confirm password';
    }
    const pwd_validate = validatePasswordEntry(
      inputs.password,
      'test',
      route?.params?.email,
    );

    if (!pwd_validate.result) {
      newErrors.password = pwd_validate.msg;
    }

    if (inputs?.confirmPassword !== inputs.password) {
      newErrors.confirmPassword = 'Confirm password not match';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleUpdatePassword = async () => {
    if (validateForm()) {
      setLoading(true);
      await dispatch(
        SendOTP({
          email: route?.params?.email,
          otp_type: 'reset_password',
        }),
      );
      setOtpSent(true);
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    await dispatch(
      VerifyOTP({
        email: route?.params?.email,
        otp_type: 'reset_password',
        data: inputs.confirmPassword,
        otp: inputs.otp,
      }),
    );
  };

  return (
    <CustomSafeAreaView>
      <BackButton withBg />
      <CustomText fontFamily={FONTS.Medium} variant="h3">
        Forgot Password
      </CustomText>

      <CustomInput
        label="NEW PASSWORD"
        value={inputs.password}
        placeholder="Enter your new password"
        onChangeText={text => handleOnChange(text, 'password')}
        returnKeyType="done"
        error={errors?.password}
        focusable={true}
        password
      />

      <CustomInput
        label="CONFIRM NEW PASSWORD"
        value={inputs.confirmPassword}
        placeholder="Re-Enter your new password"
        onChangeText={text => handleOnChange(text, 'confirmPassword')}
        returnKeyType="done"
        error={errors?.confirmPassword}
        focusable={true}
      />

      {otpSent && (
        <CustomInput
          label="Enter OTP"
          value={inputs.otp}
          placeholder=""
          onChangeText={text => handleOnChange(text, 'otp')}
          returnKeyType="done"
          error={errors?.otp}
          focusable={true}
          maxLength={6}
          keyboardType="number-pad"
          rightIcon={
            <OtpTimer
              type="email"
              onPress={() => handleUpdatePassword()}
              style={styles.timer}
            />
          }
        />
      )}

      {!otpSent && (
        <GuidelineText
          text={[
            'Password must be at least 8 characters long.',
            'Password must contain at least one lowercase letter.',
            'Password must contain at least one uppercase letter.',
            'Password must contain at least one number.',
            'Password must contain at least one special character.',
          ]}
        />
      )}

      <View style={globalStyles.absoluteBottom}>
        <CustomButton
          text={otpSent ? 'Verify OTP' : 'Send OTP'}
          disabled={loading}
          loading={loading}
          onPress={handleUpdatePassword}
          textStyle={{ color: '#10181cff' }}
          icon={<Icon name="caret-forward" size={16} />}
          iconPosition="right"
        />
      </View>
    </CustomSafeAreaView>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  timer: {
    position: 'absolute',
    right: 5,
    opacity: 0.7,
    bottom: -10,
  },
});
