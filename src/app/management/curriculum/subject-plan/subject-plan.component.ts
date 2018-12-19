import { Component, OnInit, OnChanges, Input, Output, EventEmitter  } from '@angular/core';
import { Router } from '@angular/router';

import { subjectPlanData1, years, classes} from '../testData';

@Component({
    selector: 'app-subject-plan',
    templateUrl: './subject-plan.component.html',
    styleUrls: ['./subject-plan.component.css', '../curriculum.component.css']
})

export class SubjectPlanComponent implements OnChanges  {

    @Input()
    data: object;

    @Output()
    change: EventEmitter<number> = new EventEmitter<number>();

    public subjectPlanData1 = subjectPlanData1;
    public years = years;
    public classes = classes;
    public viewBtnStatus = true;
    public selectedAcademicYear: string;
    public selectedClass: string;
    public userType = 'admin';
    public editSessionPlan = false;
    public sessionData: any;
    public noOfSessions = 3;

    constructor(private router: Router) {
        const element  = document.querySelector('.profile-sidebar');
        if (element) {
            element['style']['display'] = 'none';
        }
    }

    ngOnChanges() {
        this.userType = this.data['type'];
    }

    selectAcademicYear(year: string): void {
        this.selectedAcademicYear = year;
        this.viewBtnStatus = false;
    }

    selectClass(classItem: string): void {
        this.selectedClass = classItem;
        this.viewBtnStatus = false;
    }

    redirectToCurriculum(): void {
        this.change.emit();
        const element  = document.querySelector('.profile-sidebar');
        if (element) {
            element['style']['display'] = 'block';
        }
    }

    showEditionOfSessionPlan(e: Event): void {
        this.sessionData = {
            noOfSessions: this.noOfSessions
        };
        this.editSessionPlan = !this.editSessionPlan;
    }

    disableEdition(event: Event): void {
        this.editSessionPlan = false;
    }

}
