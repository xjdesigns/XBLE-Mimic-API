export type INIT_TYPE = {
    stateTimer?: number;
};
export type STATE_CHANGE_TYPE = {
    remove: () => void;
};
export type DEVICE_TYPE = {
    name: string;
    id: string;
    localName: string;
    isConnectable: boolean;
    _haveDeviceFail: boolean;
    connect: () => Promise<DEVICE_TYPE>;
    discoverAllServicesAndCharacteristics: () => Promise<DEVICE_TYPE>;
};
export type SERVICE_TYPE = {
    id: string;
    uuid: string;
    deviceID: string;
    isPrimary: boolean;
};
export type DESCRIPTOR_TYPE = {
    id: string;
    uuid: string;
    characteristicID: string;
    characteristicUUID: string;
    serviceID: string;
    serviceUUID: string;
    deviceID: string;
    value: string;
};
export type CHARACTERISTIC_TYPE = {
    id: string;
    uuid: string;
    serviceID: string;
    serviceUUID: string;
    deviceID: string;
    isReadable: boolean;
    isWritableWithResponse: boolean;
    isWritableWithoutResponse: boolean;
    value: string;
    descriptors: DESCRIPTOR_TYPE[];
};
export type XBLE_MANAGER_TYPE = {
    stateTimer: number;
    stateWS: WebSocket;
    deviceWS: WebSocket;
    destroy: () => null;
    enable: () => Promise<XBLE_MANAGER_TYPE>;
    state: 'PoweredOn' | 'PoweredOff' | 'Unauthorized' | 'Resetting' | 'Unknown';
    onStateChange: (fn: typeof Function) => STATE_CHANGE_TYPE;
    startDeviceScan: (_: null, __: null, fn: typeof Function) => void;
    stopDeviceScan: () => void;
    servicesForDevice: (deviceId: string, serviceUUID: string) => Promise<SERVICE_TYPE[]>;
    descriptorsForDevice: (deviceId: string, serviceUUID: string, characteristicUUID: string) => Promise<DESCRIPTOR_TYPE[]>;
    readCharacteristicForDevice: (deviceId: string, serviceUUID: string, characteristicUUID: string) => Promise<CHARACTERISTIC_TYPE>;
    writeCharacteristicWithResponseForDevice: (deviceId: string, serviceUUID: string, characteristicUUID: string, base64Value?: string, transactionId?: string) => Promise<CHARACTERISTIC_TYPE>;
    writeCharacteristicWithoutResponseForDevice: (deviceId: string, serviceUUID: string, characteristicUUID: string, base64Value?: string, transactionId?: string) => Promise<CHARACTERISTIC_TYPE>;
};
export declare function XBLEManager({ stateTimer }?: INIT_TYPE): XBLE_MANAGER_TYPE;
export declare function requestBluetoothPermission(): Promise<boolean>;
