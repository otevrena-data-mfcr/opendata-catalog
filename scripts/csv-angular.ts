import { HttpClient } from "angular/common/http";

{% if include.tsInterface %}{{ include.tsInterface }}{% endif %}
@Injectable({
  providedIn: 'root',
})
export class OpenDataService {

  constructor(
    private http: HttpClient
  ) { }

  async loadData() {
    const data = await this.http.get{% if include.tsInterfaceName %}<{{include.tsInterfaceName}}>{% endif %}("{{site.exports_url}}{{include.data_url}}", { json: true });
  }
}