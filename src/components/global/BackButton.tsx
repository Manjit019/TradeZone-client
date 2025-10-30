import { StyleSheet, TextStyle, TouchableOpacity, ViewStyle } from "react-native";
import React, { FC } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";
import { RFValue } from "react-native-responsive-fontsize";
import { goBack, navigate } from "../../utils/NavigationUtil";

interface BackButtonProps {
  path?: string;
  customStyle ?: ViewStyle | ViewStyle[] | TextStyle |any;
  withBg ?: boolean;
}
const BackButton: FC<BackButtonProps> = ({ path,customStyle,withBg }) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
        style={[styles.container,customStyle,withBg && styles.backBtn]}
      onPress={() => {
        path ? navigate(path) : goBack();
      }}
    >
      <Icon name="chevron-back" color={customStyle?.color || withBg ? '#000' : colors.text} size={RFValue(20)} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 4,
  },
   backBtn : {
    backgroundColor : '#fff',
    padding : 10,
    borderRadius : 70,
    width : 50,
    height : 50,
    color : '#0d0c0cff',
    justifyContent : 'center',
    alignItems : 'center'
  }
});
export default BackButton;
