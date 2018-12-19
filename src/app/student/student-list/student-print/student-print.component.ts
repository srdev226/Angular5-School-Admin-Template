import { Component, OnInit, Inject, Output, Input, EventEmitter } from '@angular/core';
import { StudentInfo } from '../../student-info/student-info'
import { PersonService } from '../../../person/person.service';
import { ProductDataService } from '../../../product/product-data.service';
import { School } from '../../../management/school/school';
import { SchoolDataService } from '../../../management/school/school-data.service';

@Component({
  selector: 'app-student-print',
  templateUrl: './student-print.component.html',
  styleUrls: ['./student-print.component.css']
})

export class StudentPrintComponent implements OnInit {

  school:School;
  isgender: boolean = false;
  isclass: boolean = false;
  isfather: boolean = false;
  ismother: boolean = false;
  isnum: boolean = false;
  iscaste: boolean = false;
  isaddress: boolean = false;
  isempty: boolean = false;
  isdob: boolean = false;

  @Input()
  students: StudentInfo[];

  @Output()
  onPrint = new EventEmitter<boolean>();

  constructor(
    private schoolDataService: SchoolDataService,
    private productDataService: ProductDataService,
    private personService: PersonService) {
  }

  ngOnInit() {
    this.school = this.schoolDataService.getSchool();
    for(let student of this.students){
      this.personService.getPerson(student.student.person_key).then(person_response => {
        student.person = person_response;
      });
      if(student.student.mother_person_key){
        this.personService.getPerson(student.student.mother_person_key).then(person_response => {
          student.mother = person_response;
        });
      }
      if(student.student.father_person_key){
        this.personService.getPerson(student.student.father_person_key).then(person_response => {
          student.father = person_response;
        });
      }
    }
  }

  getCasteName(code: string){
    let caste = this.productDataService.masterProduct.demographic_configuration.castes.find(x => x.code === code);
    if(caste){
      return caste.name;
    }
  }

  isGender(e) {
    if (e.target.checked) {
       this.isgender= true;
    } else {
       this.isgender= false;
    }
  }
  isDob(e) {
    if (e.target.checked) {
       this.isdob= true;
    } else {
       this.isdob= false;
    }
  }
  isCaste(e) {
    if (e.target.checked) {
       this.iscaste= true;
    } else {
       this.iscaste= false;
    }
  }
  isNumb(e) {
    if (e.target.checked) {
       this.isnum= true;
    } else {
       this.isnum= false;
    }
  }
  isMother(e) {
    if (e.target.checked) {
       this.ismother= true;
    } else {
       this.ismother= false;
    }
  }
  isFather(e) {
    if (e.target.checked) {
       this.isfather= true;
    } else {
       this.isfather= false;
    }
  }
  isAddress(e) {
    if (e.target.checked) {
       this.isaddress= true;
    } else {
       this.isaddress= false;
    }
  }
  isEmpty(e) {
    if (e.target.checked) {
       this.isempty= true;
    } else {
       this.isempty= false;
    }
  }

  back() {
    this.onPrint.emit(false);
  }

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('print_div').innerHTML;
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
          }
          td, th{
              border: 1px solid #424242;
              text-align: left;
              padding: 8px;
          }
          .value{
             border-top: 2px solid black;
          }
          .table{
            width:100%;
            font-size:12px;
          }
          .css-serial {
           counter-reset: serial-number;
          }
          .css-serial td:first-child:before {
           counter-increment: serial-number;
           content: counter(serial-number);
          }
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
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

}
