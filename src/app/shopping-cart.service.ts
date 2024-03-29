import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs/internal/Observable';
import { ShoppingCart } from './models/shopping-cart';
import { Product } from './models/product';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private db: AngularFireDatabase) { }

  async getCart(): Promise<Observable<ShoppingCart>> {
    let cartId = await this.getOrCreateCartId();
    return this.db.object('/shopping-carts/' + cartId).valueChanges().pipe(map((x: any) => new ShoppingCart(x.items)));
  }

  async addToCart(product: Product) {
    this.updateItem(product, 1);
  }

  async removeFromCart(product: Product) {
    this.updateItem(product, -1);
  }

  async clearCart() {
    let cartId = await this.getOrCreateCartId();
    this.db.object('shopping-carts/' + cartId + '/items').remove();
  }

  private create() {
    return this.db.list('/shopping-carts').push({
      dateCreated: new Date().getTime()
    });
  }


  private getItem(cartId: string, productId: string) {
    return this.db.object('/shopping-carts/' + cartId + '/items/' + productId);
  }

  private async getOrCreateCartId(): Promise<string> {
    let cartId = localStorage.getItem('cartId');
    if (cartId) return cartId;

    let result: any = await this.create();
    localStorage.setItem('cartId', result.key);
    return result.key;
  }

  private async updateItem(product: Product, change: number) {
    let cartId = await this.getOrCreateCartId();
    let item$ = this.getItem(cartId, product.$key);

    item$.snapshotChanges().pipe(take(1)).subscribe((item: any) => {
      if (item['payload'].exists()) {
        let quantity = (item['payload'].val().quantity || 0) + change;
        if (quantity === 0) {
          item$.remove();
        }
        else {
          item$.update({
            title: product.title,
            imageUrl: product.imageUrl,
            price: product.price,
            category: product.category,
            quantity: quantity
          });
        }
      }
      else {
        item$.set({
          title: product.title,
          imageUrl: product.imageUrl,
          price: product.price,
          category: product.category,
          quantity: 1
        });
      }
    });
  }
}