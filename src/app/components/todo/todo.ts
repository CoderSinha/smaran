import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { MatCheckboxModule, MatCheckboxChange } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DatePipe } from '@angular/common';
import type { List } from '../../../models/list.interface';
import { MatDialog } from '@angular/material/dialog';
import { AddDialog } from '../add-dialog/add-dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  convertISOToddMMyyyy,
  convertddMMyyyyToISO,
  formatDateInput,
  isFutureOrToday,
} from '../../../utils';
import { futureDateValidator } from '../../../validators/form.validator';
import { DIALOG_CONFIG } from '../../../config/dialog.config';

@Component({
  selector: 'app-todo',
  imports: [MatCheckboxModule, MatIconModule, MatInputModule, DatePipe, ReactiveFormsModule],
  templateUrl: './todo.html',
  styleUrl: './todo.css',
})
export class Todo implements OnInit {
  // ===== PROPERTIES =====
  item = input.required<List>();
  onClicked = output<List>();
  onDeleted = output<List>();
  onEdited = output<List>();

  // ===== STATE =====
  isInEditMode = signal<boolean>(false);
  form!: FormGroup;

  // ===== SERVICES =====
  private dialog = inject(MatDialog);
  private formBuilder = inject(FormBuilder);

  // ===== LIFECYCLE =====
  ngOnInit(): void {
    this.initializeForm();
  }

  // ===== FORM MANAGEMENT =====
  private initializeForm(): void {
    this.form = this.formBuilder.group({
      content: [this.item().content, Validators.required],
      endDate: [
        convertISOToddMMyyyy(this.item().endDate || ''),
        [Validators.required, Validators.maxLength(10), futureDateValidator],
      ],
    });
  }

  startInlineEditing(): void {
    // Don't allow editing of completed items
    if (this.item().category === 'completed') {
      return;
    }
    this.isInEditMode.set(true);
  }

  saveEdit(): void {
    if (!this.form.valid || !this.form.value.content?.trim()) {
      this.cancelEdit();
      return;
    }

    const newContent = this.form.value.content.trim();
    const newDateString = this.form.value.endDate;
    const newDateISO = convertddMMyyyyToISO(newDateString);
    const originalItem = this.item();

    const hasContentChanged = newContent !== originalItem.content;
    const hasDateChanged = newDateISO !== originalItem.endDate;

    if (hasContentChanged || hasDateChanged) {
      const updatedItem: List = {
        ...originalItem,
        content: newContent,
        endDate: newDateISO,
      };
      this.onEdited.emit(updatedItem);
    }

    this.cancelEdit();
  }

  cancelEdit(): void {
    this.isInEditMode.set(false);
    this.form.patchValue({
      content: this.item().content,
      endDate: convertISOToddMMyyyy(this.item().endDate || ''),
    });
  }

  // ===== EVENT HANDLERS =====
  onDateInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.form.patchValue({ endDate: input.value });
  }

  onDateBlur(): void {
    const currentValue = this.form.get('endDate')?.value || '';
    const formattedValue = formatDateInput(currentValue);
    this.form.patchValue({ endDate: formattedValue });
    this.saveEdit();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.saveEdit();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.cancelEdit();
    }
  }

  onCheckboxClicked(event: MatCheckboxChange): void {
    this.onClicked.emit({
      id: Number(event.source.id),
      isChecked: event.checked,
    });
  }

  // ===== UTILITY METHODS =====
  isOverdue(): boolean {
    const endDateString = this.item().endDate;
    if (this.item().category !== 'active' || !endDateString) {
      return false;
    }

    return !isFutureOrToday(endDateString);
  }

  // ===== ACTIONS =====
  onCheckBoxDeleted(): void {
    this.onDeleted.emit(this.item());
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddDialog, {
      ...DIALOG_CONFIG.ADD_DIALOG,
      data: { mode: 'edit', item: this.item() },
    });

    dialogRef.afterClosed().subscribe((data: List) => {
      if (data) {
        this.onEdited.emit(data);
      }
    });
  }
}
