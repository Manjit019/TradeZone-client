import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import ProfileHeader from '@components/profile/ProfileHeader';
import UserAvatar from '@components/dashboard/UserAvatar';
import CustomText from '@components/global/CustomText';
import { useAppSelector } from '@store/reduxHook';
import { selectUser } from '@store/reducers/userSlice';
import { FONTS } from '@constants/Fonts';
import Icon from 'react-native-vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';
import ProfileItem from '@components/profile/ProfileItem';
import { Colors } from '@constants/Colors';

const ProfileScreen = () => {
  const user = useAppSelector(selectUser);

  const MENUS = [
    {
      heading: 'Quick Actions',
      items: [
        {
          icon: <Icon name="gift" size={RFValue(20)} />,
          title: 'Refer',
          subTitle: 'Invite Friends on the app',
        },
        {
          icon: <Icon name="wallet" size={RFValue(20)} />,
          title: `₹${user.balance}`,
          subTitle: 'Stocks,F&O Balance',
        },
      ],
    },

    {
      heading: 'Account',
      items: [
        {
          icon: <Icon name="bag" size={RFValue(20)} />,
          title: 'All Orders',
          subTitle: 'Track orders,order details',
        },
        {
          icon: <Icon name="business" size={RFValue(20)} />,
          title: 'Bank Details',
          subTitle: 'Banks & AutoPay services',
        },
      ],
    },
    {
      heading: 'Danger Zone',
      isDanger: true,
      items: [
        {
          icon: <Icon name="log-out" size={RFValue(20)} />,
          title: 'Log Out',
          subTitle: 'Log out the app',
        },
      ],
    },
  ];

  return (
    <CustomSafeAreaView>
      <ProfileHeader />

      <View style={styles.profileContainer}>
        <UserAvatar style={{ width: 80, height: 80 }} />
        <CustomText fontFamily={FONTS.Bold} variant="h5">
          {user.name}
        </CustomText>
        <TouchableOpacity activeOpacity={0.8} style={styles.btn}>
            <CustomText style={{color : Colors.themeColor}}>Account Details</CustomText>
            <Icon name='chevron-right' color={Colors.themeColor} />
        </TouchableOpacity>
      </View>

      <View style={styles.quickActionContainer}>
        {MENUS.map((curMenu, index) => (
          <View key={index} style={{ marginBottom: 16 }}>
            <CustomText variant="h7" style={{ marginBottom: 10 }}>
              {curMenu.heading}
            </CustomText>
            {curMenu.items.map((item, itemIndex) => (
              <ProfileItem
                key={itemIndex}
                icon={item.icon}
                title={item.title}
                description={item.subTitle}
                danger={curMenu.isDanger}
              />
            ))}
          </View>
        ))}
      </View>
    </CustomSafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  profileContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginVertical: 16,
    marginBottom: 30,
  },
  quickActionContainer: {},
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#b0cfdc08',
    padding: 6,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
});
