import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'sr-alert-event-modal',
  templateUrl: './alert-event-modal.component.html',
  styleUrls: ['./alert-event-modal.component.scss'],
})
export class AlertEventModalComponent implements OnInit {
  @Input() message: string;
  @Output() close = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit() {}
}
