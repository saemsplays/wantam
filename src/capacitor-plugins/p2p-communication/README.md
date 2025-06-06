
# P2P Communication Capacitor Plugin

This plugin enables peer-to-peer communication via Wi-Fi Direct and Bluetooth for offline messaging in emergency situations.

## Installation & Setup

### 1. Install Dependencies
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
```

### 2. Initialize Capacitor
```bash
npx cap init
```

Configure `capacitor.config.ts`:
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.92ecb5c3696a420a9e8f473e8416b14e',
  appName: 'rejectfinancebill25',
  webDir: 'dist',
  server: {
    url: 'https://92ecb5c3-696a-420a-9e8f-473e8416b14e.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    P2pCommunication: {
      enableWifiDirect: true,
      enableBluetooth: true,
      autoConnect: false
    }
  }
};

export default config;
```

### 3. Add Platforms
```bash
npx cap add android
npx cap add ios
```

### 4. Copy Plugin to Native Projects
Copy the plugin files to your Android/iOS projects:
- Android: `android/src/main/java/com/ceka/p2pcommunication/`
- iOS: `ios/App/App/P2pCommunication/`

### 5. Register Plugin

#### Android
Add to `MainActivity.java`:
```java
import com.ceka.p2pcommunication.P2pCommunicationPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        registerPlugin(P2pCommunicationPlugin.class);
    }
}
```

#### Update Android Permissions
Add to `android/app/src/main/AndroidManifest.xml`:
```xml
<!-- Wi-Fi Direct -->
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.CHANGE_WIFI_STATE" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />

<!-- Bluetooth -->
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
<uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />

<!-- Network -->
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.CHANGE_NETWORK_STATE" />

<uses-feature android:name="android.hardware.wifi.direct" android:required="true" />
<uses-feature android:name="android.hardware.bluetooth" android:required="true" />
```

### 6. Build and Deploy
```bash
npm run build
npx cap sync
npx cap run android
```

## Usage in React Components

```typescript
import { P2pCommunication } from './capacitor-plugins/p2p-communication';

// Initialize
await P2pCommunication.initialize();

// Start discovery
await P2pCommunication.startWifiDirectDiscovery();
await P2pCommunication.startBluetoothDiscovery();

// Listen for events
P2pCommunication.addListener('peerDiscovered', (event) => {
  console.log('Peer discovered:', event.peer);
});

P2pCommunication.addListener('messageReceived', (event) => {
  console.log('Message received:', event.message);
});

// Send messages
await P2pCommunication.sendMessage({
  message: 'Hello, peer!',
  messageId: 'msg-' + Date.now()
});
```

## Key Features

### Wi-Fi Direct
- Automatic peer discovery
- Direct device-to-device communication
- No internet required
- Range: ~200 meters

### Bluetooth Mesh
- Classic Bluetooth support
- Bluetooth LE for low power
- Auto-reconnection
- Range: ~100 meters

### Message Types
- Text messages
- Voice messages (future)
- File sharing (future)
- Emergency broadcasts

## Security Considerations

1. **Encryption**: All messages are encrypted using AES-256
2. **Authentication**: Peer verification using public-key cryptography
3. **Privacy**: No data stored permanently
4. **Access Control**: Permissioned peer connections

## Testing

### Android Emulator
```bash
# Run on multiple emulators for testing
npx cap run android --target emulator-5554
npx cap run android --target emulator-5556
```

### Physical Devices
```bash
# Enable USB debugging and run
npx cap run android --target device
```

## Troubleshooting

### Common Issues

1. **Permissions Denied**
   - Ensure all required permissions are granted
   - Check Android 12+ runtime permissions

2. **Discovery Fails**
   - Enable location services
   - Turn on Wi-Fi and Bluetooth
   - Check device compatibility

3. **Connection Issues**
   - Verify both devices support Wi-Fi Direct
   - Check proximity (within range)
   - Restart discovery process

### Debug Logs
```bash
# Android logs
adb logcat | grep P2pCommunication

# iOS logs
npx cap run ios --external
```

## Limitations

1. **iOS Restrictions**: Apple limits P2P APIs
2. **Android 10+**: Stricter location permissions
3. **Battery Usage**: Continuous discovery drains battery
4. **Range**: Limited by hardware capabilities

## Production Deployment

### 1. Code Signing
```bash
# Android APK signing
./gradlew assembleRelease

# Generate signed AAB
./gradlew bundleRelease
```

### 2. Play Store Upload
- Upload AAB to Google Play Console
- Configure app permissions
- Add feature descriptions

### 3. Testing Distribution
```bash
# Internal testing
npx cap run android --configuration release

# Generate test APK
./gradlew assembleDebug
```

## Advanced Configuration

### Custom Message Encryption
```typescript
// Implement custom encryption
P2pCommunication.setEncryptionMethod({
  algorithm: 'AES-256-GCM',
  keyExchange: 'ECDH'
});
```

### Network Topology
```typescript
// Configure mesh networking
P2pCommunication.setNetworkTopology({
  mode: 'mesh', // 'star', 'mesh', 'hybrid'
  maxHops: 3,
  autoRelay: true
});
```

## Support

For issues and questions:
- GitHub Issues: [Repository Link]
- CEKA Discord: [Discord Invite]
- Email: support@ceka.lovable.app

## License

MIT License - See LICENSE file for details.
