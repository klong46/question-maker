import { Component } from '@angular/core';
import { Question } from './question/question';
import { MatDialog } from '@angular/material/dialog';
import { QuestionDialogComponent, QuestionDialogResult } from './question-dialog/question-dialog.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  questionList = this.store.collection('questionList').valueChanges({ idField: 'id' }) as Observable<Question[]>;

  constructor(private dialog: MatDialog, private store: AngularFirestore) { }

  addQuestion() {
    const dialogRef = this.dialog.open(QuestionDialogComponent, {
      width: '270px',
      data: {
        question: {},
      }
    });
    dialogRef
      .afterClosed()
      .subscribe((result: QuestionDialogResult) => {
        if (!result) {
          return;
        }
        this.store.collection('questionList').add(result.question);
      });
  }

  editQuestion(question: Question) {
    const dialogRef = this.dialog.open(QuestionDialogComponent, {
      width: '270px',
      data: {
        question,
        enableDelete: true,
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      if (result.delete) {
        this.store.collection('questionList').doc(question.id).delete();
      } else {
        this.store.collection('questionList').doc(question.id).update(question);
      }
    });
  }
}
