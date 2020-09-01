import { Pipe, PipeTransform } from '@angular/core';
import * as prettyBytes from 'pretty-bytes';

@Pipe({
  name: 'prettyBytes'
})
export class PrettyBytesPipe implements PipeTransform {

  transform(value: number, locale: boolean | string = "cs"): string {
    if (!value) return "N/A";
    return prettyBytes(value, { locale });
  }

}
