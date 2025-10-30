import { socketAxios } from "@services/apiConfig"
import { setStocks } from "@store/reducers/stockSlice";


export const GetAllStocks = () => async (dispatch :any) => {
    try {
        const res = await socketAxios.get('/stocks');
        await dispatch(setStocks(res.data.data));
    } catch (error) {
       console.log('Get stock error : ',error);
        
    }
}