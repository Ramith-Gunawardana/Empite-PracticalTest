# Empite Practical Test - React Native App

This project is developed for the Practical Test of Empite Solutions.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the App](#running-the-app)
- [Project Structure](#project-structure)

## ✨ Features

### Authentication
- **Email/Password Login**: Secure Firebase authentication with form validation
- **Facebook Login**: Social authentication integration with Facebook SDK *(Currently unavailable - see note below)*
- **Session Management**: Persistent authentication state with automatic navigation

### Weather Forecast
- **16-Day Forecast**: Detailed weather predictions using OpenWeatherMap API
- **Location-Based**: Automatic location detection with permission handling
- **Rich Data Display**: Temperature (day/min/max), humidity, cloud coverage, weather icons
- **Pull-to-Refresh**: Manual data refresh capability
- **Offline Fallback**: Sample data when API is unavailable

### Restaurant Discovery
- **Google Maps Integration**: Interactive map with custom markers
- **Nearby Search**: Discover restaurants within 1.5km radius
- **Restaurant Details**: Name, rating, address, opening hours
- **Live Location**: Real-time user location tracking
- **Info Cards**: Detailed restaurant information on marker selection
- **Secure API**: Serverless proxy to protect Google Places API key

## 🛠 Tech Stack

### Core
- **React Native**: 0.83.1
- **React**: 19.2.0
- **TypeScript**: 5.8.3

### Navigation
- **React Navigation**: 7.x
  - Native Stack Navigator
  - Bottom Tabs Navigator

### Authentication
- **Firebase Auth**: @react-native-firebase/auth 23.7.0
- **Facebook SDK**: react-native-fbsdk-next 13.4.1

### Maps & Location
- **React Native Maps**: 1.26.20
- **Geolocation**: @react-native-community/geolocation 3.4.0

### API & Networking
- **Axios**: 1.13.2
- **OpenWeatherMap API**: Weather data
- **Google Places API**: Restaurant data (via Vercel proxy)

### Backend Services
- **Firebase**: Authentication backend
- **Vercel Serverless Functions**: Places API proxy

## 📦 Prerequisites

Before you begin, ensure you have installed:

- **Node.js**: >= 20.x
- **npm** or **yarn**
- **React Native CLI**: `npm install -g react-native-cli`
- **Android Studio**: For Android development
- **Xcode**: For iOS development (macOS only)
- **Java JDK**: 17 or higher
- **CocoaPods**: For iOS dependencies

## 🚀 Installation

### 1. Clone the Repository

```bash
cd EmpitePracticalTest
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install iOS Dependencies (macOS only)

```bash
cd ios
bundle install
bundle exec pod install
cd ..
```

## ⚙️ Configuration

> **🔒 Security Note**: The following files contain sensitive API keys and credentials and are excluded from version control (`.gitignore`):
> - `src/config/env.ts` - API keys configuration
> - `android/app/google-services.json` - Firebase Android configuration
> - `android/app/src/main/res/values/strings.xml` - Facebook credentials
>
> You must create/configure these files manually following the steps below.

### Firebase Setup

1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Email/Password and Facebook authentication

2. **Android Configuration**:
   - Download `google-services.json`
   - Place in `android/app/google-services.json`

3. **iOS Configuration**:
   - Download `GoogleService-Info.plist`
   - Add to Xcode project

### Facebook App Setup

> **⚠️ Note**: Due to an error encountered during the Meta (Facebook) developer account registration process, Facebook login cannot be configured or tested in this application. The implementation code and UI are complete, but the feature requires a valid Meta Developer account to function.

**If you have an existing Meta Developer account**, follow these steps:

1. **Create Facebook App**:
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Create a new app
   - Get your App ID and Client Token

2. **Update Configuration**:
   - Edit `android/app/src/main/res/values/strings.xml`:
   ```xml
   <string name="facebook_app_id">YOUR_FACEBOOK_APP_ID</string>
   <string name="facebook_client_token">YOUR_CLIENT_TOKEN</string>
   ```

3. **Enable Facebook Login in Firebase**:
   - Add your Facebook App ID and App Secret in Firebase Console

### Google Maps Setup

1. **Get Google Maps API Key**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Maps SDK for Android
   - Create API key with Android app restriction

2. **Update AndroidManifest.xml**:
   - Already configured at `android/app/src/main/AndroidManifest.xml`
   - API key is set for Android app

### OpenWeatherMap API

1. **Get API Key**:
   - Sign up at [OpenWeatherMap](https://openweathermap.org/api)
   - Get free API key

2. **Update Configuration**:
   - Edit `src/config/env.ts`:
   ```typescript
   OPENWEATHER_API_KEY: 'your_key_here'
   ```

### Vercel Serverless Proxy (Places API)

The Places API is secured using a Vercel serverless function to prevent API key exposure.

1. **Navigate to Proxy Directory**:
   ```bash
   cd ../places-api-proxy
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Create Environment File**:
   ```bash
   echo "GOOGLE_PLACES_API_KEY=your_places_api_key" > .env
   ```

4. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

5. **Deploy to Vercel**:
   ```bash
   vercel login
   vercel
   ```

6. **Add Environment Variable**:
   ```bash
   vercel env add GOOGLE_PLACES_API_KEY
   ```
   - Enter your Google Places API key
   - Select: Production

7. **Redeploy**:
   ```bash
   vercel --prod
   ```

8. **Update App Configuration**:
   - Copy your Vercel URL (e.g., `https://places-api-proxy-xxx.vercel.app`)
   - Edit `EmpitePracticalTest/src/config/env.ts`:
   ```typescript
   PLACES_API_URL: 'https://your-project.vercel.app/api/places'
   ```

9. **Secure API Key in Google Cloud**:
   - Go to Google Cloud Console > Credentials
   - Edit your Places API key
   - Application restrictions: **HTTP referrers**
   - Add: `*.vercel.app/*`
   - API restrictions: **Places API** only

## 🏃 Running the App

### Start Metro Bundler

```bash
npm start
```

### Run on Android

```bash
npm run android
```

Or with specific architecture:
```bash
npm run android --active-arch-only
```

### Run on iOS (macOS only)

```bash
npm run ios
```

### Development Tips

- **Clear Cache**: `npm start -- --reset-cache`
- **Clean Build (Android)**:
  ```bash
  cd android
  ./gradlew clean
  cd ..
  ```
- **Clean Build (iOS)**:
  ```bash
  cd ios
  pod deintegrate
  pod install
  cd ..
  ```

## 📁 Project Structure

```
EmpitePracticalTest/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── LoadingView.tsx
│   │   ├── ErrorView.tsx
│   │   ├── Divider.tsx
│   │   ├── WeatherCard.tsx
│   │   └── index.ts
│   ├── contexts/            # React Context providers
│   │   └── AuthContext.tsx  # Authentication state management
│   ├── navigation/          # Navigation configuration
│   │   ├── AppNavigator.tsx # Main stack navigator
│   │   └── TabNavigator.tsx # Bottom tab navigator
│   ├── screens/             # App screens
│   │   ├── LoginScreen.tsx
│   │   ├── WeatherScreen.tsx
│   │   └── RestaurantScreen.tsx
│   ├── services/            # API services
│   │   ├── weatherService.ts
│   │   └── placesService.ts
│   ├── utils/               # Utility functions
│   │   ├── validation.ts
│   │   └── locationUtils.ts
│   └── config/              # Configuration
│       └── env.ts
├── android/                 # Android native code
├── ios/                     # iOS native code
└── places-api-proxy/        # Vercel serverless proxy
    ├── api/
    │   └── places.ts
    ├── package.json
    ├── vercel.json
    └── README.md
```

## 🔌 API Documentation

### Weather Service

**Function**: `getWeatherForecast(lat: number, lng: number)`

**Returns**: 16-day weather forecast

**Sample Response**:
```typescript
{
  list: [
    {
      dt: 1735257600,
      temp: { day: 15.5, min: 10.2, max: 18.3 },
      weather: [{ description: "clear sky", icon: "01d" }],
      humidity: 65,
      clouds: 20
    }
  ]
}
```

### Places Service

**Function**: `getNearbyRestaurants(lat: number, lng: number, radius?: number)`

**Default Radius**: 1500 meters

**Returns**: Array of nearby restaurants

**Sample Response**:
```typescript
{
  results: [
    {
      place_id: "ChIJ...",
      name: "Restaurant Name",
      vicinity: "123 Main St",
      rating: 4.5,
      geometry: { location: { lat: 37.7749, lng: -122.4194 } },
      icon: "https://...",
      opening_hours: { open_now: true }
    }
  ]
}
```


## 📝 Test Credentials

For development/testing purposes:

**Email/Password**:
- Create account through Firebase Console or use the app's registration flow
- Email/Password authentication is fully functional

**Facebook Login**:
- ⚠️ **Currently Unavailable**: Facebook login cannot be tested due to Meta developer account registration issues
- The UI button is visible but will show an error when clicked
- Implementation is complete and ready to use once Meta Developer account is configured

## 📄 License

This project is created as a practical test for Empite.

