import { Injectable } from '@angular/core';
import { Product } from './product';

@Injectable()
export class ProductDataService {

  product: Product;
  masterProduct: Product;

  constructor() { }

  public setProduct(prod: Product){
    this.product = prod;
  }

  public getProduct(){
    return this.product;
  }

  public setMasterProduct(prod: Product){
    this.masterProduct = prod;
  }

  public getMasterProduct(){
    return this.masterProduct;
  }

}
