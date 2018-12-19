import { Component, OnInit, EventEmitter, Output, Input  } from '@angular/core';
import { SchoolDataService } from '../../../management/school/school-data.service';
import { School } from '../../../management/school/school';
import { FeeReport, StudentMonthlyStatus, MonthlyStatusList } from '../fee-report';
import { StudentService } from '../../../student/student.service';
import * as moment from 'moment';

class MonthlyStatusCount{
  month: string;
  paid: number;
  unpaid: number;
}

@Component({
  selector: 'app-fee-register',
  templateUrl: './fee-register.component.html',
  styleUrls: ['./fee-register.component.css']
})
export class FeeRegisterComponent implements OnInit {

  todays_date: String;
  school:School;
  monthslist: any[];
  monthly_status_count: MonthlyStatusCount[];

  @Input()
  fee_registers: FeeReport[];

  constructor(private schoolDataService: SchoolDataService,
              private studentService: StudentService) {
   }

  ngOnInit() {
    let student =[]
    this.todays_date = moment().format('Do MMM YYYY');
    this.school = this.schoolDataService.getSchool();

  }

  public getStudentMonthlyStatus(fee_registers: FeeReport[]){
    let student_fee_status = [];
    this.initializeMonthlyStatusCounter()
    for(let fee_register of fee_registers){
      for(let student of fee_register.monthly_payment_status_report.student_monthly_status_list){
        if(student.monthly_status_list && student.monthly_status_list.length > 0){
          student_fee_status.push(student)
          for(let monthlist of student.monthly_status_list){
            let currnt_month= this.monthly_status_count.find(x=> x.month === monthlist.month)
            if(monthlist.status === 'PAID'){
              currnt_month.paid = currnt_month.paid + 1
            }else if(monthlist.status !== null){
              currnt_month.unpaid = currnt_month.unpaid + 1
            }
          }
        }
      }
    }
    return student_fee_status;
  }

  initializeMonthlyStatusCounter(){
    this.monthly_status_count  = [];
    let currnt_month: MonthlyStatusCount;
    for(let month of this.fee_registers[0].monthly_payment_status_report.student_monthly_status_list[0].monthly_status_list){
      currnt_month = new MonthlyStatusCount();
      currnt_month.month = month.month;
      currnt_month.paid = 0;
      currnt_month.unpaid = 0;
      this.monthly_status_count.push(currnt_month);
    }
  }

  public getPaidCount(fee_registers: FeeReport[]){
    let count = 0;
    for(let fee_register of fee_registers){
      for(let student of fee_register.monthly_payment_status_report.student_monthly_status_list){
        for(let student_status of student.monthly_status_list){
        }
      }
    }
  }

  public downloadCsv(csv, student) {
    var csvFile;
    var downloadLink;
    csvFile = new Blob([csv], {type: "text/csv"});
    downloadLink = document.createElement("a");
    downloadLink.download = student;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  public export_table_to_csv(student) {
    var csv = [];
    var rows = document.querySelectorAll("table tr");
    for (var i = 0; i < rows.length; i++) {
      var row = [], cols = rows[i].querySelectorAll("td, th");
      for (var j = 0; j < cols.length; j++)
      row.push(cols[j].textContent);
      csv.push(row.join(","));
    }
    this.downloadCsv(csv.join("\n"), student);
  }

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('register_print').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
      <head>
      <title>Print tab</title>
      <style>
      table {
        font-family: arial, sans-serif;
        border-collapse: collapse;
        width: 100%;
        font-size: 70%;
      }
      td, th{
        border: 1px solid #424242;
        text-align: left;
      }
      .value{
        border-top: 2px solid black;
      }
      .padding{
        padding: 5px;
      }
      </style>
      </head>
      <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }


}
