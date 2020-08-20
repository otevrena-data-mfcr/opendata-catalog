Vue.component("dataset-count", {
  data: function () {
    return {
      count: 0,
      loading: 3
    }
  },
  template: '<span>{{ loading ? "&hellip;" : count }}</span>',
  mounted: function () {
    var comp = this;
    $.get("https://opendata.mfcr.cz/lod/katalog/").then(function (data) {
      comp.count += data.datová_sada.length;
      comp.loading--;
    });
    $.get("https://opendata.mfcr.cz/lod/monitor/").then(function (data) {
      comp.count += data.datová_sada.length;
      comp.loading--;
    });
    $.get("https://opendata.mfcr.cz/lod/cedr/").then(function (data) {
      comp.count += data.datová_sada.length;
      comp.loading--;
    });
  }
})