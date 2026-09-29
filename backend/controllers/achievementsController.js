export const getAchievements = async (req, res) => {
  try {
    // All available achievements
    const achievements = [
      {
        id: 1,
        name: 'First Steps',
        description: 'Complete your first AI course',
        icon: '🚀',
        unlocked: true,
        unlockedDate: '2024-08-01',
        rarity: 'common'
      },
      {
        id: 2,
        name: 'AI Explorer',
        description: 'Complete 3 different AI courses',
        icon: '🔍',
        unlocked: true,
        unlockedDate: '2024-08-15',
        rarity: 'uncommon'
      },
      {
        id: 3,
        name: 'Code Master',
        description: 'Execute 50 code blocks in AI Workspace',
        icon: '💻',
        unlocked: true,
        unlockedDate: '2024-08-20',
        rarity: 'uncommon'
      },
      {
        id: 4,
        name: 'Chat Champion',
        description: 'Have 100 conversations with AI Assistant',
        icon: '💬',
        unlocked: false,
        progress: 67,
        rarity: 'rare'
      },
      {
        id: 5,
        name: 'Learning Streak',
        description: 'Maintain a 7-day learning streak',
        icon: '🔥',
        unlocked: true,
        unlockedDate: '2024-08-10',
        rarity: 'rare'
      },
      {
        id: 6,
        name: 'Pro Level Master',
        description: 'Reach Pro Level 20',
        icon: '👑',
        unlocked: false,
        progress: 62,
        rarity: 'legendary'
      },
      {
        id: 7,
        name: 'Knowledge Seeker',
        description: 'Learn 10 different AI concepts',
        icon: '📚',
        unlocked: true,
        unlockedDate: '2024-08-18',
        rarity: 'uncommon'
      },
      {
        id: 8,
        name: 'Prompt Engineer',
        description: 'Complete Prompt Engineering course',
        icon: '⚙️',
        unlocked: true,
        unlockedDate: '2024-08-22',
        rarity: 'rare'
      },
      {
        id: 9,
        name: 'Team Player',
        description: 'Collaborate on 5 team projects',
        icon: '🤝',
        unlocked: false,
        progress: 40,
        rarity: 'rare'
      },
      {
        id: 10,
        name: 'Perfect Week',
        description: 'Complete daily goals for 7 consecutive days',
        icon: '⭐',
        unlocked: false,
        progress: 5,
        rarity: 'legendary'
      },
    ];

    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const totalCount = achievements.length;

    res.status(200).json({
      success: true,
      data: {
        achievements,
        stats: {
          unlocked: unlockedCount,
          total: totalCount,
          completionPercent: Math.round((unlockedCount / totalCount) * 100)
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Achievements Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch achievements',
      details: error.message
    });
  }
};

export const unlockAchievement = async (req, res) => {
  try {
    const { achievementId } = req.params;

    // Mock unlock logic
    res.status(200).json({
      success: true,
      data: {
        message: `Achievement ${achievementId} unlocked!`,
        xpEarned: 100,
        newLevel: 13
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Unlock Achievement Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to unlock achievement',
      details: error.message
    });
  }
};
