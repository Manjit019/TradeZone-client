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
import ProfileScreen from '@screens/profile/ProfileScreen';
import Stock from '@screens/stock/Stock';
import TradingView from '@screens/stock/TradingView';
import Transaction from '@screens/stock/Transaction';
import TransactionSuccess from '@screens/stock/TransactionSuccess';

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
  },{
    name : 'TradingView',
    component : TradingView
  },{
    name : 'Transaction',
    component : Transaction
  },
  {
    name : 'TransactionSuccess',
    component : TransactionSuccess
  }
];


export const profileStacks = [
  {
    name : 'ProfileScreen',
    component : ProfileScreen
  }
]

export const mergedStacks = [...authStacks, ...dashboardStacks,...profileStacks];
