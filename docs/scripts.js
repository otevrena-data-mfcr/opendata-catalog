var editor;

function renderSnippet(data) {

  var o = "<opendata-catalog\n";
  if (data.endpoint) o += "  endpoint=\"" + data.endpoint + "\"\n";
  if (data.publishers) o += "  publishers=\"" + data.publishers + "\"\n";
  if (data.ordering) o += "  ordering=\"" + data.ordering + "\"\n";
  if (data.corsGateway) o += "  cors-gateway=\"" + data.corsGateway + "\"\n";
  if (data.hideChild) o += "  hide-child=\"" + data.hideChild + "\"\n";
  if (data.themesPrefix) o += "  themes-prefix=\"" + data.themesPrefix + "\"\n";
  o += "></opendata-catalog>\n";
  o += "<script src=\"https://cdn.jsdelivr.net/npm/@otevrena-data-mfcr/opendata-catalog@" + (data.version || "latest") + "/package/catalog.js\"><" + "/script>";

  return o;
}

window.addEventListener('DOMContentLoaded', function (event) {

  ace.config.set('basePath', 'https://pagecdn.io/lib/ace/1.4.12/');

  editor = ace.edit("editor");
  editor.setTheme("ace/theme/xcode");
  editor.session.setMode("ace/mode/html");

  renderIframe();
});

function renderIframe() {

  var container = document.getElementById("catalog-container");
  container.innerHTML = "";

  var snippet = editor.getValue();
  var style = "html,body{font-family: sans-serif;font-size: 11pt;}";

  var iframeHtml = "<!DOCTYPE html><html><head><style>" + style + "</style></head><body>" + snippet + "</body></html>";

  var iframe = document.createElement("iframe");
  container.appendChild(iframe);
  iframe.contentWindow.document.open();
  iframe.contentWindow.document.write(iframeHtml);
  iframe.contentWindow.document.close();

}

function renderCode() {

  var data = Object.fromEntries(new FormData(document.getElementById("data-form")).entries());

  if (data.endpoint === "https://data.gov.cz/sparql" && !data.publishers) {
    alert("Při použití NKOD jako SPARQL endpointu prosím specifikujte publikující subjekty.")
    return;
  }

  editor.setValue(renderSnippet(data));
  editor.clearSelection();
  editor.setShowPrintMargin(false);

  renderIframe();
}