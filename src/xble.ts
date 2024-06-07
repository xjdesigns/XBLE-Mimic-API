import axios from 'axios'
const BASE_URL = 'http://localhost:3000'
const BASE_WS_URL = 'ws://localhost:3000'

/**
 * @category TYPES
 */
export type INIT_TYPE = {
  stateTimer?: number
}

/**
 * @category TYPES
 */
export type STATE_CHANGE_TYPE = {
  remove: () => void
}

/**
 * @category TYPES
 */
export type XBLE_MANAGER_TYPE = {
  stateTimer: number,
  stateWS: WebSocket,
  deviceWS: WebSocket,
  destroy: () => null,
  enable: () => void,
  state: 'PoweredOn' | 'PoweredOff';
  onStateChange: (fn: typeof Function) => STATE_CHANGE_TYPE,
  startDeviceScan: (_: null, __: null, fn: typeof Function) => void,
  stopDeviceScan: () => void,
  readCharacteristicForDevice: (deviceId: string, serviceUUID: string, characteristicUUID: string) => Promise<any>,
  writeCharacteristicWithResponseForDevice: (deviceId: string, serviceUUID: string, characteristicUUID: string, base64Value?: string, transactionId?: string) => Promise<any>
}

/**
 * @category TYPES
 */
export type DEVICE_TYPE = {
  name: string,
  id: string,
  localName: string,
  isConnectable: boolean,
  _haveDeviceFail: boolean,
  connect: () => Promise<DEVICE_TYPE>,
  discoverAllServicesAndCharacteristics: () => Promise<DEVICE_TYPE>
}

/**
 * Create BLE manager for local testing against XBLE Mimic App
 *
 * ```ts
 * import { XBLEManager } from 'xble_mimic_api'
 * const manager = XBLEManager(...);
 * ```
 * @category Manager
 */
export function XBLEManager ({ stateTimer = 5000 }: INIT_TYPE = {}): XBLE_MANAGER_TYPE {
  return {
    stateTimer,
    stateWS: new WebSocket(`${BASE_WS_URL}/state`),
    deviceWS: new WebSocket(`${BASE_WS_URL}/startDeviceScan`),

    // Using this method to reassign back on itself
    destroy () {
      return null
    },

    enable () {
      // This could be interesting, its a promise that only succeeds when state changes
      // Blocks for Android with PoweredOn state
      // I could just set the device state with an API call which updates the file
      // or else make a hook on itself to allow the user to flip it with Simulator???
    },

    // State will come from saved file from App through API call to endpoint
    state: 'PoweredOff',

    onStateChange (fn) {
      const that = this

      this.stateWS.onmessage = function (event) {
        const state = event.data
        that.state = state
        fn && fn(state)
      }

      this.stateWS.send('ws:initial')

      setTimeout(() => {
        this.stateWS.send('ws:end')
      }, this.stateTimer)

      return {
        remove () {
          that.stateWS.send('ws:close')
        }
      }
    },

    startDeviceScan (_, __, fn) {
      // Websocket call to get data from App file
      // if App file specifies an error send along or else success
      const error = ''
      // const device = { name: 'TI BLE Sensor Tag', ...deviceConstructor }

      // On Device return it sends back 1 by 1...
      // Increment timer 1 second for every device
      this.deviceWS.onmessage = function (event) {
        const payload = JSON.parse(event.data)
        const len = payload.length

        for (let i = 0; i < len; i++) {
          const time = parseInt(`${i}000`)
          setTimeout(() => {
            const d = createDevice(payload[i])
            fn(error, d)
          }, time)
        }
      }

      this.deviceWS.send('ws:open')
    },

    stopDeviceScan () {
      this.deviceWS.send('ws:close')
    },

    async readCharacteristicForDevice (deviceId, serviceUUID, characteristicUUID) {
      const device = await axios.get(`${BASE_URL}/device?deviceId=${deviceId}`)
      return getDeviceCharacteristic(device?.data, deviceId, serviceUUID, characteristicUUID)
    },

    async writeCharacteristicWithResponseForDevice (
      deviceId,
      serviceUUID,
      characteristicUUID,
      base64Value,
      transactionId
    ) {
      const device = await axios.get(`${BASE_URL}/device?deviceId=${deviceId}`)
      return getDeviceCharacteristic(device?.data, deviceId, serviceUUID, characteristicUUID)
    }
  }
}

function createDevice (data) {
  return {
    ...deviceConstructor,
    ...data.device
  }
}

const deviceConstructor = {
  id: '',
  connect () {
    // this needs to return a promise
    // TODO: Check this to see if we allow connect, if not throw
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this)
      }, 4000)
    })
  },

  // Take the device from the file and return back that dataset
  async discoverAllServicesAndCharacteristics () {
    const device = await axios.get(`${BASE_URL}/device?deviceId=${this.id}`)
    return device?.data
  }
}

function getDeviceCharacteristic (data, deviceId, serviceUUID, characteristicUUID) {
  const characteristic = data.characteristics.filter((dc) => {
    return (
      dc.deviceID === deviceId && dc.serviceUUID === serviceUUID && dc.uuid === characteristicUUID
    )
  })
  return characteristic.length > 0 ? characteristic[0] : {}
}

// Per the docs this would be checking for Android on the permissions layer,
// Move this to a help function since it is outside the scope of the package???
export async function requestBluetoothPermission () {
  // Api call to localhost:3000 server from App
  return true
}