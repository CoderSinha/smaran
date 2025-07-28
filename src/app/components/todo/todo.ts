import { Component, inject, input, output } from '@angular/core';
import { MatCheckboxModule, MatCheckboxChange } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import type { List } from '../../../models/list.interface';
import { MatDialog } from '@angular/material/dialog';
import { AddDialog } from '../add-dialog/add-dialog';

@Component({
  selector: 'app-todo',
  imports: [MatCheckboxModule, MatIconModule, DatePipe],
  templateUrl: './todo.html',
  styleUrl: './todo.css',
})
export class Todo {
  item = input.required<List>();
  onClicked = output<List>();
  onDeleted = output<List>();
  onEdited = output<List>();

  dialog = inject(MatDialog);

  onCheckboxClicked(event: MatCheckboxChange) {
    this.onClicked.emit({
      id: Number(event.source.id),
      isChecked: event.checked,
    });
  }

  onCheckBoxDeleted() {
    this.onDeleted.emit(this.item());
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddDialog, {
      width: '500px',
      height: '350px',
      data: { mode: 'edit', item: this.item() },
    });

    dialogRef.afterClosed().subscribe((data: List) => {
      if (data) {
        this.onEdited.emit(data);
      }
    });
  }
}
