import { useState, useEffect } from "react";
import { useSettings } from "../hooks/useSettings";

const Settings = () => {
  const { settings, updateSettings, isLoading, error, resetError } = useSettings();
  const [notifications, setNotifications] = useState(settings?.notifications || false);
  const [emailUpdates, setEmailUpdates] = useState(settings?.emailUpdates || false);
  const [language, setLanguage] = useState(settings?.language || "en");
  const [theme, setTheme] = useState(settings?.theme || "light");
  const [timezone, setTimezone] = useState(settings?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [currency, setCurrency] = useState(settings?.currency || "USD");

  useEffect(() => {
    if (settings) {
      setNotifications(settings.notifications || false);
      setEmailUpdates(settings.emailUpdates || false);
      setLanguage(settings.language || "en");
      setTheme(settings.theme || "light");
      setTimezone(settings.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone);
      setCurrency(settings.currency || "USD");
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings({
        notifications,
        emailUpdates,
        language,
        theme,
        timezone,
        currency,
      });
    } catch (err) {
      console.error("Failed to update settings:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={resetError}
          >
            <span className="sr-only">Dismiss</span>
            <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Settings
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Manage your account preferences and settings
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Notifications
                  </h3>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="notifications"
                          type="checkbox"
                          checked={notifications}
                          onChange={(e) => setNotifications(e.target.checked)}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="notifications"
                          className="font-medium text-gray-700"
                        >
                          Enable push notifications
                        </label>
                        <p className="text-gray-500">
                          Receive notifications about orders and updates
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="emailUpdates"
                          type="checkbox"
                          checked={emailUpdates}
                          onChange={(e) => setEmailUpdates(e.target.checked)}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="emailUpdates"
                          className="font-medium text-gray-700"
                        >
                          Email updates
                        </label>
                        <p className="text-gray-500">
                          Receive email notifications about orders
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="language"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Language
                  </label>
                  <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {isLoading ? "Saving..." : "Save Settings"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
