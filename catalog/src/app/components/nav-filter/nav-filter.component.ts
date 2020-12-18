import { Component, OnInit, forwardRef, Input, EventEmitter, Output } from '@angular/core';

export type NavFilterOption = { label: string, count: string, value: string };

@Component({
  selector: 'app-nav-filter',
  templateUrl: './nav-filter.component.html',
  styleUrls: ['./nav-filter.component.scss'],
})
export class NavFilterComponent implements OnInit {

  maxLimit = Infinity;
  defaultLimit = 5;

  currentLimit: number = this.defaultLimit;

  @Input()
  options: NavFilterOption[] = [];

  @Input()
  selected: NavFilterOption["value"] | undefined;
  @Output()
  selectedChange = new EventEmitter<NavFilterOption["value"]>();

  @Input()
  disabled: boolean = false;


  constructor() { }

  ngOnInit(): void {
  }

  select(option: NavFilterOption) {

    if (this.disabled) return;

    if (this.selected === option.value) this.selected = undefined;
    else this.selected = option.value;

    this.selectedChange.emit(this.selected);
  }

  isSelected(option: NavFilterOption) {
    return this.selected === option.value;
  }

}
