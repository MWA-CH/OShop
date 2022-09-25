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
  products: Product[] = [];
  Prod: Product[] = [];
  filteredProducts: any[] = [];
  category: any;
  constructor(
    route: ActivatedRoute,
    productService: ProductService) {
    productService.getAll().subscribe((products: any) => {
      this.products = products;

      route.queryParamMap.subscribe(params => {
        this.category = params.get('category');

        this.filteredProducts = (this.category) ?
          this.products.filter(p => p['payload'].val().category.toLowerCase() === this.category.toLowerCase()) :
          this.products;
      });
    });

  }

  ngOnInit(): void {
  }
}
