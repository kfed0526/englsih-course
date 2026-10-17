// White bones have individual dark outlines to stay visible on every background.
const ink = '#493957';
function bone(path, width = 11) {
  return `<path d="${path}" fill="none" stroke="${ink}" stroke-width="${width + 5}"/><path d="${path}" fill="none" stroke="#fff" stroke-width="${width}"/>`;
}
export function skeleton(mode = 'wave') {
  return `<div class="mascot ${mode}" aria-label="戴紫色帽子、白骨深紫描邊的可愛骨頭人" role="img"><svg viewBox="0 0 220 250" aria-hidden="true">
    <ellipse cx="110" cy="237" rx="66" ry="9" fill="#d8cce6"/>
    <g class="body" stroke="${ink}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
      <g class="arm left">${bone('m82 140-24 24-19-23')}<path d="M35 146q-11-4-6-13 3-5 7-1-3-12 3-13 6 0 6 13 8-6 11 0 3 8-10 15Z" fill="#fff" stroke-width="3"/></g>
      <g class="arm right">${bone('m138 140 23 15 17-38')}<path d="M171 117q-10-8-5-13 4-3 8 3-5-18 2-19 5 0 6 15 4-16 10-12 4 4-3 16 10-6 12 0 0 8-18 14Z" fill="#fff" stroke-width="3"/></g>
      ${bone('M110 128v64', 12)}
      ${bone('M87 142q23 14 46 0M87 157q23 14 46 0M94 172q16 10 32 0', 8)}
      ${bone('m98 194-16 28-12 3m52-31 16 28 12 3', 12)}
      <path d="M89 184q21 12 42 0l-8 19H97Z" fill="#fff"/>
      <path d="M63 66c0-43 94-43 94 0v22q0 19-22 25v12H85v-12Q63 107 63 88Z" fill="#fff"/>
      <ellipse cx="89" cy="77" rx="12" ry="15" fill="${ink}" stroke="none"/>
      <ellipse class="eye" cx="133" cy="77" rx="12" ry="15" fill="${ink}" stroke="none"/>
      <circle cx="93" cy="72" r="4" fill="#fff" stroke="none"/><circle cx="137" cy="72" r="4" fill="#fff" stroke="none"/>
      <ellipse cx="76" cy="96" rx="9" ry="5" fill="#f2b4ab" stroke="none"/><ellipse cx="145" cy="96" rx="9" ry="5" fill="#f2b4ab" stroke="none"/>
      <path d="m107 93 4-6 4 6Z" fill="${ink}" stroke-width="2"/>
      <path d="M94 105q17 16 34 0M104 111v7m13-7v7" fill="none" stroke-width="3"/>
      <g class="hat"><path d="m73 43 22-38q4-5 8 0l28 38Z" fill="#8f71bb"/><path d="m80 31 43 0 8 12H73Z" fill="#f3b56b" stroke-width="3"/><path d="M65 45q35 9 74 0" fill="none" stroke-width="8"/><path d="m101 15 2 5 6 1-5 4 1 5-4-3-5 3 1-5-4-4 6-1Z" fill="#ffdf8a" stroke="none"/></g>
      <path d="m98 129 12 7 12-7v16l-12-7-12 7Z" fill="#edaa61" stroke-width="3"/><circle cx="110" cy="137" r="4" fill="#ffd996" stroke-width="2"/>
    </g></svg></div>`;
}
