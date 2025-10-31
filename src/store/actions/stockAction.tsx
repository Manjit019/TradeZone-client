import { socketAxios } from "@services/apiConfig"
import { setHoldings, setStocks } from "@store/reducers/stockSlice";
import { navigate } from "@utils/NavigationUtil";
import { formatPaisaWithCommas } from "@utils/NumberUtil";
import { refetchUser } from "./userAction";


export const GetAllStocks = () => async (dispatch :any) => {
    try {
        const res = await socketAxios.get('/stocks');
        await dispatch(setStocks(res.data.data));
    } catch (error) {
       console.log('Get stock error : ',error);
        
    }
}

export const getAllHoldings = () => async (dispatch : any) => {
    try {
        const res = await socketAxios.get('/stocks/holding');
        await dispatch(setHoldings(res.data.data));
        
    } catch (error) {
        console.log('Get holding error :',error);
        
    }
}

interface buyStockPayload {
    amount : number;
    companyName : string;
    quantity : number;
    stock_id : string;
}

export const BuyStock = (payload : buyStockPayload) => async (dispatch : any) => {
    try {
        const res = await socketAxios.post(`/stocks/buy`,payload);

        navigate("TransactionSuccess",{
            msg : `Your investment of ${formatPaisaWithCommas(payload.amount)} completed ${payload.companyName}`
        });
        await dispatch(refetchUser());

    } catch (error) {
        console.log('Buy Stock error : ',error);
        
    }
}

interface SellStockPayload {
    amount : number;
    companyName : string;
    quantity : number;
    holdingId : string;
}

export const SellStock = (payload : SellStockPayload) => async (dispatch : any) => {
    try {
        const res = await socketAxios.post(`/stocks/sell`,payload);

        navigate("TransactionSuccess",{
            msg : `Your holding got sold ${formatPaisaWithCommas(payload.amount)} ${payload.companyName}`
        });
        await dispatch(refetchUser());

    } catch (error) {
        console.log('Buy Stock error : ',error);
        
    }
}