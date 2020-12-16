# Katalog otevřených dat

Projekt sdíleného katalogu otevřených dat pro české organizace, který zobrazuje data z vystaveného SPARQL endpointu dle [OFN Ministerstva vnitra](https://ofn.gov.cz/rozhran%C3%AD-katalog%C5%AF-otev%C5%99en%C3%BDch-dat/draft/).

Projekt je postaven na JavaScriptovém frameworku Angular 10. Pro instalaci stačí do HTML stránky vložit skript a konfigurační soubor.

## Použití

### Kód pro vložení do webu
```html
<opendata-catalog endpoint="https://data.gov.cz/sparql" publishers="https://data.gov.cz/zdroj/ovm/00006947"></opendata-catalog>

<script src="https://cdn.jsdelivr.net/npm/@otevrena-data-mfcr/opendata-catalog@1.1.0/package/catalog.min.js"></script>
```
### Nastavení

| Nastavení    | Povinný | Formát                                     | Výchozí   | Popis                                                                                                                                          |
|--------------|---------|--------------------------------------------|-----------|------------------------------------------------------------------------------------------------------------------------------------------------|
| endpoint     | Ano     | URL                                        |           | SPARQL endpoint ze kterého se načítají datové sady                                                                                             |
| publishers   | Ne      | URL&nbsp;oddělená&nbsp;čárkou              |           | Připoužití NKOD omezí výběr dat na datové sady těchto subjektů                                                                                 |
| ordering     | Ne      | "generic"&nbsp;&#124;&nbsp;"arq_collation" | "generic" | Funkce pro řazení datových sad. Funkce "arq_collation" umí řadit podle lokálních znaků, ale je dostupná pouze na SPARQL endpointech ApacheJena |
| hide-child   | Ne      | "true"&nbsp;&#124;&nbsp;"false"            | "false"   |                                                                                                                                                |
| cors-gateway | Ne      | URL                                        |           |                                                                                                                                                |
| theme-prefix | Ne      | IRI                                        |           | Omezí vypsaná témata pouze na ty, jejichž IRI začíná takto.                                                                                    |


### Ukázka

<p class="codepen" data-height="571" data-theme-id="light" data-default-tab="css,result" data-user="smallhillcz" data-slug-hash="RwGVVvM" style="height: 571px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="RwGVVvM">
  <span>See the Pen <a href="https://codepen.io/smallhillcz/pen/RwGVVvM">
  RwGVVvM</a> by Martin Kopeček (<a href="https://codepen.io/smallhillcz">@smallhillcz</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## Kde je implementováno

 - Ministerstvo financí (https://opendata.mfcr.cz/catalog)

## Vývoj


### Prerekvizity
  - Znalost TypeScript, HTML, SCSS
  - Znalost Angular 10 (pro drobné opravy netřeba)
  - Nainstalovaný NodeJS

### Spuštění

#### Instalace balíčků:
```sh
npm install
```

#### Spuštění vývojového serveru na http://localhost:4200
```sh
npm run dev
```
