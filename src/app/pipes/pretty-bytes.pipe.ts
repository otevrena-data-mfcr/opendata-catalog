import { Pipe, PipeTransform } from '@angular/core';
import * as prettyBytes from 'pretty-bytes';

@Pipe({
  name: 'prettyBytes'
})
export class PrettyBytesPipe implements PipeTransform {

  transform(value: number): string {
    console.log(value)
    if(!value) return "N/A";
    return prettyBytes(value);
  }

}
