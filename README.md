# FitTracker 🏋️‍♂️

A smart fitness tracking web application built with React that helps users monitor their workout form, track locations, and manage workout sessions with offline support.

![FitTracker Demo](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=FitTracker+Demo)

## ✨ Features

### 📹 Form Checker with Camera
- Real-time exercise form analysis using device camera
- Visual feedback and scoring system
- Helps improve posture and technique
- Live form score display

### ⚡ Quick Actions
- Start different workout types with one click:
  - 🏋️ Strength Training
  - 🏃 Cardio
  - 🤸 Flexibility
  - 🔄 General Workout
- Instant form checker activation
- Session tracking begins automatically

### 📊 Workout Sessions Log
- Complete history of all workout sessions
- Track workout type, date, and duration
- Average form score per session
- Location data for each workout
- Visual charts and progress tracking

### 🌍 Geolocation Tracking
- Logs workout location (with user permission)
- Track where you exercised
- Location-based workout insights
- Privacy-focused with user control

### 📱 Offline Support
- Works completely offline
- Local data storage in browser
- Automatic sync when back online
- No internet required for core features

### ⚙️ Settings Management
- Privacy controls
- Enable/disable features
- Clear local data
- App information and version
- Camera and location permissions

### 🎓 Exercise Tutorials
- Built-in exercise guides
- Learn proper form and technique
- Step-by-step instructions
- Video demonstrations

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Edge, Firefox, Safari)
- Device with camera for form checking
- Geolocation permissions (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fittracker.git
   cd fittracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Production Build

```bash
npm run build
```

## 📱 How to Use

### Starting a Workout
1. Navigate to the Home page
2. Click any Quick Action button (e.g., "Start Strength Training")
3. Grant camera permission when prompted
4. The form checker will activate automatically

### Monitoring Form
- Watch your real-time form score
- Follow visual feedback cues
- Adjust posture based on recommendations
- Track improvement over time

### Ending a Session
1. Click "End Workout" button
2. Session data is automatically saved
3. View summary of your workout

### Viewing History
- Go to Sessions page
- Review workout history and trends
- Analyze form score improvements
- Check location patterns

### Managing Settings
- Access Settings page
- Adjust privacy preferences
- Enable/disable features
- Clear local data if needed

## 🛠️ Tech Stack

- **Frontend**: React.js
- **Styling**: Tailwind CSS
- **Camera**: Canvas API & MediaDevices API
- **Storage**: Local Storage / IndexedDB
- **Geolocation**: Geolocation API
- **Charts**: Chart.js / Recharts
- **Icons**: Lucide React

## 📁 Project Structure

```
fittracker/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── FormChecker.jsx
│   │   ├── QuickActions.jsx
│   │   ├── SessionsLog.jsx
│   │   └── Settings.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Sessions.jsx
│   │   └── Tutorials.jsx
│   ├── hooks/
│   │   ├── useCamera.js
│   │   ├── useGeolocation.js
│   │   └── useLocalStorage.js
│   ├── utils/
│   │   ├── formAnalysis.js
│   │   └── dataStorage.js
│   └── App.jsx
├── package.json
└── README.md
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_VERSION=1.0.0
REACT_APP_ENABLE_ANALYTICS=false
```

### Camera Permissions
The app requires camera access for form checking. Users can:
- Grant permissions on first use
- Retry if initially denied
- Use the app without camera (limited functionality)

### Geolocation Settings
Location tracking is optional and can be:
- Enabled/disabled in Settings
- Granted per workout session
- Completely turned off

## 📊 Data Storage

All data is stored locally in your browser:
- **Workout Sessions**: IndexedDB
- **User Preferences**: Local Storage
- **Form Analysis Data**: Session Storage
- **No server required**: Complete offline functionality

## 🌐 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 80+ | ✅ Fully Supported |
| Firefox | 75+ | ✅ Fully Supported |
| Safari | 13+ | ✅ Fully Supported |
| Edge | 80+ | ✅ Fully Supported |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Form analysis algorithms inspired by fitness research
- Camera integration using modern Web APIs
- Offline-first approach for better user experience
- Privacy-focused design with local data storage

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the [Wiki](https://github.com/yourusername/fittracker/wiki) for detailed guides
- Review the [FAQ](https://github.com/yourusername/fittracker/blob/main/FAQ.md)

## 🔮 Roadmap

- [ ] AI-powered form analysis
- [ ] Social features and challenges
- [ ] Wearable device integration
- [ ] Advanced analytics dashboard
- [ ] Multi-language support

---

**⚠️ Disclaimer**: This app is for educational and personal fitness tracking purposes. Always consult a fitness professional or healthcare provider for medical or fitness advice.

**🌟 Star this repository** if you find it helpful!
