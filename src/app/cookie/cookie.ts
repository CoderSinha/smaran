import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cookie',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './cookie.html',
  styleUrl: './cookie.css',
})
export class Cookie {
  // ===== CONSTANTS =====
  private readonly COOKIE_CONSENT_KEY = 'smaran-cookie-consent';

  // ===== STATE =====
  showBanner = signal<boolean>(!this.hasUserConsented());

  // ===== ACTIONS =====
  acceptCookies(): void {
    this.setCookieConsent(true);
    this.showBanner.set(false);
  }

  declineCookies(): void {
    this.setCookieConsent(false);
    this.showBanner.set(false);
  }

  // ===== PRIVATE HELPERS =====
  private hasUserConsented(): boolean {
    try {
      return localStorage.getItem(this.COOKIE_CONSENT_KEY) !== null;
    } catch (error) {
      console.error('Error checking cookie consent:', error);
      return false;
    }
  }

  private setCookieConsent(accepted: boolean): void {
    try {
      localStorage.setItem(this.COOKIE_CONSENT_KEY, accepted.toString());
    } catch (error) {
      console.error('Error saving cookie consent:', error);
    }
  }
}
