import AccountProtectedScreen from '@screens/auth/AccountProtectedScreen';
import AuthVerification from '@screens/auth/AuthVerification';
import ConfirmPinScreen from '@screens/auth/ConfirmPinScreen';
import EmailOtpScreen from '@screens/auth/EmailOtpScreen';
import EmailPasswordScreen from '@screens/auth/EmailPasswordScreen';
import ForgotPasswordScreen from '@screens/auth/ForgotPasswordScreen';
import LoginScreen from '@screens/auth/LoginScreen';
import PersonalDetails from '@screens/auth/PersonalDetails';
import PhoneScreen from '@screens/auth/PhoneScreen';
import PinScreen from '@screens/auth/PinScreen';
import RegisterScreen from '@screens/auth/RegisterScreen';
import SplashScreen from '@screens/onboarding/SplashScreen';
import Stock from '@screens/stock/Stock';

export const authStacks = [
  {
    name: 'SplashScreen',
    component: SplashScreen,
  },
  {
    name: 'LoginScreen',
    component: LoginScreen,
  },
  {
    name: 'PersonalDetailScreen',
    component: PersonalDetails,
  },
  {
    name : 'RegisterScreen',
    component : RegisterScreen
  },
  {
    name: 'PhoneScreen',
    component: PhoneScreen,
  },
  {
    name: 'AuthVerificationScreen',
    component: AuthVerification,
  },
  {
    name: 'PinScreen',
    component: PinScreen,
  },
   {
    name: 'EmailPasswordScreen',
    component: EmailPasswordScreen,
  },
   {
    name: 'EmailOtpScreen',
    component: EmailOtpScreen,
  },
  {
    name : 'ConfirmPinScreen',
    component : ConfirmPinScreen,
  },
  {
    name : 'AccountProtectedScreen',
    component : AccountProtectedScreen
  },
  {
    name : 'ForgotPasswordScreen',
    component : ForgotPasswordScreen
  }
];

export const dashboardStacks = [
  {
    name : 'StockScreen',
    component : Stock
  }
];

export const mergedStacks = [...authStacks, ...dashboardStacks];
