// GET /api/workspace/progress/:userId
router.get('/progress/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Supabase se progress fetch karein
    const { data: progress, error } = await supabase
      .from('pro_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "Not Found"
    
    // Agar user naya hai toh default progress bhej dein
    const userData = progress || { total_xp: 0, level: 1, current_track: 'Data Scientist' };
    
    // Fetch completed tasks for specific zones
    const { data: tasks } = await supabase
      .from('completed_tasks')
      .select('zone_id')
      .eq('user_id', userId);

    const completedZones = tasks ? tasks.map(t => t.zone_id) : [];

    res.status(200).json({ success: true, progress: userData, completedZones });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});