import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { withAuth } from "../../middleware/authMiddleware";
import { Switch } from "@headlessui/react";
import {
  BellIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "../../context/TranslationContext";
import dotenv from "dotenv";
dotenv.config();
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

function Settings() {
  const { t, changeLanguage, language } = useTranslation();
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({
    // Notification Settings
    emailNotifications: true,
    pushNotifications: false,
    workoutReminders: true,
    progressUpdates: true,
    newsletterSubscription: false,

    // Appearance Settings
    darkMode: true,
    compactView: false,
    animationsEnabled: true,

    // Privacy Settings
    profileVisibility: "public",
    shareProgress: true,
    shareWorkouts: false,

    // Regional Settings
    language: "en",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    measurementUnit: "metric", // metric or imperial
    dateFormat: "DD/MM/YYYY",

    // Workout Settings
    workoutDifficulty: "intermediate",
    workoutRemindersTime: "08:00",
    restDayNotifications: true,
  });

  useEffect(() => {
    // Fetch user data
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`${apiUrl}/api/profile/getUserProfile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();
        setUser(userData.user);

        // Load user-specific settings if they exist
        const savedSettings = localStorage.getItem(`userSettings_${userData.user._id}`);
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          setSettings(parsedSettings);
          // Update the language in the translation context
          changeLanguage(parsedSettings.language);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Fallback to localStorage user data if API fails
        const localUser = JSON.parse(localStorage.getItem("user"));
        if (localUser) {
          setUser(localUser);
        }
      }
    };

    fetchUser();
  }, []);

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    // If language is changed, update the translation context
    if (key === 'language') {
      changeLanguage(value);
    }
    
    // Store settings with user ID to keep multiple users' settings separate
    localStorage.setItem(
      `userSettings_${user?._id || 'default'}`,
      JSON.stringify(newSettings)
    );
  };

  const languages = [
    { code: "en", name: "English" },
    { code: "fr", name: "French" },
    { code: "zh", name: "Chinese (Simplified)" },
  ];

  const SettingsSection = ({ title, icon: Icon, children }) => (
    <div className="bg-[#13111C] rounded-2xl p-6 shadow-lg border border-purple-900/20">
      <div className="flex items-center gap-3 mb-6">
        <Icon className="w-6 h-6 text-purple-400" />
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-300 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
          {title}
        </h2>
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );

  const ToggleOption = ({ title, description, value, onChange }) => (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-medium text-white">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <Switch
        checked={value}
        onChange={onChange}
        className={`${
          value ? "bg-purple-600" : "bg-gray-700"
        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
      >
        <span className="sr-only">Enable {title}</span>
        <span
          className={`${
            value ? "translate-x-6" : "translate-x-1"
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        />
      </Switch>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Notification Settings */}
        <SettingsSection title={t('notificationSettings')} icon={BellIcon}>
          <ToggleOption
            title={t('emailNotifications')}
            description={t('emailNotificationsDesc')}
            value={settings.emailNotifications}
            onChange={(value) =>
              handleSettingChange("emailNotifications", value)
            }
          />
          <ToggleOption
            title={t('pushNotifications')}
            description={t('pushNotificationsDesc')}
            value={settings.pushNotifications}
            onChange={(value) =>
              handleSettingChange("pushNotifications", value)
            }
          />
          <ToggleOption
            title={t('workoutReminders')}
            description={t('workoutRemindersDesc')}
            value={settings.workoutReminders}
            onChange={(value) => handleSettingChange("workoutReminders", value)}
          />
          <ToggleOption
            title={t('progressUpdates')}
            description={t('progressUpdatesDesc')}
            value={settings.progressUpdates}
            onChange={(value) => handleSettingChange("progressUpdates", value)}
          />
        </SettingsSection>

        {/* Regional Settings */}
        <SettingsSection title={t('regionalSettings')} icon={GlobeAltIcon}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="language"
                className="block text-lg font-medium text-white"
              >
                {t('language')}
              </label>
              <select
                id="language"
                value={settings.language}
                onChange={(e) =>
                  handleSettingChange("language", e.target.value)
                }
                className="mt-1 block w-full rounded-md bg-[#1E1B29] border border-purple-900/20 text-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="timezone"
                className="block text-lg font-medium text-white"
              >
                {t('timezone')}
              </label>
              <input
                type="text"
                id="timezone"
                value={settings.timezone}
                readOnly
                className="mt-1 block w-full rounded-md bg-[#1E1B29] border border-purple-900/20 text-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="measurementUnit"
                className="block text-lg font-medium text-white"
              >
                {t('measurementUnit')}
              </label>
              <select
                id="measurementUnit"
                value={settings.measurementUnit}
                onChange={(e) =>
                  handleSettingChange("measurementUnit", e.target.value)
                }
                className="mt-1 block w-full rounded-md bg-[#1E1B29] border border-purple-900/20 text-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="metric">{t('metric')}</option>
                <option value="imperial">{t('imperial')}</option>
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="dateFormat"
                className="block text-lg font-medium text-white"
              >
                {t('dateFormat')}
              </label>
              <select
                id="dateFormat"
                value={settings.dateFormat}
                onChange={(e) =>
                  handleSettingChange("dateFormat", e.target.value)
                }
                className="mt-1 block w-full rounded-md bg-[#1E1B29] border border-purple-900/20 text-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </SettingsSection>

        {/* Privacy Settings */}
        <SettingsSection title={t('privacySettings')} icon={ShieldCheckIcon}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="profileVisibility"
                className="block text-lg font-medium text-white"
              >
                {t('profileVisibility')}
              </label>
              <select
                id="profileVisibility"
                value={settings.profileVisibility}
                onChange={(e) =>
                  handleSettingChange("profileVisibility", e.target.value)
                }
                className="mt-1 block w-full rounded-md bg-[#1E1B29] border border-purple-900/20 text-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="public">{t('public')}</option>
                <option value="friends">{t('friends')}</option>
                <option value="private">{t('private')}</option>
              </select>
            </div>

            <ToggleOption
              title={t('shareProgress')}
              description="Allow others to see your fitness progress"
              value={settings.shareProgress}
              onChange={(value) => handleSettingChange("shareProgress", value)}
            />

            <ToggleOption
              title={t('shareWorkouts')}
              description="Share your workout routines with the community"
              value={settings.shareWorkouts}
              onChange={(value) => handleSettingChange("shareWorkouts", value)}
            />
          </div>
        </SettingsSection>

        {/* Appearance Settings */}
        <SettingsSection title={t('appearanceSettings')} icon={UserIcon}>
          <ToggleOption
            title={t('darkMode')}
            description="Use dark theme throughout the app"
            value={settings.darkMode}
            onChange={(value) => handleSettingChange("darkMode", value)}
          />

          <ToggleOption
            title={t('compactView')}
            description="Display more content with less spacing"
            value={settings.compactView}
            onChange={(value) => handleSettingChange("compactView", value)}
          />

          <ToggleOption
            title={t('animationsEnabled')}
            description="Enable animations and transitions"
            value={settings.animationsEnabled}
            onChange={(value) =>
              handleSettingChange("animationsEnabled", value)
            }
          />
        </SettingsSection>

        {/* Workout Settings */}
        <SettingsSection title={t('workoutSettings')} icon={UserIcon}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="workoutDifficulty"
                className="block text-lg font-medium text-white"
              >
                {t('workoutDifficulty')}
              </label>
              <select
                id="workoutDifficulty"
                value={settings.workoutDifficulty}
                onChange={(e) =>
                  handleSettingChange("workoutDifficulty", e.target.value)
                }
                className="mt-1 block w-full rounded-md bg-[#1E1B29] border border-purple-900/20 text-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="beginner">{t('beginner')}</option>
                <option value="intermediate">{t('intermediate')}</option>
                <option value="advanced">{t('advanced')}</option>
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="workoutRemindersTime"
                className="block text-lg font-medium text-white"
              >
                {t('workoutRemindersTime')}
              </label>
              <input
                type="time"
                id="workoutRemindersTime"
                value={settings.workoutRemindersTime}
                onChange={(e) =>
                  handleSettingChange("workoutRemindersTime", e.target.value)
                }
                className="mt-1 block w-full rounded-md bg-[#1E1B29] border border-purple-900/20 text-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <ToggleOption
              title={t('restDayNotifications')}
              description="Get notifications on rest days"
              value={settings.restDayNotifications}
              onChange={(value) =>
                handleSettingChange("restDayNotifications", value)
              }
            />
          </div>
        </SettingsSection>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-xl shadow-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform transition-all duration-200 hover:scale-105"
            onClick={() => {
              // Save settings to backend (if needed)
              // For now, we're just saving to localStorage
              alert(t('settingsSaved'));
            }}
          >
            {t('saveChanges')}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default withAuth(Settings);
