import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';


@Pipe({
  name: 'customDate'
})
export class CustomDatePipe implements PipeTransform {

  transform(input_date: string, input_date_format: string, output_date_format: string): any {
    let input_moment = moment(input_date, input_date_format, true);
    return input_moment.format(output_date_format);
  }

}
