import { HttpClient } from "angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class OpenDataService {

  constructor(
    private http: HttpClient
  ) { }

  async loadData() {
    const data = await this.http.get("%%%URL%%%", { json: true });
  }
}