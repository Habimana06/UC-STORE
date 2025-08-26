import React, { useState, useRef } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award, 
  Briefcase,
  Edit3,
  Save,
  X,
  Camera,
  Settings,
  Shield,
  Bell,
  Eye,
  EyeOff,
  Star,
  TrendingUp,
  Clock,
  Target,
  Users,
  ShoppingCart,
  BarChart3,
  Activity
} from "lucide-react";

// Mock hook for authentication
const useAuth = () => ({
  user: {
    id: 1,
    username: "John Doe",
    email: "john.doe@company.com",
    phone: "+1 (555) 123-4567",
    role: "sales associate",
    department: "Sales",
    location: "New York, NY",
    joinDate: "January 15, 2024",
    performance: 92,
    avatar: null,
    bio: "Experienced sales professional with a passion for customer service and team collaboration.",
    skills: ["Customer Service", "Sales Strategy", "Team Leadership", "Product Knowledge"],
    achievements: [
      { id: 1, title: "Top Performer Q1", date: "March 2024", icon: "🏆" },
      { id: 2, title: "Customer Champion", date: "February 2024", icon: "⭐" },
      { id: 3, title: "Sales Milestone", date: "January 2024", icon: "📈" }
    ],
    stats: {
      totalSales: 1247,
      customersServed: 342,
      performanceRating: 4.8,
      monthsExperience: 8
    }
  }
});

function EmployeeProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showPassword, setShowPassword] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user.avatar);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    phone: user.phone,
    location: user.location,
    bio: user.bio
  });

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      username: user.username,
      email: user.email,
      phone: user.phone,
      location: user.location,
      bio: user.bio
    });
    setAvatarUrl(user.avatar);
    setIsEditing(false);
  };

  const handleAvatarClick = () => fileInputRef.current?.click();
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setAvatarUrl(localUrl);
      // Persist to server
      const form = new FormData();
      form.append('avatar', file);
      // Assuming user.id exists and API base is localhost:3001
      fetch(`http://localhost:3001/api/users/${user.id}/avatar`, {
        method: 'POST',
        body: form,
      })
        .then(async (r) => {
          if (!r.ok) throw new Error('Upload failed');
          const data = await r.json();
          if (data?.avatarUrl) setAvatarUrl(`http://localhost:3001${data.avatarUrl}`);
        })
        .catch(() => {
          // keep local preview; server might be offline
        });
    }
  };

  const StatCard = ({ icon, label, value, color = "text-indigo-600", bgColor = "bg-indigo-100" }) => (
    <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${bgColor}`}>
          {React.createElement(icon, { className: `w-6 h-6 ${color}` })}
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-600">{label}</p>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'performance', label: 'Performance', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account and view your performance</p>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-8 overflow-hidden">
          <div className="h-36 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 relative">
            <div className="absolute inset-0 opacity-30">
              <div className="w-full h-full" style={{
                backgroundImage: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15), transparent 40%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.12), transparent 40%), radial-gradient(circle at 50% 80%, rgba(255,255,255,0.1), transparent 40%)"
              }}></div>
            </div>
          </div>
          <div className="relative px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16">
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-2xl overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-white" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
                    <p className="text-lg text-gray-600 capitalize mb-2">{user.role}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {user.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {user.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Joined {user.joinDate}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    {isEditing ? 'Close Edit' : 'Edit Profile'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabs.map(tab => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <TabIcon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={ShoppingCart}
                label="Total Sales"
                value={user.stats.totalSales.toLocaleString()}
                color="text-green-600"
                bgColor="bg-green-100"
              />
              <StatCard
                icon={Users}
                label="Customers Served"
                value={user.stats.customersServed}
                color="text-blue-600"
                bgColor="bg-blue-100"
              />
              <StatCard
                icon={Star}
                label="Rating"
                value={user.stats.performanceRating}
                color="text-yellow-600"
                bgColor="bg-yellow-100"
              />
              <StatCard
                icon={Clock}
                label="Experience"
                value={`${user.stats.monthsExperience} months`}
                color="text-purple-600"
                bgColor="bg-purple-100"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Personal Information */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
                    {isEditing && (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSave}
                          className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          <Save className="w-4 h-4" />
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="flex items-center gap-2 px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.username}
                          onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">{user.username}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">{user.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">{user.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">{user.location}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                      {isEditing ? (
                        <textarea
                          value={formData.bio}
                          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">{user.bio}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Skills Section */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Skills & Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {isEditing && (
                      <button className="px-3 py-1.5 border-2 border-dashed border-gray-300 text-gray-500 rounded-full text-sm hover:border-gray-400 hover:text-gray-600 transition-colors">
                        + Add Skill
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Achievements & Activity */}
              <div className="space-y-6">
                {/* Recent Achievements */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
                  <div className="space-y-4">
                    {user.achievements.map(achievement => (
                      <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div>
                          <p className="font-medium text-gray-900">{achievement.title}</p>
                          <p className="text-sm text-gray-500">{achievement.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance Summary */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Overall Rating</span>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${star <= Math.floor(user.stats.performanceRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="font-semibold">{user.stats.performanceRating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Monthly Performance</span>
                      <span className="font-semibold text-green-600">{user.performance}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Target Achievement</span>
                      <span className="font-semibold text-indigo-600">85%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-8">
            {/* Performance Overview */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Performance Analytics</h3>
              
              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">92%</p>
                  <p className="text-sm text-gray-600">Overall Performance</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">85%</p>
                  <p className="text-sm text-gray-600">Goal Achievement</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200">
                  <Activity className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">4.8</p>
                  <p className="text-sm text-gray-600">Customer Rating</p>
                </div>
              </div>

              {/* Monthly Progress */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Monthly Progress</h4>
                {[
                  { month: 'January', sales: 85, target: 100, customers: 45 },
                  { month: 'February', sales: 92, target: 100, customers: 52 },
                  { month: 'March', sales: 78, target: 100, customers: 41 },
                  { month: 'April', sales: 95, target: 100, customers: 58 }
                ].map((month, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">{month.month}</span>
                      <span className="text-sm text-gray-600">{month.sales}% of target</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${month.sales}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Sales: {month.sales}%</span>
                      <span>Customers: {month.customers}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Goals & Targets */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Current Goals</h3>
              <div className="space-y-4">
                {[
                  { goal: 'Monthly Sales Target', current: 342, target: 400, unit: 'sales' },
                  { goal: 'Customer Satisfaction', current: 4.8, target: 5.0, unit: 'rating' },
                  { goal: 'Training Completion', current: 8, target: 10, unit: 'courses' }
                ].map((item, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">{item.goal}</span>
                      <span className="text-sm text-gray-600">
                        {item.current} / {item.target} {item.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(item.current / item.target) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8">
            {/* Account Settings */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h3>
              
              <div className="space-y-6">
                {/* Password Change */}
                <div className="border-b border-gray-200 pb-6">
                  <h4 className="font-medium text-gray-900 mb-4">Change Password</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-10"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter new password"
                      />
                    </div>
                  </div>
                  <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Update Password
                  </button>
                </div>

                {/* Notification Settings */}
                <div className="border-b border-gray-200 pb-6">
                  <h4 className="font-medium text-gray-900 mb-4">Notification Preferences</h4>
                  <div className="space-y-4">
                    {[
                      { label: 'Email notifications for new orders', checked: true },
                      { label: 'SMS alerts for urgent tasks', checked: false },
                      { label: 'Weekly performance reports', checked: true },
                      { label: 'Marketing communications', checked: false }
                    ].map((setting, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-gray-700">{setting.label}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked={setting.checked}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Privacy Settings */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Privacy Settings</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-700">Profile visibility</span>
                        <p className="text-sm text-gray-500">Control who can see your profile information</p>
                      </div>
                      <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                        <option>Everyone</option>
                        <option>Team members only</option>
                        <option>Managers only</option>
                        <option>Private</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-700">Activity tracking</span>
                        <p className="text-sm text-gray-500">Allow tracking of your activity for analytics</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-6">
              <h3 className="text-xl font-semibold text-red-900 mb-4">Danger Zone</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <span className="font-medium text-red-900">Deactivate Account</span>
                    <p className="text-sm text-red-700">Temporarily disable your account</p>
                  </div>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Deactivate
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <span className="font-medium text-red-900">Delete Account</span>
                    <p className="text-sm text-red-700">Permanently delete your account and all data</p>
                  </div>
                  <button className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployeeProfile;