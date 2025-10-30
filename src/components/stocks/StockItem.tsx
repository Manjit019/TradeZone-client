import { useTheme } from '@react-navigation/native';
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import React, { FC, useEffect, useState } from 'react';
import { navigate } from '../../utils/NavigationUtil';
import { Colors } from '../../constants/Colors';
import CustomText from '../global/CustomText';
import { FONTS } from '../../constants/Fonts';
import { useWS } from '@utils/WSProvide';
import { formatPaisaWithCommas, getSignText } from '@utils/NumberUtil';

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
  high: number;
  low: number;
  open: number;
  time: number;
  timestamp: string;
};

interface StockItemProps {
  item: any;
}

const subscribedSymbols = new Set<string>();

const StockItem: FC<StockItemProps> = React.memo(({ item }) => {
  const { colors } = useTheme();
  const socketService = useWS();
  const [stockData, setStockData] = useState<any>(null);

  useEffect(() => {
    if (socketService && item?.symbol) {
      if (!subscribedSymbols.has(item.symbol)) {
        socketService.emit('subscribeToStocks', item.symbol);
        subscribedSymbols.add(item.symbol);
      }

      socketService.on(item.symbol, data => {
        setStockData(data);
      });

      return () => {
        socketService.off(item.symbol);
        subscribedSymbols.delete(item.symbol);
      };
    }
  }, [item.symbol, socketService]);

  const handlePress = () => {
    const { tenMinTimeSeries, dayTimeSeries, ...stockWithoutTimeSeries } =
      item as Stock;
    navigate('TradingView', { stock: stockWithoutTimeSeries });
  };

  const renderStockDetails = (stockData: any) => {
    const { companyName, currentPrice, lastDayTradedPrice, iconUrl } =
      stockData;
    const priceChange = currentPrice - lastDayTradedPrice;
    const percentageChange = Math.abs(
      (priceChange / lastDayTradedPrice) * 100,
    ).toFixed(2);

    const isProfit = priceChange > 0 ? Colors.profit : Colors.loss;
    const isNeutral = priceChange === 0;

    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={handlePress}
        style={[styles.itemContainer, ]}
      >
        <View style={styles.imgContainer}>
          <Image source={{ uri: iconUrl }} style={styles.img} />
        </View>
        <CustomText numberOfLines={1} variant="h8" fontFamily={FONTS.Medium}>
          {companyName}
        </CustomText>
        <View style={styles.priceContainer}>
          <CustomText numberOfLines={1} variant="h8" fontFamily={FONTS.Medium}>
            ₹{formatPaisaWithCommas(currentPrice)}
          </CustomText>
          <CustomText
            numberOfLines={1}
            variant="h9"
            style={{ color: isNeutral ? colors.text : isProfit, marginTop: 6 }}
            fontFamily={FONTS.Medium}
          >
            {getSignText(priceChange)} ({percentageChange}%)
          </CustomText>
        </View>
      </TouchableOpacity>
    );
  };

  return stockData ? renderStockDetails(stockData) : renderStockDetails(item);
});

export default StockItem;

const styles = StyleSheet.create({
  itemContainer: {
    padding: 18,
    width: '48%',
    aspectRatio: 1,
    // height: RFValue(140),
    borderWidth: Platform.OS === 'android' ? 1.2 : 1,
    marginBottom: RFValue(6),
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // elevation: 3,
    backgroundColor: '#0d1f3a46',
    borderColor : '#3f757e1e',
  },
  imgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#44717756',
    overflow : 'hidden'
  },
  img: {
    resizeMode: 'contain',
    borderRadius: 8,
    width: 35,
    height: 35,
  },
  priceContainer: {
    marginTop: 22,
  },
});
