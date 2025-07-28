import type { Category } from './category.type';

export interface List {
  id: number;
  content?: string;
  category?: Category;
  isChecked: boolean;
  endDate?: string;
  completedDate?: string;
}
