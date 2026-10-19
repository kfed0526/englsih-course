// Short life-game prompts, not an additional textbook vocabulary list.
export const HOSPITAL_CUES={
 lobby:'選牙齒，或選耳朵。一起去看看！',ticket:'先拿一張號碼牌。',
 dentalNumber:'你的號碼是十二。找找一樣的號碼。',entNumber:'你的號碼是二十一。找找一樣的號碼。',
 called:'號碼一樣！按綠色箭頭，進診間。',feeling:'現在心情怎麼樣？點笑臉，或點小熊。',
 ready:'準備好了！按綠色箭頭，看工具。',nervous:'緊張也沒關係。我們慢慢來。按箭頭，看工具。',
 mirror:'找找小鏡子。醫生用它看看牙齒。',light:'找找檢查燈，幫醫生照亮。',
 tool:'找到了！按綠色箭頭，一起玩。',brush:'點點牙齒上的小斑點，也可以滑動刷。',
 brushed:'刷好了！按綠色箭頭，謝謝醫生。',doctor:'找到了！按小燈，請醫生看看。',
 checked:'都找到了！按綠色箭頭，謝謝醫生。',
 dentalDone:'謝謝醫生！真的刷牙，記得請大人幫忙。',entDone:'看診小冒險完成！謝謝醫生。',
 retry:'再試一次，慢慢來。',missing:'請大人幫忙，重新打開遊戲。'
};
export function hospitalCue(state){
 const visit=state.current,c=HOSPITAL_CUES;if(state.paused)return '';if(!visit)return c.lobby;
 if(visit.step===0)return visit.called?c.called:visit.ticket?c[state.room==='dental'?'dentalNumber':'entNumber']:c.ticket;
 if(visit.step===1)return visit.feeling?c[visit.feeling]:c.feeling;
 if(visit.step===2)return visit.tool?c.tool:c[state.room==='dental'?'mirror':'light'];
 if(visit.step===3){
  if(state.room==='dental')return visit.practiceDone?c.brushed:c.brush;
  if(visit.practiceDone)return c.checked;if(state.parts.length!==3||!state.target)return c.missing;
  if(visit.exam==='checking')return '';if(visit.exam==='ready')return c.doctor;
  return `點點${state.target.zh}。`;
 }
 return c[state.room==='dental'?'dentalDone':'entDone'];
}
export function hospitalVoiceTexts(parts){return [...new Set([...Object.values(HOSPITAL_CUES),...parts.map(part=>`點點${part.zh}。`)])];}
