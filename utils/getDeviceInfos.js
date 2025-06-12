//https://docs.expo.dev/versions/latest/sdk/device/#devicemodelid
import * as Device from 'expo-device';

const getDeviceInfo = () => {
  const deviceInfo = {
    manufacturer: Device.manufacturer,
    brand: Device.brand,
    modelName: Device.modelName,
    deviceType: getDeviceType(Device.deviceType),  
    osName: Device.osName,
    osVersion: Device.osVersion,
    isDevice: Device.isDevice,
    totalMemory: Device.totalMemory,
    supportedCpuArchitectures: Device.supportedCpuArchitectures || [],
  };

  console.log(deviceInfo);
  return deviceInfo;
};

const getDeviceType = (type) => {
  const types = {
    0: 'UNKNOWN',
    1: 'PHONE',
    2: 'TABLET',
    3: 'DESKTOP',
    4: 'TV',
  };
  return types[type] || 'UNKNOWN';
};

export default getDeviceInfo;


