import { useState } from 'react';
import {
  Bell, ChevronDown, Moon, Sun, Globe, Eye,
  Trash2, Save, X, Check
} from 'lucide-react';

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [onlineStatus, setOnlineStatus] = useState(true);
  const [groupChatNotifications, setGroupChatNotifications] = useState(true);

  const [profileVisibility, setProfileVisibility] = useState('everyone');
  const [language, setLanguage] = useState('english');
  const [theme, setTheme] = useState('light');
  const [notificationSound, setNotificationSound] = useState('bell');

  const [openDropdown, setOpenDropdown] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const visibilityOptions = ['Everyone', 'Friends only', 'Connections only', 'Private'];
  const languageOptions = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'];
  const themeOptions = ['Light', 'Dark', 'System default'];
  const soundOptions = ['Bell', 'Chime', 'Ping', 'None'];

  const saveSettings = () => {
    console.log('Saving settings...', {
      emailNotifications,
      pushNotifications,
      onlineStatus,
      groupChatNotifications,
      profileVisibility,
      language,
      theme,
      notificationSound,
    });

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const deleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Deleting account...');
    }
  };

  const ToggleSwitch = ({ enabled, onChange, label }) => (
    <div className="flex items-center justify-between py-2 text-sm">
      <span className="text-gray-700">{label}</span>
      <button
        className={`relative inline-flex h-5 w-10 items-center rounded-full transition ${
          enabled ? 'bg-indigo-600' : 'bg-gray-300'
        }`}
        onClick={() => onChange(!enabled)}
        aria-pressed={enabled}
        aria-label={`Toggle ${label}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
            enabled ? 'translate-x-5' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const Dropdown = ({ label, value, options, onChange, icon, open, onToggle }) => (
    <div className="relative py-2 text-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center text-gray-700">
          {icon}
          <span className="ml-2">{label}</span>
        </div>
        <button
          className="flex items-center text-gray-800 hover:text-indigo-600"
          onClick={() => onToggle(label)}
        >
          <span className="mr-1">{value}</span>
          <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {open && (
        <div className="mt-1 absolute right-0 z-10 bg-white w-44 rounded-md shadow-md border border-gray-200">
          <ul className="py-1 text-gray-700 max-h-60 overflow-auto">
            {options.map((option) => (
              <li
                key={option}
                className={`px-4 py-2 cursor-pointer hover:bg-indigo-50 ${
                  value.toLowerCase() === option.toLowerCase()
                    ? 'bg-indigo-100 text-indigo-800'
                    : ''
                }`}
                onClick={() => {
                  onChange(option.toLowerCase());
                  onToggle(null);
                }}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-5">
          <h1 className="text-xl md:text-3xl font-bold text-gray-800">Settings</h1>
        </div>
      </header>

      {/* Settings Body */}
      <main className="max-w-2xl mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* Notification Preferences */}
        <section className="bg-white rounded-lg shadow-sm p-4 md:p-6 space-y-2">
          <h2 className="text-base md:text-lg font-semibold text-gray-800">Notification Preferences</h2>
          <div className="divide-y divide-gray-200">
            <ToggleSwitch label="Email Notifications" enabled={emailNotifications} onChange={setEmailNotifications} />
            <ToggleSwitch label="Push Notifications" enabled={pushNotifications} onChange={setPushNotifications} />
            <ToggleSwitch label="Show Online Status" enabled={onlineStatus} onChange={setOnlineStatus} />
            <ToggleSwitch label="Group Chat Notifications" enabled={groupChatNotifications} onChange={setGroupChatNotifications} />
          </div>
        </section>

        {/* Profile & App Preferences */}
        <section className="bg-white rounded-lg shadow-sm p-4 md:p-6 space-y-2">
          <h2 className="text-base md:text-lg font-semibold text-gray-800">Profile and Appearance</h2>
          <div className="relative divide-y divide-gray-200">
            <Dropdown
              label="Profile Visibility"
              value={
                profileVisibility === 'everyone'
                  ? 'Everyone'
                  : profileVisibility === 'friends'
                  ? 'Friends only'
                  : profileVisibility === 'connections'
                  ? 'Connections only'
                  : 'Private'
              }
              options={visibilityOptions}
              onChange={setProfileVisibility}
              icon={<Eye size={16} />}
              open={openDropdown === 'Profile Visibility'}
              onToggle={toggleDropdown}
            />
            <Dropdown
              label="App Language"
              value={language.charAt(0).toUpperCase() + language.slice(1)}
              options={languageOptions}
              onChange={setLanguage}
              icon={<Globe size={16} />}
              open={openDropdown === 'App Language'}
              onToggle={toggleDropdown}
            />
            <Dropdown
              label="Theme Preference"
              value={theme.charAt(0).toUpperCase() + theme.slice(1)}
              options={themeOptions}
              onChange={setTheme}
              icon={theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
              open={openDropdown === 'Theme Preference'}
              onToggle={toggleDropdown}
            />
            <Dropdown
              label="Notification Sound"
              value={notificationSound.charAt(0).toUpperCase() + notificationSound.slice(1)}
              options={soundOptions}
              onChange={setNotificationSound}
              icon={<Bell size={16} />}
              open={openDropdown === 'Notification Sound'}
              onToggle={toggleDropdown}
            />
          </div>
        </section>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <button
            onClick={saveSettings}
            className="flex items-center justify-center px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition"
          >
            <Save size={16} className="mr-2" />
            Save Settings
          </button>
          <button
            onClick={deleteAccount}
            className="flex items-center justify-center px-5 py-2.5 border border-red-600 text-red-600 font-medium rounded-md hover:bg-red-50 transition"
          >
            <Trash2 size={16} className="mr-2" />
            Delete Account
          </button>
        </div>

        {/* Success Toast */}
        {showSuccess && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-100 border-l-4 border-green-600 text-green-800 p-4 rounded shadow-md flex items-center animate-fade-in z-50">
            <Check size={18} className="mr-2 text-green-600" />
            Settings saved successfully!
          </div>
        )}
      </main>
    </div>
  );
}
