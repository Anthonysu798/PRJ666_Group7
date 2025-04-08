export const checkSubscription = (allowedPlans) => {
  return async (req, res, next) => {
    try {
      // Get plan from authenticated user data
      const userPlan = req.user?.subscription?.plan || 'basic';
      console.log('User plan in middleware:', userPlan);
      console.log('User data:', req.user);
      
      const userPlanLower = userPlan.toLowerCase();
      const allowedPlansLower = allowedPlans.map(p => p.toLowerCase());

      console.log('Checking plan access:', {
        userPlan: userPlanLower,
        allowedPlans: allowedPlansLower
      });

      if (!allowedPlansLower.includes(userPlanLower)) {
        return res.status(403).json({
          success: false,
          message: 'This feature requires a Standard or Premium subscription'
        });
      }
      
      next();
    } catch (error) {
      console.error('Subscription middleware error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Subscription check failed'
      });
    }
  };
}; 