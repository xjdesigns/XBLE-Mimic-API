# XBLE Mimic API

Javascript BLE mocking api for React Native written in typescript.

This is a WIP. Building out to my internal needs but the goal is to extend to match the actual module 1:1.

# Documentation Site
[Documentation Site](https://xjdesigns.github.io/HelpingHand/)

## BLE Manager

This module is meant to run locally only with the Mimic app to mock BLE using http/websockets.

Built of the spec for "react-native-ble-plx" plugin.

[react-native-ble-plx docs](https://dotintent.github.io/react-native-ble-plx/#introduction)

## Install
```bash
npm i xble_mimic_api
```

```bash
import { module } from 'xble_mimic_api'
```

## Build
Typescript compiler for type declarations. Rollup and babel used for bundling.

Build an output file and type declarations
```bash
npm run build
```

Run types and bunding in watch mode
```bash
npm run build:watch
```

Run only types
```bash
npm run build:types
```

Run type checking
```bash
npm run type-check
```

## Local Development
To run locally you will want to `npm link` the package.

NOTE: If you link then unlink a package you must run your install command again.

```bash
* Inside xble_mimic_api
npm link
```

```bash
* Inside Application
npm link xble_mimic_api
```

## Testing
Testing uses Jest and 100% coverage is required.

Run tests
```bash
npm run test
```

Run tests in watch mode
```bash
npm run test:watch
```

Run tests coverage report
```bash
npm run test:coverage
```

Create typedocs
```bash
npm run typedoc
```
