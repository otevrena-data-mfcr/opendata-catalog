import { Component } from '@angular/core';
import { ConfigService } from './services/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'opendata-catalog';

  constructor(
    configService: ConfigService
  ) {
    console.log(configService.config)
  }
}
