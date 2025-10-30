import { Image, StyleSheet, Text, View } from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@store/reduxHook';
import { selectUser } from '@store/reducers/userSlice';
import { useWS } from '@utils/WSProvide';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import { navigate, resetAndNavigate } from '@utils/NavigationUtil';
import { loginWithBiometrics } from '@utils/BiometricUtil';
import { VerifyPin } from '@store/actions/userAction';
import CustomText from '@components/global/CustomText';
import CustomNumberPad from '@components/inputs/CustomNumberPad';
import CenteredLogo from '@components/global/CenteredLogo';
import { FONTS } from '@constants/Fonts';
import { RFValue } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/Ionicons';
import DiamondOTPInput from '@components/inputs/DiamondOTPInput';

const initialState = ['', '', '', ''];
interface BiometricProps {
  onForgotPin: () => void;
}

const BiometricVerification: FC<BiometricProps> = ({ onForgotPin }) => {
  const [otpValues, setOtpValues] = useState(['', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const { updateAccessToken } = useWS();

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
  const handlePressCheckMark = async () => {
    let valid = false;
    if (otpValues.join('') == 'BIOP') {
      return;
    }
    otpValues.forEach(i => {
      if (i === '') {
        valid = true;
        setOtpError('Enter PIN');
        setOtpValues(initialState);
        setFocusedIndex(0);
      }
    });

    if (!valid) {
      setLoading(true);
      const { result, msg } = await dispatch(
        VerifyPin({ login_pin: otpValues.join('') }, updateAccessToken),
      );

      if (!result) {
        setOtpError(msg);
        setLoading(false);
      } else {
        resetAndNavigate('StockScreen');
      }
    }
  };

  const handleBiometricVerification = async () => {
    const { msg, result } = await dispatch(
      loginWithBiometrics(user.userId || ''),
    );

    if (!result) {
      setOtpError(msg);
      return;
    }

    if (result) {
      setOtpValues(['B', 'I', 'O', 'P']);
      resetAndNavigate('BottomTab');
    }
  };

  useEffect(() => {
    const allFilled = otpValues.every(value => value !== '');
    if (allFilled) {
      handlePressCheckMark();
    }
  }, [otpValues]);

  useEffect(() => {
    handleBiometricVerification();
  }, []);

  return (
    <CustomSafeAreaView>
      <View style={styles.container}>
        <CenteredLogo
          icon={<Icon name="lock-closed" size={RFValue(16)} color={'#fff'} />}
        />
        <CustomText
          fontFamily={FONTS.Medium}
          variant="h3"
          style={{ marginTop: 24 }}
        >
         Enter App Pin
        </CustomText>
        <CustomText style={{opacity : 0.36}}>
            {user.email}
        </CustomText>

        <DiamondOTPInput
            loading={loading}
            otpValues={otpValues}
            error={otpError}
            onForgotPin={onForgotPin}
        />

      </View>

      <CustomNumberPad
        onPressBackspace={handlePressBackspace}
        onPressCheckmark={handlePressCheckMark}
        onPressNumber={handlePressNumber}
        isBiometric={true}
        onPressBiometric={handleBiometricVerification}
      />
    </CustomSafeAreaView>
  );
};

export default BiometricVerification;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  img: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    borderRadius: 50,
  },
});
