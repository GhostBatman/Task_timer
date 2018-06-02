import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'dateCheck'
})

export class DateCheckPipe implements PipeTransform {

    transform(value: string): any {
        let today = moment().format('ddd DD MMM');
        if ( today === value) {
            value = 'Today'
        }
        return value;
    }
}