import { Product } from './../../models/product';
import { ProductService } from './../../product.service';
import { Component, Directive, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';

//start
export type SortColumn = keyof Product | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { 'asc': 'desc', 'desc': '', '': 'asc' };

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class NgbdSortableHeader {

  @Input() sortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.sortable, direction: this.direction });
  }
}

//end
@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  page = 1;
  pageSize = 10;
  filterdPageSize = 0;
  products: Product[] = [];
  //Prod: Product[] = [];
  filteredProducts: any = [];
  collectionSize = 0;
  subscription: Subscription;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  constructor(private productService: ProductService) {
    this.headers = new QueryList<NgbdSortableHeader>;

    this.subscription = this.productService.getAll()
      .subscribe((products: any) => {
        this.filteredProducts = this.products = products;
        this.collectionSize = this.filteredProducts.length;
        this.refreshProducts();
      });
  }

  // prepareForLoadingData() {
  //   this.products.forEach((products: any) => {
  //     this.Prod.push({
  //       id: products.key,
  //       title: products.payload.val().title,
  //       price: products.payload.val().price,
  //       category: products.payload.val().category,
  //       imageUrl: products.payload.val().imageUrl
  //     });
  //   });
  // }
  refreshProducts() {
    this.filteredProducts = this.products
      .map((product, i) => ({ key: i + 1, ...product }))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
  filter(query: string) {
    if (query) {
      this.filteredProducts = this.products.filter(
        p => p['payload'].val().title.toLowerCase().includes(query.toLowerCase()));

      //this.filterdPageSize = this.pageSize;
      //this.pageSize = this.filteredProducts.length;
      //this.collectionSize = this.filteredProducts.length;
    }
    else {
      this.filteredProducts = this.products;
      //this.pageSize = this.filterdPageSize;
      //this.collectionSize = this.filteredProducts.length;
      this.refreshProducts();
    }
  }
  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    // sorting products
    if (direction === '' || column === '') {
      this.filteredProducts = this.products;
      this.refreshProducts();
    } else {
      this.filteredProducts = [...this.filteredProducts].sort((a, b) => {
        const res = compare(a['payload'].val()[column], b['payload'].val()[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit(): void {
  }

}
