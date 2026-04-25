import { Component, inject, signal } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatNativeDateModule,
  NativeDateAdapter,
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
  MAT_NATIVE_DATE_FORMATS,
} from '@angular/material/core';
import { List } from '../../../models/list.interface';
import { Category } from '../../../models/category.type';
import { form, FormField, required } from '@angular/forms/signals';
import { notInPast } from '../../validators/date-not-in-past.validators';

interface FormModel {
  content: string;
  endDate: Date | null;
}

@Component({
  selector: 'app-add-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormField,
  ],
  providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
  ],
  templateUrl: './add-dialog.html',
  styleUrl: './add-dialog.css',
})
export class AddDialog {
  // ===== SERVICES =====
  dialogRef = inject(MatDialogRef<AddDialog>);

  // ===== PROPERTIES =====
  data = inject(MAT_DIALOG_DATA);
  isEditMode = this.data.mode === 'edit';
  // minDate = new Date();

  // ===== FORM MODEL =====
  entryModel = signal<FormModel>({
    content: this.isEditMode ? this.data.item.content : '',
    endDate: this.isEditMode ? new Date(this.data.item.endDate) : new Date(),
  });

  entryForm = form(this.entryModel, (schemaPath) => {
    required(schemaPath.content);
    required(schemaPath.endDate);
    notInPast(schemaPath.endDate);
  });

  // ===== ACTIONS =====
  onSave(): void {
    if (this.entryForm().valid()) {
      const endDate = this.entryForm().value().endDate;
      const content = this.entryForm().value().content;
      if (endDate && content) {
        const formData: List = {
          content,
          id: this.isEditMode ? this.data.item.id : this.data.id,
          isChecked: false,
          endDate: endDate.toISOString(),
          category: Category.ACTIVE,
        };
        this.dialogRef.close(formData);
      }
    }
  }
}
