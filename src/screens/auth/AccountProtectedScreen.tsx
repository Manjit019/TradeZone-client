import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import BiometricVerification from './BiometricVerification';
import ResetPin from './ResetPin';

const AccountProtectedScreen = () => {

    const [authScreen,setAuthScreen] = useState('Biometrics');

  return (
    <>
       {authScreen === 'Biometrics' ? (
        <BiometricVerification onForgotPin={()=>setAuthScreen('ResetPin')} />
       ): (
        <ResetPin />
       )}
    </>
  )
}

export default AccountProtectedScreen

const styles = StyleSheet.create({})