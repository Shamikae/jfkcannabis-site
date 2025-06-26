import React, { useState, useEffect } from 'react';
import { Accessibility, ZoomIn, ZoomOut, Sun, Moon, Type, Eye } from 'lucide-react';

interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'x-large';
  contrast: 'normal' | 'high';
  reducedMotion: boolean;
  dyslexicFont: boolean;
}

const AccessibilityMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 'normal',
    contrast: 'normal',
    reducedMotion: false,
    dyslexicFont: false
  });

  // Apply settings when they change
  useEffect(() => {
    // Font size
    document.documentElement.classList.remove('text-normal', 'text-large', 'text-x-large');
    document.documentElement.classList.add(`text-${settings.fontSize}`);
    
    // Contrast
    if (settings.contrast === 'high') {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    // Reduced motion
    if (settings.reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
    
    // Dyslexic font
    if (settings.dyslexicFont) {
      document.documentElement.classList.add('dyslexic-font');
      // Load OpenDyslexic font if not already loaded
      if (!document.getElementById('dyslexic-font-stylesheet')) {
        const link = document.createElement('link');
        link.id = 'dyslexic-font-stylesheet';
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/opendyslexic@1.0.3/dist/opendyslexic/opendyslexic.css';
        document.head.appendChild(link);
      }
    } else {
      document.documentElement.classList.remove('dyslexic-font');
    }
    
    // Save settings to localStorage
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
  }, [settings]);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibilitySettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    
    // Add CSS variables for accessibility
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --base-font-size: 1rem;
        --text-color: #1a1a1a;
        --bg-color: #f7f7f7;
        --link-color: #396842;
      }
      
      /* Font size classes */
      .text-normal {
        font-size: var(--base-font-size);
      }
      
      .text-large {
        font-size: calc(var(--base-font-size) * 1.25);
      }
      
      .text-x-large {
        font-size: calc(var(--base-font-size) * 1.5);
      }
      
      /* High contrast mode */
      .high-contrast {
        --text-color: #ffffff;
        --bg-color: #000000;
        --link-color: #ffff00;
      }
      
      .high-contrast body {
        background-color: var(--bg-color);
        color: var(--text-color);
      }
      
      .high-contrast a {
        color: var(--link-color);
      }
      
      /* Dyslexic font */
      .dyslexic-font body,
      .dyslexic-font h1,
      .dyslexic-font h2,
      .dyslexic-font h3,
      .dyslexic-font h4,
      .dyslexic-font h5,
      .dyslexic-font h6,
      .dyslexic-font p,
      .dyslexic-font span,
      .dyslexic-font a,
      .dyslexic-font button,
      .dyslexic-font input,
      .dyslexic-font select,
      .dyslexic-font textarea {
        font-family: 'OpenDyslexic', sans-serif !important;
      }
      
      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          animation-duration: 0.001s !important;
          transition-duration: 0.001s !important;
        }
      }
      
      .reduced-motion *,
      .reduced-motion *::before,
      .reduced-motion *::after {
        animation-duration: 0.001s !important;
        transition-duration: 0.001s !important;
      }
      
      /* Accessibility improvements */
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
      }
      
      /* Dropdown scrolling */
      .dropdown-scrollable {
        max-height: 80vh;
        overflow-y: auto;
        scrollbar-width: thin;
      }
      
      .dropdown-scrollable::-webkit-scrollbar {
        width: 6px;
      }
      
      .dropdown-scrollable::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
      }
      
      .dropdown-scrollable::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 10px;
      }
      
      .dropdown-scrollable::-webkit-scrollbar-thumb:hover {
        background: #555;
      }
    `;
    document.head.appendChild(style);
    
    // Check for system preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setSettings(prev => ({ ...prev, reducedMotion: true }));
    }
    
    const prefersHighContrast = window.matchMedia('(prefers-contrast: more)').matches;
    if (prefersHighContrast) {
      setSettings(prev => ({ ...prev, contrast: 'high' }));
    }
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings({
      fontSize: 'normal',
      contrast: 'normal',
      reducedMotion: false,
      dyslexicFont: false
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <button
        onClick={toggleMenu}
        className="flex items-center justify-center p-3 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors"
        aria-label="Accessibility options"
        aria-expanded={isOpen}
      >
        <Accessibility className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-72 bg-white rounded-lg shadow-xl p-4">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <Accessibility className="h-5 w-5 mr-2 text-primary-600" />
            Accessibility Options
          </h3>

          <div className="space-y-4">
            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Text Size
              </label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateSetting('fontSize', 'normal')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm ${
                    settings.fontSize === 'normal' 
                      ? 'bg-primary-100 text-primary-700 font-medium' 
                      : 'bg-neutral-100 text-neutral-700'
                  }`}
                  aria-pressed={settings.fontSize === 'normal'}
                >
                  <ZoomOut className="h-4 w-4 inline-block mr-1" />
                  Normal
                </button>
                <button
                  onClick={() => updateSetting('fontSize', 'large')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm ${
                    settings.fontSize === 'large' 
                      ? 'bg-primary-100 text-primary-700 font-medium' 
                      : 'bg-neutral-100 text-neutral-700'
                  }`}
                  aria-pressed={settings.fontSize === 'large'}
                >
                  <Type className="h-4 w-4 inline-block mr-1" />
                  Large
                </button>
                <button
                  onClick={() => updateSetting('fontSize', 'x-large')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm ${
                    settings.fontSize === 'x-large' 
                      ? 'bg-primary-100 text-primary-700 font-medium' 
                      : 'bg-neutral-100 text-neutral-700'
                  }`}
                  aria-pressed={settings.fontSize === 'x-large'}
                >
                  <ZoomIn className="h-4 w-4 inline-block mr-1" />
                  X-Large
                </button>
              </div>
            </div>

            {/* Contrast */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Contrast
              </label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateSetting('contrast', 'normal')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm ${
                    settings.contrast === 'normal' 
                      ? 'bg-primary-100 text-primary-700 font-medium' 
                      : 'bg-neutral-100 text-neutral-700'
                  }`}
                  aria-pressed={settings.contrast === 'normal'}
                >
                  <Sun className="h-4 w-4 inline-block mr-1" />
                  Normal
                </button>
                <button
                  onClick={() => updateSetting('contrast', 'high')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm ${
                    settings.contrast === 'high' 
                      ? 'bg-primary-100 text-primary-700 font-medium' 
                      : 'bg-neutral-100 text-neutral-700'
                  }`}
                  aria-pressed={settings.contrast === 'high'}
                >
                  <Moon className="h-4 w-4 inline-block mr-1" />
                  High Contrast
                </button>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="reduced-motion" className="text-sm text-neutral-700">
                  Reduced Motion
                </label>
                <div className="relative inline-flex items-center">
                  <input
                    type="checkbox"
                    id="reduced-motion"
                    checked={settings.reducedMotion}
                    onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-11 h-6 rounded-full transition ${
                      settings.reducedMotion ? 'bg-primary-600' : 'bg-neutral-300'
                    }`}
                  >
                    <div
                      className={`transform transition-transform bg-white w-5 h-5 rounded-full shadow-md ${
                        settings.reducedMotion ? 'translate-x-6' : 'translate-x-1'
                      }`}
                      style={{ marginTop: '2px' }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label htmlFor="dyslexic-font" className="text-sm text-neutral-700">
                  Dyslexia-friendly Font
                </label>
                <div className="relative inline-flex items-center">
                  <input
                    type="checkbox"
                    id="dyslexic-font"
                    checked={settings.dyslexicFont}
                    onChange={(e) => updateSetting('dyslexicFont', e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-11 h-6 rounded-full transition ${
                      settings.dyslexicFont ? 'bg-primary-600' : 'bg-neutral-300'
                    }`}
                  >
                    <div
                      className={`transform transition-transform bg-white w-5 h-5 rounded-full shadow-md ${
                        settings.dyslexicFont ? 'translate-x-6' : 'translate-x-1'
                      }`}
                      style={{ marginTop: '2px' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-between">
              <button
                onClick={resetSettings}
                className="text-sm text-neutral-600 hover:text-neutral-900"
              >
                Reset to Default
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-sm bg-primary-600 text-white px-3 py-1 rounded-md hover:bg-primary-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessibilityMenu;
