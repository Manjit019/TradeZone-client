import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import CenteredLogo from '@components/global/CenteredLogo';
import CustomText from '@components/global/CustomText';
import CustomInput from '@components/inputs/CustomInput';
import { useRoute } from '@react-navigation/native';
import CustomButton from '@components/global/CustomButton';
import { useAppDispatch } from '@store/reduxHook';
import { validatePassword, validatePasswordEntry } from '@utils/ValidationUtil';
import { LoginWithEmail } from '@store/actions/userAction';
import Icon from 'react-native-vector-icons/Ionicons';
import { screenWidth } from '@utils/Scaling';
import { RFValue } from 'react-native-responsive-fontsize';
import { FONTS } from '@constants/Fonts';
import { globalStyles } from '@styles/globalStyle';

const EmailPasswordScreen = () => {
  const route = useRoute();
  const { email } = route.params as any;

  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validate = () => {
    const {msg,result} = validatePasswordEntry(password, email, email);
    setPasswordError(msg);
    return result;
  };

  const handleOnSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await dispatch(
        LoginWithEmail({ email: email.toLowerCase().trim(), password }),
      );
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomSafeAreaView>
      <View style={styles.container}>
        <CenteredLogo icon={<Icon name='lock-closed' size={RFValue(16)} color={'#fff'} />} />
        <CustomText fontFamily={FONTS.Medium} variant="h4" style={{marginTop : 24}}>
          Password Verification
        </CustomText>

        <View style={{ width: '100%' }}>
          <CustomInput
            value={email}
            disabled={true}
            disabledBackground={true}
            leftIcon={<Icon name="mail" size={RFValue(14)} color={'#a7a7a7ff'} />}
          />

          <CustomInput
            placeholder="Enter Your Password"
            returnKeyType="done"
            value={password}
            focusable={true}
            error={passwordError}
            onEndEditing={validate}
            onChangeText={text => {
              setPassword(text);
              setPasswordError('');
            }}
            onSubmitEditing={handleOnSubmit}
            password={true}
          />
        </View>
      </View>
      <View style={globalStyles.absoluteBottom}>
        <CustomButton
          text="Verify"
          disabled={loading}
          loading={loading}
          onPress={handleOnSubmit}
          textStyle={{ color: '#10181cff' }}
          icon={<Icon name="caret-forward" size={16} />}
          iconPosition="right"
        />
      </View>
    </CustomSafeAreaView>
  );
};

export default EmailPasswordScreen;

const styles = StyleSheet.create({
  container: {
    padding: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

});
