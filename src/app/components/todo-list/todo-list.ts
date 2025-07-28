import { Component, computed, inject, signal } from '@angular/core';
import { Todo } from '../todo/todo';
import { List, Category } from '../../../models/models';
import { Chips } from '../chips/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AddDialog } from '../add-dialog/add-dialog';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css',
  imports: [Todo, Chips, MatButtonModule, MatIconModule],
})
export class TodoList {
  list = signal<List[]>([
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
  category = signal<Category>(Category.ACTIVE);
  filtertedList = computed(() =>
    this.list()
      .filter((item) => item.category === this.category())
      .sort(this.sortFn),
  );
  dialog = inject(MatDialog);

  onCategoryChange(category: Category) {
    this.category.set(category);
  }

  onCheckboxClicked(list: List): void {
    this.list.update((item) => {
      return item.map((entry) => {
        if (entry.id === list.id) {
          entry.isChecked = list.isChecked;
          entry.category = list.isChecked ? Category.COMPLETED : Category.ACTIVE;
          if (list.isChecked) {
            entry.completedDate = new Date().toISOString();
          } else {
            entry.completedDate = undefined;
          }
        }
        return entry;
      });
    });
  }

  onCheckBoxDeleted(list: List): void {
    this.list.update((item) => item.filter((entry) => entry.id !== list.id));
  }

  onContentEdited(list: List): void {
    this.list.update((item) => item.map((entry) => (entry.id === list.id ? list : entry)));
  }

  openDialog(): void {
    const maxId = this.list().reduce((acc, curr) => {
      if (curr.id > acc) {
        acc = curr.id;
      }
      return acc;
    }, 0);
    const dialogRef = this.dialog.open(AddDialog, {
      width: '500px',
      height: '350px',
      data: { mode: 'create', id: maxId + 1 },
    });

    dialogRef.afterClosed().subscribe((data: List) => {
      if (data) {
        this.list.update((list) => [...list, data]);
      }
    });
  }

  private addDaysToToday(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString();
  }

  private sortFn = (a: List, b: List): number => {
    if (a.isChecked !== b.isChecked) {
      return a.isChecked ? -1 : 1;
    }

    if (this.category() === Category.ACTIVE) {
      const dateA = a.endDate ? new Date(a.endDate).getTime() : 0;
      const dateB = b.endDate ? new Date(b.endDate).getTime() : 0;
      return dateA - dateB;
    } else if (this.category() === Category.COMPLETED) {
      const dateA = a.completedDate ? new Date(a.completedDate).getTime() : 0;
      const dateB = b.completedDate ? new Date(b.completedDate).getTime() : 0;
      return dateA - dateB;
    }
    return 0;
  };
}
