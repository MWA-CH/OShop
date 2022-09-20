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
  products: Product[] = [];
  filteredProducts: any = [];
  subscription: Subscription;
  constructor(private productService: ProductService) {

    this.subscription = this.productService.getAll()
      .subscribe((products: any) => {
        this.filteredProducts = this.products = products;
        //this.prepareForSorting();
      });
  }

  // prepareForSorting() {
  //   this.products.forEach((product: any) => {
  //     this.sortableProducts.push({
  //       title: product.payload.val().title,
  //       price: product.payload.val().price
  //     });
  //   });
  // }
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
