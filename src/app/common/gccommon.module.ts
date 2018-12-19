import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ImageComponent } from './image/image.component';
import { ImageService } from './image/image.service';
import { CustomDatePipe } from './custom-date.pipe';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    SimpleNotificationsModule.forRoot(),
  ],
  exports: [
    ImageComponent,
    CustomDatePipe
  ],
  declarations: [ImageComponent, CustomDatePipe],
  providers: [ImageService]
})

export class GCCommonModule { }
