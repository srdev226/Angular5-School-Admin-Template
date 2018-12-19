import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transport',
  templateUrl: './transport.component.html',
  styleUrls: ['./transport.component.css']
})
export class TransportComponent implements OnInit {

  constructor(private route: ActivatedRoute,private router: Router) { }

  student_key: string;

  ngOnInit() {

    // this.student_key = this.route.snapshot.params['student_key'];
    this.route.firstChild.params.subscribe(params => {
      this.student_key = params['student_key'];
      // this.router.navigate(['/transport/trips']);
    });
  }

  public getStdKey() {
    return this.student_key;
  }
}
