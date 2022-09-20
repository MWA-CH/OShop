import { Product } from './../../models/product';
import { ProductService } from './../../product.service';
import { Component, Directive, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConditionalExpr } from '@angular/compiler';


@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  page = 1;
  pageSize = 0;
  products: Product[] = [];
  Prod: Product[] = [];
  filteredProducts: any = [];
  collectionSize = 0;
  subscription: Subscription;
  constructor(private productService: ProductService) {

    this.subscription = this.productService.getAll()
      .subscribe((products: any) => {
        this.filteredProducts = this.products = products;
        this.prepareForLoadingData();
        this.collectionSize = this.Prod.length;
        this.pageSize = this.Prod.length;
      });
    this.refreshProducts();
  }

  // prepareForSorting() {
  //   this.products.forEach((product: any) => {
  //     this.sortableProducts.push({
  //       title: product.payload.val().title,
  //       price: product.payload.val().price
  //     });
  //   });
  // }
  prepareForLoadingData() {
    this.products.forEach((products: any) => {
      this.Prod.push({
        id: products.key,
        title: products.payload.val().title,
        price: products.payload.val().price,
        category: products.payload.val().category,
        imageUrl: products.payload.val().imageUrl
      });
    });
  }
  refreshProducts() {
    this.filteredProducts = this.products
      .map((product, i) => ({ key: i + 1, ...product }))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
  filter(query: string) {
    this.filteredProducts = (query) ? this.products.filter(p => p['payload'].val().title.toLowerCase().includes(query.toLowerCase())) :
      this.products;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit(): void {
  }

}
