import DashboardLayout from "../../components/DashboardLayout";
import { withAuth } from "../../middleware/authMiddleware";
import { useState, useEffect } from "react";
import { Activity, Clock, Award } from 'lucide-react';

function Progress() {
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        
        // Using existing endpoints from the codebase
        const [statsRes, weeklyWorkoutsRes, streakRes] = await Promise.all([
          fetch(`${apiUrl}/api/user/stats`, {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch(`${apiUrl}/api/user/weekly-workouts`, {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch(`${apiUrl}/api/workout/streak`, {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
        ]);

        const [stats, weeklyWorkouts, streakData] = await Promise.all([
          statsRes.json(),
          weeklyWorkoutsRes.json(),
          streakRes.json()
        ]);

        setUserStats({
          stats: stats.user,
          weeklyWorkouts: weeklyWorkouts.weeklyWorkouts,
          currentStreak: streakData.streak?.currentStreak || 0,
          highestStreak: streakData.streak?.highestStreak || 0,
          recentSessions: streakData.recentSessions || []
        });
      } catch (err) {
        console.error('Error fetching tracking data:', err);
        setError('Failed to fetch tracking data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-red-400 text-center p-4">{error}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-[#13111C] rounded-2xl p-6 shadow-lg border border-purple-900/20">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-300 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
          Progress Tracking
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-purple-500/5 rounded-xl p-4 border border-purple-500/10">
            <div className="flex items-center space-x-3">
              <Activity className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Workouts Completed</p>
                <p className="text-xl font-semibold text-white">
                  {userStats?.stats?.workoutsCompleted || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-500/5 rounded-xl p-4 border border-purple-500/10">
            <div className="flex items-center space-x-3">
              <Award className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Current Streak</p>
                <p className="text-xl font-semibold text-white">
                  {userStats?.currentStreak || 0} days
                </p>
                <p className="text-xs text-gray-400">
                  Best: {userStats?.highestStreak || 0} days
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-500/5 rounded-xl p-4 border border-purple-500/10">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Total Points</p>
                <p className="text-xl font-semibold text-white">
                  {userStats?.stats?.points || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Sessions */}
        {userStats?.recentSessions?.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Sessions</h2>
            <div className="space-y-3">
              {userStats.recentSessions.map((session, index) => (
                <div 
                  key={index}
                  className="bg-purple-500/5 rounded-xl p-3 border border-purple-500/10"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white">{new Date(session.startTime).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-400">{session.workoutType}</p>
                    </div>
                    <p className="text-purple-400">{session.duration} min</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default withAuth(Progress);
