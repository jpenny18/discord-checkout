'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserSettings } from '../../../types/settings';
import Image from 'next/image';
import { timezones } from '@/config/timezones';
import { languages } from '@/config/languages';

export default function SettingsPage() {
  const { user, userProfile } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'preferences' | 'privacy' | 'subscription'>('profile');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSettings({
            notifications: {
              email: true,
              discord: true,
              signals: true,
              announcements: true,
              mentions: true,
              ...data.notifications
            },
            preferences: {
              theme: 'dark',
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              language: 'en',
              signalAlerts: 'all',
              autoplayVideos: true,
              ...data.preferences
            },
            privacy: {
              showProfile: true,
              showActivity: true,
              showProgress: true,
              ...data.privacy
            },
            subscription: {
              plan: 'Free',
              status: 'inactive',
              ...data.subscription,
              renewalDate: data.subscription?.renewalDate?.toDate()
            },
            profile: {
              firstName: userProfile?.firstName || '',
              lastName: '',
              email: user.email || '',
              ...data.profile
            }
          });
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching settings:', error);
        setLoading(false);
      }
    };

    fetchSettings();
  }, [user, userProfile]);

  const handleSave = async () => {
    if (!user || !settings) return;

    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        notifications: settings.notifications,
        preferences: settings.preferences,
        privacy: settings.privacy,
        profile: settings.profile
      });
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ffc62d] border-t-transparent" />
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg bg-[#111111] p-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="mt-2 text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Tabs and Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Tabs */}
        <div className="space-y-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full rounded-lg px-4 py-2 text-left text-sm font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-[#ffc62d] text-black'
                : 'bg-[#111111] text-white hover:bg-gray-800'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full rounded-lg px-4 py-2 text-left text-sm font-medium transition-colors ${
              activeTab === 'notifications'
                ? 'bg-[#ffc62d] text-black'
                : 'bg-[#111111] text-white hover:bg-gray-800'
            }`}
          >
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`w-full rounded-lg px-4 py-2 text-left text-sm font-medium transition-colors ${
              activeTab === 'preferences'
                ? 'bg-[#ffc62d] text-black'
                : 'bg-[#111111] text-white hover:bg-gray-800'
            }`}
          >
            Preferences
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`w-full rounded-lg px-4 py-2 text-left text-sm font-medium transition-colors ${
              activeTab === 'privacy'
                ? 'bg-[#ffc62d] text-black'
                : 'bg-[#111111] text-white hover:bg-gray-800'
            }`}
          >
            Privacy
          </button>
          <button
            onClick={() => setActiveTab('subscription')}
            className={`w-full rounded-lg px-4 py-2 text-left text-sm font-medium transition-colors ${
              activeTab === 'subscription'
                ? 'bg-[#ffc62d] text-black'
                : 'bg-[#111111] text-white hover:bg-gray-800'
            }`}
          >
            Subscription
          </button>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="rounded-lg bg-[#111111] p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="relative h-20 w-20">
                    <Image
                      src={settings.profile.avatar || '/default-avatar.png'}
                      alt="Profile"
                      fill
                      className="rounded-full object-cover"
                    />
                    <button className="absolute bottom-0 right-0 rounded-full bg-[#ffc62d] p-2 text-black hover:bg-[#ffd35f]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">{settings.profile.firstName} {settings.profile.lastName}</h3>
                    <p className="text-sm text-gray-400">{settings.profile.email}</p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-400">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={settings.profile.firstName}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          profile: { ...settings.profile, firstName: e.target.value }
                        })
                      }
                      className="mt-1 block w-full rounded-lg bg-[#1a1a1a] px-3 py-2 text-white focus:border-[#ffc62d] focus:outline-none focus:ring-1 focus:ring-[#ffc62d]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={settings.profile.lastName}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          profile: { ...settings.profile, lastName: e.target.value }
                        })
                      }
                      className="mt-1 block w-full rounded-lg bg-[#1a1a1a] px-3 py-2 text-white focus:border-[#ffc62d] focus:outline-none focus:ring-1 focus:ring-[#ffc62d]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400">
                    Discord Username
                  </label>
                  <input
                    type="text"
                    value={settings.profile.discordUsername || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        profile: { ...settings.profile, discordUsername: e.target.value }
                      })
                    }
                    className="mt-1 block w-full rounded-lg bg-[#1a1a1a] px-3 py-2 text-white focus:border-[#ffc62d] focus:outline-none focus:ring-1 focus:ring-[#ffc62d]"
                    placeholder="username#0000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400">
                    Bio
                  </label>
                  <textarea
                    value={settings.profile.bio || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        profile: { ...settings.profile, bio: e.target.value }
                      })
                    }
                    rows={4}
                    className="mt-1 block w-full rounded-lg bg-[#1a1a1a] px-3 py-2 text-white focus:border-[#ffc62d] focus:outline-none focus:ring-1 focus:ring-[#ffc62d]"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Email Notifications</h3>
                  <div className="space-y-2">
                    {Object.entries(settings.notifications).map(([key, value]) => (
                      <label key={key} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              notifications: {
                                ...settings.notifications,
                                [key]: e.target.checked
                              }
                            })
                          }
                          className="h-4 w-4 rounded border-gray-300 text-[#ffc62d] focus:ring-[#ffc62d]"
                        />
                        <span className="text-sm text-gray-300">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400">
                    Theme
                  </label>
                  <select
                    value={settings.preferences.theme}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        preferences: {
                          ...settings.preferences,
                          theme: e.target.value as 'dark' | 'light'
                        }
                      })
                    }
                    className="mt-1 block w-full rounded-lg bg-[#1a1a1a] px-3 py-2 text-white focus:border-[#ffc62d] focus:outline-none focus:ring-1 focus:ring-[#ffc62d]"
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400">
                    Timezone
                  </label>
                  <select
                    value={settings.preferences.timezone}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        preferences: {
                          ...settings.preferences,
                          timezone: e.target.value
                        }
                      })
                    }
                    className="mt-1 block w-full rounded-lg bg-[#1a1a1a] px-3 py-2 text-white focus:border-[#ffc62d] focus:outline-none focus:ring-1 focus:ring-[#ffc62d]"
                  >
                    {timezones.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400">
                    Language
                  </label>
                  <select
                    value={settings.preferences.language}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        preferences: {
                          ...settings.preferences,
                          language: e.target.value
                        }
                      })
                    }
                    className="mt-1 block w-full rounded-lg bg-[#1a1a1a] px-3 py-2 text-white focus:border-[#ffc62d] focus:outline-none focus:ring-1 focus:ring-[#ffc62d]"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400">
                    Signal Alerts
                  </label>
                  <select
                    value={settings.preferences.signalAlerts}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        preferences: {
                          ...settings.preferences,
                          signalAlerts: e.target.value as 'all' | 'important' | 'none'
                        }
                      })
                    }
                    className="mt-1 block w-full rounded-lg bg-[#1a1a1a] px-3 py-2 text-white focus:border-[#ffc62d] focus:outline-none focus:ring-1 focus:ring-[#ffc62d]"
                  >
                    <option value="all">All Signals</option>
                    <option value="important">Important Only</option>
                    <option value="none">None</option>
                  </select>
                </div>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.preferences.autoplayVideos}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        preferences: {
                          ...settings.preferences,
                          autoplayVideos: e.target.checked
                        }
                      })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-[#ffc62d] focus:ring-[#ffc62d]"
                  />
                  <span className="text-sm text-gray-300">Autoplay Videos</span>
                </label>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Privacy Settings</h3>
                  <div className="space-y-2">
                    {Object.entries(settings.privacy).map(([key, value]) => (
                      <label key={key} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              privacy: {
                                ...settings.privacy,
                                [key]: e.target.checked
                              }
                            })
                          }
                          className="h-4 w-4 rounded border-gray-300 text-[#ffc62d] focus:ring-[#ffc62d]"
                        />
                        <span className="text-sm text-gray-300">
                          {key
                            .replace(/([A-Z])/g, ' $1')
                            .replace(/^./, (str) => str.toUpperCase())}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'subscription' && (
              <div className="space-y-6">
                <div className="rounded-lg bg-[#1a1a1a] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-white">
                        Current Plan: {settings.subscription.plan}
                      </h3>
                      <p className="text-sm text-gray-400">
                        Status:{' '}
                        <span
                          className={`font-medium ${
                            settings.subscription.status === 'active'
                              ? 'text-green-400'
                              : 'text-red-400'
                          }`}
                        >
                          {settings.subscription.status.charAt(0).toUpperCase() +
                            settings.subscription.status.slice(1)}
                        </span>
                      </p>
                      {settings.subscription.renewalDate && (
                        <p className="text-sm text-gray-400">
                          Renewal Date:{' '}
                          {settings.subscription.renewalDate.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <button className="rounded-lg bg-[#ffc62d] px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-[#ffd35f]">
                      Manage Subscription
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end space-x-4">
        {message && (
          <p
            className={`text-sm ${
              message.type === 'success' ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {message.text}
          </p>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-[#ffc62d] px-6 py-2 text-sm font-medium text-black transition-colors hover:bg-[#ffd35f] disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
} 