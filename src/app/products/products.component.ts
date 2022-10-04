import { Subscription } from 'rxjs';
import { ShoppingCartService } from './../shopping-cart.service';
import { Product } from './../models/product';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from './../product.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: any = [];
  Prod: Product[] = [];
  filteredProducts: any[] = [];
  category: any;
  cart: any;
  subscription: Subscription = new Subscription;
  constructor(
    private route: ActivatedRoute,
    productService: ProductService,
    private shoppingCartService: ShoppingCartService) {

    productService.getAll().subscribe((products: any) => {
      this.processProductsData(products);
      this.filterProducts();
    });

  }

  processProductsData(products: any): void {
    products.forEach((p: any) => {
      this.products.push({
        id: p.key,
        title: p['payload'].val().title,
        price: p['payload'].val().price,
        category: p['payload'].val().category,
        imageUrl: p['payload'].val().imageUrl
      });
    });
  }

  filterProducts() {
    this.route.queryParamMap.subscribe(params => {
      this.category = params.get('category');
      this.filteredProducts = (this.category) ?
        this.products.filter((p: any) => p.category.toLowerCase() === this.category.toLowerCase()) :
        this.products;
    });
  }

  async ngOnInit() {
    this.subscription = (await this.shoppingCartService.getCart()).subscribe((cart: any) => this.cart = cart);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
