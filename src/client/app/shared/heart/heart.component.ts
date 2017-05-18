import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit
}                         from '@angular/core';
import { EmitEvent }      from './emitEvent';

@Component({
  moduleId: module.id,
  selector: 'ak-heart',
  templateUrl: 'heart.component.html',
  styleUrls: ['heart.component.css'],
})

export class HeartComponent implements OnInit {
  @Input()
  elementId: number;

  @Input()
  favourite: boolean;

  isAnimating: boolean = false;
  emitEvent: EmitEvent;

  @Output()
  change: EventEmitter<EmitEvent> = new EventEmitter<EmitEvent>();

  ngOnInit(): void {
    this.emitEvent = new EmitEvent(this.elementId);
    this.isAnimating = this.favourite;
  }

  updateHeart() {
    this.isAnimating = !this.isAnimating;
    this.favourite = this.isAnimating;
    this.emitEvent.isLiked = this.isAnimating;
    this.change.emit(this.emitEvent);
  }
}
