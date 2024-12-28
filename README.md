# Katalog otevřených dat

Projekt sdíleného katalogu otevřených dat pro české organizace, který zobrazuje data z vystaveného SPARQL endpointu dle [OFN Ministerstva vnitra](https://ofn.gov.cz/rozhran%C3%AD-katalog%C5%AF-otev%C5%99en%C3%BDch-dat/draft/).

Pro instalaci stačí do HTML stránky vložit HTML tag a skript.

## Použití

#### Kód pro vložení do webu
 
Kód pro vložení do webu si vygenerujte na https://otevrena-data-mfcr.github.io/opendata-catalog/.
 
#### Stylování

Stylovat komponentu katalogu lze následujícími CSS proměnnými:

```css
opendata-catalog {
  --primary: #0087c8; /* barva pro primární tlačítka */
  --link-color: #0087c8; /* barva pro odkazy */
  --border-radius: 0; /* poloměr zaoblení rohů u tlačítek a dalších prvků */
  --bg-light: #eee; /* pozadí karet distribuce a datové sady a klíčových slov */
}
```

## Kde je implementováno

 - Ministerstvo financí (https://data.mf.gov.cz/catalog)

## Vývoj

#### Prerekvizity
  - Znalost TypeScript, HTML, SCSS
  - Znalost Angular 10 (pro drobné opravy netřeba)
  - Nainstalovaný NodeJS

#### Spuštění

Vývoj katalogu probíhá ve složce `catalog`

##### Instalace balíčků:
```sh
npm install
```

##### Spuštění vývojového serveru na http://localhost:4200
```sh
npm run dev
```
