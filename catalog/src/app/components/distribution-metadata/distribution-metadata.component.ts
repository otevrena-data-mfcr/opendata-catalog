import { Component, Input, OnInit } from '@angular/core';
import { Distribution, DistributionService } from 'app/schema';

@Component({
  selector: 'app-distribution-metadata',
  templateUrl: './distribution-metadata.component.html',
  styleUrls: ['./distribution-metadata.component.scss']
})
export class DistributionMetadataComponent implements OnInit {

  @Input()
  distribution?: Distribution;

  @Input()
  distributionService?: DistributionService;

  constructor() { }

  ngOnInit(): void {
  }

}
