# Apple App Store Preparation & Submission Guide

This project (**Storybook Financial Literacy**) has been pre-configured with **Capacitor** to build and distribute as a native iOS app on the Apple App Store.

---

## 1. Pre-configured Settings in this Codebase

- **Capacitor Core & iOS Engine:** `@capacitor/core`, `@capacitor/ios`, and `@capacitor/cli` installed, alongside `@capacitor/share`, `@capacitor/filesystem`, and `@capgo/capacitor-printer`.
- **Bundle Identifier:** `com.limon.storybookeducation` (configured in `capacitor.config.ts` and automated workflow).
- **Apple Developer Team ID:** `EYQARSHNW2`.
- **App Name:** `Storybook Financial Literacy`.
- **Automated Cloud CI/CD:** GitHub Actions workflow pre-installed at `.github/workflows/app-store-deploy.yml`.
- **iOS Safe Areas:** Support for iPhone notch, Dynamic Island, and home indicator bar with `viewport-fit=cover` in `index.html` and `env(safe-area-inset-*)` in CSS.
- **App Icon & Web Manifest:** SVG app icon (`public/icon.svg`) and PWA web app manifest (`public/manifest.json`).
- **NPM Helper Scripts:**
  - `npm run cap:build` — Compiles the Vite web app and synchronizes the native iOS project.
  - `npm run cap:sync` — Syncs web assets to the iOS wrapper.
  - `npm run cap:open:ios` — Opens the generated project directly in Xcode.

---

## 2. Option A: Automated App Store Connect / TestFlight Deployment (Recommended)

A GitHub Actions workflow is included at `.github/workflows/app-store-deploy.yml` that builds the application on a macOS runner, configures CocoaPods & Xcode targets, and directly codesigns and uploads to TestFlight / App Store Connect.

### To enable automated uploads:
1. In your GitHub repository, navigate to **Settings > Secrets and variables > Actions**.
2. Add the following **Repository Secrets**:
   - `APP_STORE_CONNECT_KEY_P8`: The complete content of your App Store Connect API Key (`AuthKey_XXXXXXXXXX.p8` file).
   - `APP_STORE_CONNECT_KEY_ID`: Your 10-character Key ID.
   - `APP_STORE_CONNECT_ISSUER_ID`: Your App Store Connect Issuer ID (UUID format).
3. Whenever you push to the `main` or `master` branch (or run **Actions > "Build and Upload to App Store Connect" > Run workflow**), GitHub will automatically archive and upload the build directly to TestFlight!

---

## 3. Option B: Manual Local Build on Your Mac

### Step 1: Export Code from AI Studio
- In the top-right settings menu of AI Studio, click **"Export to ZIP"** (or connect your GitHub repository).
- Extract the ZIP archive onto your Mac.

### Step 2: Open Terminal in the Project Folder
Run the following commands:
```bash
# Install dependencies
npm install

# Build web distribution
npm run build

# Add the native iOS Xcode project (only needed first time)
npx cap add ios

# Open the project in Xcode
npx cap open ios
```

---

## 4. In Xcode: Signing & Testing

1. In Xcode's left sidebar, click the top **App** project item.
2. Select the **App** target, then click the **Signing & Capabilities** tab:
   - Check **"Automatically manage signing"**.
   - Under **Team**, select your Apple Developer account (`EYQARSHNW2`).
   - The Bundle Identifier will show: `com.limon.storybookeducation`.
3. Select an iOS Simulator (e.g. **iPhone 16 Pro** or **iPad Air**) or connect your physical iPhone.
4. Press **Run (▶)** to test the native application.

---

## 5. App Store Review Checklist (Kids / Elementary Category)

Since this app is built for elementary students (Grades 2–5):

1. **Kids Category Declaration (App Store Review Guideline 1.3):**
   - In App Store Connect, set the Age Rating and specify the **Kids Category (Ages 6–8 and 9–11)**.
   - The app does not include any third-party behavioral advertisements or external trackers, satisfying COPPA and Apple child protection policies.
2. **Privacy Policy URL:**
   - Apple requires a publicly accessible Privacy Policy link for all apps in the Kids Category.
3. **App Store Screenshots Required:**
   - **6.7" iPhone:** 1290 × 2796 pixels (e.g., iPhone 15/16 Pro Max screenshot from Xcode Simulator using `Cmd + S`).
   - **12.9" iPad Pro:** 2048 × 2732 pixels.
4. **App Store Icon:**
   - 1024 × 1024 px PNG with no transparency (Apple applies the squircle rounded corners automatically).

---

## 6. Distribute to the App Store

1. In Xcode, set the build destination to **Any iOS Device (arm64)**.
2. Go to **Product > Archive**.
3. Once the archive completes in the Organizer window, click **Distribute App**.
4. Choose **App Store Connect > Upload**, and follow the prompts.
5. In [App Store Connect](https://appstoreconnect.apple.com), select the uploaded build, fill in your description and keywords, and click **Submit for Review**.
