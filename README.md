# Katalog otevřených dat

Projekt sdíleného katalogu otevřených dat pro české organizace, který zobrazuje data z vystaveného SPARQL endpointu dle [OFN Ministerstva vnitra](https://ofn.gov.cz/rozhran%C3%AD-katalog%C5%AF-otev%C5%99en%C3%BDch-dat/draft/).

Projekt je postaven na JavaScriptovém frameworku Angular 10. Pro instalaci stačí do HTML stránky vložit skript a konfigurační soubor.

## Instalace

 1) Do stránky vašeho webu vložit před uzavírací tag `</body>` následující skript:
```html
<script src="https://cdn.jsdelivr.net/npm/@otevrena-data-mfcr/opendata-catalog@1.0.0/package/catalog.min.js"></script>
```


 2) Do stránky vašeho webu, na místo, kde se má vykreslit katalog, vložit následující HTML tag:
```html
<opendata-catalog></opendata-catalog>
```


 3) Do stejného adresáře, jako je stránka vložit konfigurační soubor `config.yml`, který bude obsahovat nastavení:
```yml
# SPARQL endpoint to load data from
endpoint: https://data.gov.cz/sparql # NKOD 

# Filter publishers shown in this catalog
# comment out following list to show all publishers
# don't comment out for NKOD catalog, bad things will happen
publishers: 
  - https://data.gov.cz/zdroj/ovm/00006947 # Ministry of Finance

# Ordering method used for sorting datasets
ordering: "generic"
# ordering: "arq_collation" # use function http://jena.apache.org/ARQ/function#collation for ordering taking into account locale. works only with Jena Fuseki SPARQL endpoint

# CORS gateway for accessing dataset files' last modified date and previews in case the files are not served with CORS
# corsGateway: "https://example.com/gateway?url="
# corsGateway: "https://example.com/gateway/"

# If set to true, child datasets (datasets with dct:isPartOf) will be hidden from the dataset list
# Not supported by current NKOD
hideChild: false
```

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
