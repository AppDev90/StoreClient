import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-error-test',
  templateUrl: './error-test.component.html',
  styleUrls: ['./error-test.component.scss']
})
export class ErrorTestComponent implements OnInit {

  basUrl: string = environment.apiUrl + "ErrorGenerator/";
  validationErrors: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  getInternalServer_Eception_500() {
    this.http.get(this.basUrl + "Server").subscribe(response => {
      console.log(response);
    }), error => {
      console.log(error);
    };
  }

  getUnknown_BadRequest_400() {
    this.http.get(this.basUrl + "UnKnown").subscribe(response => {
      console.log(response);
    }, error => {
      console.log(error);
    });
  }

  getValidation_400() {
    this.http.get(this.basUrl + "Validation").subscribe(response => {
      console.log(response);
    }, error => {
      console.log(error);
      this.validationErrors = error.errors;
    });
  }

  getAuhtorization_401() {
    this.http.get(this.basUrl + "Authorization").subscribe(response => {
      console.log(response);
    }, error => {
      console.log(error);
    });
  }

  getNotFound_404() {
    this.http.get(this.basUrl + "NotFound").subscribe(response => {
      console.log(response);
    }, error => {
      console.log(error);
    });
  }

}
