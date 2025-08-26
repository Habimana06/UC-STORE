import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  Settings as SettingsIcon, User, Palette, Bell, Shield,
  Save, Mail, Phone, MapPin, AlertTriangle, Database
} from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    username: user?.username || "",
    email: user?.email || "user@ucstore.com",
    phone: "",
    location: "Kigali, Rwanda",
    theme: "light",
    language: "english",
    currency: "USD",
    dateFormat: "MM/DD/YYYY",
    emailNotifications: true,
    pushNotifications: true,
    salesAlerts: true,
    lowStockAlerts: true,
    dailyReports: true,
    twoFactorAuth: false,
    sessionTimeout: "30",
    loginAlerts: true,
    autoBackup: true,
    backupFrequency: "daily",
    dataRetention: "1year",
    debugMode: false
  });

  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setUnsavedChanges(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setTimeout(() => {
      setUnsavedChanges(false);
      alert("Settings saved successfully!");
    }, 500);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'system', label: 'System', icon: Database }
  ];

  const ToggleSwitch = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
      <div className="flex-1">
        <div className="font-medium text-gray-900">{label}</div>
        {description && <div className="text-sm text-gray-500 mt-1">{description}</div>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-indigo-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const renderProfileSettings = () => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={settings.username}
              onChange={(e) => updateSetting('username', e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={settings.email}
              onChange={(e) => updateSetting('email', e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <div className="relative">
            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={settings.phone}
              onChange={(e) => updateSetting('phone', e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <div className="relative">
            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={settings.location}
              onChange={(e) => updateSetting('location', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Appearance</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
          <div className="flex items-center gap-3">
            {['light','dark','system'].map((t) => (
              <button
                key={t}
                onClick={() => updateSetting('theme', t)}
                className={`px-4 py-2 rounded-xl border text-sm ${settings.theme === t ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
          <select
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={settings.language}
            onChange={(e) => updateSetting('language', e.target.value)}
          >
            <option value="english">English</option>
            <option value="french">French</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
          <select
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={settings.currency}
            onChange={(e) => updateSetting('currency', e.target.value)}
          >
            <option value="USD">USD</option>
            <option value="RWF">RWF</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
          <select
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={settings.dateFormat}
            onChange={(e) => updateSetting('dateFormat', e.target.value)}
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
      <ToggleSwitch
        enabled={settings.emailNotifications}
        onChange={(v) => updateSetting('emailNotifications', v)}
        label="Email Notifications"
        description="Receive updates and alerts via email"
      />
      <ToggleSwitch
        enabled={settings.pushNotifications}
        onChange={(v) => updateSetting('pushNotifications', v)}
        label="Push Notifications"
        description="Enable push notifications in the app"
      />
      <ToggleSwitch
        enabled={settings.salesAlerts}
        onChange={(v) => updateSetting('salesAlerts', v)}
        label="Sales Alerts"
        description="Get notified when new sales occur"
      />
      <ToggleSwitch
        enabled={settings.lowStockAlerts}
        onChange={(v) => updateSetting('lowStockAlerts', v)}
        label="Low Stock Alerts"
        description="Warn when inventory is running low"
      />
      <ToggleSwitch
        enabled={settings.dailyReports}
        onChange={(v) => updateSetting('dailyReports', v)}
        label="Daily Reports"
        description="Send a daily performance summary"
      />
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Security</h3>
      <ToggleSwitch
        enabled={settings.twoFactorAuth}
        onChange={(v) => updateSetting('twoFactorAuth', v)}
        label="Two-Factor Authentication"
        description="Require an extra step to secure your account"
      />
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
          <select
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={settings.sessionTimeout}
            onChange={(e) => updateSetting('sessionTimeout', e.target.value)}
          >
            <option value="15">15</option>
            <option value="30">30</option>
            <option value="60">60</option>
          </select>
        </div>
        <div className="flex items-end">
          <ToggleSwitch
            enabled={settings.loginAlerts}
            onChange={(v) => updateSetting('loginAlerts', v)}
            label="Login Alerts"
            description="Notify when a new login occurs"
          />
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">System</h3>
      <ToggleSwitch
        enabled={settings.autoBackup}
        onChange={(v) => updateSetting('autoBackup', v)}
        label="Automatic Backups"
        description="Backup your data automatically"
      />
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
          <select
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={settings.backupFrequency}
            onChange={(e) => updateSetting('backupFrequency', e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Data Retention</label>
          <select
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={settings.dataRetention}
            onChange={(e) => updateSetting('dataRetention', e.target.value)}
          >
            <option value="6months">6 months</option>
            <option value="1year">1 year</option>
            <option value="2years">2 years</option>
          </select>
        </div>
      </div>
      <ToggleSwitch
        enabled={settings.debugMode}
        onChange={(v) => updateSetting('debugMode', v)}
        label="Debug Mode"
        description="Enable extra logs for troubleshooting"
      />
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileSettings();
      case 'appearance': return renderAppearanceSettings();
      case 'notifications': return renderNotificationSettings();
      case 'security': return renderSecuritySettings();
      case 'system': return renderSystemSettings();
      default: return renderProfileSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <SettingsIcon className="text-indigo-600" size={28} />
            Settings
          </h1>
          <p className="text-gray-600 mt-1">Manage your account and system preferences</p>
        </div>
        {unsavedChanges && (
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg"
          >
            <Save size={16} />
            Save Changes
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-2">
          {tabs.map(({ id, label, icon }) => {
            const Icon = icon;
            return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === id
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
                <Icon size={16} />
              {label}
            </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {renderContent()}

      {/* Unsaved changes indicator */}
      {unsavedChanges && (
        <div className="fixed bottom-6 right-6 bg-yellow-500 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 animate-pulse">
          <AlertTriangle size={16} />
          <span className="text-sm font-medium">Unsaved changes</span>
        </div>
      )}
    </div>
  );
}
