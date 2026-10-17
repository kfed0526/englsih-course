// Expand every teaching template from the same textbook data.
export function fillLesson(template,word){
 return String(template??'').replace(/\{(\w+)\}/g,(_,key)=>key==='word'?word.id:String(word[key]??''));
}
export function questionFor(unit,word){return fillLesson(unit.question,word);}
export function answersFor(unit,word){return [unit.answer,unit.negativeAnswer].filter(Boolean).map(template=>fillLesson(template,word));}
