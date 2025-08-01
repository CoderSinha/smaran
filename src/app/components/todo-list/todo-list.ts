import { Component, computed, inject, signal } from '@angular/core';
import { List, Category } from '../../../models/models';
import { Chips } from '../chips/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AddDialog } from '../add-dialog/add-dialog';
import { ListData } from '../../service/list-data';
import { Todo } from '../todo/todo';
import { DIALOG_CONFIG } from '../../../config/dialog.config';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css',
  imports: [Chips, MatButtonModule, MatIconModule, Todo],
})
export class TodoList {
  // ===== SERVICES =====
  private listDataService = inject(ListData);
  private dialog = inject(MatDialog);

  // ===== STATE =====
  category = signal<Category>(Category.ACTIVE);
  list = this.listDataService.getList();
  filtertedList = computed(() =>
    this.list()
      .filter((item) => item.category === this.category())
      .sort(this.sortFn),
  );

  // ===== EVENT HANDLERS =====
  onCategoryChange(category: Category): void {
    this.category.set(category);
  }

  onCheckboxClicked(list: List): void {
    this.listDataService.updateList((item) => {
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
    this.listDataService.updateList((item) => item.filter((entry) => entry.id !== list.id));
  }

  onContentEdited(list: List): void {
    this.listDataService.updateList((item) =>
      item.map((entry) => (entry.id === list.id ? list : entry)),
    );
  }

  // ===== ACTIONS =====
  openDialog(): void {
    const maxId = this.listDataService.getMaxId();
    const dialogRef = this.dialog.open(AddDialog, {
      ...DIALOG_CONFIG.ADD_DIALOG,
      data: { mode: 'create', id: maxId + 1 },
    });

    dialogRef.afterClosed().subscribe((data: List) => {
      if (data) {
        this.listDataService.addItem(data);
      }
    });
  }

  // ===== PRIVATE HELPERS =====
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
