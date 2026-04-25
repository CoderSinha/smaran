import { validate, SchemaPathTree } from '@angular/forms/signals';

export function notInPast(path: SchemaPathTree<Date | string | null>) {
  validate(path, (ctx) => {
    const value = ctx.value();

    if (!value) return null;

    const selected = new Date(value);
    const today = new Date();

    selected.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (selected >= today) return null;

    return {
      kind: 'not_in_past',
      message: 'Date must be today or in the future',
    };
  });
}
