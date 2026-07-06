import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  output,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { StoreService } from "@app/services/store.service";

@Component({
  selector: "app-filters",
  imports: [],
  template: `
    @if (categories()) {
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 py-3">
          <h3
            class="font-semibold text-gray-900 dark:text-gray-100 text-sm uppercase tracking-wide"
          >
            CATEGORIES
          </h3>
        </div>
        <div class="divide-y divide-gray-100 dark:divide-gray-700">
          @for (category of categories(); track category) {
            <button
              (click)="onShowCategory(category)"
              class="w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-150 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              {{ category }}
            </button>
          }
        </div>
      </div>
    }
  `,
  providers: [StoreService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersComponent {
  private readonly storeService = inject(StoreService);

  readonly showCategory = output<string>();

  private readonly categoriesFromApi = toSignal(this.storeService.categories$, {
    initialValue: [],
  });

  readonly categories = computed(() => {
    const categories = this.categoriesFromApi();
    return categories.length ? ["all", ...categories] : [];
  });

  onShowCategory(category: string): void {
    this.showCategory.emit(category);
  }
}
