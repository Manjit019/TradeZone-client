import { StyleSheet, TextStyle, TouchableOpacity, ViewStyle } from "react-native";
import React, { FC } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";
import { RFValue } from "react-native-responsive-fontsize";
import { goBack, navigate } from "../../utils/NavigationUtil";

interface BackButtonProps {
  path?: string;
  customStyle ?: ViewStyle | ViewStyle[] | TextStyle |any;
}
const BackButton: FC<BackButtonProps> = ({ path,customStyle }) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
        style={[styles.container,customStyle]}
      onPress={() => {
        path ? navigate(path) : goBack();
      }}
    >
      <Icon name="chevron-back" color={customStyle?.color ||colors.text} size={RFValue(20)} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingVertical: 4,
    marginBottom: 8,
  },
});
export default BackButton;
