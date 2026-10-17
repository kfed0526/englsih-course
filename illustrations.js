import {shapeSVG} from './game.js';
const ink='#514363';
const drawings={
 chair:'<path d="M34 25h46v48H34z" fill="#d2bbef"/><path d="M26 72h65v16H26z" fill="#b293d4"/><path d="M34 88v24m48-24v24"/>',
 table:'<path d="M15 45h90v18H15z" fill="#e8b573"/><path d="M26 64v45m68-45v45"/><path d="M26 79h68"/>',
 schoolbag:'<path d="M43 26q17-23 34 0" fill="none"/><rect x="27" y="24" width="66" height="84" rx="18" fill="#e8a28c"/><rect x="38" y="65" width="44" height="30" rx="8" fill="#f6d384"/><path d="M38 49h44m-31-8v12m18-12v12"/>',
 cup:'<path d="M83 42h11q22 0 12 25-5 10-23 5" fill="none"/><path d="M26 33h59v58q-30 22-59 0z" fill="#9fcee2"/><path d="M25 33q30-12 61 0" fill="#ddf0f5"/>',
 bowl:'<ellipse cx="60" cy="49" rx="45" ry="14" fill="#f6e4ba"/><path d="M15 49q6 51 45 51t45-51q-45 25-90 0Z" fill="#a2cdb3"/>',
 teacher:'<rect x="8" y="12" width="104" height="68" rx="5" fill="#77ad9c"/><path d="m25 50 13-18 13 18Zm40-16h24m-24 14h24" stroke="#fff" fill="none"/><path d="m51 85-15 24m34-24 15 24"/><circle cx="61" cy="72" r="15" fill="#f2c69e"/><path d="M42 111V92q20-17 39 0v19" fill="#d2b8e9"/>',
 friend:'<circle cx="40" cy="38" r="17" fill="#f0c19c"/><circle cx="82" cy="38" r="17" fill="#d89e74"/><path d="M21 84V65q19-17 38 0v19" fill="#edb471"/><path d="M64 84V65q19-17 38 0v19" fill="#a9c9e6"/><path d="m35 85-5 24m17-24 5 24m25-24-5 24m17-24 5 24M51 69l19-3"/><path d="M26 26q12-17 28 0m14 0q13-17 27 0" fill="#655066"/>',
 'bus driver':'<rect x="11" y="44" width="98" height="58" rx="10" fill="#f3cc72"/><rect x="24" y="51" width="34" height="25" rx="4" fill="#d8edf3"/><circle cx="32" cy="105" r="9" fill="#655066"/><circle cx="88" cy="105" r="9" fill="#655066"/><circle cx="82" cy="50" r="16" fill="#eac09c"/><path d="M63 36h39l-6-13H70z" fill="#9b91c5"/><circle cx="83" cy="79" r="13" fill="none"/>',
 cook:'<path d="M36 39Q13 21 32 12q11-7 19 3 9-22 24-5 24-8 29 10 2 17-19 19v13H36Z" fill="#fff"/><circle cx="61" cy="62" r="20" fill="#eac09c"/><path d="M31 112V91q30-24 59 0v21" fill="#e4b1a0"/><path d="M45 82v30h33V82" fill="#fff"/><path d="M24 73v36M18 73v13m12-13v13M98 77v32"/><ellipse cx="99" cy="73" rx="8" ry="12" fill="#decab2"/>',
 'play area':'<path d="M22 102V32h25v70m-25-55h25m-25 18h25m-25 18h25M44 32h20l40 70H84L47 47" fill="#efa478"/><circle cx="91" cy="22" r="13" fill="#f6d775"/>',
 classroom:'<rect x="10" y="13" width="100" height="55" rx="5" fill="#83b7a1"/><path d="M22 27h42m-42 13h30" stroke="#fff"/><path d="M16 86h39v10H16Zm51 0h39v10H67Z" fill="#deb380"/><path d="M22 97v15m26-15v15m25-15v15m26-15v15"/>',
 kitchen:'<rect x="16" y="48" width="88" height="61" rx="7" fill="#eac29a"/><rect x="28" y="69" width="42" height="29" rx="3" fill="#8d82a8"/><path d="M16 59h88m-24 8v33"/><path d="M35 33h38v15H35z" fill="#adcddc"/><path d="M39 23q-8-8 0-15m15 15q-8-8 0-15m15 15q-8-8 0-15" fill="none"/>',
 bathroom:'<path d="M26 39h66v17q-33 24-66 0Z" fill="#d1e8ec"/><path d="M55 63v40h18V63M61 39V24q0-16 17-10v13" fill="#fff"/><rect x="23" y="7" width="25" height="24" rx="6" fill="#b3dce7"/><path d="M15 108h90"/>'
};
export function illustration(word,{silhouette=false}={}){
 if(['circle','square','triangle','star'].includes(word))return shapeSVG(word);
 if(!drawings[word])throw Error('Missing illustration: '+word);
 return `<svg class="lesson-art ${silhouette?'silhouette':''}" viewBox="0 0 120 120" role="img" aria-label="${word}"><g stroke="${ink}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">${drawings[word]}</g></svg>`;
}
export function girl(){return '<span class="traveller" role="img" aria-label="小女孩">👧</span>';}
export function costume(word){
 const props={teacher:'<path d="M10 28q22-10 40 2 18-12 40-2v55q-22-10-40 2-18-12-40-2Z" fill="#d4b6ea"/><path d="M50 30v55M20 42h20m-20 13h20m20-13h20m-20 13h20"/>',friend:'<path d="M52 53q-20 30-5 43" fill="none"/><ellipse cx="52" cy="30" rx="27" ry="28" fill="#f0aa98"/><path d="m48 57 4-7 5 7Z" fill="#f0aa98"/>','bus driver':'<path d="M15 60V35q35-34 70 0v25Z" fill="#aaa2d4"/><path d="M12 60h78q-5 15-40 15T12 60Z" fill="#7e719f"/><circle cx="50" cy="40" r="9" fill="#f3cf7c"/>',cook:'<path d="M20 47Q0 35 10 18q12-13 25-1Q45-7 61 10q22-10 30 8 12 19-11 29v36H20Z" fill="#fff"/><path d="M20 63h60m-43-18v15m25-15v15"/>'};
 return `<svg viewBox="0 0 100 100" fill="none" stroke="#514363" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">${props[word]||''}</svg>`;
}
