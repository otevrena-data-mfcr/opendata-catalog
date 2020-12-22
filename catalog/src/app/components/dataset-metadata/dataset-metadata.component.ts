import { Component, Input, OnInit } from '@angular/core';
import { Dataset } from 'app/schema';

@Component({
  selector: 'app-dataset-metadata',
  templateUrl: './dataset-metadata.component.html',
  styleUrls: ['./dataset-metadata.component.scss']
})
export class DatasetMetadataComponent implements OnInit {

  @Input()
  dataset!: Dataset;

  private re_duration = /^P(\d+)([DMY])$/;
  private durationNames: any = {
    "D": "den",
    "M": "měsíc",
    "Y": "rok"
  }

  private re_mail = /[a-zA-Z0-9_\-\.]+@[a-zA-Z0-9_\-\.]*[a-zA-Z0-9]/;

  constructor() { }

  ngOnInit(): void {
  }

  parseDuration(duration?: string) {
    if (!duration) return undefined;
    const match = this.re_duration.exec(duration);
    if (match) return `${match[1]} ${this.durationNames[match[2]]} (${duration})`;
    return duration;
  }

  parseContact(contact?: string) {
    return contact?.replace(this.re_mail, "<a href=\"$&\">$&</a>");
  }

}
