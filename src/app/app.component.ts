import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IPagination } from './shared/models/pagination';
import { IProduct } from './shared/models/Product';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'Store';
  products: IProduct[];
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get("https://localhost:5001/api/product?pageSize=50").subscribe(
      (response: IPagination) => {
        console.log(response);
        this.products = response.data;
      }, error => {
        console.log(error);
      }
    );
  }

}
