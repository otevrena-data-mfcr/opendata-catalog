import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type NavFilterOption = { label: string, count: string, value: string };

@Component({
  selector: 'app-nav-filter',
  templateUrl: './nav-filter.component.html',
  styleUrls: ['./nav-filter.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NavFilterComponent),
    multi: true
  }]
})
export class NavFilterComponent implements OnInit, ControlValueAccessor {

  maxLimit = Infinity;
  defaultLimit = 5;

  currentLimit: number = this.defaultLimit;

  @Input()
  options: NavFilterOption[] = [];

  selected: NavFilterOption["value"] | undefined;

  disabled: boolean = false;

  onChange = (value: any) => { };
  onTouched = () => { };

  constructor() { }

  writeValue(obj: NavFilterOption["value"]): void {
    this.selected = obj;
  }
  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnInit(): void {
  }

  select(option: NavFilterOption) {

    if (this.disabled) return;
    
    if (this.selected === option.value) this.selected = undefined;
    else this.selected = option.value;

    this.onChange(this.selected);
  }

  isSelected(option: NavFilterOption) {
    return this.selected === option.value;
  }

}
