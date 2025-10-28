import { appAxios } from '@services/apiConfig';
import { setUser } from '@store/reducers/userSlice';
import { resetAndNavigate } from '@utils/NavigationUtil';

export const CheckProfile = async (dispatch: any) => {
  try {
    const res = await appAxios.get('/auth/profile');
    const { userId, email, login_pin_exist, phone_exist, name } = res.data;

    await dispatch(setUser(res.data));

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
