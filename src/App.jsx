import { useState, useEffect } from 'react';
import CanvasFormChecker from './components/CanvasFormChecker';
import GeoLogger from './components/GeoLogger';
import ExerciseTutorials from './components/ExerciseTutorials';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [workoutSessions, setWorkoutSessions] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [formScore, setFormScore] = useState(0);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const savedSessions = localStorage.getItem('workoutSessions');
    if (savedSessions) {
      setWorkoutSessions(JSON.parse(savedSessions));
    }

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('workoutSessions', JSON.stringify(workoutSessions));
  }, [workoutSessions]);

  const startWorkout = (type = 'General') => {
    setIsWorkoutActive(true);
    const session = {
      id: Date.now(),
      type,
      startTime: new Date().toISOString(),
      location: currentLocation,
      formScores: [],
      status: 'active'
    };
    setWorkoutSessions(prev => [...prev, session]);
  };

  const endWorkout = () => {
    setIsWorkoutActive(false);
    setWorkoutSessions(prev => 
      prev.map(session => 
        session.status === 'active' 
          ? { 
              ...session, 
              endTime: new Date().toISOString(),
              status: 'completed',
              duration: Math.round((new Date() - new Date(session.startTime)) / 60000)
            }
          : session
      )
    );
  };

  const handleLocationUpdate = (location) => {
    setCurrentLocation(location);
  };

  const handleFormScore = (score) => {
    setFormScore(score);
    setWorkoutSessions(prev => 
      prev.map(session => 
        session.status === 'active' 
          ? { 
              ...session, 
              formScores: [...(session.formScores || []), {
                score,
                timestamp: new Date().toISOString()
              }]
            }
          : session
      )
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAverageFormScore = (session) => {
    if (!session.formScores || session.formScores.length === 0) return 0;
    const sum = session.formScores.reduce((acc, score) => acc + score.score, 0);
    return Math.round(sum / session.formScores.length);
  };

  const renderNavigation = () => (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <svg className="h-8 w-8 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-xl font-bold text-gray-800">FitTracker</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {['home', 'sessions', 'tutorials', 'settings'].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
                  currentPage === page
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            {isOffline && (
              <div className="flex items-center text-amber-600">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-xs">Offline</span>
              </div>
            )}
            {isWorkoutActive && (
              <div className="flex items-center text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-xs">Active</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );

  const renderHomePage = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Smart Fitness Tracker</h1>
        <p className="text-xl text-gray-600">Track your form, location, and progress</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Form Checker</h2>
            <div className="w-full aspect-video bg-gray-100 rounded-md overflow-hidden">
              <CanvasFormChecker 
                isActive={isWorkoutActive}
                onFormScore={handleFormScore}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {!isWorkoutActive ? (
                <>
                  <button
                    onClick={() => startWorkout('Strength')}
                    className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Start Strength Training
                  </button>
                  <button
                    onClick={() => startWorkout('Cardio')}
                    className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Start Cardio
                  </button>
                  <button
                    onClick={() => startWorkout('Flexibility')}
                    className="bg-purple-500 text-white py-3 px-6 rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    Start Flexibility
                  </button>
                  <button
                    onClick={() => startWorkout('General')}
                    className="bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    General Workout
                  </button>
                </>
              ) : (
                <button
                  onClick={endWorkout}
                  className="col-span-2 bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 transition-colors"
                >
                  End Workout
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <GeoLogger 
            onLocationUpdate={handleLocationUpdate}
            sessions={workoutSessions}
          />
          
          {isWorkoutActive && (
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="text-lg font-semibold mb-3">Current Session</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Form Score:</span>
                  <span className={`font-bold ${formScore >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                    {formScore}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">
                    {Math.round((new Date() - new Date(workoutSessions.find(s => s.status === 'active')?.startTime || Date.now())) / 60000)} min
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSessionsPage = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Workout Sessions</h1>
        <div className="text-sm text-gray-500">
          {workoutSessions.length} total sessions
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workoutSessions.slice().reverse().map((session) => (
          <div key={session.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{session.type}</h3>
                <p className="text-sm text-gray-600">{formatDate(session.startTime)}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                session.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {session.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              {session.duration && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{session.duration} min</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Avg. Form Score:</span>
                <span className={`font-bold ${getAverageFormScore(session) >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                  {getAverageFormScore(session)}%
                </span>
              </div>
              {session.location && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-mono text-xs">
                    {session.location.latitude.toFixed(4)}, {session.location.longitude.toFixed(4)}
                  </span>
                </div>
              )}
            </div>

            {session.formScores && session.formScores.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Form Score Trend</h4>
                <div className="flex items-end space-x-1 h-8">
                  {session.formScores.slice(-10).map((score, index) => (
                    <div
                      key={index}
                      className={`w-2 rounded-t ${
                        score.score >= 70 ? 'bg-green-400' : 'bg-red-400'
                      }`}
                      style={{ height: `${(score.score / 100) * 100}%` }}
                    ></div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {workoutSessions.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No workout sessions</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first workout session.</p>
        </div>
      )}
    </div>
  );

  const renderTutorialsPage = () => (
    <ExerciseTutorials />
  );

  const renderSettingsPage = () => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
      
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Location & Privacy</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">GPS Tracking</h3>
                <p className="text-sm text-gray-500">Track your workout locations</p>
              </div>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                Enable
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">High Accuracy Mode</h3>
                <p className="text-sm text-gray-500">Use more battery for precise location</p>
              </div>
              <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors">
                Disabled
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Form Checking</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Real-time Analysis</h3>
                <p className="text-sm text-gray-500">Continuous form monitoring</p>
              </div>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                Enabled
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Audio Feedback</h3>
                <p className="text-sm text-gray-500">Voice guidance for form corrections</p>
              </div>
              <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors">
                Disabled
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Data & Sync</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Offline Mode</h3>
                <p className="text-sm text-gray-500">Save data locally when offline</p>
              </div>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                Enabled
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Auto Sync</h3>
                <p className="text-sm text-gray-500">Automatically sync when online</p>
              </div>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                Enabled
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Clear Local Data</h3>
                <p className="text-sm text-gray-500">Remove all stored workout data</p>
              </div>
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
                Clear Data
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">About</h2>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Smart Fitness Tracker v1.0</p>
            <p className="text-sm text-gray-600">Built with React, Canvas API, and Geolocation</p>
            <p className="text-sm text-gray-600">Features: Form checking, GPS tracking, offline support</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {renderNavigation()}
      
      <main>
        {currentPage === 'home' && renderHomePage()}
        {currentPage === 'sessions' && renderSessionsPage()}
        {currentPage === 'tutorials' && renderTutorialsPage()}
        {currentPage === 'settings' && renderSettingsPage()}
      </main>
    </div>
  );
}

export default App;