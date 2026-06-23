import type { CapacitorConfig } from "@capacitor/cli";

// Unified app id across both platforms: vn.fighttech.go2048
//   Android applicationId : vn.fighttech.go2048  (Play app, in android/app/build.gradle)
//   iOS bundle identifier  : vn.fighttech.go2048  (Xcode project)
const config: CapacitorConfig = {
  appId: "vn.fighttech.go2048",
  appName: "go2048",
  webDir: "dist",
  backgroundColor: "#0f1115",
  server: {
    androidScheme: "https",
  },
  ios: {
    backgroundColor: "#0f1115",
    // `never` lets the WKWebView fill the whole screen edge-to-edge (under the
    // notch / Dynamic Island and home indicator). Safe areas are then handled
    // purely in CSS via `viewport-fit=cover` + `env(safe-area-inset-*)`.
    // `always` double-insets (native inset + CSS env → extra top gap) and lets
    // the dark native backgroundColor show through the safe areas (black bars).
    contentInset: "never",
  },
  android: {
    backgroundColor: "#0f1115",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 600,
      backgroundColor: "#0f1115",
      showSpinner: false,
    },
  },
};

export default config;
