import { effect, Injectable, signal } from '@angular/core';
import { List, Category } from '../../models/models';

@Injectable({
  providedIn: 'root',
})
export class ListData {
  // ===== CONSTANTS =====
  private readonly STORAGE_KEY = 'smaran-todo-list';
  private readonly COOKIE_CONSENT_KEY = 'smaran-cookie-consent';

  // ===== STATE =====
  private list = signal<List[]>(this.loadFromLocalStorage());

  // ===== CONSTRUCTOR =====
  constructor() {
    effect(() => {
      const list = this.list();
      this.saveToLocalStorage(list);
    });
  }

  // Public methods to interact with the list
  getList() {
    return this.list.asReadonly();
  }

  updateList(updateFn: (list: List[]) => List[]) {
    this.list.update(updateFn);
  }

  addItem(item: List) {
    this.list.update((list) => [...list, item]);
  }

  getMaxId(): number {
    return this.list().reduce((acc, curr) => {
      if (curr.id > acc) {
        acc = curr.id;
      }
      return acc;
    }, 0);
  }

  // ===== PRIVATE HELPERS =====
  private addDaysToToday(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString();
  }

  // ===== COOKIE CONSENT METHODS =====
  private hasCookieConsent(): boolean {
    try {
      const consent = localStorage.getItem(this.COOKIE_CONSENT_KEY);
      return consent === 'true';
    } catch (error) {
      console.error('Error checking cookie consent:', error);
      return false;
    }
  }

  // ===== LOCALSTORAGE METHODS =====
  private loadFromLocalStorage(): List[] {
    // Only load from localStorage if user has given consent
    if (!this.hasCookieConsent()) {
      return this.getDefaultData();
    }

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }

    // Return default data if localStorage is empty or has errors
    return this.getDefaultData();
  }

  private saveToLocalStorage(list: List[]): void {
    // Only save to localStorage if user has given consent
    if (!this.hasCookieConsent()) {
      return;
    }

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  private getDefaultData(): List[] {
    return [
      {
        id: 1,
        content: 'Click to edit this demo task or add a new one',
        category: Category.ACTIVE,
        isChecked: false,
        endDate: this.addDaysToToday(7),
        completedDate: undefined,
      },
    ];
  }
}
