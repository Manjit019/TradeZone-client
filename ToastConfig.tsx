import React from 'react';
import CustomToastMessage from '@components/global/CustomToastMessage';

interface ToastConfigProps {
  msg: string;
}
 
export const toastConfig = {
  successToast: ({ props }: { props: ToastConfigProps }) => (
    <CustomToastMessage type="successToast" msg={props.msg} />
  ),

  warningToast: ({ props }: { props: ToastConfigProps }) => (
    <CustomToastMessage type="warningToast" msg={props.msg} />
  ),

  normalToast: ({ props }: { props: ToastConfigProps }) => (
    <CustomToastMessage type="normalToast" msg={props.msg} />
  ),
};

export default { toastConfig };
