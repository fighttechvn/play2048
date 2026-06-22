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
    contentInset: "always",
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
