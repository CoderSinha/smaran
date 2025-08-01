import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from '../../service/theme.service';

@Component({
  selector: 'app-header',
  imports: [MatIconModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  // ===== PROPERTIES =====
  title = signal('Smaran').asReadonly();

  // ===== CONSTRUCTOR =====
  constructor(public themeService: ThemeService) {}

  // ===== EVENT HANDLERS =====
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
