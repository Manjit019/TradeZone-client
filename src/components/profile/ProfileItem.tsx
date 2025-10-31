import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { FC } from 'react';
import { Colors } from '@constants/Colors';
import CustomText from '@components/global/CustomText';
import { FONTS } from '@constants/Fonts';

interface ProfileItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onPress?: () => {};
  danger?: boolean;
}

const ProfileItem: FC<ProfileItemProps> = ({
  description,
  icon,
  title,
  danger,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.itemCard,
        danger
          ? {
              backgroundColor: '#fc7c7c32',
              borderColor: '#922727d2',
              borderWidth: 1,
            }
          : {},
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          danger ? { backgroundColor: '#ff3f3fc6' } : {},
        ]}
      >
        {icon}
      </View>
      <View>
        <CustomText
          variant="h6"
          fontFamily={FONTS.Medium}
          style={{ color: danger ? 'red' : '' }}
        >
          {title}
        </CustomText>
        <CustomText style={{ opacity: 0.7, color: danger ? '#c18d8dff' : '' }}>
          {description}
        </CustomText>
      </View>
    </TouchableOpacity>
  );
};

export default ProfileItem;

const styles = StyleSheet.create({
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 15,
    borderRadius: 16,
    backgroundColor: Colors.background_light,
    marginBottom: 10,
  },
  iconContainer: {
    width: 40,
    aspectRatio: 1,
    borderRadius: 50,
    backgroundColor: Colors.dark_background_light,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
