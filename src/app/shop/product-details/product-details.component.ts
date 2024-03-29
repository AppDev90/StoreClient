import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BasketService } from 'src/app/basket/basket.service';
import { IProduct } from 'src/app/shared/models/product';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  product: IProduct;
  quantity = 1;

  constructor(private shopService: ShopService, private activateRout: ActivatedRoute,
    private bcService: BreadcrumbService, private basketService: BasketService) {
    this.emptyTitleOfSectionHeaderBeforeLoding();
  }

  emptyTitleOfSectionHeaderBeforeLoding() {
    this.setTitleOfSectionHeader(' ');
  }

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct() {
    this.shopService.getProduct(+this.activateRout.snapshot.paramMap.get('id')).subscribe(product => {
      this.product = product;
      this.setTitleOfSectionHeader(product.name);
    }, error => {
      console.error(error);
    });
  }

  setTitleOfSectionHeader(title: string) {
    this.bcService.set('@productDetails', title);
  }

  addItemToBasket() {
    this.basketService.addItemToBasket(this.product, this.quantity);
  }

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }


}
