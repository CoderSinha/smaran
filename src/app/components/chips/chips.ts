import { Component, input, output, signal } from '@angular/core';
import { MatChipsModule, MatChipSelectionChange } from '@angular/material/chips';
import { Category, type CategoryForChips } from '../../../models/models';

@Component({
  selector: 'app-chips',
  imports: [MatChipsModule],
  templateUrl: './chips.html',
  styleUrl: './chips.css',
})
export class Chips {
  selectedCategory = input<Category>(Category.ACTIVE);
  chipSelectionChange = output<Category>();
  categories = signal<CategoryForChips[]>([
    { value: Category.ACTIVE, label: 'Active' },
    { value: Category.COMPLETED, label: 'Completed' },
  ]).asReadonly();

  onSelectionChange(event: MatChipSelectionChange) {
    this.chipSelectionChange.emit(event.source.value as Category);
  }
}
