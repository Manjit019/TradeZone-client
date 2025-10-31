import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import React, { useState } from 'react';
import {  useRoute } from '@react-navigation/native';
import { token_storage } from '@store/storage';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import { Colors } from '@constants/Colors';
import CustomButton from '@components/global/CustomButton';
import { navigate } from '@utils/NavigationUtil';
import { screenHeight, screenWidth } from '@utils/Scaling';
import WebView from 'react-native-webview';
import { TRADINGVIEW_WEB_URI } from '@services/API';
import TradingViewHeader from '@components/stocks/TradingViewHeader';

interface ParamsType {
  stock?: any;
}
const TradingView = () => {
  const route = useRoute();
  const stockData = (route.params as ParamsType)?.stock || null;

  const socketToken = token_storage.getString('socket_access_token');
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);

  console.log(
    `${TRADINGVIEW_WEB_URI}/?theme=dark&stock=${stockData.symbol}&access_token=${socketToken}`,
  );

  return (
    <CustomSafeAreaView style={styles.container}>
      <TradingViewHeader />
      <WebView
        source={{
          uri: `${TRADINGVIEW_WEB_URI}/?theme=dark&stock=${stockData.symbol}&access_token=${socketToken}`,
        }}
        allowFileAccessFromFileURLs={true}
        domStorageEnabled={true}
        onLoadEnd={() => {
          setTimeout(() => {
            setLoading(false);
          }, 600);
        }}
        bounces={false}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        originWhitelist={['*']}
        onShouldStartLoadWithRequest={() => true}
        style={{
          flex: 1,
          backgroundColor: Colors.background,
          right: -1,
        }}
        onHttpError={err => {
          if (err.nativeEvent.description.includes('net')) {
            setNetworkError(true);
          }
        }}
        
      />

      <View style={[styles.btnContainer]}>
        <CustomButton
          text="SELL"
          loading={loading}
          disabled={loading}
          onPress={() =>
            navigate('Transaction', { type: 'SELL', stock: stockData })
          }
          style={[styles.btn, { backgroundColor: Colors.loss }]}
        />
        <CustomButton
          text="BUY"
          loading={loading}
          disabled={loading}
          onPress={() =>
            navigate('Transaction', { type: 'BUY', stock: stockData })
          }
          style={[styles.btn, { backgroundColor: Colors.profit }]}
        />
      </View>

      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.themeColor} />
        </View>
      )}
    </CustomSafeAreaView>
  );
};

export default TradingView;

const styles = StyleSheet.create({
  container: {
    padding: 0,
    paddingHorizontal: 0,
  },
  loaderContainer: {
    width: screenWidth,
    height: screenHeight,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
    backgroundColor: Colors.background,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    borderRadius: 17,
    padding: 10,
  },
  btn: {
    borderRadius: 16,
    width: '48%',
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
