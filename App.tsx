import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Navigation from '@navigation/Navigation';
import { Provider } from 'react-redux';
import { persistor, store } from '@store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { toastConfig } from './ToastConfig';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import { WEB_CLIENT_ID } from '@config/env';

GoogleSignin.configure({
  webClientId : WEB_CLIENT_ID,
  forceCodeForRefreshToken : true,
  offlineAccess : false,
  iosClientId : WEB_CLIENT_ID,
});

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Navigation />
        </PersistGate>
      </Provider>
      <Toast
        visibilityTime={3000}
        config={toastConfig}
        bottomOffset={0}
        swipeable={true}
        position='bottom'
      />
    </GestureHandlerRootView>
  );
};

export default App;
