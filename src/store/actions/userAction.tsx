import { CHECK_EMAIL, EMAIL_LOGIN, SEND_OTP, VERIFY_OTP } from '@services/API';
import { appAxios } from '@services/apiConfig';
import { setUser } from '@store/reducers/userSlice';
import { token_storage } from '@store/storage';
import { navigate, resetAndNavigate } from '@utils/NavigationUtil';
import axios from 'axios';
import Toast from 'react-native-toast-message';

export const CheckProfile = async (dispatch: any) => {
  try {
    const res = await appAxios.get('/auth/profile');
    await dispatch(setUser(res.data));

    const { userId, email, login_pin_exist, phone_exist, name } = res.data;

    if (!phone_exist) {
      resetAndNavigate('PhoneScreen');
    } else if (!name) {
      resetAndNavigate('PersonalDetailScreen');
    } else if (!login_pin_exist) {
      resetAndNavigate('PinScreen');
    } else {
      resetAndNavigate('AuthVerificationScreen');
    }
  } catch (error) {
    console.log('Profile check error : ', error);
  }
};

interface CheckEmail {
  email: string;
}

export const CheckEmail = (data: CheckEmail) => async (dispatch: any) => {
  try {
    const res = await axios.post(CHECK_EMAIL, data);

    let path = res.data.isExist ? 'EmailPasswordScreen' : 'EmailOtpScreen';

    navigate(path, { email: data.email });
  } catch (error) {
    Toast.show({
      type: 'warningToast',
      props: {
        msg: 'We are not able to connect to our server, please try again later.',
      },
    });
    console.log('check email error : ', error);
  }
};

interface EmailLogin {
  email: string;
  password: string;
}
export const LoginWithEmail = (data: EmailLogin) => async (dispatch: any) => {
  try {
    const res = await axios.post(EMAIL_LOGIN, data);

    token_storage.set('app_access_token', res.data.tokens.access_token);
    token_storage.set('app_refresh_token', res.data.tokens.refresh_token);

    await dispatch(setUser(res.data.user));

    const { userId, email, login_pin_exist, phone_exist, name } = res.data;

    if (!phone_exist) {
      resetAndNavigate('PhoneScreen');
    } else if (!name) {
      resetAndNavigate('PersonalDetailScreen');
    } else if (!login_pin_exist) {
      resetAndNavigate('PinScreen');
    } else {
      resetAndNavigate('AuthVerificationScreen');
    }
  } catch (error: any) {
    Toast.show({
      type: 'normalToast',
      props: {
        msg: error?.response?.data?.msg,
      },
    });
    console.log(error);
  }
};

interface SendOTP {
  email: string;
  otp_type: string;
}

export const SendOTP = (data: SendOTP) => async (dispatch: any) => {
  try {
    const res = await axios.post(SEND_OTP, data);

    Toast.show({
      type: 'normalToast',
      props: {
        msg: res?.data?.msg,
      },
    });
  } catch (error: any) {
    Toast.show({
      type: 'normalToast',
      props: {
        msg: error?.response?.data?.msg,
      },
    });
    console.log('send otp error : ', error);
  }
};

interface VerifyOTP {
  email: string;
  otp_type: string;
  otp: number | string;
  data?: any;
}
export const VerifyOTP = (data: VerifyOTP) => async (dispatch: any) => {
  try {
    const res = await axios.post(VERIFY_OTP, data);

    if (data.otp_type === 'phone') {
      resetAndNavigate('PersonalDetailScreen');
    }
    if (data.otp_type === 'email') {
      navigate('RegisterScreen', {
        email: data.email,
        register_token: res.data?.register_token,
      });
    }

    if (data.otp_type === 'reset_password') {
      Toast.show({
        type: 'normalToast',
        props: {
          msg: "Password Reset Successfully! Login Again",
        },
      });
      resetAndNavigate('AuthVerificationScreen');
    }

    if (data.otp_type === 'reset_pin') {
      Toast.show({
        type: 'normalToast',
        props: {
          msg: "PIN Reset Successfully! Login Again",
        },
      });
      resetAndNavigate('LoginScreen');
    }
  } catch (error: any) {
    Toast.show({
      type: 'normalToast',
      props: {
        msg: error?.response?.data?.msg,
      },
    });
    console.log('send otp error : ', error);
  }
};
