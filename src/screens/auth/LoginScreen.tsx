import { Image, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import CustomText from '@components/global/CustomText';
import SocialLoginButton from '@components/auth/SocialLoginButton';
import Icon from 'react-native-vector-icons/Ionicons';
import GoogleIcon from '@assets/images/google.png';
import { useDispatch } from 'react-redux';
import { signInWithApple, signInWithGoogle } from '@store/SocialLogin';
import { useAppDispatch } from '@store/reduxHook';
import { FONTS } from '@constants/Fonts';
import CustomInput from '@components/inputs/CustomInput';
import BreakerText from '@components/global/BreakerText';
import CustomButton from '@components/global/CustomButton';
import { Colors } from '@constants/Colors';
import { validateEmail } from '@utils/ValidationUtil';
import { CheckEmail } from '@store/actions/userAction';
import { resetAndNavigate } from '@utils/NavigationUtil';

const LoginScreen = () => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validate = () => {
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleOnSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await dispatch(CheckEmail({ email: email.toLowerCase().trim() }));
      resetAndNavigate('EmailPasswordScreen',{email})
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomSafeAreaView>
      <View style={styles.container}>
        <View style={[styles.flexRowBetween, { width: '100%' }]}>
          <View>
            <CustomText
              fontSize={28}
              fontFamily={FONTS.Bold}
              style={styles.headline}
            >
              Sign In
            </CustomText>
            <CustomText
              fontSize={28}
              fontFamily={FONTS.Bold}
              style={[styles.headline, { opacity: 0.4 }]}
            >
              To continue,
            </CustomText>
          </View>
          <Image
            source={require('@assets/images/tradezone.jpg')}
            style={styles.logoApp}
          />
        </View>
      </View>
      <SocialLoginButton
        icon={<Image source={GoogleIcon} style={styles.gimg} />}
        onPress={async () => await dispatch(signInWithGoogle())}
        text="Sign in with Google"
      />

      <SocialLoginButton
        icon={<Icon name="logo-apple" size={18} color={'#f9f9f9ff'} />}
        onPress={async () => await signInWithApple(dispatch)}
        text="Sign in with Apple"
      />

      <BreakerText text="OR" />

      <CustomText style={{ marginTop: 20 }}>Sign in with Email ID</CustomText>

      <CustomInput
        placeholder="Eg : johndoe@gmail.com"
        returnKeyType="done"
        value={email}
        inputMode="email"
        focusable={true}
        error={emailError}
        onEndEditing={validate}
        onChangeText={text => {
          setEmail(text);
          setEmailError('');
        }}
        onSubmitEditing={handleOnSubmit}
      />

      <CustomButton
        text="Continue"
        disabled={loading}
        loading={loading}
        onPress={handleOnSubmit}
        style={{ marginTop: 20, marginBottom: 10 }}
        textStyle={{ color: '#10181cff' }}
        icon={<Icon name="caret-forward" size={16} />}
        iconPosition="right"
      />

      <CustomText fontSize={10} style={{ opacity: 0.75 }}>
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </CustomText>

      <View style={styles.madeWith}>
        <CustomText style={{ textAlign: 'center' }}>
          Made with ‪‪❤︎‬ by 𓆩Manjit𓆪
        </CustomText>
      </View>
    </CustomSafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headline: {
    width: '100%',
    alignSelf: 'flex-start',
  },
  flexRowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
  },
  gimg: {
    width: 20,
    height: 20,
    objectFit: 'contain',
  },
  logoApp: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    borderRadius: 100,
  },
  madeWith: {
    textAlign: 'center',
    opacity: 0.8,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20,
  },
});
