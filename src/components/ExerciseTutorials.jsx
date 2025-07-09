import { useState, useEffect, useRef } from 'react';
import { useIntersectionObserver } from '../utils/observer';

const ExerciseTutorials = () => {
  const [exercises, setExercises] = useState([]);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [selectedExercise, setSelectedExercise] = useState(null);

  useEffect(() => {
    // Initialize exercises data
    const exerciseData = [
      {
        id: 1,
        name: 'Push-ups',
        category: 'Chest',
        difficulty: 'Beginner',
        duration: '3-5 minutes',
        description: 'Classic bodyweight exercise for chest, shoulders, and triceps.',
        instructions: [
          'Start in a plank position with hands shoulder-width apart',
          'Lower your body until chest nearly touches the floor',
          'Push back up to starting position',
          'Repeat for desired reps'
        ],
        image: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=800',
        video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        tips: 'Keep your body in a straight line, engage your core'
      },
      {
        id: 2,
        name: 'Squats',
        category: 'Legs',
        difficulty: 'Beginner',
        duration: '4-6 minutes',
        description: 'Fundamental lower body exercise targeting quads, glutes, and hamstrings.',
        instructions: [
          'Stand with feet shoulder-width apart',
          'Lower your body by bending knees and pushing hips back',
          'Go down until thighs are parallel to floor',
          'Push through heels to return to standing'
        ],
        image: 'https://images.pexels.com/photos/703012/pexels-photo-703012.jpeg?auto=compress&cs=tinysrgb&w=800',
        video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        tips: 'Keep chest up, weight on heels, knees tracking over toes'
      },
      {
        id: 3,
        name: 'Plank',
        category: 'Core',
        difficulty: 'Intermediate',
        duration: '2-4 minutes',
        description: 'Isometric core exercise that builds strength and stability.',
        instructions: [
          'Start in push-up position',
          'Lower onto forearms',
          'Keep body straight from head to heels',
          'Hold the position while breathing normally'
        ],
        image: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=800',
        video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        tips: 'Engage core, dont let hips sag or pike up'
      },
      {
        id: 4,
        name: 'Lunges',
        category: 'Legs',
        difficulty: 'Intermediate',
        duration: '5-7 minutes',
        description: 'Unilateral leg exercise that improves balance and strength.',
        instructions: [
          'Stand with feet hip-width apart',
          'Step forward with one leg',
          'Lower until both knees are at 90 degrees',
          'Push back to starting position'
        ],
        image: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=800',
        video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        tips: 'Keep front knee over ankle, torso upright'
      },
      {
        id: 5,
        name: 'Burpees',
        category: 'Full Body',
        difficulty: 'Advanced',
        duration: '3-5 minutes',
        description: 'High-intensity full-body exercise combining strength and cardio.',
        instructions: [
          'Start in standing position',
          'Drop into squat and place hands on floor',
          'Jump feet back into plank position',
          'Do a push-up, jump feet to hands, then jump up'
        ],
        image: 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=800',
        video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        tips: 'Move quickly but maintain form, modify as needed'
      },
      {
        id: 6,
        name: 'Mountain Climbers',
        category: 'Cardio',
        difficulty: 'Intermediate',
        duration: '2-4 minutes',
        description: 'Dynamic exercise that combines cardio with core strengthening.',
        instructions: [
          'Start in plank position',
          'Bring right knee to chest',
          'Switch legs quickly',
          'Continue alternating at a fast pace'
        ],
        image: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800',
        video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        tips: 'Keep hips level, maintain plank position'
      }
    ];

    setExercises(exerciseData);
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Chest': return 'bg-blue-100 text-blue-800';
      case 'Legs': return 'bg-purple-100 text-purple-800';
      case 'Core': return 'bg-orange-100 text-orange-800';
      case 'Full Body': return 'bg-pink-100 text-pink-800';
      case 'Cardio': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Exercise Tutorials</h2>
        <p className="text-gray-600">Learn proper form and technique for various exercises</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onSelect={() => setSelectedExercise(exercise)}
            getDifficultyColor={getDifficultyColor}
            getCategoryColor={getCategoryColor}
          />
        ))}
      </div>

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <ExerciseModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
          getDifficultyColor={getDifficultyColor}
          getCategoryColor={getCategoryColor}
        />
      )}
    </div>
  );
};

const ExerciseCard = ({ exercise, onSelect, getDifficultyColor, getCategoryColor }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef(null);

  // Use intersection observer to determine when to load the image
  useIntersectionObserver(cardRef, () => {
    setIsVisible(true);
  }, { threshold: 0.1 });

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={onSelect}
    >
      {/* Image with lazy loading */}
      <div className="relative h-48 bg-gray-200">
        {isVisible && (
          <>
            <img
              src={exercise.image}
              alt={exercise.name}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            )}
          </>
        )}
        {!isVisible && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{exercise.name}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(exercise.category)}`}>
            {exercise.category}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3">{exercise.description}</p>

        <div className="flex justify-between items-center">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
            {exercise.difficulty}
          </span>
          <span className="text-sm text-gray-500">{exercise.duration}</span>
        </div>
      </div>
    </div>
  );
};

const ExerciseModal = ({ exercise, onClose, getDifficultyColor, getCategoryColor }) => {
  const [activeTab, setActiveTab] = useState('instructions');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{exercise.name}</h2>
              <div className="flex space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(exercise.category)}`}>
                  {exercise.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                  {exercise.difficulty}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <img
              src={exercise.image}
              alt={exercise.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>

          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('instructions')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'instructions'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Instructions
            </button>
            <button
              onClick={() => setActiveTab('tips')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'tips'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tips
            </button>
          </div>

          <div className="min-h-[200px]">
            {activeTab === 'instructions' && (
              <div>
                <h3 className="text-lg font-semibold mb-3">How to perform:</h3>
                <ol className="space-y-2">
                  {exercise.instructions.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {activeTab === 'tips' && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Pro Tips:</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-gray-700">{exercise.tips}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseTutorials;