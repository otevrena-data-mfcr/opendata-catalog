var editor;

var data = {
  "nkod-mf": {
    html: `
      <opendata-catalog
        endpoint="https://data.gov.cz/sparql"
        publishers="https://data.gov.cz/zdroj/ovm/00006947"
      ></opendata-catalog>`,
    css: `
        html,
        body {
          font-family: "Inter var", Verdana, sans-serif;
          font-size: 11pt;
        }`
  },
  "mf": {
    html: `
      <opendata-catalog
        endpoint="https://opendata.mfcr.cz/lod/sparql"
        ordering="arq_collation"
        corsGateway="https://opendata.mfcr.cz/gateway/"
        hideChild="false"
        themesPrefix="https://opendata.mfcr.cz/topics/"
      ></opendata-catalog>`,
    css: `
        html,
        body {
          font-family: "Inter var", Verdana, sans-serif;
          font-size: 11pt;
        }

        opendata-catalog {
          --link-color: #09f;
          --button-border-radius: 1px;
          --button-primary-color: #fff;
          --button-primary-background: #09f;
        }`
  }

};

function renderHTML(src) {
  return `
  <html>
    <head>
      <style>
      ${src.css}

      </style>
    </head>
    <body>
      ${src.html}
  
      <script src="https://cdn.jsdelivr.net/npm/@otevrena-data-mfcr/opendata-catalog@latest/package/catalog.min.js"><${""}/script>
  
    </body>
  </html>
  `;
}

window.addEventListener('DOMContentLoaded', (event) => {

  ace.config.set('basePath', 'https://pagecdn.io/lib/ace/1.4.12/');

  editor = ace.edit("editor");
  editor.setTheme("ace/theme/xcode");
  editor.session.setMode("ace/mode/html");

  renderForm();
  // renderCatalog();
});

function renderCatalog() {
  var container = document.getElementById("catalog-container");
  container.innerHTML = "";

  var html = editor.getValue();

  var iframe = document.createElement("iframe");
  container.appendChild(iframe);
  iframe.contentWindow.document.open();
  iframe.contentWindow.document.write(html);
  iframe.contentWindow.document.close();

}

function renderForm() {

  var id = document.getElementById("code-selector").value;
  console.log(id)

  editor.setValue(this.renderHTML(data[id]));
  editor.clearSelection();
  editor.setShowPrintMargin(false);

  renderCatalog();
}