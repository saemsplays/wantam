
package com.ceka.p2pcommunication;

import android.Manifest;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.net.wifi.p2p.WifiP2pDevice;
import android.net.wifi.p2p.WifiP2pDeviceList;
import android.net.wifi.p2p.WifiP2pManager;
import android.os.Build;

import androidx.core.app.ActivityCompat;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@CapacitorPlugin(
    name = "P2pCommunication",
    permissions = {
        @Permission(strings = { Manifest.permission.ACCESS_FINE_LOCATION }, alias = "location"),
        @Permission(strings = { Manifest.permission.ACCESS_WIFI_STATE }, alias = "wifi_state"),
        @Permission(strings = { Manifest.permission.CHANGE_WIFI_STATE }, alias = "wifi_change"),
        @Permission(strings = { Manifest.permission.BLUETOOTH }, alias = "bluetooth"),
        @Permission(strings = { Manifest.permission.BLUETOOTH_ADMIN }, alias = "bluetooth_admin"),
        @Permission(strings = { Manifest.permission.ACCESS_COARSE_LOCATION }, alias = "coarse_location")
    }
)
public class P2pCommunicationPlugin extends Plugin {
    
    private WifiP2pManager wifiP2pManager;
    private WifiP2pManager.Channel channel;
    private BluetoothAdapter bluetoothAdapter;
    private List<WifiP2pDevice> wifiPeers = new ArrayList<>();
    private List<BluetoothDevice> bluetoothPeers = new ArrayList<>();
    
    private final BroadcastReceiver wifiP2pReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            
            if (WifiP2pManager.WIFI_P2P_PEERS_CHANGED_ACTION.equals(action)) {
                if (wifiP2pManager != null) {
                    if (ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                        wifiP2pManager.requestPeers(channel, new WifiP2pManager.PeerListListener() {
                            @Override
                            public void onPeersAvailable(WifiP2pDeviceList peerList) {
                                Collection<WifiP2pDevice> refreshedPeers = peerList.getDeviceList();
                                wifiPeers.clear();
                                wifiPeers.addAll(refreshedPeers);
                                
                                for (WifiP2pDevice device : refreshedPeers) {
                                    JSObject peer = new JSObject();
                                    peer.put("id", device.deviceAddress);
                                    peer.put("name", device.deviceName);
                                    peer.put("connectionType", "wifi");
                                    peer.put("isConnected", device.status == WifiP2pDevice.CONNECTED);
                                    
                                    notifyListeners("peerDiscovered", peer);
                                }
                            }
                        });
                    }
                }
            }
        }
    };
    
    private final BroadcastReceiver bluetoothReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            
            if (BluetoothDevice.ACTION_FOUND.equals(action)) {
                BluetoothDevice device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
                if (device != null && !bluetoothPeers.contains(device)) {
                    bluetoothPeers.add(device);
                    
                    JSObject peer = new JSObject();
                    peer.put("id", device.getAddress());
                    if (ActivityCompat.checkSelfPermission(getContext(), Manifest.permission.BLUETOOTH_CONNECT) == PackageManager.PERMISSION_GRANTED) {
                        peer.put("name", device.getName() != null ? device.getName() : "Unknown Device");
                    } else {
                        peer.put("name", "Unknown Device");
                    }
                    peer.put("connectionType", "bluetooth");
                    peer.put("isConnected", false);
                    
                    notifyListeners("peerDiscovered", peer);
                }
            }
        }
    };
    
    @PluginMethod
    public void initialize(PluginCall call) {
        wifiP2pManager = (WifiP2pManager) getContext().getSystemService(Context.WIFI_P2P_SERVICE);
        channel = wifiP2pManager.initialize(getContext(), getContext().getMainLooper(), null);
        bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        
        JSObject result = new JSObject();
        result.put("success", true);
        call.resolve(result);
    }
    
    @PluginMethod
    public void startWifiDirectDiscovery(PluginCall call) {
        if (!hasRequiredPermissions()) {
            requestPermissionForAlias("location", call, "locationPermissionCallback");
            return;
        }
        
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(WifiP2pManager.WIFI_P2P_PEERS_CHANGED_ACTION);
        getContext().registerReceiver(wifiP2pReceiver, intentFilter);
        
        if (ActivityCompat.checkSelfPermission(getContext(), Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
            wifiP2pManager.discoverPeers(channel, new WifiP2pManager.ActionListener() {
                @Override
                public void onSuccess() {
                    JSObject result = new JSObject();
                    result.put("success", true);
                    call.resolve(result);
                }
                
                @Override
                public void onFailure(int reasonCode) {
                    JSObject result = new JSObject();
                    result.put("success", false);
                    result.put("error", "Failed to start Wi-Fi Direct discovery: " + reasonCode);
                    call.reject("Discovery failed", String.valueOf(reasonCode));
                }
            });
        } else {
            call.reject("Location permission required");
        }
    }
    
    @PluginMethod
    public void stopWifiDirectDiscovery(PluginCall call) {
        try {
            getContext().unregisterReceiver(wifiP2pReceiver);
        } catch (IllegalArgumentException e) {
            // Receiver not registered, ignore
        }
        
        JSObject result = new JSObject();
        result.put("success", true);
        call.resolve(result);
    }
    
    @PluginMethod
    public void startBluetoothDiscovery(PluginCall call) {
        if (!hasRequiredPermissions()) {
            requestPermissionForAlias("bluetooth", call, "bluetoothPermissionCallback");
            return;
        }
        
        if (bluetoothAdapter == null || !bluetoothAdapter.isEnabled()) {
            call.reject("Bluetooth not available or disabled");
            return;
        }
        
        IntentFilter intentFilter = new IntentFilter(BluetoothDevice.ACTION_FOUND);
        getContext().registerReceiver(bluetoothReceiver, intentFilter);
        
        if (ActivityCompat.checkSelfPermission(getContext(), Manifest.permission.BLUETOOTH_SCAN) == PackageManager.PERMISSION_GRANTED) {
            boolean started = bluetoothAdapter.startDiscovery();
            
            JSObject result = new JSObject();
            result.put("success", started);
            call.resolve(result);
        } else {
            call.reject("Bluetooth scan permission required");
        }
    }
    
    @PluginMethod
    public void stopBluetoothDiscovery(PluginCall call) {
        try {
            getContext().unregisterReceiver(bluetoothReceiver);
        } catch (IllegalArgumentException e) {
            // Receiver not registered, ignore
        }
        
        if (bluetoothAdapter != null && ActivityCompat.checkSelfPermission(getContext(), Manifest.permission.BLUETOOTH_SCAN) == PackageManager.PERMISSION_GRANTED) {
            bluetoothAdapter.cancelDiscovery();
        }
        
        JSObject result = new JSObject();
        result.put("success", true);
        call.resolve(result);
    }
    
    @PermissionCallback
    private void locationPermissionCallback(PluginCall call) {
        if (getPermissionState("location") == PermissionState.GRANTED) {
            startWifiDirectDiscovery(call);
        } else {
            call.reject("Location permission is required for Wi-Fi Direct");
        }
    }
    
    @PermissionCallback
    private void bluetoothPermissionCallback(PluginCall call) {
        if (getPermissionState("bluetooth") == PermissionState.GRANTED) {
            startBluetoothDiscovery(call);
        } else {
            call.reject("Bluetooth permission is required");
        }
    }
    
    private boolean hasRequiredPermissions() {
        return getPermissionState("location") == PermissionState.GRANTED &&
               getPermissionState("wifi_state") == PermissionState.GRANTED &&
               getPermissionState("wifi_change") == PermissionState.GRANTED;
    }
}
