import {bodyArt} from './body-art.js?v=20261020.v2';
import {CHARACTERS,characterImage} from './characters.js?v=20261020.v2';
import {shapeSVG} from './game.js?v=20261020.v2';
const ink='#685239';
let paintedId=0;
const details={
 chair:'<path d="M40 34h34M40 42h34M34 78h45" stroke="#fff3d2" stroke-width="2" opacity=".65"/>',
 table:'<path d="M22 50h76M40 55h38" stroke="#fff4d1" stroke-width="2" opacity=".75"/>',
 schoolbag:'<path d="M34 41v16M43 75h23" stroke="#fff1d0" stroke-width="3" opacity=".65"/>',
 cup:'<path d="M34 45v31" stroke="#fff" stroke-width="4" opacity=".6"/>',
 bowl:'<path d="M27 67q4 13 13 18" stroke="#fff9e4" stroke-width="3" opacity=".65" fill="none"/>',
};
const drawings={
 chair:'<path d="M34 25h46v48H34z" fill="#c6b478"/><path d="M26 72h65v16H26z" fill="#9c8b56"/><path d="M34 88v24m48-24v24"/>',
 table:'<path d="M15 45h90v18H15z" fill="#e8b573"/><path d="M26 64v45m68-45v45"/><path d="M26 79h68"/>',
 schoolbag:'<path d="M43 26q17-23 34 0" fill="none"/><rect x="27" y="24" width="66" height="84" rx="18" fill="#e8a28c"/><rect x="38" y="65" width="44" height="30" rx="8" fill="#f6d384"/><path d="M38 49h44m-31-8v12m18-12v12"/>',
 cup:'<path d="M83 42h11q22 0 12 25-5 10-23 5" fill="none"/><path d="M26 33h59v58q-30 22-59 0z" fill="#9fcee2"/><path d="M25 33q30-12 61 0" fill="#ddf0f5"/>',
 bowl:'<ellipse cx="60" cy="49" rx="45" ry="14" fill="#f6e4ba"/><path d="M15 49q6 51 45 51t45-51q-45 25-90 0Z" fill="#a2cdb3"/>',
 'play area':'<path d="M22 102V32h25v70m-25-55h25m-25 18h25m-25 18h25M44 32h20l40 70H84L47 47" fill="#efa478"/><circle cx="91" cy="22" r="13" fill="#f6d775"/>',
 classroom:'<rect x="10" y="13" width="100" height="55" rx="5" fill="#83b7a1"/><path d="M22 27h42m-42 13h30" stroke="#fff"/><path d="M16 86h39v10H16Zm51 0h39v10H67Z" fill="#deb380"/><path d="M22 97v15m26-15v15m25-15v15m26-15v15"/>',
 kitchen:'<rect x="16" y="48" width="88" height="61" rx="7" fill="#eac29a"/><rect x="28" y="69" width="42" height="29" rx="3" fill="#8d82a8"/><path d="M16 59h88m-24 8v33"/><path d="M35 33h38v15H35z" fill="#adcddc"/><path d="M39 23q-8-8 0-15m15 15q-8-8 0-15m15 15q-8-8 0-15" fill="none"/>',
 bathroom:'<path d="M26 39h66v17q-33 24-66 0Z" fill="#d1e8ec"/><path d="M55 63v40h18V63M61 39V24q0-16 17-10v13" fill="#fff"/><rect x="23" y="7" width="25" height="24" rx="6" fill="#b3dce7"/><path d="M15 108h90"/>'
};
export function illustration(word,{silhouette=false}={}){
 const body=bodyArt(word);if(body)return body;
 if(CHARACTERS[word])return characterImage(word);
 if(['circle','square','triangle','star'].includes(word))return shapeSVG(word);
 if(!drawings[word])throw Error('Missing illustration: '+word);
 const id='painted-'+(++paintedId);
 return `<svg class="lesson-art ${silhouette?'silhouette':''}" viewBox="0 0 120 120" role="img" aria-label="${word}"><defs><filter id="${id}" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="2" result="grain"/><feColorMatrix in="grain" type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".09"/></feComponentTransfer><feComposite in2="SourceGraphic" operator="in"/><feBlend in="SourceGraphic" mode="multiply"/></filter></defs><g filter="url(#${id})" stroke="${ink}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">${drawings[word]}${details[word]||''}</g></svg>`;
}
