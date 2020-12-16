import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  errors: string[] = [];

  constructor() { }

  showError(err: any) {

    if (typeof err === "string") return this.errors.push(err);

    if (typeof err == "object" && "message" in err) return this.errors.push(err.message);

    this.errors.push("Unknown error, see console");
    console.error(err);

  }
}
