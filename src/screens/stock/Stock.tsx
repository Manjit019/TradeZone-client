import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@store/reduxHook';
import { selectStocks } from '@store/reducers/stockSlice';
import { GetAllStocks } from '@store/actions/stockAction';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import MainHeader from '@components/dashboard/MainHeader';
import Seperator from '@components/stocks/Seperator';
import StockCard from '@components/stocks/StockCard';
import { Colors } from '@constants/Colors';
import CustomText from '@components/global/CustomText';
import { FONTS } from '@constants/Fonts';
import MiniStockList from '@components/stocks/MiniStockList';
import HoldingList from '@components/stockholdings/HoldingList';
import Holdings from '@components/stockholdings/Holdings';

const Stock = () => {
  const dispatch = useAppDispatch();
  const stockData = useAppSelector(selectStocks);

  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'stocks' | 'holdings'>('stocks');

  const fetchStocks = async () => {
    await dispatch(GetAllStocks());
  };

  const refreshHandler = async () => {
    setRefreshing(true);
    await fetchStocks();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  return (
    <CustomSafeAreaView>
      <MainHeader />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100 }}
        nestedScrollEnabled
        refreshControl={
          <RefreshControl onRefresh={refreshHandler} refreshing={refreshing}/>
        }
      >
        <Seperator label="Popular Stocks" seeMore />
        <StockCard data={stockData} />

        <Seperator label="Recently Stocks" />
        <View style={styles.tabContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.tab, activeTab === 'stocks' && styles.activeTab]}
            onPress={() => setActiveTab('stocks')}
          >
            <CustomText
              variant="h5"
              fontFamily={FONTS.Medium}
              style={{
                color: activeTab === 'stocks' ? '#000000ff' : '#93d0ddff',
              }}
            >
              Stock
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.tab, activeTab === 'holdings' && styles.activeTab]}
            onPress={() => setActiveTab('holdings')}
          >
            <CustomText
              variant="h5"
              fontFamily={FONTS.Medium}
              style={{
                color: activeTab === 'holdings' ? '#000000ff' : '#93d0ddff',
              }}
            >
              Holdings
            </CustomText>
          </TouchableOpacity>
        </View>

        {
          activeTab === 'stocks' ? (
            <MiniStockList data={stockData.slice(4)} /> 
          ) : (
            <Holdings />
          )
        }

      </ScrollView>
    </CustomSafeAreaView>
  );
};

export default Stock;

const styles = StyleSheet.create({
  container: {},
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.background_light,
    padding: 5,
    borderRadius: 17,
  },
  tab: {
    borderRadius: 12,
    width: '47%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: Colors.themeColor,
  },
});
