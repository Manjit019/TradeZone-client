import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import BackButton from '@components/global/BackButton';
import CustomText from '@components/global/CustomText';
import { FONTS } from '@constants/Fonts';
import { useAppDispatch } from '@store/reduxHook';
import CustomRadioInput from '@components/inputs/CustomRadioInput';
import CustomButton from '@components/global/CustomButton';
import { globalStyles } from '@styles/globalStyle';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomDateInput from '@components/inputs/CustomDateInput';
import CustomInput from '@components/inputs/CustomInput';
import { validatePasswordEntry } from '@utils/ValidationUtil';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface InputStateProps {
  name: string;
  email: string;
  password: string;
  date_of_birth: string;
  gender: string;
  confirmPassword: string;
}

const RegisterScreen = () => {
  const insets = useSafeAreaInsets();
  const [inputs, setInputs] = useState<InputStateProps>({
    name: '',
    date_of_birth: '',
    gender: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const dispatch = useAppDispatch();
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>(
    {},
  );

  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const handleOnChange = (text: string, fieldName: string) => {
    setInputs(prevInputs => ({
      ...prevInputs,
      [fieldName]: text,
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [fieldName]: undefined,
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string | undefined } = {};
    if (!inputs.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!inputs.gender.trim()) {
      newErrors.gender = 'Gender is required';
    }
    if (!inputs.date_of_birth.trim()) {
      newErrors.date_of_birth = 'Date of Birth is required';
    }
    if (!inputs.email.trim()) {
      newErrors.email = 'Email is required';
    }
    if (!inputs.password.trim()) {
      newErrors.password = 'Enter new password';
    }
    if (!inputs.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Enter confirm password';
    }
    const pwd_validate = validatePasswordEntry(
      inputs.password,
      'test',
      inputs.email,
    );

    if (!pwd_validate.result) {
      newErrors.password = pwd_validate.msg;
    }

    if (inputs?.confirmPassword !== inputs.password) {
      newErrors.confirmPassword = 'Confirm password not match';
    }
    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);

    return Object.keys(newErrors).length === 0;
  };

  const handleOnSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      // await dispatch(RegisterNewUser(inputs));
      setLoading(false);
    }
  };

  return (
    <>
      <View style={[styles.header,{paddingTop : insets.top}]}>
        <BackButton />
        <CustomText variant="h4" fontFamily={FONTS.Medium}>
          New User Registration
        </CustomText>
      </View>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer} >

      <CustomInput
        label="FULL NAME (As per your Pan Card) "
        returnKeyLabel="done"
        value={inputs.name}
        error={errors?.name}
        onChangeText={text => handleOnChange(text, 'name')}
        placeholder="Eg - John Doe"
      />
      <CustomInput
        label="Email ID"
        returnKeyLabel="done"
        value={inputs.email}
        error={errors?.email}
        onChangeText={text => handleOnChange(text, 'email')}
        placeholder="Eg - johndoe@gmail.com"
      />
      <CustomDateInput
        label="DATE OF BIRTH"
        error={errors?.date_of_birth}
        onDateChange={text => handleOnChange(text, 'date_of_birth')}
      />

      <CustomRadioInput
        label="GENDER"
        error={errors?.gender}
        options={['male', 'female', 'others']}
        onSelect={(text: string) => {
          return handleOnChange(text, 'gender');
        }}
        selected={inputs.gender}
      />

      <CustomInput
        label="NEW PASSWORD"
        value={inputs.password}
        placeholder="Enter your new password"
        onChangeText={text => handleOnChange(text, 'password')}
        returnKeyType="done"
        error={errors?.password}
        focusable={true}
        password
      />

      <CustomInput
        label="CONFIRM NEW PASSWORD"
        value={inputs.confirmPassword}
        placeholder="Re-Enter your new password"
        onChangeText={text => handleOnChange(text, 'confirmPassword')}
        returnKeyType="done"
        error={errors?.confirmPassword}
        focusable={true}
      />

      <View style={globalStyles.absoluteBottom}>
        <CustomButton
          text={'Register'}
          disabled={loading}
          loading={loading}
          onPress={handleOnSubmit}
          textStyle={{ color: '#10181cff' }}
          icon={<Icon name="caret-forward" size={16} />}
          iconPosition="right"
        />
      </View>
    </ScrollView >
    </>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'flex-start',
    backgroundColor: '#213c63c6',
    padding: 20,

  },
  scrollContainer : {
    flex : 1,
    padding : 16
  }
});
