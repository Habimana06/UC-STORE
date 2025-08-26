import React, { createContext, useEffect, useMemo, useState, useCallback } from "react";

const UIContext = createContext(null);

export { UIContext };

export function UIProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'english');
  const translations = useMemo(() => ({
    english: {
      nav: {
        navigation: 'Navigation',
        dashboard: 'Dashboard',
        home: 'Home',
        products: 'Products',
        sales: 'Sales',
        purchases: 'Purchases',
        analytics: 'Analytics',
        reports: 'Reports',
        settings: 'Settings',
        profile: 'Profile',
      },
      actions: {
        quickActions: 'Quick Actions',
        notifications: 'Notifications',
        logout: 'Logout',
        new: 'new',
      },
    },
    french: {
      nav: {
        navigation: 'Navigation',
        dashboard: 'Tableau de bord',
        home: 'Accueil',
        products: 'Produits',
        sales: 'Ventes',
        purchases: 'Achats',
        analytics: 'Analytique',
        reports: 'Rapports',
        settings: 'Paramètres',
        profile: 'Profil',
      },
      actions: {
        quickActions: 'Actions rapides',
        notifications: 'Notifications',
        logout: 'Déconnexion',
        new: 'nouveau',
      },
    },
  }), []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language === 'french' ? 'fr' : 'en';
  }, [language]);

  const t = useCallback((key) => {
    try {
      return key.split('.').reduce((obj, k) => obj[k], translations[language]) || key;
    } catch {
      return key;
    }
  }, [language, translations]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo(() => ({
    theme,
    setTheme,
    language,
    setLanguage,
    toggleTheme,
    t,
  }), [theme, language, t, toggleTheme]);

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}




