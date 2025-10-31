import { CHECK_EMAIL, EMAIL_LOGIN, SEND_OTP, VERIFY_OTP } from '@services/API';
import { appAxios } from '@services/apiConfig';
import { setUser } from '@store/reducers/userSlice';
import { token_storage } from '@store/storage';
import { persistor } from '@store/store';
import { deleteBiometricPublicKey } from '@utils/BiometricUtil';
import { navigate, resetAndNavigate } from '@utils/NavigationUtil';
import axios from 'axios';
import Toast from 'react-native-toast-message';

export const CheckProfile = async (dispatch: any) => {
  try {
    const res = await appAxios.get('/auth/profile');

    console.log('Check profile res : ', res);

    await dispatch(setUser(res.data));

    const { login_pin_exists, phone_exist, name } = res.data;

    if (!phone_exist) {
      resetAndNavigate('PhoneScreen');
    } else if (!name) {
      resetAndNavigate('PersonalDetailScreen');
    } else if (!login_pin_exists) {
      resetAndNavigate('PinScreen');
    } else {
      resetAndNavigate('AccountProtectedScreen');
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

    console.log('CheckEmail res : ', res.data);

    let path = res.data.isExists ? 'EmailPasswordScreen' : 'EmailOtpScreen';

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
    console.log('Login With email res : ', res.data);

    token_storage.set('app_access_token', res.data.tokens.access_token);
    token_storage.set('app_refresh_token', res.data.tokens.refresh_token);

    await dispatch(setUser(res.data.user));

    const { login_pin_exist, phone_exist, name } = res.data?.user;

    if (!phone_exist) {
      resetAndNavigate('PhoneScreen');
    } else if (!name) {
      resetAndNavigate('PersonalDetailScreen');
    } else if (!login_pin_exist) {
      resetAndNavigate('PinScreen');
    } else {
      resetAndNavigate('AccountProtectedScreen');
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
          msg: 'Password Reset Successfully! Login Again',
        },
      });
      resetAndNavigate('AuthVerificationScreen');
    }

    if (data.otp_type === 'reset_pin') {
      Toast.show({
        type: 'normalToast',
        props: {
          msg: 'PIN Reset Successfully! Login Again',
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

interface UpdateProfile {
  name: string;
  date_of_birth: string;
  gender: string;
}
export const UpdateProfile = (data: UpdateProfile) => async (dispatch: any) => {
  try {
    const res = await appAxios.put('/auth/profile', data);

    resetAndNavigate('PinScreen');
  } catch (error: any) {
    Toast.show({
      type: 'normalToast',
      props: {
        msg: error?.response?.data?.msg,
      },
    });
    console.log('UPdate profile error : ', error);
  }
};

interface SetLoginPin {
  login_pin: string;
}

export const SetLoginPin =
  (data: SetLoginPin, updateHook: () => void) => async (dispatch: any) => {
    try {
      const res = await appAxios.post('/auth/set-pin', data);

      token_storage.set(
        'socket_access_token',
        res.data.socket_tokens.access_token,
      );
      token_storage.set(
        'socket_refresh_token',
        res.data.socket_tokens.refresh_token,
      );

      updateHook();

      resetAndNavigate('AccountProtectedScreen');
    } catch (error: any) {
      Toast.show({
        type: 'normalToast',
        props: {
          msg: error?.response?.data?.msg,
        },
      });
      console.log('UPdate profile error : ', error);
    }
  };

interface VerifyPin {
  login_pin: string;
}
export const VerifyPin =
  (data: VerifyPin, updateHook: () => void) => async (dispatch: any) => {
    try {
      const res = await appAxios.post('/auth/verify-pin', data);

      const access_token = res.data.socket_tokens.socket_access_token;
      token_storage.set('socket_access_token', access_token);
      token_storage.set(
        'socket_refresh_token',
        res.data.socket_tokens.socket_refresh_token,
      );

      updateHook();

      return { msg: 'Success', result: true };
    } catch (error: any) {
      console.log('Verify pin error', error);
      return { msg: error?.response?.data?.msg, result: false };
    }
  };

export const Logout = () => async (dispatch: any) => {
  try {
    const res = await appAxios.post('/auth/logout');

    await token_storage.clearAll();
    await persistor.purge();
    resetAndNavigate('LoginScreen');
    await deleteBiometricPublicKey();
  } catch (error) {
    await token_storage.clearAll();
    await persistor.purge();
    resetAndNavigate('LoginScreen');
    console.log('Log out err', error);
  }
};

function updateHook(dispatch: any, data: any) {
  // Optionally update user state or perform side effects after setting PIN
  if (data?.user) {
    dispatch(setUser(data.user));
  }
}

export const refetchUser = () => async (dispatch: any) => {
  try {
    const res = await appAxios.get('/auth/profile');
    await dispatch(setUser(res.data));
  } catch (error) {
    console.log('Refetch user err : ', error);
  }
};
