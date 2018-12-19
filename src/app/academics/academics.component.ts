import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-academics',
  templateUrl: './academics.component.html',
  styleUrls: ['./academics.component.css']
})
export class AcademicsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  public onViewTimetable() {
  	console.log(111);
  }
}
