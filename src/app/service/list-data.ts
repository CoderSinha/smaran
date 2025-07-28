import { Injectable, signal } from '@angular/core';
import { List, Category } from '../../models/models';

@Injectable({
  providedIn: 'root',
})
export class ListData {
  private list = signal<List[]>([
    {
      id: 1,
      content: 'Buy groceries for the week',
      category: Category.ACTIVE,
      isChecked: false,
      endDate: this.addDaysToToday(2),
      completedDate: undefined,
    },
    {
      id: 2,
      content: 'Complete Angular project documentation',
      category: Category.ACTIVE,
      isChecked: false,
      endDate: this.addDaysToToday(20),
      completedDate: undefined,
    },
    {
      id: 3,
      content: 'Schedule dentist appointment',
      category: Category.ACTIVE,
      isChecked: false,
      endDate: this.addDaysToToday(4),
      completedDate: undefined,
    },
    {
      id: 4,
      content: 'Review pull requests from team',
      category: Category.ACTIVE,
      isChecked: false,
      endDate: this.addDaysToToday(3),
      completedDate: undefined,
    },
    {
      id: 5,
      content: 'Plan weekend trip to mountains',
      category: Category.ACTIVE,
      isChecked: false,
      endDate: this.addDaysToToday(35),
      completedDate: undefined,
    },
    {
      id: 6,
      content: 'Update resume with recent projects',
      category: Category.ACTIVE,
      isChecked: false,
      endDate: this.addDaysToToday(15),
      completedDate: undefined,
    },
    {
      id: 7,
      content: 'Call mom for her birthday',
      category: Category.ACTIVE,
      isChecked: false,
      endDate: this.addDaysToToday(10),
      completedDate: undefined,
    },
    {
      id: 8,
      content: 'Fix leaky faucet in kitchen',
      category: Category.ACTIVE,
      isChecked: false,
      endDate: this.addDaysToToday(5),
      completedDate: undefined,
    },
    {
      id: 9,
      content: 'Research new laptop options',
      category: Category.ACTIVE,
      isChecked: false,
      endDate: this.addDaysToToday(25),
      completedDate: undefined,
    },
    {
      id: 10,
      content: 'Organize digital photos from vacation',
      category: Category.ACTIVE,
      isChecked: false,
      endDate: this.addDaysToToday(50),
      completedDate: undefined,
    },
    {
      id: 11,
      content: 'Learn TypeScript advanced features',
      category: Category.ACTIVE,
      isChecked: false,
      endDate: this.addDaysToToday(65),
      completedDate: undefined,
    },
    {
      id: 12,
      content: 'Clean out garage and donate items',
      category: Category.ACTIVE,
      isChecked: false,
      endDate: this.addDaysToToday(33),
      completedDate: undefined,
    },
    {
      id: 13,
      content: 'Set up automated backup system',
      category: Category.COMPLETED,
      isChecked: true,
      endDate: this.addDaysToToday(1),
      completedDate: this.addDaysToToday(1),
    },
    {
      id: 14,
      content: 'Finish reading "Clean Code" book',
      category: Category.COMPLETED,
      isChecked: true,
      endDate: this.addDaysToToday(7),
      completedDate: this.addDaysToToday(7),
    },
    {
      id: 15,
      content: 'Install new security system',
      category: Category.COMPLETED,
      isChecked: true,
      endDate: this.addDaysToToday(12),
      completedDate: this.addDaysToToday(12),
    },
    {
      id: 16,
      content: 'Complete online course on React',
      category: Category.COMPLETED,
      isChecked: true,
      endDate: this.addDaysToToday(18),
      completedDate: this.addDaysToToday(18),
    },
    {
      id: 17,
      content: 'Submit tax documents to accountant',
      category: Category.COMPLETED,
      isChecked: true,
      endDate: this.addDaysToToday(22),
      completedDate: this.addDaysToToday(22),
    },
    {
      id: 18,
      content: 'Renew car insurance policy',
      category: Category.COMPLETED,
      isChecked: true,
      endDate: this.addDaysToToday(30),
      completedDate: this.addDaysToToday(30),
    },
  ]);

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

  private addDaysToToday(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString();
  }
}
