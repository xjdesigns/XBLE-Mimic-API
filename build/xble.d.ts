export type INIT_TYPE = {
    stateTimer?: number;
};
export type STATE_CHANGE_TYPE = {
    remove: () => void;
};
export type XBLE_MANAGER_TYPE = {
    stateTimer: number;
    stateWS: WebSocket;
    deviceWS: WebSocket;
    destroy: () => null;
    enable: () => void;
    state: 'PoweredOn' | 'PoweredOff';
    onStateChange: (fn: typeof Function) => STATE_CHANGE_TYPE;
    startDeviceScan: (_: null, __: null, fn: typeof Function) => void;
    stopDeviceScan: () => void;
    readCharacteristicForDevice: (deviceId: string, serviceUUID: string, characteristicUUID: string) => Promise<any>;
    writeCharacteristicWithResponseForDevice: (deviceId: string, serviceUUID: string, characteristicUUID: string, base64Value?: string, transactionId?: string) => Promise<any>;
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
export declare function XBLEManager({ stateTimer }?: INIT_TYPE): XBLE_MANAGER_TYPE;
export declare function requestBluetoothPermission(): Promise<boolean>;
