import { View, Image, StyleSheet } from 'react-native';
import React, { FC } from 'react';
import Logo from '../../assets/images/tradezone.jpg';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from '@constants/Colors';

const CenteredLogo: FC<{ icon?: React.ReactNode }> = ({ icon }) => {
  return (
    <View style={styles.container}>
      <View style={styles.imgContainer}>
        <Image style={styles.img} source={Logo} />
      </View>
      {icon && <View style={styles.icon}>{icon}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    flexDirection: 'row',
    marginVertical: 16,
  },
  imgContainer: {
    width: RFValue(100),
    height: RFValue(100),
  },
  img: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
    borderRadius: 50,
  },
  icon: {
    position: 'absolute',
    bottom: -12,
    left: '50%',
    transform: [{ translateX: -8 }],
    borderRadius: 60,
    backgroundColor: Colors.border,
    padding: 6,
  },
});

export default CenteredLogo;
