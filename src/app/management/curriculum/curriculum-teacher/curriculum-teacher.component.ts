import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { Router } from '@angular/router';

import {subjectPlanData, years, classes, orderData, testGraphData, statusLevelData} from '../testData';

@Component({
    selector: 'app-curriculum-teacher',
    templateUrl: './curriculum-teacher.component.html',
    styleUrls: ['./curriculum-teacher.component.css', '../curriculum.component.css']
})

export class CurriculumTeacherComponent implements OnInit  {

    public subjectPlanData = subjectPlanData;
    public years = years;
    public classes = classes;
    public viewBtnStatus = true;
    public subjectPlan = false;
    public selectedAcademicYear: string;
    public selectedClass: string;
    public userType = 'teacher';

    data: object;
    constructor(private router: Router) {}

    ngOnInit() {
    }

    selectAcademicYear(year: string): void {
        this.selectedAcademicYear = year;
        this.viewBtnStatus = false;
    }

    selectClass(classItem: string): void {
        this.selectedClass = classItem;
        this.viewBtnStatus = false;
    }

    viewSubjectPlan(item: object): void {
        this.data = {
            type: this.userType,
            item: item
        };
        this.subjectPlan = !this.subjectPlan;
    }

    disableSubjectPlan(): void {
        this.subjectPlan = false;
    }
}
