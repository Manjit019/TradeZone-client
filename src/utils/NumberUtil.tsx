import { Colors } from "@constants/Colors";

export const getSignText = (number : number) => {
    return number > 0 ? `${number?.toFixed(2)}%` : `${number?.toFixed(2)}`;
}

export const formatPaisaWithCommas = (number : number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

interface signPaisaProps {
    paisa :string;
    color : string;
}

export const getSignPaisa = (number : number):signPaisaProps => {
    let paisa : any = Math.abs(number);
    paisa = paisa?.toFixed(2)?.replace(/\B(?=(\c{3})+(?!\d))/g,",")?.toString();

    return {
        paisa : number>0 ? `+ ₹${paisa}` : `- ₹${paisa}`,
        color : number > 0 ? Colors.profit : Colors.loss
    }
}