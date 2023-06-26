export class Question{
    id?: string
    date: string;
    category: string;
    text: string;
    answer: string;
    order_num?: number;
    difficulty?: number;
    points?: number;
    note?: string;
    constructor(category: string, text: string, answer: string){
        this.category = category;
        this.text = text;
        this.answer = answer;
        this.date = new Date().toLocaleDateString();
    }
}