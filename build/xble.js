const BASE_URL = 'http://localhost:3000';
const BASE_WS_URL = 'ws://localhost:3000';
export function XBLEManager({ stateTimer = 5000 } = {}) {
    return {
        stateTimer,
        stateWS: new WebSocket(`${BASE_WS_URL}/state`),
        deviceWS: new WebSocket(`${BASE_WS_URL}/startDeviceScan`),
        destroy() {
            return null;
        },
        async enable() {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(this);
                }, 4000);
            });
        },
        state: 'PoweredOff',
        onStateChange(fn) {
            const that = this;
            this.stateWS.onmessage = function (event) {
                const state = event.data;
                that.state = state;
                fn && fn(state);
            };
            this.stateWS.send('ws:initial');
            setTimeout(() => {
                this.stateWS.send('ws:end');
            }, this.stateTimer);
            return {
                remove() {
                    that.stateWS.send('ws:close');
                }
            };
        },
        startDeviceScan(_, __, fn) {
            const error = '';
            this.deviceWS.onmessage = function (event) {
                const payload = JSON.parse(event.data);
                const len = payload.length;
                for (let i = 0; i < len; i++) {
                    const time = parseInt(`${i}000`);
                    setTimeout(() => {
                        const d = createDevice(payload[i]);
                        fn(error, d);
                    }, time);
                }
            };
            this.deviceWS.send('ws:open');
        },
        stopDeviceScan() {
            this.deviceWS.send('ws:close');
        },
        async servicesForDevice(deviceId, serviceUUID) {
            const device = await getAPI(`${BASE_URL}/device?deviceId=${deviceId}`);
            return getDeviceServices(device?.data, deviceId, serviceUUID);
        },
        async descriptorsForDevice(deviceId, serviceUUID, characteristicUUID) {
            const device = await getAPI(`${BASE_URL}/device?deviceId=${deviceId}`);
            return getDeviceDescriptors(device?.data, deviceId, serviceUUID, characteristicUUID);
        },
        async readCharacteristicForDevice(deviceId, serviceUUID, characteristicUUID) {
            const device = await getAPI(`${BASE_URL}/device?deviceId=${deviceId}`);
            return getDeviceCharacteristic(device?.data, deviceId, serviceUUID, characteristicUUID);
        },
        async writeCharacteristicWithResponseForDevice(deviceId, serviceUUID, characteristicUUID, base64Value, transactionId) {
            const device = await getAPI(`${BASE_URL}/device?deviceId=${deviceId}`);
            return getDeviceCharacteristic(device?.data, deviceId, serviceUUID, characteristicUUID);
        },
        async writeCharacteristicWithoutResponseForDevice(deviceId, serviceUUID, characteristicUUID, base64Value, transactionId) {
            const device = await getAPI(`${BASE_URL}/device?deviceId=${deviceId}`);
            return getDeviceCharacteristic(device?.data, deviceId, serviceUUID, characteristicUUID);
        }
    };
}
function createDevice(data) {
    return {
        ...deviceConstructor,
        ...data.device
    };
}
const deviceConstructor = {
    id: '',
    connect() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this);
            }, 4000);
        });
    },
    async discoverAllServicesAndCharacteristics() {
        const device = await getAPI(`${BASE_URL}/device?deviceId=${this.id}`);
        return device?.data;
    }
};
function getDeviceServices(data, deviceId, serviceUUID) {
    const services = data.service.filter((dc) => {
        return (dc.deviceID === deviceId && dc.serviceUUID === serviceUUID);
    });
    return services.length > 0 ? services : [];
}
function getDeviceCharacteristic(data, deviceId, serviceUUID, characteristicUUID) {
    const characteristic = data.characteristics.filter((dc) => {
        return (dc.deviceID === deviceId && dc.serviceUUID === serviceUUID && dc.uuid === characteristicUUID);
    });
    return characteristic.length > 0 ? characteristic[0] : {};
}
function getDeviceDescriptors(data, deviceId, serviceUUID, characteristicUUID) {
    const characteristic = getDeviceCharacteristic(data, deviceId, serviceUUID, characteristicUUID);
    return characteristic.length > 0 ? characteristic.descriptors : [];
}
function getAPI(path = '') {
    return fetch(path)
        .then((response) => response.json())
        .then((data) => {
        return {
            data
        };
    });
}
export async function requestBluetoothPermission() {
    return true;
}
