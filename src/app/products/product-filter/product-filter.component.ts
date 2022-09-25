import { CategoryService } from './../../category.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css']
})
export class ProductFilterComponent implements OnInit {
  categories$: any;
  @Input('category') category: any;
  constructor(categoryService: CategoryService) {
    this.categories$ = categoryService.getCategoriesWithKey();
  }

  ngOnInit(): void {
  }

}
