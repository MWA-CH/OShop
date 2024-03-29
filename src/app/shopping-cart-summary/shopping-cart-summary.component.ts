import { ShoppingCart } from './../models/shopping-cart';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'shopping-cart-summary',
  templateUrl: './shopping-cart-summary.component.html',
  styleUrls: ['./shopping-cart-summary.component.css']
})
export class ShoppingCartSummaryComponent implements OnInit {
  @Input('cart') cart!: ShoppingCart;
  constructor() { }

  ngOnInit(): void {
  }

}
