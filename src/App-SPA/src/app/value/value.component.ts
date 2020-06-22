import { Component, OnInit } from '@angular/core';
import { ValuesClient } from '../_api/api-client';

@Component({
  selector: 'app-value',
  templateUrl: './value.component.html',
  styleUrls: ['./value.component.scss']
})
export class ValueComponent implements OnInit {
  values: any;

  constructor(private valuesClient: ValuesClient) { }

  ngOnInit() {
    this.getValues();
  }

  getValues() {
    this.valuesClient.getValues().subscribe(response => {
      this.values = response;
    }, error => {
      console.log(error);
    });
  }
}
