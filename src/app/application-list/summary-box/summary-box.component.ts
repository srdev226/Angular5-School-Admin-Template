
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SummaryData } from './summary-data';
 @Component({
  selector: 'app-summary-box',
   templateUrl: './summary-box.component.html',
   styleUrls: ['./summary-box.component.css']
 })
 export class SummaryBoxComponent implements OnInit {

 	 @Input() summaryData: SummaryData;
   @Output() onStatusClick : EventEmitter<string> = new EventEmitter<string>();

   constructor() { }

   ngOnInit() {
   }

   setApplicationStatus(event){
      this.onStatusClick.emit(this.summaryData.status);
    }

   ngDoCheck(){

     switch(this.summaryData.status){
       case "New" :
            this.summaryData.class = 'violet';
            this.summaryData.icon = 'fa-plus';
            break;
       case "Completed" :
            this.summaryData.class = 'blue';
            this.summaryData.icon = 'fa-database';
            break;
      case "Review" :
            this.summaryData.class = 'green';
            this.summaryData.icon = 'fa-check';
            break;
      case "Accepted" :
            this.summaryData.class = 'orange';
            this.summaryData.icon = 'fa-user';
            break;
      case "Rejected" :
            this.summaryData.class = 'red';
            this.summaryData.icon = 'fa-times';
            break;
      case "Enrolled" :
            this.summaryData.class = 'yellow';
            this.summaryData.icon = 'fa-child';
            break;
     }
   }
 }
