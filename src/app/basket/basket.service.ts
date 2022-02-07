import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Basket, IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl = environment.apiUrl;
  private basketSource = new BehaviorSubject<IBasket>(null);
  basket$ = this.basketSource.asObservable();
  private basketTotalSource = new BehaviorSubject<IBasketTotals>(null);
  basketTotal$ = this.basketTotalSource.asObservable();
  shipping = 0;

  constructor(private http: HttpClient) {

  }

  getBasket(id: string) {
    return this.http.get(this.baseUrl + 'basket?id=' + id)
      .pipe(
        map((basket: IBasket) => {
          this.setClientBasket(basket)
          this.calculateTotals();
        })
      );
  }

  createBasket(basket: IBasket) {
    return this.http.post(this.baseUrl + 'basket/Create', basket).subscribe((response: IBasket) => {
      this.setClientBasket(response)
      this.setBasketIdInLocalStorage(response.id);
      this.calculateTotals();
    }, error => {
      console.log(error);
    });
  }

  updateBasket(basket: IBasket) {
    return this.http.post(this.baseUrl + 'basket/Update', basket).subscribe((response: IBasket) => {
      this.setClientBasket(response);
      this.calculateTotals();
    }, error => {
      console.log(error);
    });
  }

  deleteBasket(basket: IBasket) {
    return this.http.delete(this.baseUrl + 'basket?id=' + basket.id).subscribe(() => {
      this.setClientBasket(null);
      //this.basketTotalSource.next(null);
      this.removeBasketIdFromLocalStorage();
    }, error => {
      console.log(error);
    });
  }

  deleteLocalBasket(id: string) {
    this.setClientBasket(null);
    this.setTotals(null);
    localStorage.removeItem('basket_id');
  }

  addItemToBasket(item: IProduct, quantity = 1) {

    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(item, quantity);
    let basket = this.getClientBasket();

    if (!this.isBasketExist()) {
      basket = this.createEmptyClientBasket();
    }
    basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);

    !this.isBasketExist() ?
      this.createBasket(basket) : this.updateBasket(basket);
  }

  loadBasketIfExist(component: string) {
    if (this.isBasketExist()) {
      this.getBasket(this.getBasketIdFromLocalStorage())
        .subscribe(() => {
          console.log("Basket initiated from: " + component);
        }, error => {
          console.log(error);
        });
    }
  }

  incrementItemQuantity(item: IBasketItem) {
    const basket = this.getClientBasket();
    const foundItemIndex = basket.items.findIndex(x => x.id === item.id);
    basket.items[foundItemIndex].quantity++;
    this.updateBasket(basket);
  }


  decrementItemQuantity(item: IBasketItem) {
    const basket = this.getClientBasket();
    const foundItemIndex = basket.items.findIndex(x => x.id === item.id);
    if (basket.items[foundItemIndex].quantity > 1) {
      basket.items[foundItemIndex].quantity--;
      this.updateBasket(basket);
    } else {
      this.removeItemFromBasket(item);
    }
  }

  removeItemFromBasket(item: IBasketItem) {
    const basket = this.getClientBasket();
    if (basket.items.some(x => x.id === item.id)) {
      basket.items = basket.items.filter(i => i.id !== item.id);
      if (basket.items.length > 0) {
        this.updateBasket(basket);
      } else {
        this.deleteBasket(basket);
      }
    }
  }

  getBasketObservable() {
    return this.basket$;
  }

  private calculateTotals() {
    const basket = this.getClientBasket();
    const shipping = this.shipping;
    const subtotal = basket.items.reduce((a, b) => (b.price * b.quantity) + a, 0);
    const total = subtotal + shipping;
    this.setTotals({ shipping, total, subtotal });
  }

  private isBasketExist() {
    if (this.getBasketIdFromLocalStorage())
      return true;
    return false;
  }

  private getBasketIdFromLocalStorage() {
    return localStorage.getItem('basket_id');
  }

  private addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number): IBasketItem[] {
    const index = items.findIndex(i => i.id === itemToAdd.id);
    if (index === -1) {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    } else {
      items[index].quantity += quantity;
    }
    return items;
  }

  private mapProductItemToBasketItem(item: IProduct, quantity: number): IBasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity,
      brand: item.productBrand,
      type: item.productType
    };
  }

  private createEmptyClientBasket(): IBasket {
    const basket = new Basket();
    return basket;
  }

  private setBasketIdInLocalStorage(basket_id: string) {
    localStorage.setItem('basket_id', basket_id);
  }

  private removeBasketIdFromLocalStorage() {
    localStorage.removeItem('basket_id');
  }

  private getClientBasket() {
    return this.basketSource.value;
  }

  private setClientBasket(basket: IBasket) {
    this.basketSource.next(basket);
  }

  private setTotals(basketTotals: IBasketTotals) {
    this.basketTotalSource.next(basketTotals);
  }

}
