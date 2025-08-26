import React, { useState, useEffect } from "react";
import { 
  Store, User, Shield, Users, LogIn, Mail, ArrowRight,
  Loader2, CheckCircle, AlertCircle, Sparkles,
  Lock, Send, ArrowLeft, Clock, RefreshCw, Heart,
  Coffee, Sun, Moon, Star, Smile, ThumbsUp, Zap,
  TrendingUp, Award, Target, Rocket, Compass, Layers,
  Eye, EyeOff, Globe, Wifi, Database, BarChart3,
  ShoppingCart, Package, Truck, DollarSign, PieChart,
  Activity, Users2, Settings, Bell, Crown, Gem
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function EnhancedLogin() {
  const [currentStep, setCurrentStep] = useState('welcome'); // 'welcome', 'login', 'verify'
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "admin"
  });
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [currentGreeting, setCurrentGreeting] = useState(0);
  const [welcomeComplete, setWelcomeComplete] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);
  const [authProgress, setAuthProgress] = useState(0);
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Demo credentials
  const demoCredentials = [
    { username: "John Admin", email: "john@ucstore.com", role: "admin" },
    { username: "Jane Employee", email: "jane@ucstore.com", role: "employee" }
  ];

  // Enhanced welcome messages with more personality
  const greetings = [
    { text: "Welcome back, superstar! ✨", icon: Crown, color: "from-yellow-400 via-orange-400 to-red-500", bg: "from-yellow-400/20 to-red-500/20" },
    { text: "Ready to conquer today? 🚀", icon: Rocket, color: "from-blue-400 via-purple-500 to-pink-500", bg: "from-blue-400/20 to-pink-500/20" },
    { text: "Let's make magic happen! ✨", icon: Sparkles, color: "from-purple-400 via-pink-400 to-rose-500", bg: "from-purple-400/20 to-rose-500/20" },
    { text: "Time to shine bright! 💎", icon: Gem, color: "from-emerald-400 via-teal-400 to-cyan-500", bg: "from-emerald-400/20 to-cyan-500/20" }
  ];

  // Stats to showcase
  const stats = [
    { value: "10K+", label: "Happy Users", icon: Users2, color: "from-blue-400 to-blue-600" },
    { value: "99.9%", label: "Uptime", icon: Activity, color: "from-green-400 to-green-600" },
    { value: "500+", label: "Stores", icon: Store, color: "from-purple-400 to-purple-600" },
    { value: "24/7", label: "Support", icon: Bell, color: "from-orange-400 to-orange-600" }
  ];

  // Features with enhanced descriptions
  const features = [
    { icon: Shield, title: "Bank-Level Security", desc: "256-bit encryption", color: "from-red-400 to-pink-500" },
    { icon: Zap, title: "Lightning Fast", desc: "Sub-second response", color: "from-yellow-400 to-orange-500" },
    { icon: Database, title: "Real-time Sync", desc: "Live data updates", color: "from-blue-400 to-cyan-500" },
    { icon: BarChart3, title: "Smart Analytics", desc: "AI-powered insights", color: "from-purple-400 to-indigo-500" }
  ];

  useEffect(() => {
    setIsVisible(true);
    
    if (currentStep === 'welcome') {
      // Enhanced welcome sequence
      const greetingTimer = setInterval(() => {
        setCurrentGreeting(prev => {
          if (prev < greetings.length - 1) {
            return prev + 1;
          } else {
            clearInterval(greetingTimer);
            setTimeout(() => {
              setWelcomeComplete(true);
            }, 2500);
            return prev;
          }
        });
      }, 2500);

      // Stats rotation
      const statsTimer = setInterval(() => {
        setCurrentStat(prev => (prev + 1) % stats.length);
      }, 3000);
      
      return () => {
        clearInterval(greetingTimer);
        clearInterval(statsTimer);
      };
    }
  }, [currentStep]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 2) {
      newErrors.username = "Username must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateVerificationCode = () => {
    const code = verificationCode.join('');
    if (code.length !== 6) {
      setErrors({ verification: "Please enter the complete 6-digit code" });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return;
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
    
    if (errors.verification) {
      setErrors(prev => ({ ...prev, verification: '' }));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleDemoLogin = (demo) => {
    setFormData({ 
      username: demo.username, 
      email: demo.email,
      role: demo.role 
    });
  };

  const proceedToLogin = () => {
    setCurrentStep('login');
  };

  const sendVerificationCode = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCurrentStep('verify');
      setCountdown(60);
    } catch {
      setErrors({ general: "Failed to send verification code. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyAndLogin = async () => {
    if (!validateVerificationCode()) return;
    setIsSubmitting(true);
    setAuthProgress(0);
    setRedirecting(true);
    
    try {
      const steps = ['Verifying code...', 'Authenticating user...', 'Loading profile...', 'Preparing dashboard...'];
      for (let i = 0; i < steps.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise(resolve => setTimeout(resolve, 500));
        setAuthProgress(Math.round(((i + 1) / steps.length) * 100));
      }
      await login(formData.username, formData.role);
      setShowSuccess(true);
      setTimeout(() => {
        navigate(formData.role === 'employee' ? '/employee' : '/');
      }, 1500);
    } catch {
      setErrors({ verification: "Invalid verification code. Please try again." });
      setAuthProgress(0);
      setRedirecting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendCode = async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCountdown(60);
      setVerificationCode(['', '', '', '', '', '']);
      setErrors({});
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleIcon = (role) => {
    return role === "admin" ? <Shield size={16} /> : <Users size={16} />;
  };

  const getRoleColor = (role) => {
    return role === "admin" 
      ? "from-amber-400 to-orange-500" 
      : "from-blue-400 to-cyan-500";
  };

  const goBack = () => {
    if (currentStep === 'verify') {
      setCurrentStep('login');
      setVerificationCode(['', '', '', '', '', '']);
      setErrors({});
    } else {
      setCurrentStep('welcome');
      setWelcomeComplete(false);
      setCurrentGreeting(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 flex relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Main gradient orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob-1"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-cyan-400 via-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob-2"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-400 via-teal-400 to-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob-3"></div>
        
        {/* Additional smaller orbs */}
        <div className="absolute top-20 right-1/4 w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full mix-blend-multiply filter blur-lg opacity-40 animate-float-1"></div>
        <div className="absolute bottom-20 left-1/4 w-32 h-32 bg-gradient-to-br from-rose-400 to-pink-400 rounded-full mix-blend-multiply filter blur-lg opacity-40 animate-float-2"></div>
        
        {/* Matrix-style digital rain */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute top-0 text-green-400 text-[10px] font-mono animate-matrix-rain"
              style={{
                left: `${(i * 5) + (Math.random() * 5)}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
                textShadow: '0 0 8px rgba(16,185,129,0.8)'
              }}
            >
              {Array.from({length: 24}, () => Math.random() > 0.5 ? '1' : '0').join('')}
            </div>
          ))}
        </div>

        {/* Circuit board pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" className="animate-circuit-flow" style={{ filter: 'drop-shadow(0 0 6px rgba(167,139,250,0.5))' }}>
            <defs>
              <pattern id="circuitPattern" patternUnits="userSpaceOnUse" width="120" height="120">
                <path d="M0 60 L30 60 L30 30 L90 30 L90 90 L120 90" stroke="url(#neon)" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: '6 6', animation: 'dash-flow 8s linear infinite' }} />
                <circle cx="30" cy="60" r="2" fill="url(#neon)" />
                <circle cx="30" cy="30" r="2" fill="url(#neon)" />
                <circle cx="90" cy="30" r="2" fill="url(#neon)" />
                <circle cx="90" cy="90" r="2" fill="url(#neon)" />
              </pattern>
              <linearGradient id="neon">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuitPattern)" />
          </svg>
        </div>

        {/* Floating particles with varied sizes */}
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full opacity-30 animate-float-particle-${i % 3}`}
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `hsl(${Math.random() * 360}, 70%, 60%)`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 6}s`,
              filter: 'blur(0.5px)',
              boxShadow: '0 0 10px currentColor'
            }}
          />
        ))}
        
        {/* Geometric shapes */}
        <div className="absolute top-1/4 left-10 w-4 h-4 border border-white/20 rotate-45 animate-spin-very-slow opacity-60" style={{ boxShadow: '0 0 12px rgba(255,255,255,0.25)' }}></div>
        <div className="absolute bottom-1/4 right-10 w-6 h-6 border-2 border-purple-400/30 rounded-full animate-pulse-slow opacity-40" style={{ boxShadow: '0 0 12px rgba(168,85,247,0.6)' }}></div>
        {/* Extra neon shapes */}
        <div className="absolute top-10 right-8 w-3 h-8 bg-gradient-to-b from-fuchsia-400/50 to-transparent animate-wave" style={{ boxShadow: '0 0 10px rgba(232,121,249,0.6)' }}></div>
        <div className="absolute bottom-10 left-8 w-5 h-5 border-2 border-cyan-400/40 rounded-md animate-spin-very-slow" style={{ boxShadow: '0 0 10px rgba(34,211,238,0.6)' }}></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:50px_50px] animate-grid-drift opacity-20"></div>
      </div>

      {/* Enhanced Success Animation with Character */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center">
          <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl rounded-3xl p-8 text-center animate-scale-in shadow-2xl border border-gray-700/50 max-w-md mx-4">
            {/* Dancing character with particles */}
            <div className="relative mb-6">
              <div className="w-32 h-32 mx-auto relative animate-character-dance">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full animate-character-bounce"></div>
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex gap-3 mb-2 animate-blink">
                    <div className="w-3 h-3 bg-white rounded-full">
                      <div className="w-2 h-2 bg-black rounded-full ml-0.5 animate-eye-look"></div>
                    </div>
                    <div className="w-3 h-3 bg-white rounded-full">
                      <div className="w-2 h-2 bg-black rounded-full ml-0.5 animate-eye-look"></div>
                    </div>
                  </div>
                  <div className="w-6 h-3 border-b-2 border-white rounded-b-full animate-smile-grow"></div>
                </div>
                <div className="absolute top-8 -left-2 w-4 h-8 bg-blue-500 rounded-full rotate-45 animate-wave-arm"></div>
                <div className="absolute top-8 -right-2 w-4 h-8 bg-blue-500 rounded-full -rotate-45 animate-wave-arm-reverse"></div>
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full animate-celebration-particle"
                    style={{
                      background: `hsl(${[60, 120, 180, 240, 300][i % 5]}, 70%, 60%)`,
                      left: `${20 + (i * 8)}px`,
                      top: `${10 + Math.sin(i) * 20}px`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="relative">
                  <CheckCircle className="text-green-400 animate-check-grow" size={40} />
                  <div className="absolute inset-0 rounded-full border-2 border-green-300 animate-success-ring"></div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">🎉 Welcome Aboard!</h3>
              <p className="text-gray-300 text-lg">Authentication successful • Ready to explore!</p>
              {redirecting && (
                <div className="space-y-3">
                  <div className="text-sm text-gray-400 flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                    Preparing your dashboard... {authProgress}%
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-700 ease-out animate-progress-glow" style={{ width: `${authProgress}%` }}></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Left Panel - Enhanced Welcome Experience */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center items-center p-8">
        <div className={`text-center transition-all duration-1000 max-w-lg ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {currentStep === 'welcome' && (
            <div className="space-y-8">
              {/* Enhanced Brand Presentation */}
              <div className="space-y-6">
                <div className="relative inline-block">
                  {/* Animated mascot sticker (pre-login) */}
                  <div className="absolute -top-16 -right-16 z-10 animate-mascot-float">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-2xl animate-mascot-bounce relative overflow-hidden">
                        <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
                          <div className="flex gap-2 mb-1">
                            <div className="w-2 h-2 bg-black rounded-full animate-mascot-blink"></div>
                            <div className="w-2 h-2 bg-black rounded-full animate-mascot-blink"></div>
                          </div>
                          <div className="w-4 h-2 border-b-2 border-black rounded-b-full"></div>
                        </div>
                        <div className="absolute top-6 -right-1 w-3 h-6 bg-orange-400 rounded-full rotate-45 animate-mascot-wave"></div>
                      </div>
                      <div className="absolute -top-8 -left-12 bg-white rounded-lg px-3 py-1 text-xs text-gray-800 font-medium">
                        Hey there! 👋
                        <div className="absolute bottom-0 left-6 transform translate-y-full">
                          <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-3xl shadow-2xl animate-float-brand relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                    <div className="absolute inset-2 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center">
                      <Store className="text-white animate-pulse-glow" size={50} />
                    </div>
                  </div>
                  {/* Orbiting elements */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-orbit-1"></div>
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full animate-orbit-2"></div>
                </div>
                
                <div className="space-y-3">
                  <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent animate-text-shimmer">
                    UC-STORE
                  </h1>
                  <p className="text-xl text-gray-300 font-medium">Next-Gen Inventory Management</p>
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 animate-twinkle-star" style={{animationDelay: `${i * 0.3}s`}} />
                      ))}
                    </div>
                    <span className="text-sm ml-2">Rated 5/5 by users worldwide</span>
                  </div>
                </div>

                {/* Dynamic Greeting Animation */}
                <div className="h-24 flex items-center justify-center relative">
                  {greetings.map((greeting, index) => {
                    const Icon = greeting.icon;
                    return (
                      <div
                        key={index}
                        className={`absolute transition-all duration-1500 transform ${
                          currentGreeting === index
                            ? 'opacity-100 scale-100 translate-y-0 rotate-0'
                            : currentGreeting > index
                            ? 'opacity-0 scale-75 -translate-y-8 -rotate-12'
                            : 'opacity-0 scale-125 translate-y-8 rotate-12'
                        }`}
                      >
                        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${greeting.bg} backdrop-blur-sm border border-white/20 shadow-2xl`}>
                          <div className={`absolute inset-0 bg-gradient-to-r ${greeting.color} opacity-10 animate-pulse-slow`}></div>
                          <div className="relative flex items-center gap-4 p-6">
                            <div className={`p-3 rounded-xl bg-gradient-to-r ${greeting.color} text-white shadow-lg animate-bounce-icon`}>
                              <Icon size={28} />
                            </div>
                            <span className="text-2xl font-bold text-white animate-text-glow">{greeting.text}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stats Showcase */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={index}
                      className={`p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 transition-all duration-500 hover:scale-105 animate-slide-in-stats ${
                        currentStat === index ? 'ring-2 ring-white/30 bg-white/20' : ''
                      }`}
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center mb-2 animate-icon-float`}>
                        <Icon size={16} className="text-white" />
                      </div>
                      <div className="text-2xl font-bold text-white animate-number-count">{stat.value}</div>
                      <div className="text-xs text-gray-300">{stat.label}</div>
                    </div>
                  );
                })}
              </div>

              {/* Enhanced CTA */}
              {welcomeComplete && (
                <div className="space-y-4 animate-cta-entrance">
                  <button
                    onClick={proceedToLogin}
                    className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-500 shadow-2xl hover:shadow-3xl transform hover:scale-105 animate-cta-pulse"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <div className="relative flex items-center gap-3">
                      <div className="p-1 bg-white/20 rounded-lg">
                        <LogIn size={24} />
                      </div>
                      <span className="text-xl">Start Your Journey</span>
                      <ArrowRight size={24} className="animate-arrow-bounce" />
                    </div>
                  </button>
                  <p className="text-sm text-gray-400">✨ Join thousands of happy users today</p>
                </div>
              )}
            </div>
          )}

          {/* Enhanced Login/Verify Left Panel */}
          {(currentStep === 'login' || currentStep === 'verify') && (
            <div className="space-y-6 animate-fade-in relative">
              {/* Helper sticker with encouraging bubble */}
              <div className="absolute -top-10 -right-10 z-20 animate-helper-bounce">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full shadow-xl relative overflow-hidden">
                    <div className="absolute top-1 left-2 w-3 h-3 bg-white/50 rounded-full"></div>
                    <div className="absolute top-5 left-1/2 transform -translate-x-1/2">
                      <div className="flex gap-2 mb-1">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <div className="w-5 h-2 border-b border-white rounded-b-full"></div>
                    </div>
                  </div>
                  <div className="absolute -top-6 -left-20 bg-white/95 text-gray-800 rounded-lg px-3 py-1 text-xs font-medium shadow">
                    {currentStep === 'login' ? 'You got this! Fill the form ✍️' : 'Enter the 6-digit code 🔐'}
                    <div className="absolute bottom-0 right-4 transform translate-y-full">
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-2xl animate-logo-pulse mx-auto relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                  <div className="relative flex items-center justify-center h-full">
                    <Store className="text-white" size={32} />
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                  {currentStep === 'login' ? '🔐 Secure Access' : '📧 Email Verification'}
                </h2>
                <p className="text-lg text-gray-300">
                  {currentStep === 'login' 
                    ? 'Your inventory dashboard awaits' 
                    : 'Almost there! Check your inbox'
                  }
                </p>
              </div>

              {/* Enhanced Features Grid */}
              <div className="grid grid-cols-2 gap-3">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className="group p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 animate-feature-float"
                      style={{ animationDelay: `${index * 0.15}s` }}
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                        <Icon size={16} className="text-white" />
                      </div>
                      <p className="text-sm font-medium text-white mb-1">{feature.title}</p>
                      <p className="text-xs text-gray-400">{feature.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Trust indicators */}
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">System Status: All Good</span>
                </div>
                <div className="flex items-center justify-center gap-4 text-gray-400 text-xs">
                  <div className="flex items-center gap-1">
                    <Shield size={12} />
                    <span>SSL Secured</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Globe size={12} />
                    <span>99.9% Uptime</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Compact Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
        <div className={`w-full max-w-md transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {/* Compact main card */}
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl relative overflow-hidden">
            {/* Animated border */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-sm animate-gradient-shift"></div>
              <div className="absolute inset-px bg-white/10 backdrop-blur-2xl rounded-2xl"></div>
            </div>
            
            <div className="relative z-10 p-6">
              {currentStep === 'login' ? (
                <div className="space-y-5">
                  {/* Mobile header */}
                  <div className="text-center lg:hidden">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl mb-3 shadow-xl animate-pulse mx-auto flex items-center justify-center">
                      <Store className="text-white" size={24} />
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      UC-STORE
                    </h1>
                    <p className="text-gray-300 text-sm">Sign in to continue</p>
                  </div>

                  {/* Compact demo credentials */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-300 flex items-center gap-1">
                      <Sparkles size={12} className="animate-twinkle" />
                      Quick Demo
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {demoCredentials.map((demo, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleDemoLogin(demo)}
                          className="flex flex-col items-center gap-2 p-3 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 hover:border-white/30 transition-all duration-300 text-center group hover:scale-105 animate-demo-card"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${getRoleColor(demo.role)} text-white shadow-md group-hover:shadow-lg transition-shadow`}>
                            {getRoleIcon(demo.role)}
                          </div>
                          <div>
                            <div className="text-xs font-medium text-white">{demo.username.split(' ')[0]}</div>
                            <div className="text-xs text-gray-400 capitalize">{demo.role}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Compact divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                    <span className="text-xs text-gray-400">or</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                  </div>

                  {/* Compact form inputs */}
                  <div className="space-y-4">
                    {errors.general && (
                      <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 animate-shake text-sm">
                        <AlertCircle size={14} />
                        <span>{errors.general}</span>
                      </div>
                    )}

                    {/* Username field */}
                    <div className="animate-slide-in" style={{ animationDelay: '0.1s' }}>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          className={`w-full pl-10 pr-3 py-3 rounded-lg border bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 transition-all duration-300 text-sm ${
                            errors.username 
                              ? "border-red-500/50 focus:border-red-400" 
                              : "border-white/20 focus:border-white/40"
                          } focus:ring-2 focus:ring-white/20 focus:bg-white/15 hover:bg-white/15`}
                          placeholder="Your full name"
                          value={formData.username}
                          onChange={(e) => handleInputChange('username', e.target.value)}
                          disabled={isSubmitting}
                        />
                      </div>
                      {errors.username && (
                        <p className="mt-1 text-xs text-red-300 flex items-center gap-1 animate-slide-in">
                          <AlertCircle size={12} />
                          {errors.username}
                        </p>
                      )}
                    </div>

                    {/* Email field */}
                    <div className="animate-slide-in" style={{ animationDelay: '0.2s' }}>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="email"
                          className={`w-full pl-10 pr-3 py-3 rounded-lg border bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 transition-all duration-300 text-sm ${
                            errors.email 
                              ? "border-red-500/50 focus:border-red-400" 
                              : "border-white/20 focus:border-white/40"
                          } focus:ring-2 focus:ring-white/20 focus:bg-white/15 hover:bg-white/15`}
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          disabled={isSubmitting}
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-300 flex items-center gap-1 animate-slide-in">
                          <AlertCircle size={12} />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Compact role selection */}
                    <div className="animate-slide-in" style={{ animationDelay: '0.3s' }}>
                      <label className="block text-xs font-medium text-gray-300 mb-2">Role</label>
                      <div className="grid grid-cols-2 gap-2">
                        {["admin", "employee"].map((role) => (
                          <button
                            key={role}
                            type="button"
                            onClick={() => handleInputChange('role', role)}
                            disabled={isSubmitting}
                            className={`p-3 rounded-lg border transition-all duration-300 hover:scale-105 text-sm ${
                              formData.role === role
                                ? `border-transparent bg-gradient-to-r ${getRoleColor(role)} text-white shadow-lg scale-105`
                                : "border-white/20 hover:border-white/40 bg-white/10 text-gray-300 hover:bg-white/15"
                            }`}
                          >
                            <div className="flex flex-col items-center gap-1">
                              {getRoleIcon(role)}
                              <span className="font-medium capitalize">{role}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Remember me */}
                    <div className="flex items-center text-sm animate-slide-in" style={{ animationDelay: '0.4s' }}>
                      <input
                        id="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 bg-white/10 border-white/30 rounded"
                        disabled={isSubmitting}
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-xs text-gray-300">
                        Remember me
                      </label>
                    </div>

                    {/* Submit button */}
                    <button 
                      onClick={sendVerificationCode}
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden animate-slide-in"
                      style={{ animationDelay: '0.5s' }}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="animate-spin" size={16} />
                          <span className="text-sm">Sending...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <Send size={16} />
                          <span className="text-sm">Send Code</span>
                          <ArrowRight size={16} className="animate-pulse" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full hover:translate-x-full transition-transform duration-700"></div>
                    </button>

                    {/* Back button for mobile */}
                    <button 
                      type="button" 
                      onClick={goBack}
                      className="w-full lg:hidden bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 border border-white/20 hover:border-white/30 flex items-center justify-center gap-2 text-sm"
                    >
                      <ArrowLeft size={14} />
                      <span>Back</span>
                    </button>
                  </div>
                </div>
              ) : currentStep === 'verify' ? (
                /* Compact Verification Step */
                <div className="space-y-5">
                  {/* Header */}
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl mb-4 shadow-xl animate-bounce-slow mx-auto flex items-center justify-center">
                      <Lock className="text-white" size={24} />
                    </div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-1">
                      Check Your Email
                    </h2>
                    <p className="text-gray-300 text-sm mb-1">6-digit code sent to</p>
                    <p className="text-white font-medium text-sm">{formData.email}</p>
                  </div>

                  <div className="space-y-4">
                    {errors.verification && (
                      <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 animate-shake text-sm">
                        <AlertCircle size={14} />
                        <span>{errors.verification}</span>
                      </div>
                    )}

                    {/* Verification code inputs */}
                    <div className="space-y-3">
                      <label className="block text-xs font-medium text-gray-300 text-center">
                        Enter Code
                      </label>
                      <div className="flex justify-center gap-2">
                        {verificationCode.map((digit, index) => (
                          <input
                            key={index}
                            id={`code-${index}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleCodeChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-10 h-10 text-center text-lg font-bold bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300 hover:bg-white/15"
                            disabled={isSubmitting}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Resend code */}
                    <div className="text-center">
                      {countdown > 0 ? (
                        <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                          <Clock size={14} />
                          <span>Resend in {countdown}s</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={resendCode}
                          disabled={isSubmitting}
                          className="text-indigo-300 hover:text-indigo-200 transition-colors duration-300 flex items-center gap-2 mx-auto hover:scale-105 transform text-sm"
                        >
                          <RefreshCw size={14} />
                          <span>Resend code</span>
                        </button>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="space-y-2">
                      <button 
                        onClick={verifyAndLogin}
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="animate-spin" size={16} />
                            <span>Verifying...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <CheckCircle size={16} />
                            <span>Verify & Sign In</span>
                          </div>
                        )}
                      </button>

                      <button 
                        type="button" 
                        onClick={goBack}
                        disabled={isSubmitting}
                        className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 border border-white/20 hover:border-white/30 flex items-center justify-center gap-2 hover:scale-105 transform text-sm"
                      >
                        <ArrowLeft size={14} />
                        <span>Back</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Pre-Registration Showcase (right column) */
                <div className="space-y-6 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl animate-bounce-slow mx-auto flex items-center justify-center">
                    <Store className="text-white animate-pulse" size={32} />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-1">Get started in minutes</h2>
                    <p className="text-gray-300 text-sm">Modern tools to power your store</p>
                  </div>

                  {/* Animated highlights */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {icon: ShoppingCart, title: 'Fast Sales', color: 'from-emerald-400 to-teal-500'},
                      {icon: PieChart, title: 'Smart Analytics', color: 'from-indigo-400 to-purple-500'},
                      {icon: Database, title: 'Secure Sync', color: 'from-sky-400 to-cyan-500'},
                      {icon: DollarSign, title: 'Better Margins', color: 'from-amber-400 to-orange-500'}
                    ].map((f, i) => {
                      const Icon = f.icon;
                      return (
                        <div key={i} className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 animate-slide-in" style={{animationDelay: `${i * 0.1}s`}}>
                          <div className={`w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-r ${f.color} flex items-center justify-center shadow-lg`}>
                            <Icon size={18} className="text-white" />
                          </div>
                          <p className="text-sm font-semibold text-white">{f.title}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Mini animated status bar */}
                  <div className="mx-auto w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-gradient-to-r from-cyan-400 to-blue-500 animate-progress-glow"></div>
                  </div>

                  {welcomeComplete && (
                    <button
                      onClick={proceedToLogin}
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 animate-slide-up"
                    >
                      <div className="flex items-center gap-2 justify-center">
                        <LogIn size={18} />
                        <span>Continue</span>
                        <ArrowRight size={18} className="animate-bounce-x" />
                      </div>
                    </button>
                  )}
                </div>
              )}

              {/* Compact Footer */}
              {currentStep !== 'welcome' && (
                <div className="mt-6 text-center text-xs text-gray-500 border-t border-white/10 pt-4">
                  <p className="font-medium">UC-STORE v2.0</p>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                    <span>Secure • Fast • Reliable</span>
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse animation-delay-500"></span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Enhanced blob animations */
        @keyframes blob-1 {
          0%, 100% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
          25% { transform: translate(30px, -50px) scale(1.1) rotate(90deg); }
          50% { transform: translate(-20px, 20px) scale(0.9) rotate(180deg); }
          75% { transform: translate(-30px, -30px) scale(1.05) rotate(270deg); }
        }
        @keyframes blob-2 {
          0%, 100% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
          33% { transform: translate(-40px, 30px) scale(1.2) rotate(120deg); }
          66% { transform: translate(40px, -20px) scale(0.8) rotate(240deg); }
        }
        @keyframes blob-3 {
          0%, 100% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
          20% { transform: translate(50px, 30px) scale(0.9) rotate(72deg); }
          40% { transform: translate(-30px, 50px) scale(1.1) rotate(144deg); }
          60% { transform: translate(-50px, -40px) scale(0.95) rotate(216deg); }
          80% { transform: translate(20px, -50px) scale(1.05) rotate(288deg); }
        }

        /* Floating animations */
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          25% { transform: translateY(-20px) translateX(10px) rotate(90deg); }
          50% { transform: translateY(0px) translateX(-10px) rotate(180deg); }
          75% { transform: translateY(20px) translateX(5px) rotate(270deg); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          33% { transform: translateY(15px) translateX(-15px) rotate(120deg); }
          66% { transform: translateY(-15px) translateX(15px) rotate(240deg); }
        }

        /* Particle animations */
        @keyframes float-particle-0 {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
          50% { transform: translateY(-30px) scale(1.2); opacity: 0.8; }
        }
        @keyframes float-particle-1 {
          0%, 100% { transform: translateY(0px) scale(0.8); opacity: 0.4; }
          50% { transform: translateY(-40px) scale(1.1); opacity: 0.9; }
        }
        @keyframes float-particle-2 {
          0%, 100% { transform: translateY(0px) scale(1.1); opacity: 0.2; }
          50% { transform: translateY(-25px) scale(0.9); opacity: 0.7; }
        }

        /* Brand animations */
        @keyframes float-brand {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        @keyframes orbit-1 {
          0% { transform: rotate(0deg) translateX(50px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(50px) rotate(-360deg); }
        }
        @keyframes orbit-2 {
          0% { transform: rotate(0deg) translateX(45px) rotate(0deg); }
          100% { transform: rotate(-360deg) translateX(45px) rotate(360deg); }
        }

        /* Text and UI animations */
        @keyframes text-shimmer {
          0%, 100% { background-position: -200% center; }
          50% { background-position: 200% center; }
        }
        @keyframes text-glow {
          0%, 100% { text-shadow: 0 0 10px rgba(255,255,255,0.5); }
          50% { text-shadow: 0 0 20px rgba(255,255,255,0.8); }
        }
        @keyframes twinkle-star {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes bounce-icon {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-5px) scale(1.1); }
        }
        @keyframes arrow-bounce {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(5px); }
        }
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(8px); }
        }
        @keyframes matrix-rain {
          0% { transform: translateY(-100%); opacity: 0.6; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        @keyframes circuit-flow {
          0% { opacity: 0.2; }
          50% { opacity: 0.4; }
          100% { opacity: 0.2; }
        }
        @keyframes dash-flow {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -1000; }
        }

        /* Enhanced UI animations */
        @keyframes gradient-shift {
          0%, 100% { transform: translateX(-100%) rotate(0deg); }
          50% { transform: translateX(100%) rotate(180deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(139, 69, 254, 0.3); }
          50% { box-shadow: 0 0 30px rgba(139, 69, 254, 0.6); }
        }
        @keyframes logo-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(139, 69, 254, 0.3); }
          50% { transform: scale(1.05); box-shadow: 0 0 30px rgba(139, 69, 254, 0.5); }
        }
        @keyframes cta-pulse {
          0%, 100% { box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3); }
          50% { box-shadow: 0 15px 40px rgba(16, 185, 129, 0.5); }
        }
        @keyframes cta-entrance {
          0% { transform: translateY(30px) scale(0.9); opacity: 0; }
          100% { transform: translateY(0px) scale(1); opacity: 1; }
        }

        /* Complex animations */
        @keyframes wave {
          0%, 100% { height: 32px; }
          50% { height: 16px; }
        }
        @keyframes grid-drift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        @keyframes spin-very-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Component-specific animations */
        @keyframes slide-in-stats {
          0% { transform: translateX(-20px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes number-count {
          0% { transform: scale(0.8); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes icon-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        @keyframes feature-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes demo-card {
          0% { transform: translateY(10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes character-dance {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(5deg) scale(1.03); }
          50% { transform: rotate(0deg) scale(1.06); }
          75% { transform: rotate(-5deg) scale(1.03); }
        }
        @keyframes character-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes celebration-particle {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-20px) scale(0.8); opacity: 0; }
        }
        @keyframes success-ring {
          0% { transform: scale(0.9); opacity: 0.7; }
          100% { transform: scale(1.2); opacity: 0; }
        }
        @keyframes check-grow {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes progress-glow {
          0%, 100% { filter: drop-shadow(0 0 6px rgba(34,211,238,0.5)); }
          50% { filter: drop-shadow(0 0 10px rgba(59,130,246,0.8)); }
        }

        /* Success animations */
        @keyframes bounce-success {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.1); }
        }
        @keyframes scale-in {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        @keyframes ping-slower {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(1.5); opacity: 0; }
        }

        /* General animations */
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes slide-in {
          0% { transform: translateY(-10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes slide-up {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        /* Apply animations */
        .animate-blob-1 { animation: blob-1 8s infinite; }
        .animate-blob-2 { animation: blob-2 10s infinite; }
        .animate-blob-3 { animation: blob-3 12s infinite; }
        .animate-float-1 { animation: float-1 6s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 8s ease-in-out infinite; }
        .animate-float-particle-0 { animation: float-particle-0 4s ease-in-out infinite; }
        .animate-float-particle-1 { animation: float-particle-1 5s ease-in-out infinite; }
        .animate-float-particle-2 { animation: float-particle-2 6s ease-in-out infinite; }
        .animate-float-brand { animation: float-brand 3s ease-in-out infinite; }
        .animate-orbit-1 { animation: orbit-1 8s linear infinite; }
        .animate-orbit-2 { animation: orbit-2 12s linear infinite; }
        .animate-text-shimmer { animation: text-shimmer 3s ease-in-out infinite; background-size: 400% 400%; }
        .animate-text-glow { animation: text-glow 2s ease-in-out infinite; }
        .animate-twinkle-star { animation: twinkle-star 1.5s ease-in-out infinite; }
        .animate-bounce-icon { animation: bounce-icon 2s ease-in-out infinite; }
        .animate-arrow-bounce { animation: arrow-bounce 1s ease-in-out infinite; }
        .animate-bounce-x { animation: bounce-x 1s ease-in-out infinite; }
        .animate-matrix-rain { animation: matrix-rain linear infinite; }
        .animate-circuit-flow { animation: circuit-flow 6s ease-in-out infinite; }
        .animate-gradient-shift { animation: gradient-shift 4s ease infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-logo-pulse { animation: logo-pulse 3s ease-in-out infinite; }
        .animate-cta-pulse { animation: cta-pulse 2s ease-in-out infinite; }
        .animate-cta-entrance { animation: cta-entrance 0.8s ease-out; }
        .animate-wave { animation: wave 2s ease-in-out infinite; }
        .animate-grid-drift { animation: grid-drift 20s linear infinite; }
        .animate-spin-very-slow { animation: spin-very-slow 20s linear infinite; }
        .animate-slide-in-stats { animation: slide-in-stats 0.6s ease-out; }
        .animate-number-count { animation: number-count 0.5s ease-out; }
        .animate-icon-float { animation: icon-float 2s ease-in-out infinite; }
        .animate-feature-float { animation: feature-float 3s ease-in-out infinite; }
        .animate-demo-card { animation: demo-card 0.5s ease-out; }
        .animate-character-dance { animation: character-dance 2.5s ease-in-out infinite; }
        .animate-character-bounce { animation: character-bounce 2s ease-in-out infinite; }
        .animate-celebration-particle { animation: celebration-particle 0.8s ease-out forwards; }
        .animate-success-ring { animation: success-ring 1.2s ease-out infinite; }
        .animate-check-grow { animation: check-grow 0.6s ease-out forwards; }
        .animate-progress-glow { animation: progress-glow 2s ease-in-out infinite; }
        .animate-bounce-success { animation: bounce-success 1s ease-in-out infinite; }
        .animate-scale-in { animation: scale-in 0.5s ease-out; }
        .animate-ping-slow { animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .animate-ping-slower { animation: ping-slower 3s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .animate-slide-in { animation: slide-in 0.6s ease-out; }
        .animate-slide-up { animation: slide-up 0.8s ease-out; }
        .animate-fade-in { animation: fade-in 1s ease-out; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }

        /* Delay classes */
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }

        /* Enhanced shadows */
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }

        /* Responsive optimizations */
        @media (max-width: 1024px) {
          .animate-blob-1, .animate-blob-2, .animate-blob-3 { 
            animation-duration: 15s; 
          }
          .animate-float-1, .animate-float-2 { 
            animation-duration: 10s; 
          }
        }
        /* Mascot animations */
        @keyframes mascot-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes mascot-blink {
          0%, 92%, 100% { opacity: 1; }
          95% { opacity: 0; }
        }
        @keyframes mascot-wave {
          0%, 100% { transform: rotate(45deg); }
          50% { transform: rotate(25deg); }
        }
        @keyframes helper-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}