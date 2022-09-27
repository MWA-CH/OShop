import { Product } from './../../models/product';
import { ProductService } from './../../product.service';
import { CategoryService } from './../../category.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { SnapshotAction } from '@angular/fire/compat/database';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  categories$: any;
  product: any = {
    title: '',
    price: '',
    category: '',
    imageUrl: ''
  };
  id: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private productService: ProductService) {

    this.categories$ = categoryService.getCategories();

    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id) this.productService.get(this.id).pipe(take(1)).subscribe((p: any) => {
      this.product = {
        title: p['payload'].val().title,
        price: p['payload'].val().price,
        category: p['payload'].val().category,
        imageUrl: p['payload'].val().imageUrl
      }
    });
  }

  save(product: any) {
    if (this.id) this.productService.update(this.id, product);
    else this.productService.create(product);

    this.router.navigate(['/admin/products']);
  }
  delete() {
    if (!confirm('Are you sure you want to delte this product?')) return;

    this.productService.delete(this.id);
    this.router.navigate(['/admin/products']);

  }
  ngOnInit(): void {
  }

}
