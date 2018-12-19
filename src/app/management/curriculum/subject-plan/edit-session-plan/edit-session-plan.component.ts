import { Component, OnInit, OnChanges, Input, Output, EventEmitter  } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-edit-session-plan',
    templateUrl: './edit-session-plan.component.html',
    styleUrls: ['./edit-session-plan.component.css', '../../curriculum.component.css']
})

export class EditSessionPlanComponent implements OnChanges  {

    @Input()
    data: object;

    @Output()
    change: EventEmitter<number> = new EventEmitter<number>();

    public noOfSessions: Array<number> = [];

    constructor(private router: Router) {}

    ngOnChanges(): void {
        if (this.data) {
            for (let i = 0; i < this.data['noOfSessions']; i++) {
                this.noOfSessions.push(i + 1);
            }
        }
    }

    savePlan(e: Event): void {

    }

    clearAll(e: Event): void {}

    redirectToCurriculum(): void {
        this.change.emit();
    }
}
