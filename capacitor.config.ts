import type { CapacitorConfig } from "@capacitor/cli";

// NOTE on app identifiers (they differ per platform on purpose):
//   Android applicationId : com.tozstudio.go2048  (existing Play listing — must stay)
//   iOS bundle identifier  : vn.fighttech.go2048   (new App Store record)
// Capacitor's single `appId` is used to scaffold the Android package, so it is
// set to the Android id. The iOS bundle id is overridden in the Xcode project
// after `npx cap add ios` (see scripts/set-ios-bundle-id.sh).
const config: CapacitorConfig = {
  appId: "com.tozstudio.go2048",
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
