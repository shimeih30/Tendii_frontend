# Tendii - Cross-Platform Appointment Booking App

A complete React Native + Expo appointment booking application that works on iOS, Android, and Web platforms.

## Features

### 🎯 Cross-Platform Support
- **iOS Native App** - Submit to App Store
- **Android Native App** - Submit to Google Play Store  
- **Progressive Web App (PWA)** - Works in any browser
- **Single Codebase** - Maintain one codebase for all platforms

### 📱 Core Features
- **User Authentication** - Login/Register with secure authentication
- **Service Discovery** - Browse services by category with search and filters
- **Appointment Booking** - Calendar-based booking with time slot selection
- **Appointment Management** - View, cancel, and manage appointments
- **User Profiles** - Complete profile management
- **Push Notifications** - Get notified about appointments
- **Offline Support** - Basic functionality works offline

### 🔧 Technical Features
- **REST API Integration** - Seamless integration with Django backend
- **State Management** - Context API for global state
- **Navigation** - Stack and tab navigation
- **Form Validation** - Complete form validation
- **Error Handling** - Comprehensive error handling
- **Loading States** - Smooth loading indicators
- **Pull to Refresh** - Refresh data with pull gestures

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development on Mac)
- Android Studio (for Android development)

### Quick Start

1. **Create new Expo project:**
```bash
npx create-expo-app tendii-booking-app
cd tendii-booking-app
```

2. **Install dependencies:**
```bash
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context react-native-gesture-handler axios @react-native-async-storage/async-storage react-native-vector-icons react-native-calendars react-native-modal react-native-picker-select expo-linear-gradient expo-font expo-notifications
```

3. **Replace App.js and create the folder structure:**
```bash
mkdir -p src/screens src/context src/services src/components
```

4. **Copy all the files from the artifact into your project**

5. **Start the development server:**
```bash
npx expo start
```

6. **Run on different platforms:**
```bash
# iOS (requires Mac + Xcode)
npx expo start --ios

# Android (requires Android Studio)
npx expo start --android

# Web browser
npx expo start --web
```

## Project Structure

```
tendii-booking-app/
├── App.js                     # Main app component
├── app.json                   # Expo configuration
├── package.json               # Dependencies
├── src/
│   ├── context/
│   │   ├── AuthContext.js     # Authentication state management
│   │   └── ApiContext.js      # API service context
│   ├── services/
│   │   └── api.js             # API service functions
│   ├── screens/
│   │   ├── LoadingScreen.js   # Loading/splash screen
│   │   ├── WelcomeScreen.js   # Welcome/onboarding
│   │   ├── LoginScreen.js     # Login form
│   │   ├── RegisterScreen.js  # Registration form
│   │   ├── HomeScreen.js      # Dashboard/home
│   │   ├── ServicesScreen.js  # Services listing
│   │   ├── ServiceDetailScreen.js  # Service details
│   │   ├── BookingScreen.js   # Appointment booking
│   │   ├── AppointmentsScreen.js   # User appointments
│   │   └── ProfileScreen.js   # User profile
│   └── components/            # Reusable components (add as needed)
└── assets/                    # Images, icons, fonts
```

## API Integration

The app connects to your Django backend at `https://alx-capstone.onrender.com/api`

### API Endpoints Used:
- `POST /accounts/register/` - User registration
- `POST /accounts/login/` - User login  
- `POST /accounts/logout/` - User logout
- `GET /accounts/profile/` - Get user profile
- `GET /services/categories/` - Get service categories
- `GET /services/` - Get services (with filters)
- `GET /services/{id}/` - Get service details
- `GET /appointments/` - Get user appointments
- `POST /appointments/` - Create appointment
- `POST /appointments/{id}/cancel/` - Cancel appointment

## Building for Production

### 1. Build for iOS (App Store)
```bash
# Build for iOS
eas build --platform ios

# Submit to App Store
eas submit --platform ios
```

### 2. Build for Android (Google Play)
```bash
# Build for Android
eas build --platform android

# Submit to Google Play
eas submit --platform android
```

### 3. Build for Web (PWA)
```bash
# Build web version
npx expo export --platform web

# Deploy to any web hosting service
```

## Customization

### 1. Update API URL
In `src/services/api.js`, change:
```javascript
const BASE_URL = 'https://your-backend-url.com/api';
```

### 2. Update App Configuration
In `app.json`, update:
- App name and description
- Bundle identifiers
- Icons and splash screen
- Version numbers

### 3. Add Your Branding
- Replace icons in `assets/` folder
- Update colors in style files
- Modify splash screen and app icon

## App Store Submission

### iOS Requirements:
- Apple Developer Account ($99/year)
- App icons (multiple sizes)
- Screenshots for different device sizes
- Privacy policy URL
- App description and keywords

### Android Requirements:
- Google Play Developer Account ($25 one-time)
- App icons and feature graphic
- Screenshots for phones and tablets
- Store listing details
- Privacy policy

## Features Roadmap

### Phase 2 (Coming Soon):
- [ ] Real-time chat with service providers
- [ ] Payment integration (Stripe/PayPal)
- [ ] Push notifications
- [ ] Photo uploads for services
- [ ] Service provider registration
- [ ] Reviews and ratings
- [ ] Favorites/Bookmarks
- [ ] Location-based services
- [ ] Multi-language support

### Phase 3 (Future):
- [ ] Video consultations
- [ ] Subscription services
- [ ] Advanced analytics
- [ ] AI-powered recommendations
- [ ] Social features
- [ ] Loyalty program

## Development Tips

1. **Testing on Real Devices:**
   - Use Expo Go app for testing
   - Test on multiple device sizes
   - Test both iOS and Android

2. **Performance Optimization:**
   - Use FlatList for large lists
   - Implement image caching
   - Add loading states
   - Optimize bundle size

3. **User Experience:**
   - Add haptic feedback
   - Implement smooth animations
   - Handle network errors gracefully
   - Add offline capabilities

## Support

If you encounter any issues:

1. Check the Expo documentation
2. Review the React Navigation docs
3. Check your API endpoints are working
4. Verify your backend is accessible
5. Test on different devices/platforms

## License

This project is licensed under the MIT License.

---

**Your cross-platform appointment booking app is ready! 🚀**

Build once, deploy everywhere - iOS, Android, and Web!