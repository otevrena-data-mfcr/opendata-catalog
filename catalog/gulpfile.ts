
import { src, dest, series, parallel } from "gulp";
import * as concat from "gulp-concat";

import { rmdirSync, mkdirSync } from "fs";

export function clearPackageDir(cb) {
  rmdirSync("./package/", { recursive: true });
  mkdirSync("./package/");
  cb();
}

export function buildPackageES5() {
  return src("./dist/*-es5.js")
    .pipe(concat("catalog-es5.js"))
    .pipe(dest("./package/"))
}

export function buildPackageES2015() {
  return src("./dist/*-es2015.js")
    .pipe(concat("catalog.js"))
    .pipe(dest("./package/"));
}

export function copyAssets() {

  const assets = [
    "./dist/3rdpartylicenses.txt"
  ];

  return src(assets).pipe(dest("./package/"));
}

export const buildPackage = series(clearPackageDir, parallel(buildPackageES5, buildPackageES2015), copyAssets);
