import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { orderData, testGraphData, statusLevelData, subjectPlanData, years, classes} from './testData';

@Component({
    selector: 'app-manage-curriculum',
    templateUrl: './curriculum.component.html',
    styleUrls: ['./curriculum.component.css']
})

export class CurriculumComponent implements OnInit {
    public orderData = orderData;
    public testGraphData = testGraphData;
    public statusLevelData = statusLevelData;
    public subjectPlanData: any[];
    public years = years;
    public classes = classes;
    public viewBtnStatus = true;
    public subjectPlan = false;
    public selectedAcademicYear: string;
    public selectedClass: string;
    public userType = 'admin';

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

    viewCurriculum(disabledStatus: boolean): void {
        this.viewBtnStatus = !disabledStatus;
        if (disabledStatus) {
            this.subjectPlanData = [];
        } else {
            this.subjectPlanData = subjectPlanData;
        }
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
