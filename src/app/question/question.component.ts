import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Question } from './question';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent{
  @Input() question: Question;
  @Input() orderNum: number = 0;
  @Output() edit = new EventEmitter<Question>();
  date: string

  // ngOnInit(): void {
  //   let sec = JSON.parse(JSON.stringify(this.question.date)).seconds;  
  //   this.date = new Date(sec * 1000).toLocaleDateString();
  // }
  
}
