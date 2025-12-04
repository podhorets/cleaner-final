import Constants from "expo-constants";
import * as LocalAuthentication from "expo-local-authentication";
import { Platform } from "react-native";

/**
 * Check if biometric authentication is available on the device
 */
export async function isBiometricAvailable(): Promise<boolean> {
  // Only support iOS for now
  if (Platform.OS !== "ios") {
    return false;
  }

  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    return hasHardware && isEnrolled;
  } catch (error) {
    console.error("Error checking biometric availability:", error);
    return false;
  }
}

/**
 * Get the type of biometric authentication available
 */
export async function getBiometricType(): Promise<string | null> {
  if (Platform.OS !== "ios") {
    return null;
  }

  try {
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();

    if (
      types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)
    ) {
      return "Face ID";
    } else if (
      types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)
    ) {
      return "Touch ID";
    }

    return null;
  } catch (error) {
    console.error("Error getting biometric type:", error);
    return null;
  }
}

/**
 * Authenticate user with biometrics
 */
export async function authenticateWithBiometrics(): Promise<{
  success: boolean;
  error?: string;
}> {
  if (Platform.OS !== "ios") {
    return {
      success: false,
      error: "Biometric authentication is only supported on iOS",
    };
  }

  try {
    // Check if biometrics are available
    const isAvailable = await isBiometricAvailable();
    if (!isAvailable) {
      return {
        success: false,
        error: "Biometric authentication is not available",
      };
    }

    // Get biometric type for prompt message
    const biometricType = await getBiometricType();
    const promptMessage = biometricType
      ? `Unlock with ${biometricType}`
      : "Unlock with biometrics";

    const isExpoGo = Constants.appOwnership === "expo";
    console.log("isExpoGo", isExpoGo);
    // Authenticate
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      cancelLabel: "Cancel",
      // TODO: uncomment this when we build app for production
      // disableDeviceFallback: true, // Don't allow passcode fallback
      // In Expo Go, allow device fallback so you can at least test the flow
      disableDeviceFallback: !isExpoGo,
    });

    if (result.success) {
      return { success: true };
    } else {
      console.error("Biometric authentication failed:", result);
      return {
        success: false,
        error: result.error || "Authentication failed",
      };
    }
  } catch (error) {
    console.error("Biometric authentication error:", error);
    return {
      success: false,
      error: "An error occurred during authentication",
    };
  }
}
