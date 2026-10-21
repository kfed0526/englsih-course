import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {policeVoiceTexts} from '../police-voice.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const audio=Object.fromEntries(policeVoiceTexts().map(text=>[text,'assets/audio/police/'+createHash('sha256').update(text).digest('hex').slice(0,16)+'.wav']));
fs.writeFileSync(path.join(root,'content/police-audio.json'),JSON.stringify({language:'zh-TW',source:'Microsoft Hanhan Desktop，Rate=-1；開發時產生的中文合成語音，非真人錄音。',audio},null,2)+'\n');
console.log(Object.keys(audio).length+' police clips mapped (no audio generated).');
