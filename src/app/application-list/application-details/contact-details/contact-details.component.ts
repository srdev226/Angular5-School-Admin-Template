import { Component, Input, OnInit } from '@angular/core';
import {Person, PersonInfo} from '../../../person/person';
import { ProductDataService } from '../../../product/product-data.service';

@Component({
     selector: 'app-contact-details',
     templateUrl: './contact-details.component.html',
     styleUrls: ['./contact-details.component.css']
})

export class ContactDetailsComponent implements OnInit {

    constructor(private productDataService: ProductDataService) { }

    ngOnInit() {
    }

    @Input() person_info : PersonInfo;

    getProfesssion(code: string){
      let profession = this.productDataService.masterProduct.demographic_configuration.professions.
        find(x => x.code === code);
      return (profession ? profession.name : "NA");
    }

    getEducation(code: string){
      let education = this.productDataService.masterProduct.demographic_configuration.educationLevels.find(x => x.code === code);
      return (education ? education.desc : "NA");
    }

}
