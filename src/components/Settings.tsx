import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, Upload, Building2, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Palette, Moon, Sun } from 'lucide-react';
import { GymSettings } from '../types';

interface SettingsProps {
  settings: GymSettings;
  onSave: (settings: GymSettings) => void;
}

export const Settings: React.FC<SettingsProps> = ({ settings, onSave }) => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState<GymSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);

  const themeColors = [
    { name: 'Orange (Default)', value: '#F97316' },
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Indigo', value: '#6366F1' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Teal', value: '#06B6D4' },
    { name: 'Amber', value: '#F59E0B' },
    { name: 'Lime', value: '#84CC16' },
  ];

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'ku', name: 'Kurdish', nativeName: 'کوردی' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Update language if changed
      if (formData.language !== i18n.language) {
        await i18n.changeLanguage(formData.language);
      }
      onSave(formData);
      alert(t('settingsSaved'));
    } catch (error) {
      alert(t('settingsError'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, customFont: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t('settings')}</h1>
        <p className="text-gray-600">{t('customizeGym')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{t('basicInformation')}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('gymName')} *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('location')} *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder={t('locationPlaceholder')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('logo')}
            </label>
            <div className="flex items-center gap-4">
              {formData.logo && (
                <img 
                  src={formData.logo} 
                  alt="Gym logo" 
                  className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                />
              )}
              <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <Upload size={16} />
                {t('uploadLogo')}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <Phone className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{t('contactInformation')}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail size={16} className="inline mr-1" />
                {t('email')} *
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone size={16} className="inline mr-1" />
                {t('phone')} *
              </label>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <Instagram className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{t('socialMedia')}</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Facebook size={16} className="inline mr-1" />
                {t('facebookURL')}
              </label>
              <input
                type="url"
                value={formData.socialMedia.facebook || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  socialMedia: { ...formData.socialMedia, facebook: e.target.value }
                })}
                placeholder={t('facebookURLPlaceholder')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Instagram size={16} className="inline mr-1" />
                {t('instagramURL')}
              </label>
              <input
                type="url"
                value={formData.socialMedia.instagram || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  socialMedia: { ...formData.socialMedia, instagram: e.target.value }
                })}
                placeholder={t('instagramURLPlaceholder')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Twitter size={16} className="inline mr-1" />
                {t('twitterURL')}
              </label>
              <input
                type="url"
                value={formData.socialMedia.twitter || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  socialMedia: { ...formData.socialMedia, twitter: e.target.value }
                })}
                placeholder={t('twitterURLPlaceholder')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Customization */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{t('customization')}</h2>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('themeColor')}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {themeColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, themeColor: color.value })}
                  className={`flex items-center gap-2 p-2 sm:p-3 border rounded-lg transition-all hover:shadow-sm ${
                    formData.themeColor === color.value 
                      ? 'border-gray-800 bg-gray-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: color.value }}
                  />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">{color.name}</span>
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {t('chooseThemeColor')}
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('language')}
            </label>
            <select
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-2">
              {t('selectLanguage')}
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('themeMode')}
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, darkMode: false })}
                className={`flex items-center gap-2 p-3 border rounded-lg transition-all hover:shadow-sm ${
                  !formData.darkMode 
                    ? 'border-gray-800 bg-gray-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Sun size={16} />
                <span className="text-sm font-medium text-gray-700">{t('lightMode')}</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, darkMode: true })}
                className={`flex items-center gap-2 p-3 border rounded-lg transition-all hover:shadow-sm ${
                  formData.darkMode 
                    ? 'border-gray-800 bg-gray-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Moon size={16} />
                <span className="text-sm font-medium text-gray-700">{t('darkMode')}</span>
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {t('chooseThemeMode')}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('customFont')}
            </label>
            <div className="flex items-center gap-4">
              {formData.customFont && (
                <p className="text-sm text-green-600">{t('customFontUploaded')}</p>
              )}
              <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <Upload size={16} />
                {t('uploadFont')}
                <input
                  type="file"
                  accept=".ttf,.otf,.woff,.woff2"
                  onChange={handleFontUpload}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {t('uploadCustomFont')}
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
          >
            <Save size={20} />
            {isSaving ? t('saving') : t('saveSettings')}
          </button>
        </div>
      </form>
    </div>
  );
};