import { Component, OnInit, Input } from '@angular/core';
import { Distribution } from 'app/schema';
import { HttpClient } from '@angular/common/http';
import * as prettyBytes from "pretty-bytes";

@Component({
  selector: 'app-distribution-card',
  templateUrl: './distribution-card.component.html',
  styleUrls: ['./distribution-card.component.scss']
})
export class DistributionCardComponent implements OnInit {

  @Input()
  metadata?: Distribution;

  @Input()
  headers?: { lastModified: string, contentType: string, contentLength: string, acceptRanges: string };

  showInfo = false;

  constructor() { }

  ngOnInit(): void { }

}
