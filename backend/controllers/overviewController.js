export const getOverviewStats = async (req, res) => {
  try {
    // Mock data - baad mein database se fetch karega
    const stats = {
      level: 12,
      totalXP: 8450,
      nextLevelXP: 10000,
      progressPercent: 84.5,
      currentStreak: 8,
      longestStreak: 15,
      coursesCompleted: 5,
      coursesInProgress: 3,
      badges: 12,
      skillRating: 4.5,
      milestones: [
        { label: 'Tasks Completed', value: 328, max: 500, color: '#4F8EF7' },
        { label: 'Hours Logged', value: 82, max: 100, color: '#A78BFA' },
        { label: 'Skills Mastered', value: 12, max: 20, color: '#34D399' },
        { label: 'Team Projects', value: 45, max: 100, color: '#F59E0B' },
      ],
      recentActivity: [
        { id: 1, type: 'course_completed', title: 'Completed: Prompt Engineering 101', time: '2 hours ago' },
        { id: 2, type: 'badge_earned', title: 'Earned Badge: AI Explorer', time: '1 day ago' },
        { id: 3, type: 'milestone_reached', title: 'Reached 100 XP', time: '2 days ago' },
      ],
      nextGoal: 'Reach Pro Level 15 (1,550 XP needed)',
      motivationalQuote: 'Great progress! Keep pushing your AI knowledge to the next level! 🚀'
    };

    res.status(200).json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Overview Stats Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch overview stats',
      details: error.message
    });
  }
};
