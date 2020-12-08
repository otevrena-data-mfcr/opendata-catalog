import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from './services/config.service';

@Component({
  selector: 'opendata-catalog',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class AppComponent implements OnInit {
  title = 'opendata-catalog';

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.router.initialNavigation();
  }
}
