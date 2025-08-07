import React from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { 
  LayoutDashboard, 
  Dumbbell, 
  Tag,
  Users, 
  FileText, 
  Settings,
  Menu,
  X,
  Sun,
  Moon,
  Globe
} from 'lucide-react';
import { NavigationTab, GymSettings } from '../types';

interface NavigationProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  gymSettings: GymSettings;
  onSettingsChange: (settings: GymSettings) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  activeTab,
  onTabChange,
  gymSettings,
  onSettingsChange,
  isOpen,
  onToggle
}) => {
  const { t } = useTranslation();
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'ku', name: 'Kurdish', flag: '🇮🇶' },
  ];

  const handleLanguageChange = async (languageCode: string) => {
    await i18n.changeLanguage(languageCode);
    onSettingsChange({ ...gymSettings, language: languageCode });
  };

  const toggleDarkMode = () => {
    onSettingsChange({ ...gymSettings, darkMode: !gymSettings.darkMode });
  };

  const navItems = [
    { id: 'dashboard' as NavigationTab, label: t('dashboard'), icon: LayoutDashboard },
    { id: 'exercises' as NavigationTab, label: t('exercises'), icon: Dumbbell },
    { id: 'categories' as NavigationTab, label: t('categories'), icon: Tag },
    { id: 'players' as NavigationTab, label: t('players'), icon: Users },
    { id: 'plans' as NavigationTab, label: t('workoutPlans'), icon: FileText },
    { id: 'settings' as NavigationTab, label: t('settings'), icon: Settings },
  ];

  const handleTabClick = (tabId: NavigationTab) => {
    onTabChange(tabId);
    // Always close mobile nav when changing tabs, regardless of language
    if (window.innerWidth < 1024) {
      onToggle();
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className={`lg:hidden fixed top-4 z-50 p-2 ${gymSettings.darkMode ? 'bg-gray-700' : 'bg-gray-800'} text-white rounded-lg shadow-lg left-4 rtl:left-auto rtl:right-4`}
        onClick={onToggle}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 z-40 w-64 ${gymSettings.darkMode ? 'bg-gray-900' : 'bg-gray-800'} text-white transition-transform duration-300 ease-in-out overflow-y-auto
        left-0 rtl:left-auto rtl:right-0
        ${isOpen 
          ? 'transform translate-x-0' 
          : 'transform -translate-x-full lg:translate-x-0 rtl:translate-x-full rtl:-translate-x-full'
        }
      `}>
        <div className={`p-6 border-b ${gymSettings.darkMode ? 'border-gray-700' : 'border-gray-700'}`}>
          <div className="flex items-center gap-3 mb-3">
            {gymSettings.logo && (
              <img src={gymSettings.logo} alt="Logo" className="w-8 h-8 rounded" />
            )}
            <h1 className="text-xl font-bold text-orange-400">{gymSettings.name}</h1>
          </div>
          <p className="text-sm text-gray-300 mt-1">{t('managementSystem')}</p>
          
          {/* Theme and Language Controls */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-700">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
              title={gymSettings.darkMode ? t('switchToLightMode') : t('switchToDarkMode')}
            >
              {gymSettings.darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            
            <div className="relative group">
              <button className="flex items-center gap-1 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                <Globe size={16} />
                <span className="text-xs">
                  {languages.find(lang => lang.code === gymSettings.language)?.flag}
                </span>
              </button>
              
              <div className="absolute right-0 top-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[120px]">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg flex items-center gap-2 ${
                      gymSettings.language === lang.code ? 'bg-orange-600' : ''
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <nav className="mt-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`
                  w-full flex items-center px-6 py-3 text-left ${gymSettings.darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-700'} transition-colors
                  ${activeTab === item.id ? 'bg-orange-600 hover:bg-orange-700' : ''}
                `}
              >
                <Icon size={20} className="mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={onToggle}
        />
      )}
    </>
  );
};