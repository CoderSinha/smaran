import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
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
  private formBuilder = inject(FormBuilder);

  // ===== PROPERTIES =====
  data = inject(MAT_DIALOG_DATA);
  isEditMode = this.data.mode === 'edit';
  minDate = new Date(); // Set minimum date to today (no past dates allowed)

  // ===== STATE =====
  form = this.formBuilder.group({
    content: [this.initialData('content'), Validators.required],
    endDate: [this.initialData('endDate'), Validators.required],
  });

  // ===== ACTIONS =====
  onSave(): void {
    if (this.form.valid) {
      // Convert to machine-workable ISO format
      const endDate = this.form.value.endDate;
      const content = this.form.value.content;
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
    } else {
      console.log('Form is invalid');
    }
  }

  // ===== PRIVATE HELPERS =====
  private initialData(propertyName: string) {
    if (propertyName === 'content') {
      return this.isEditMode ? this.data.item.content : '';
    }

    if (propertyName === 'endDate') {
      return this.isEditMode ? new Date(this.data.item.endDate) : (null as Date | null);
    }
  }
}
