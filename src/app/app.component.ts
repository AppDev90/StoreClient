import { Component, OnInit } from '@angular/core';
import { AccountService } from './account/account.service';
import { BasketService } from './basket/basket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'Store';

  constructor(private basketService: BasketService, private accountService: AccountService) { }

  ngOnInit(): void {
    this.basketService.loadBasketIfExist("App");
    this.accountService.loadCurrentUserIfExist("App");
  }

}
