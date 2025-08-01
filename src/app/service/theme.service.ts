import { Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_STORAGE_KEY = 'smaran-theme';
  private currentTheme = signal<Theme>(this.loadThemeFromStorage());

  constructor() {
    this.initializeSystemListener();
    this.applyTheme(this.currentTheme());
  }

  toggleTheme(): void {
    const current = this.currentTheme();
    const newTheme =
      current === 'system'
        ? this.getSystemPreference() === 'dark'
          ? 'light'
          : 'dark'
        : current === 'light'
          ? 'dark'
          : 'light';

    this.setTheme(newTheme);
  }

  isDarkMode(): boolean {
    const theme = this.currentTheme();
    return theme === 'system' ? this.getSystemPreference() === 'dark' : theme === 'dark';
  }

  private setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
    this.applyTheme(theme);
    this.saveThemeToStorage(theme);
  }
  private loadThemeFromStorage(): Theme {
    try {
      const stored = localStorage.getItem(this.THEME_STORAGE_KEY);
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
    } catch (error) {
      console.error('Error loading theme from localStorage:', error);
    }

    // Default to system preference
    return 'system';
  }

  private saveThemeToStorage(theme: Theme): void {
    try {
      localStorage.setItem(this.THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.error('Error saving theme to localStorage:', error);
    }
  }

  private getSystemPreference(): 'light' | 'dark' {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    } else {
      return 'light';
    }
  }

  private initializeSystemListener(): void {
    // Simple universal approach - just poll every second
    let lastSystemPreference = this.getSystemPreference();

    const checkSystemTheme = () => {
      const currentSystemPreference = this.getSystemPreference();

      if (currentSystemPreference !== lastSystemPreference) {
        lastSystemPreference = currentSystemPreference;

        if (this.currentTheme() === 'system') {
          // If following system, apply the change
          this.applyTheme('system');
        } else {
          // If not following system, update the stored preference to match system
          // This keeps the stored preference in sync with system changes
          this.currentTheme.set(currentSystemPreference);
          this.applyTheme(currentSystemPreference);
          this.saveThemeToStorage(currentSystemPreference);
        }
      }
    };

    // Poll every second - works universally across all browsers
    setInterval(checkSystemTheme, 1000);

    // Also check on window events for faster response
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', checkSystemTheme);
      window.addEventListener('visibilitychange', checkSystemTheme);
    }
  }

  private applyTheme(theme: Theme): void {
    if (typeof document !== 'undefined') {
      let actualTheme: 'light' | 'dark';

      if (theme === 'system') {
        actualTheme = this.getSystemPreference();
      } else {
        actualTheme = theme as 'light' | 'dark';
      }

      document.documentElement.setAttribute('data-theme', actualTheme);
    }
  }
}
