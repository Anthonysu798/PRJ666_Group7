import React, { createContext, useContext, useState, useEffect } from 'react';

// Default translations for English, French, and Chinese Simplified
const defaultTranslations = {
  en: {
    // Common
    dashboard: "Dashboard",
    profile: "Profile",
    subscription: "Subscription",
    dietPlan: "Diet Plan",
    workoutPlan: "Workout Plan",
    advancedMealPlans: "Advanced Meal Plans",
    aiRecommendations: "AI Recommendations",
    progressTracking: "Progress Tracking",
    community: "Community",
    aiCoaching: "AI Coaching",
    oneOnOneCoaching: "One-on-One Coaching",
    analytics: "Analytics",
    settings: "Settings",
    logout: "Logout",
    
    // Payment pages
    paymentSuccessful: "Payment Successful!",
    thankYouForSubscribing: "Thank you for subscribing to our {plan} plan.",
    redirectingIn: "Redirecting to dashboard in {seconds} seconds...",
    goToDashboard: "Go to Dashboard",
    paymentCanceled: "Payment Canceled",
    paymentCanceledMessage: "Your payment was canceled. No charges were made.",
    redirectingToSubscriptions: "Redirecting to subscriptions in {seconds} seconds...",
    returnToSubscriptions: "Return to Subscriptions",
    
    // Plan names
    basic: "Basic",
    standard: "Standard",
    premium: "Premium",
    
    // Settings page
    notificationSettings: "Notification Settings",
    emailNotifications: "Email Notifications",
    emailNotificationsDesc: "Receive email updates about your progress",
    pushNotifications: "Push Notifications",
    pushNotificationsDesc: "Get push notifications for important updates",
    workoutReminders: "Workout Reminders",
    workoutRemindersDesc: "Get reminded about your scheduled workouts",
    progressUpdates: "Progress Updates",
    progressUpdatesDesc: "Receive weekly progress reports",
    
    // Regional settings
    regionalSettings: "Regional Settings",
    language: "Language",
    timezone: "Timezone",
    measurementUnit: "Measurement Unit",
    dateFormat: "Date Format",
    
    // Privacy settings
    privacySettings: "Privacy Settings",
    profileVisibility: "Profile Visibility",
    shareProgress: "Share Progress",
    shareWorkouts: "Share Workouts",
    
    // Appearance settings
    appearanceSettings: "Appearance Settings",
    darkMode: "Dark Mode",
    compactView: "Compact View",
    animationsEnabled: "Animations Enabled",
    
    // Workout settings
    workoutSettings: "Workout Settings",
    workoutDifficulty: "Workout Difficulty",
    workoutRemindersTime: "Workout Reminders Time",
    restDayNotifications: "Rest Day Notifications",
    
    // Visibility options
    public: "Public",
    friends: "Friends Only",
    private: "Private",
    
    // Difficulty levels
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    
    // Units
    metric: "Metric",
    imperial: "Imperial",
    
    // Save button
    saveChanges: "Save Changes",
    settingsSaved: "Settings saved successfully!",
  },
  fr: {
    // Common
    dashboard: "Tableau de Bord",
    profile: "Profil",
    subscription: "Abonnement",
    dietPlan: "Plan Alimentaire",
    workoutPlan: "Plan d'Entraînement",
    advancedMealPlans: "Plans de Repas Avancés",
    aiRecommendations: "Recommandations IA",
    progressTracking: "Suivi de Progression",
    community: "Communauté",
    aiCoaching: "Coaching IA",
    oneOnOneCoaching: "Coaching Personnalisé",
    analytics: "Analyses",
    settings: "Paramètres",
    logout: "Déconnexion",
    
    // Payment pages
    paymentSuccessful: "Paiement Réussi !",
    thankYouForSubscribing: "Merci de vous être abonné à notre plan {plan}.",
    redirectingIn: "Redirection vers le tableau de bord dans {seconds} secondes...",
    goToDashboard: "Aller au Tableau de Bord",
    paymentCanceled: "Paiement Annulé",
    paymentCanceledMessage: "Votre paiement a été annulé. Aucun frais n'a été prélevé.",
    redirectingToSubscriptions: "Redirection vers les abonnements dans {seconds} secondes...",
    returnToSubscriptions: "Retourner aux Abonnements",
    
    // Plan names
    basic: "Basique",
    standard: "Standard",
    premium: "Premium",
    
    // Settings page
    notificationSettings: "Paramètres de Notification",
    emailNotifications: "Notifications par Email",
    emailNotificationsDesc: "Recevoir des mises à jour par email sur votre progression",
    pushNotifications: "Notifications Push",
    pushNotificationsDesc: "Recevoir des notifications push pour les mises à jour importantes",
    workoutReminders: "Rappels d'Entraînement",
    workoutRemindersDesc: "Recevoir des rappels pour vos entraînements programmés",
    progressUpdates: "Mises à Jour de Progression",
    progressUpdatesDesc: "Recevoir des rapports hebdomadaires de progression",
    
    // Regional settings
    regionalSettings: "Paramètres Régionaux",
    language: "Langue",
    timezone: "Fuseau Horaire",
    measurementUnit: "Unité de Mesure",
    dateFormat: "Format de Date",
    
    // Privacy settings
    privacySettings: "Paramètres de Confidentialité",
    profileVisibility: "Visibilité du Profil",
    shareProgress: "Partager la Progression",
    shareWorkouts: "Partager les Entraînements",
    
    // Appearance settings
    appearanceSettings: "Paramètres d'Apparence",
    darkMode: "Mode Sombre",
    compactView: "Vue Compacte",
    animationsEnabled: "Animations Activées",
    
    // Workout settings
    workoutSettings: "Paramètres d'Entraînement",
    workoutDifficulty: "Difficulté d'Entraînement",
    workoutRemindersTime: "Heure des Rappels d'Entraînement",
    restDayNotifications: "Notifications les Jours de Repos",
    
    // Visibility options
    public: "Public",
    friends: "Amis Seulement",
    private: "Privé",
    
    // Difficulty levels
    beginner: "Débutant",
    intermediate: "Intermédiaire",
    advanced: "Avancé",
    
    // Units
    metric: "Métrique",
    imperial: "Impérial",
    
    // Save button
    saveChanges: "Enregistrer les Modifications",
    settingsSaved: "Paramètres enregistrés avec succès !",
  },
  zh: {
    // Common
    dashboard: "仪表盘",
    profile: "个人资料",
    subscription: "订阅",
    dietPlan: "饮食计划",
    workoutPlan: "锻炼计划",
    advancedMealPlans: "高级膳食计划",
    aiRecommendations: "AI推荐",
    progressTracking: "进度跟踪",
    community: "社区",
    aiCoaching: "AI教练",
    oneOnOneCoaching: "一对一教练",
    analytics: "分析",
    settings: "设置",
    logout: "退出登录",
    
    // Payment pages
    paymentSuccessful: "支付成功！",
    thankYouForSubscribing: "感谢您订阅我们的{plan}计划。",
    redirectingIn: "{seconds}秒后重定向到仪表盘...",
    goToDashboard: "前往仪表盘",
    paymentCanceled: "支付已取消",
    paymentCanceledMessage: "您的支付已取消。未产生任何费用。",
    redirectingToSubscriptions: "{seconds}秒后重定向到订阅页面...",
    returnToSubscriptions: "返回订阅页面",
    
    // Plan names
    basic: "基础版",
    standard: "标准版",
    premium: "高级版",
    
    // Settings page
    notificationSettings: "通知设置",
    emailNotifications: "电子邮件通知",
    emailNotificationsDesc: "接收关于您进度的电子邮件更新",
    pushNotifications: "推送通知",
    pushNotificationsDesc: "获取重要更新的推送通知",
    workoutReminders: "锻炼提醒",
    workoutRemindersDesc: "获取关于您计划锻炼的提醒",
    progressUpdates: "进度更新",
    progressUpdatesDesc: "接收每周进度报告",
    
    // Regional settings
    regionalSettings: "区域设置",
    language: "语言",
    timezone: "时区",
    measurementUnit: "计量单位",
    dateFormat: "日期格式",
    
    // Privacy settings
    privacySettings: "隐私设置",
    profileVisibility: "个人资料可见性",
    shareProgress: "分享进度",
    shareWorkouts: "分享锻炼",
    
    // Appearance settings
    appearanceSettings: "外观设置",
    darkMode: "深色模式",
    compactView: "紧凑视图",
    animationsEnabled: "启用动画",
    
    // Workout settings
    workoutSettings: "锻炼设置",
    workoutDifficulty: "锻炼难度",
    workoutRemindersTime: "锻炼提醒时间",
    restDayNotifications: "休息日通知",
    
    // Visibility options
    public: "公开",
    friends: "仅好友",
    private: "私密",
    
    // Difficulty levels
    beginner: "初学者",
    intermediate: "中级",
    advanced: "高级",
    
    // Units
    metric: "公制",
    imperial: "英制",
    
    // Save button
    saveChanges: "保存更改",
    settingsSaved: "设置保存成功！",
  }
};

// Create the context
const TranslationContext = createContext();

export function TranslationProvider({ children }) {
  // Get the language from localStorage or default to English
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('userSettings_default');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        return settings.language || 'en';
      }
    }
    return 'en';
  });
  
  const [translations, setTranslations] = useState(defaultTranslations);

  // Function to change the language
  const changeLanguage = (lang) => {
    setLanguage(lang);
    // Update the language in settings
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('userSettings_default');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        settings.language = lang;
        localStorage.setItem('userSettings_default', JSON.stringify(settings));
      } else {
        // Create settings if they don't exist
        localStorage.setItem('userSettings_default', JSON.stringify({ language: lang }));
      }
    }
  };

  // Function to get a translation with variable replacement
  const t = (key, variables = {}) => {
    let text = translations[language]?.[key] || translations['en'][key] || key;
    
    // Replace variables in the format {variableName}
    Object.entries(variables).forEach(([varName, value]) => {
      text = text.replace(`{${varName}}`, value);
    });
    
    return text;
  };

  return (
    <TranslationContext.Provider value={{ language, changeLanguage, t, translations }}>
      {children}
    </TranslationContext.Provider>
  );
}

// Custom hook to use the translation context
export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
} 