import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Question } from '../question/question';

@Component({
  selector: 'app-question-dialog',
  templateUrl: './question-dialog.component.html',
  styleUrls: ['./question-dialog.component.css']
})
export class QuestionDialogComponent {
  @Output() newQuestion = new EventEmitter<Question>();

  constructor(public dialogRef: MatDialogRef<QuestionDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: QuestionDialogData) {}

  cancel() {
    this.dialogRef.close();
  }
}

export interface QuestionDialogData {
  question: Partial<Question>;
  enableDelete: boolean;
}

export interface QuestionDialogResult {
  question: Question;
  delete?: boolean;
}