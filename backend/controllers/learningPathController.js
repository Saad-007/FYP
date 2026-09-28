export const getLearningPath = async (req, res) => {
  try {
    const learningPath = {
      recommendedCourses: [
        {
          id: 1,
          title: 'Advanced Prompt Engineering',
          description: 'Master advanced techniques for AI prompts',
          category: 'AI',
          level: 'Advanced',
          duration: 6,
          lessons: 18,
          xpReward: 500,
          progress: 100,
          status: 'completed',
          completedDate: '2024-08-22',
          rating: 4.8,
          reviews: 245
        },
        {
          id: 2,
          title: 'Neural Networks 101',
          description: 'Understand how neural networks work',
          category: 'ML',
          level: 'Intermediate',
          duration: 8,
          lessons: 24,
          xpReward: 600,
          progress: 65,
          status: 'in_progress',
          startedDate: '2024-08-15',
          rating: 4.7,
          reviews: 312
        },
        {
          id: 3,
          title: 'Python for AI',
          description: 'Learn Python specifically for AI applications',
          category: 'Programming',
          level: 'Beginner',
          duration: 10,
          lessons: 30,
          xpReward: 700,
          progress: 45,
          status: 'in_progress',
          startedDate: '2024-08-10',
          rating: 4.6,
          reviews: 428
        },
        {
          id: 4,
          title: 'Data Analysis Fundamentals',
          description: 'Basics of data analysis and visualization',
          category: 'Data Science',
          level: 'Beginner',
          duration: 7,
          lessons: 21,
          xpReward: 450,
          progress: 0,
          status: 'not_started',
          rating: 4.5,
          reviews: 189
        }
      ],
      skillPath: [
        {
          skillName: 'AI Literacy',
          courses: [
            { id: 1, name: 'Prompt Engineering 101', completed: true },
            { id: 2, name: 'Advanced Prompting', completed: true },
            { id: 5, name: 'AI Ethics', completed: false }
          ],
          progressPercent: 67
        },
        {
          skillName: 'Machine Learning',
          courses: [
            { id: 6, name: 'ML Basics', completed: false },
            { id: 7, name: 'Neural Networks', completed: false },
            { id: 8, name: 'Deep Learning', completed: false }
          ],
          progressPercent: 0
        },
        {
          skillName: 'Programming',
          courses: [
            { id: 9, name: 'Python Basics', completed: true },
            { id: 10, name: 'Python Advanced', completed: false },
            { id: 11, name: 'Web Dev Basics', completed: false }
          ],
          progressPercent: 33
        }
      ],
      nextRecommendation: {
        courseId: 4,
        reason: 'Based on your interest in data analysis and ML',
        estimatedCompletionTime: '1 week',
        difficulty: 'Beginner'
      }
    };

    res.status(200).json({
      success: true,
      data: learningPath,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Learning Path Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch learning path',
      details: error.message
    });
  }
};

export const startCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    res.status(200).json({
      success: true,
      data: {
        message: `Course ${courseId} started!`,
        courseId,
        firstLessonId: 1,
        startedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Start Course Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start course',
      details: error.message
    });
  }
};

export const updateCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { lessonId, progress, completed } = req.body;

    res.status(200).json({
      success: true,
      data: {
        message: 'Course progress updated',
        courseId,
        progress,
        xpEarned: completed ? 50 : 0,
        newTotal: 8500
      }
    });
  } catch (error) {
    console.error('Update Progress Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update course progress',
      details: error.message
    });
  }
};
