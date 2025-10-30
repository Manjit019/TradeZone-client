import CustomText from '@components/global/CustomText';
import { FONTS } from '@constants/Fonts';
import { useTheme } from '@react-navigation/native';
import { FC } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import DottedLine from '@assets/images/dotted.png'
import Icon  from 'react-native-vector-icons/Ionicons';

interface SeperatorProps {
  label: string;
  seeMore?:boolean;
}

const Seperator: FC<SeperatorProps> = ({ label, seeMore }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <CustomText variant='h5' fontFamily={FONTS.Medium}>{label}</CustomText>
      {seeMore && (
        <TouchableOpacity activeOpacity={0.8} style={styles.seeMore}>
            <CustomText style={{color : colors.primary}}>See More</CustomText>
            {/* <Image source={DottedLine} style={styles.img} /> */}
            <Icon name='chevron-forward' color={'#fff'} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Seperator;

const styles = StyleSheet.create({
    container : {
        marginVertical : 20,
        flexDirection : 'row',
        justifyContent: 'space-between',
        alignItems : 'center'
    },
    seeMore : {
        flexDirection : 'row',
        alignItems : 'center',
        gap : 5,
        backgroundColor : '#b0cfdc08',
        padding : 6,
        borderRadius : 10,
        paddingHorizontal : 10
    },
    img : {
        height : 3,

    }
});
