import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-pagination',
    standalone: true,
    imports: [CommonModule],
    template: `
    <nav aria-label="Page navigation" *ngIf="totalPages > 1">
      <ul class="pagination justify-content-center">
        <li class="page-item" [class.disabled]="currentPage === 1">
          <button class="page-link" (click)="onPageChange(currentPage - 1)">Précédent</button>
        </li>
        
        <li class="page-item disabled">
          <span class="page-link">Page {{ currentPage }}</span>
        </li>
        
        <li class="page-item" [class.disabled]="currentPage === totalPages">
          <button class="page-link" (click)="onPageChange(currentPage + 1)">Suivant</button>
        </li>
      </ul>
    </nav>
  `
})
export class PaginationComponent {
    @Input() currentPage = 1;
    @Input() totalPages = 1;
    @Output() pageChange = new EventEmitter<number>();

    onPageChange(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.pageChange.emit(page);
        }
    }
}
