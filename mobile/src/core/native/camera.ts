import { PermissionsAndroid, Platform } from 'react-native';
import { Camera } from 'react-native-vision-camera';

export async function requestCameraPermission(): Promise<boolean> {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
        title: 'Camera permission',
        message: 'Allow camera access to show Qibla direction in AR view.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      });
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }

    const status = await Camera.requestCameraPermission();
    return status === 'granted';
  } catch {
    return false;
  }
}

export async function hasCameraPermission(): Promise<boolean> {
  try {
    const status = await Camera.getCameraPermissionStatus();
    return status === 'granted';
  } catch {
    return false;
  }
}
