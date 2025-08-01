import { effect, Injectable, signal } from '@angular/core';
import { List, Category } from '../../models/models';

@Injectable({
  providedIn: 'root',
})
export class ListData {
  // ===== CONSTANTS =====
  private readonly STORAGE_KEY = 'smaran-todo-list';

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

  // ===== LOCALSTORAGE METHODS =====
  private loadFromLocalStorage(): List[] {
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
