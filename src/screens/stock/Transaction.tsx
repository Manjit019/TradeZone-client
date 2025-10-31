import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '@store/reduxHook';
import {
  ParamListBase,
  RouteProp,
  useRoute,
  useTheme,
} from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectUser } from '@store/reducers/userSlice';
import { selectHoldings } from '@store/reducers/stockSlice';
import { useWS } from '@utils/WSProvide';
import { refetchUser } from '@store/actions/userAction';
import {
  BuyStock,
  getAllHoldings,
  SellStock,
} from '@store/actions/stockAction';
import Toast from 'react-native-toast-message';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import TransactionHeader from '@components/stocks/TransactionHeader';
import CustomText from '@components/global/CustomText';
import { FONTS } from '@constants/Fonts';
import { formatPaisaWithCommas } from '@utils/NumberUtil';
import CustomButton from '@components/global/CustomButton';

interface ParamsType {
  stock?: any;
  type?: string;
}

type Stock = {
  __v: number;
  _id: string;
  companyName: string;
  currentPrice: number;
  iconUrl: string;
  lastDayTradedPrice: number;
  symbol: string;
  dayTimeSeries: Array<TimeSeries>;
  tenMinTimeSeries: Array<TimeSeries>;
};

type TimeSeries = {
  _internal_originalTime: number;
  close: number;
  open: number;
  low: number;
  high: number;
  time: number;
  timestamp: string;
};

const Transaction = () => {
  const dispatch = useAppDispatch();

  const route = useRoute<RouteProp<ParamListBase>>();
  const stockData = (route.params as ParamsType)?.stock || null;
  const transaction_type = (route.params as ParamsType)?.type || null;
  const { colors } = useTheme();
  const user = useSelector(selectUser);
  const holdings = useSelector(selectHoldings);
  const socketService = useWS();
  const [stockSocketData, setStockSocketData] = useState<Stock | null>(null);
  const [formState, setFormState] = useState({
    quantity: 0,
    loading: false,
    disabled: false,
    error: false,
  });

  useEffect(() => {
    dispatch(refetchUser());
    dispatch(getAllHoldings());
  }, []);

  useEffect(() => {
    if (socketService && stockData.symbol) {
      socketService.emit('subscribeToStocks', stockData.symbol);
      socketService.on(stockData.symbol, data => {
        setStockSocketData(data);
      });
      return () => {};
    }
  }, [socketService]);

  const handleQuantityChange = (text: string) => {
    const parsedQuantity = parseInt(text, 10);
    if (!isNaN(parsedQuantity)) {
      setFormState({
        ...formState,
        quantity: parsedQuantity,
        disabled: parsedQuantity < 0 || parsedQuantity > 1000,
      });
    } else {
      setFormState({
        ...formState,
        quantity: 0,
        disabled: true,
      });
    }
  };

  const buyTransaction = async () => {
    if (formState.quantity != 0) {
      await dispatch(
        BuyStock({
          stock_id: stockData?._id,
          quantity: formState.quantity,
          amount:
            formState.quantity * (stockSocketData?.currentPrice as number),
          companyName: stockData?.companyName,
        }),
      );
    } else {
      Toast.show({
        type: 'warningToast',
        props: {
          msg: 'Quantity should be more than 0.',
        },
      });
    }
  };

  const sellTransaction = async () => {
    const holding = holdings.find(
      (h: any) => h.stock.symbol === stockData?.symbol,
    ) as any;

    if (
      holding &&
      formState.quantity != 0 &&
      formState.quantity <= holding?.quantity
    ) {
      await dispatch(
        SellStock({
          holdingId: stockData?._id,
          quantity: formState.quantity,
          amount:
            formState.quantity * (stockSocketData?.currentPrice as number),
          companyName: stockData?.companyName,
        }),
      );
    } else {
      Toast.show({
        type: 'warningToast',
        props: {
          msg: 'Enter limit holding quantity',
        },
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      keyboardVerticalOffset={10}
      behavior="padding"
    >
      <CustomSafeAreaView>
        <View style={{paddingHorizontal : 10,flex : 1}}>
          <TransactionHeader stock={stockSocketData as Record<string, any>} />
          
          <ScrollView>
              
          </ScrollView>
        </View>

        <View style={styles.btnContainer}>
          {formState.error && (
            <View style={styles.errContainer}>
              <CustomText fontFamily={FONTS.Medium} variant="h7">
                Enter a valid limit price.
              </CustomText>
            </View>
          )}

          <View style={[styles.flexRowBetween]}>
            <CustomText variant="h9">
              Balance : {`₹${user.balance}` || `-------`}
            </CustomText>
            <CustomText variant="h9">
              {transaction_type === 'BUY' ? `Required` : `Sell Amount`} :{' '}
              {formatPaisaWithCommas(
                (formState?.quantity || 0) *
                  (stockSocketData?.currentPrice as number),
              )}
            </CustomText>
          </View>

          <CustomButton
            text={transaction_type || ''}
            onPress={async () => {
              if (transaction_type === 'SELL') {
                await sellTransaction();
              } else {
                await buyTransaction();
              }
            }}
            loading={formState.loading}
            disabled={formState.disabled}
          />
        </View>
      </CustomSafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Transaction;

const styles = StyleSheet.create({
  btnContainer: {},
  errContainer: {},
  flexRowBetween: {},
  flexRow : {}
});
