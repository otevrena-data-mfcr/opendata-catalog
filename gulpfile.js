
const { src, dest, series, parallel } = require("gulp");
const concat = require("gulp-concat");

const { rmdirSync, mkdirSync } = require("fs");

function clearPackageDir(cb) {
  rmdirSync("./package/", { recursive: true });
  mkdirSync("./package/");
  cb();
}

function buildPackage() {
  return src(["./catalog/dist/*.js"])
    .pipe(concat("catalog.js"))
    .pipe(dest("./package/"));
}

function copyAssets() {
  const assets = [
    "./catalog/dist/3rdpartylicenses.txt"
  ];
  return src(assets).pipe(dest("./package/"));
}

exports.buildPackage = series(clearPackageDir, buildPackage, copyAssets);
