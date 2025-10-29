import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useAppDispatch } from '@store/reduxHook';
import { UpdateProfile } from '@store/actions/userAction';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import BackButton from '@components/global/BackButton';
import CustomText from '@components/global/CustomText';
import { FONTS } from '@constants/Fonts';
import { globalStyles } from '@styles/globalStyle';
import CustomButton from '@components/global/CustomButton';
import Icon  from 'react-native-vector-icons/Ionicons';
import CustomInput from '@components/inputs/CustomInput';
import CustomDateInput from '@components/inputs/CustomDateInput';
import CustomRadioInput from '@components/inputs/CustomRadioInput';

interface InputStateProps {
  name : string;
  date_of_birth : string;
  gender : string;
}

const PersonalDetails = () => {

  const [inputs,setInputs] = useState<InputStateProps>({
    name : '',
    date_of_birth : '',
    gender : ''
  });

  const dispatch = useAppDispatch();
  const [errors,setErrors] = useState<{[key : string] : string | undefined}>({});

  const [loading,setLoading] = useState(false);
  const [isFormValid,setIsFormValid] = useState(false);


  const handleOnChange = (text : string,fieldName : string) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      [fieldName] : text
    }));
  }

  const validateForm = () => {
    const newErrors:{[key : string]:string|undefined} = {};
    if(!inputs.name.trim()){
      newErrors.name = "Name is required";
    };
    if(!inputs.gender.trim()){
      newErrors.gender = "Gender is required";
    };
    if(!inputs.date_of_birth.trim()){
      newErrors.date_of_birth = "Date of Birth is required"
    };

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);

    return Object.keys(newErrors).length === 0;
  }

  const handleOnSubmit = async () => {
    if(validateForm()){
      setLoading(true);
      await dispatch(UpdateProfile(inputs));
      setLoading(false);
    }
  }

  return (
    <CustomSafeAreaView>
      <BackButton customStyle={styles.backBtn}  />
      <CustomText fontFamily={FONTS.Bold} variant='h2' style={{marginVertical  :20}}>
        Personal Details
      </CustomText>

      <CustomInput
        label='FULL NAME (As per your Pan Card) '
        returnKeyLabel='done'
        value={inputs.name}
        error={errors?.name}
        onChangeText={text => handleOnChange(text,'name')}
        placeholder='Enter your full name'
      />

      <CustomDateInput
        label='DATE OF BIRTH'
        error={errors?.date_of_birth}
        onDateChange={text => handleOnChange(text,'date_of_birth')}
      />

      <CustomRadioInput
        label='GENDER'
        error={errors?.gender}
        options={['male','female','others']}
        onSelect={(text :string) => {
          return handleOnChange(text,'gender');
        }}
        selected={inputs.gender}
      />

      <View style={globalStyles.absoluteBottom}>
          <CustomButton
            text={'Continue'}
            disabled={loading}
            loading={loading}
            onPress={handleOnSubmit}
            textStyle={{ color: '#10181cff' }}
            icon={<Icon name="caret-forward" size={16} />}
            iconPosition="right"
          />
        </View>
    </CustomSafeAreaView>
  )
}

export default PersonalDetails

const styles = StyleSheet.create({
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
})