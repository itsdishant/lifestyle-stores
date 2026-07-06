import { CurrencyPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatIcon } from "@angular/material/icon";
import { MatMenu, MatMenuTrigger } from "@angular/material/menu";

import { RouterLink } from "@angular/router";
import { CartService } from "@app/services/cart.service";
import { ThemeService } from "@app/services/theme.service";

@Component({
  selector: "app-header",
  imports: [MatIcon, CurrencyPipe, RouterLink, MatMenuTrigger, MatMenu],
  template: `
    <header
      class="bg-gradient-to-tr from-blue-100 to-teal-100 dark:from-gray-800 dark:to-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300"
    >
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="flex justify-between items-center py-3 sm:py-4">
          <a
            routerLink="home"
            class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
          >
            {{ "LifeStyle Stores" }}
          </a>

          <div class="flex items-center gap-2 sm:gap-4">
            <!-- ponytail: minimal icon button, matches cart style, no complex wrappers -->
            <button
              (click)="themeService.toggleTheme()"
              class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 focus:outline-none"
              [attr.aria-label]="themeService.isDarkMode() ? 'Switch to light mode' : 'Switch to dark mode'"
            >
              <mat-icon class="text-2xl sm:text-3xl text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                {{ themeService.isDarkMode() ? 'light_mode' : 'dark_mode' }}
              </mat-icon>
            </button>

            <button
              [matMenuTriggerFor]="menu"
              class="relative p-2 rounded-[50%]"
              aria-label="Shopping cart"
            >
              <mat-icon
                class="text-2xl sm:text-3xl text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                >shopping_cart</mat-icon
              >
              @if (cartItemCount() > 0) {
                <span
                  class="absolute -top-1 -right-1 bg-red-700 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md"
                >
                  {{ cartItemCount() }}
                </span>
              }
            </button>
          </div>

          <mat-menu #menu="matMenu">
            <div class="p-3 divide-y divide-solid dark:divide-gray-700">
              <div class="pb-3 mr-16 text-sm dark:text-gray-300">{{ cartItemCount() }} items</div>
              @if (!isEmpty()) {
                @for (item of cartItems(); track item.id) {
                  <div class="py-3">
                    <div class="flex font-light mb-2 justify-between text-sm dark:text-gray-200">
                      {{ item.name }} x {{ item.quantity }}
                      <span class="font-bold text-red-500">{{ item.price | currency }}</span>
                    </div>
                  </div>
                }
                <div class="py-3 font-light flex justify-between text-sm dark:text-gray-200">
                  Total
                  <span class="font-bold text-blue-600 dark:text-blue-400">{{ cartTotal() | currency }}</span>
                </div>
              }
              <div class="pt-3 flex justify-between gap-3">
                <button
                  (click)="onClearCart()"
                  class="bg-rose-600 hover:bg-rose-700 text-white rounded-full w-24 h-10 items-center transition-colors"
                >
                  {{ "Clear Cart" }}
                </button>
                <button
                  routerLink="/cart"
                  class="bg-green-600 hover:bg-green-700 text-white rounded-full w-24 h-10 items-center transition-colors"
                >
                  {{ "View Cart" }}
                </button>
              </div>
            </div>
          </mat-menu>
        </div>
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly cartService = inject(CartService);
  readonly themeService = inject(ThemeService);

  readonly cartItems = toSignal(this.cartService.cartItems$, {
    initialValue: [],
  });
  readonly cartTotal = toSignal(this.cartService.cartTotal$, {
    initialValue: 0,
  });
  readonly cartItemCount = toSignal(this.cartService.cartItemCount$, {
    initialValue: 0,
  });
  readonly isEmpty = toSignal(this.cartService.isEmpty$, {
    initialValue: true,
  });

  onClearCart(): void {
    this.cartService.clearCart();
  }
}
