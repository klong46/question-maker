import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Question } from './question';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent {
  @Input() question: Question | undefined = undefined;
  @Input() orderNum: number = 0;
  @Output() edit = new EventEmitter<Question>();

  
}
