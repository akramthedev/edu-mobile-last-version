import  * as Network from 'expo-network';


const getNetworkInfo = async () => {
    try{
        const IP_ADDRESS = await Network.getIpAddressAsync();
        console.log(IP_ADDRESS);
        return IP_ADDRESS;
    }
    catch(e){
        console.log(e.message);
    }
};


export default getNetworkInfo;