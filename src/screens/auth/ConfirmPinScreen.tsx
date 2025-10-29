import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { navigate } from '@utils/NavigationUtil';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import CustomText from '@components/global/CustomText';
import { FONTS } from '@constants/Fonts';
import CustomNumberPad from '@components/inputs/CustomNumberPad';
import OTPInput from '@components/inputs/OTPInput';
import { useRoute } from '@react-navigation/native';
import { useAppDispatch } from '@store/reduxHook';
import { useWS } from '@utils/WSProvide';
import { SetLoginPin } from '@store/actions/userAction';

const ConfirmPinScreen = () => {
  const [otpValues, setOtpValues] = useState(['', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [otpError, setOtpError] = useState<string | null>(null);

  const router = useRoute() as any;
  const dispatch = useAppDispatch();

  const {updateAccessToken} = useWS();

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

  const handlePressCheckmark = async () => {
    let valid = false;
    const isNotEmpty = otpValues.map(i => {
      if (i == '') {
        valid = true;
        setOtpError('Enter all PIN');
      }
    });
   if(otpValues.toString() != router.params?.pin){
      valid = true;
      setOtpValues(['','','','']);
      setFocusedIndex(0);
      setOtpError('Pin not Matching..')
   }

   if(!valid){
     await dispatch(SetLoginPin({login_pin : otpValues.join('')},updateAccessToken))
   }
  };

  return (
    <CustomSafeAreaView>
    
     <View style={styles.container}>
      <CustomText fontFamily={FONTS.Bold} variant="h2">
        Confirm Your App Pin
      </CustomText>
      <CustomText style={{ opacity: 0.7 }}>
        Please Re-enter your app pin to confim it.
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
  );
};

export default ConfirmPinScreen;

const styles = StyleSheet.create({
    container : {
        justifyContent : 'center',
        alignItems : 'center'
    }
});
