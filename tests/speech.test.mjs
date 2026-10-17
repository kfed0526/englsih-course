import test from 'node:test';
import assert from 'node:assert/strict';
import {LessonSpeech,SPEECH_LEVELS,speechLevel,chooseVoice} from '../speech.js';
const voices=[{name:'Microsoft Zira Desktop',lang:'en-US',voiceURI:'zira'},{name:'Microsoft Jenny Online (Natural)',lang:'en-US',voiceURI:'jenny'},{name:'Google 國語（臺灣）',lang:'zh-TW',voiceURI:'tw'},{name:'Google Cantonese',lang:'zh-HK',voiceURI:'hk'}];
function environment({voiceList=voices,failTTS=false,endTTS=true,failAudio=false}={}){
 const utterances=[],clips=[];
 class Utterance{constructor(text){this.text=text;}}
 class Audio{play(){clips.push(this);queueMicrotask(()=>failAudio?this.onerror?.():this.onended?.());return Promise.resolve();}pause(){this.paused=true;}}
 const synth={getVoices:()=>voiceList,cancel(){},resume(){},speak(u){utterances.push(u);if(endTTS)queueMicrotask(()=>failTTS?u.onerror?.():u.onend?.());}};
 return {player:new LessonSpeech({synth,Utterance,Audio}),utterances,clips};
}
test('natural-label voices and Mandarin are preferred; explicit choice and recorded mode respected',()=>{
 assert.equal(chooseVoice(voices,'en-US').voiceURI,'jenny');assert.equal(chooseVoice(voices,'zh-TW').voiceURI,'tw');assert.equal(chooseVoice(voices,'en-US','zira').voiceURI,'zira');assert.equal(chooseVoice(voices,'en-US','recorded'),null);assert.equal(chooseVoice([voices[3]],'zh-TW'),null);
});
test('all five levels affect device speech and preserve-pitch backup recordings',async()=>{
 for(const speed of SPEECH_LEVELS){const e=environment();assert.equal(await e.player.play('Circle.',{level:speed.level,clip:'circle.wav'}),true);assert.equal(e.utterances[0].rate,speed.tts);assert.equal(e.clips.length,0);
 const fallback=environment({voiceList:[]});assert.equal(await fallback.player.play('Circle.',{level:speed.level,clip:'circle.wav'}),true);assert.equal(fallback.clips[0].playbackRate,speed.audio);assert.equal(fallback.clips[0].preservesPitch,true);}
 assert.equal(speechLevel(0),3);assert.equal(speechLevel(6),3);assert.equal(speechLevel('2'),2);assert.equal(speechLevel('bad'),3);
});
test('failed natural speech falls back to recording at the selected speed',async()=>{
 const e=environment({failTTS:true});assert.equal(await e.player.play('再試一次',{lang:'zh-TW',clip:'retry.wav',level:2}),true);assert.equal(e.utterances[0].voice.voiceURI,'tw');assert.equal(e.clips[0].playbackRate,0.875);
 const recorded=environment();await recorded.player.play('Circle.',{clip:'circle.wav',selection:'recorded'});assert.equal(recorded.utterances.length,0);assert.equal(recorded.clips.length,1);
});
test('cancelled speech settles and late errors cannot start backup or overlap the next utterance',async()=>{
 const e=environment({endTTS:false});const pending=e.player.play('Circle.',{clip:'circle.wav'});const lateError=e.utterances[0].onerror;e.player.cancel();assert.equal(await pending,false);lateError();await Promise.resolve();assert.equal(e.clips.length,0);
});
test('missing or failed speech and recording report failure without hanging',async()=>{
 const e=environment({voiceList:[],failAudio:true});assert.equal(await e.player.play('Circle.',{clip:'circle.wav'}),false);assert.equal(await e.player.play('Unknown.',{}),false);
});
