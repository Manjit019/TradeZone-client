import { Button, Image, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import DotLoading from '@components/global/DotLoading';
import CustomText from '@components/global/CustomText';
import Toast from 'react-native-toast-message';
import { FONTS } from '@constants/Fonts';
import { useAppDispatch } from '@store/reduxHook';
import { token_storage } from '@store/storage';
import { resetAndNavigate } from '@utils/NavigationUtil';
import { jwtDecode } from 'jwt-decode';
import { refresh_token } from 'services/apiConfig';
import { CheckProfile } from '@store/actions/userAction';

interface DecodedToken {
  exp: number;
}

const SplashScreen = () => {
  const dispatch = useAppDispatch();

  const tokenCheck = async () => {
    const app_access_token = token_storage.getString(
      'app_access_token',
    ) as string;

    const app_refresh_token = token_storage.getString(
      'app_refresh_token',
    ) as string;

    if (app_access_token) {
      const decodedAccessToken = jwtDecode<DecodedToken>(app_access_token);
      const decodedRefreshToken = jwtDecode<DecodedToken>(app_refresh_token);

      const currentTime = Date.now() / 1000;

      if (decodedRefreshToken?.exp < currentTime) {
        resetAndNavigate('LoginScreen');
        Toast.show({
          type: 'warningToast',
          props: {
            msg: 'Session Expired! Please login again.',
          },
        });
        return;
      }

      if (decodedAccessToken?.exp < currentTime) {
        try {
          refresh_token('app', true);
          await dispatch(CheckProfile);
        } catch (error) {
          console.log(error);
          Toast.show({
            type: 'warningToast',
            props: {
              msg: 'Session Expired! Please login again.',
            },
          });
          return;
        }
      } else {
        await dispatch(CheckProfile);
      }
      return;
    }
    resetAndNavigate('LoginScreen');
  };

  useEffect(() => {
    async function deepLinks() {
      await tokenCheck();
    }

    const timeoutId = setTimeout(deepLinks, 3000);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <CustomSafeAreaView>
      <View style={styles.container}>
        <Image
          source={require('@assets/images/tradezone.jpg')}
          style={styles.logo}
        />

        <CustomText
          fontSize={24}
          fontFamily={FONTS.Bold}
          style={{ marginBottom: 6, marginTop: 6 }}
        >
          TradeZone
        </CustomText>
        <CustomText fontSize={11} style={{ marginBottom: 20, opacity: 0.6 }}>
          ● Insight ● Execution ● Growth ●
        </CustomText>
        <DotLoading />
      </View>
      <CustomText style={{ textAlign: 'center', opacity: 0.8 }}>
        Made with ‪‪❤︎‬ by 𓆩Manjit𓆪
      </CustomText>
    </CustomSafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    objectFit: 'cover',
    borderRadius: 50,
    marginBottom: 50,
  },
});
