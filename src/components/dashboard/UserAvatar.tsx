import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import CustomText from '../global/CustomText';
import { FONTS } from '../../constants/Fonts';
import { RFValue } from 'react-native-responsive-fontsize';

import { navigate } from '../../utils/NavigationUtil';
import { useAppSelector } from '@store/reduxHook';
import { selectUser } from '@store/reducers/userSlice';

interface UserAvatarProps {
  style?: ImageStyle;
}

const pic =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQb5G6DnMqYtGKXRBe2JlnD9f1zwiMuAPemfg&s';

const UserAvatar: React.FC<UserAvatarProps> = ({ style }) => {
  const user = useAppSelector(selectUser);
  return (
    <TouchableOpacity
      onPress={() => {
        navigate('ProfileScreen');
      }}
    >
      {pic ? (
        <Image
          source={{
            uri: pic,
          }}
          style={[styles.img, style]}
        />
      ) : (
        <View style={[styles.img, style]}>
          <CustomText variant="h8" fontFamily={FONTS.Bold}>
            {user?.name?.split(' ')[0].charAt(0)}
            {user?.name?.split(' ')[1].charAt(0)}
          </CustomText>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  img: {
    borderRadius: 40,
    justifyContent: 'center',
    width: RFValue(35),
    height: RFValue(35),
    alignItems: 'center',
    resizeMode: 'cover',
    marginLeft: 8,
    backgroundColor: Colors.light_text,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
});
export default UserAvatar;
