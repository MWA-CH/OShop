import { ShoppingCart } from './../models/shopping-cart';
import { Observable } from 'rxjs/internal/Observable';
import { ShoppingCartService } from './../shopping-cart.service';
import { Product } from './../models/product';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from './../product.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: any = [];
  Prod: Product[] = [];
  filteredProducts: any[] = [];
  category: any;
  cart$!: Observable<ShoppingCart>;
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
        $key: p.key,
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
    this.cart$ = await this.shoppingCartService.getCart();
  }


}
