import { Component, OnInit } from '@angular/core';
import { Question } from './question/question';
import { MatDialog } from '@angular/material/dialog';
import { QuestionDialogComponent, QuestionDialogResult } from './question-dialog/question-dialog.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

const DAILY_QUESTION_LIMIT = 10;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  selectedDate: Date = new Date();
  collectionDate: string = this.getCollectionDate();
  questionList = this.store.collection(this.getCollectionName()).valueChanges({ idField: 'id' }) as Observable<Question[]>;
  categoryInput: string = '';
  dayCategory: string = '';
  qListLength: number = 0;

  constructor(private dialog: MatDialog, private store: AngularFirestore) { 
  }

  ngOnInit(): void {
    this.setCategory();
    this.countQuestions();
  }

  getCollectionDate(): string{
    return this.selectedDate.getMonth()+'-'+this.selectedDate.getDate()+'-'+this.selectedDate.getFullYear();
  }

  getCollectionName(): string{
    return 'questionList - '+this.collectionDate;
  }

  dateChange() {
      this.collectionDate = this.getCollectionDate();
      this.questionList = this.store.collection(this.getCollectionName()).valueChanges({ idField: 'id' }) as Observable<Question[]>;
      this.setCategory();
  }

  setCategory(){
    let qListForCat = this.questionList.subscribe(questions => {
      this.categoryInput = (questions[0] && questions[0].category) ? questions[0].category : '';
      this.dayCategory = this.categoryInput;
      qListForCat.unsubscribe();
    });
  }

  countQuestions(){
    let qListForCount = this.questionList.subscribe(questions => {
      this.qListLength = questions.length;
      qListForCount.unsubscribe();
    })
  }

  addQuestion() {
    this.countQuestions();
    if(this.qListLength < DAILY_QUESTION_LIMIT){
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
          result.question.date = this.selectedDate;
          result.question.category = this.dayCategory;
          this.store.collection('questionList - '+this.collectionDate).add(result.question);
          this.qListLength++;
        });
    }
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
        this.store.collection(this.getCollectionName()).doc(question.id).delete();
        this.qListLength--;
      } else {
        this.store.collection(this.getCollectionName()).doc(question.id).update(question);
      }
    });
  }

  changeCategory(){
    this.dayCategory = this.categoryInput;
    let questionsObservable = this.questionList.subscribe(questions => {
      for(let i = 0; i < questions.length; i++){
        let newQuestion = questions[i];
        newQuestion.category = this.dayCategory;
        this.store.collection(this.getCollectionName()).doc(questions[i].id).update(newQuestion);
        questionsObservable.unsubscribe();
      }
    });
  }
}
