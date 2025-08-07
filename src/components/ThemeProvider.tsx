import React, { useEffect } from 'react';
import { GymSettings } from '../types';

interface ThemeProviderProps {
  settings: GymSettings;
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ settings, children }) => {
  useEffect(() => {
    // Apply dark mode class to document
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }

    // Create CSS custom properties for the theme color
    const root = document.documentElement;
    const themeColor = settings.themeColor || '#F97316';
    // Always use LTR direction for all languages
    document.body.setAttribute('dir', 'ltr');
    
    // Convert hex to RGB for various opacity levels
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };

    const rgb = hexToRgb(themeColor);
    if (rgb) {
      root.style.setProperty('--theme-color', themeColor);
      root.style.setProperty('--theme-color-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
      
      // Generate lighter and darker variants
      const lighterColor = `rgb(${Math.min(255, rgb.r + 20)}, ${Math.min(255, rgb.g + 20)}, ${Math.min(255, rgb.b + 20)})`;
      const darkerColor = `rgb(${Math.max(0, rgb.r - 20)}, ${Math.max(0, rgb.g - 20)}, ${Math.max(0, rgb.b - 20)})`;
      
      root.style.setProperty('--theme-color-light', lighterColor);
      root.style.setProperty('--theme-color-dark', darkerColor);
      
      // Set opacity variants
      root.style.setProperty('--theme-color-50', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.05)`);
      root.style.setProperty('--theme-color-100', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`);
      root.style.setProperty('--theme-color-200', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`);
    }

    // Apply custom font system-wide
    if (settings.customFont) {
      // Remove existing custom font if any
      const existingStyle = document.getElementById('custom-font-style');
      if (existingStyle) {
        existingStyle.remove();
      }

      // Create new style element for custom font
      const style = document.createElement('style');
      style.id = 'custom-font-style';
      
      // Extract font format from data URL
      const getFontFormat = (dataUrl: string) => {
        if (dataUrl.includes('font/woff2')) return 'woff2';
        if (dataUrl.includes('font/woff')) return 'woff';
        if (dataUrl.includes('font/ttf') || dataUrl.includes('font/truetype')) return 'truetype';
        if (dataUrl.includes('font/otf') || dataUrl.includes('font/opentype')) return 'opentype';
        // Fallback based on common file extensions in data URL
        if (dataUrl.includes('.woff2')) return 'woff2';
        if (dataUrl.includes('.woff')) return 'woff';
        if (dataUrl.includes('.ttf')) return 'truetype';
        if (dataUrl.includes('.otf')) return 'opentype';
        return 'truetype'; // Default fallback
      };

      const fontFormat = getFontFormat(settings.customFont);
      
      // Define the custom font face
      style.textContent = `
        @font-face {
          font-family: 'CustomGymFont';
          src: url('${settings.customFont}') format('${fontFormat}');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        
        /* Apply custom font to the entire application */
        * {
          font-family: 'CustomGymFont', 'Noto Sans Arabic', 'Noto Sans', sans-serif !important;
        }
        
        /* Ensure proper font rendering for different languages */
        html[lang="ar"] *,
        html[lang="ku"] * {
          font-family: 'CustomGymFont', 'Noto Sans Arabic', sans-serif !important;
        }
        
        html[lang="en"] * {
          font-family: 'CustomGymFont', 'Noto Sans', sans-serif !important;
        }
        
        /* Maintain font for input elements */
        input, textarea, select, button {
          font-family: 'CustomGymFont', 'Noto Sans Arabic', 'Noto Sans', sans-serif !important;
        }
      `;
      
      document.head.appendChild(style);
    } else {
      // Remove custom font if no font is set
      const existingStyle = document.getElementById('custom-font-style');
      if (existingStyle) {
        existingStyle.remove();
      }
    }
  }, [settings.themeColor]);

  // Also update when custom font changes
  useEffect(() => {
    // This effect will run when customFont changes
    // The main effect above will handle the font application
  }, [settings.customFont]);

  return <>{children}</>;
};