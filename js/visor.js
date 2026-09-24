const visorMarkup = (id) => `
<svg class="visor-svg" viewBox="0 0 1000 500" fill="none" aria-hidden="true">
  <defs>
    <linearGradient id="${id}-alu" x1="200" y1="90" x2="820" y2="380">
      <stop offset="0%" stop-color="#f7f5f1"/>
      <stop offset="38%" stop-color="#e4e1db"/>
      <stop offset="72%" stop-color="#b9b6af"/>
      <stop offset="100%" stop-color="#8f8c86"/>
    </linearGradient>
    <linearGradient id="${id}-aluEdge" x1="200" y1="120" x2="200" y2="380">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="45%" stop-color="#d8d5cf"/>
      <stop offset="100%" stop-color="#7a7873"/>
    </linearGradient>
    <linearGradient id="${id}-band" x1="80" y1="160" x2="160" y2="400">
      <stop offset="0%" stop-color="#f6f4ef"/>
      <stop offset="100%" stop-color="#cfcbc3"/>
    </linearGradient>
    <linearGradient id="${id}-glass" x1="240" y1="140" x2="760" y2="360">
      <stop offset="0%" stop-color="#4a3d62"/>
      <stop offset="18%" stop-color="#1e3144"/>
      <stop offset="42%" stop-color="#101216"/>
      <stop offset="64%" stop-color="#2a4a5c"/>
      <stop offset="82%" stop-color="#5a3a32"/>
      <stop offset="100%" stop-color="#16181e"/>
    </linearGradient>
    <radialGradient id="${id}-iris" cx="34%" cy="28%" r="72%">
      <stop offset="0%" stop-color="rgba(210,190,255,0.42)"/>
      <stop offset="24%" stop-color="rgba(120,200,220,0.22)"/>
      <stop offset="52%" stop-color="rgba(255,255,255,0.06)"/>
      <stop offset="100%" stop-color="rgba(255,170,110,0.08)"/>
    </radialGradient>
    <linearGradient id="${id}-shine" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="rgba(255,255,255,0)"/>
      <stop offset="40%" stop-color="rgba(255,255,255,0.22)"/>
      <stop offset="58%" stop-color="rgba(255,255,255,0)"/>
    </linearGradient>
    <filter id="${id}-soft" x="-20%" y="-30%" width="140%" height="180%">
      <feDropShadow dx="0" dy="22" stdDeviation="18" flood-color="#000" flood-opacity="0.42"/>
    </filter>
  </defs>

  <ellipse cx="500" cy="448" rx="250" ry="18" fill="rgba(0,0,0,0.42)"/>

  <path d="M248 206 C210 78 790 78 752 206" stroke="url(#${id}-band)" stroke-width="22" stroke-linecap="round" opacity="0.32"/>

  <path class="visor-band" d="M228 214 C118 236 78 292 70 368" stroke="url(#${id}-band)" stroke-width="28" stroke-linecap="round"/>
  <path class="visor-band" d="M772 214 C882 236 922 292 930 368" stroke="url(#${id}-band)" stroke-width="28" stroke-linecap="round"/>

  <circle cx="96" cy="268" r="16" fill="url(#${id}-alu)"/>
  <circle cx="904" cy="268" r="16" fill="url(#${id}-alu)"/>
  <circle cx="96" cy="268" r="6" fill="#d8d5cf"/>
  <circle cx="904" cy="268" r="6" fill="#d8d5cf"/>

  <g filter="url(#${id}-soft)">
    <rect class="visor-alu" x="194" y="128" width="612" height="232" rx="116" fill="url(#${id}-aluEdge)"/>
    <rect x="206" y="140" width="588" height="208" rx="104" fill="url(#${id}-alu)"/>
    <rect class="visor-glass" x="218" y="150" width="564" height="188" rx="94" fill="url(#${id}-glass)"/>
    <rect class="visor-iris" x="218" y="150" width="564" height="188" rx="94" fill="url(#${id}-iris)"/>
    <rect class="visor-shine" x="218" y="150" width="564" height="188" rx="94" fill="url(#${id}-shine)"/>
    <path d="M268 176 C340 158 410 188 448 208" stroke="rgba(255,255,255,0.32)" stroke-width="3" stroke-linecap="round"/>
    <circle class="visor-cam" cx="458" cy="288" r="5.5"/>
    <circle class="visor-cam" cx="542" cy="288" r="5.5"/>
    <circle class="visor-led" cx="500" cy="176" r="3"/>
  </g>

  <rect x="246" y="104" width="30" height="16" rx="8" fill="url(#${id}-alu)"/>
  <circle cx="820" cy="198" r="23" fill="url(#${id}-aluEdge)"/>
  <circle cx="820" cy="198" r="14" fill="#cfcbc4" stroke="#9a978f" stroke-width="2"/>
  <circle cx="820" cy="198" r="4" fill="#8a8780"/>
</svg>
`;

const visorSimple = (id) => `
<svg class="visor-svg" viewBox="0 0 1000 400" fill="none" aria-hidden="true">
  <defs>
    <linearGradient id="${id}-alu" x1="200" y1="80" x2="800" y2="320">
      <stop offset="0%" stop-color="#f4f2ed"/>
      <stop offset="100%" stop-color="#9a978f"/>
    </linearGradient>
  </defs>
  <path d="M230 190 C120 210 90 260 80 320" stroke="#d8d4cc" stroke-width="22" stroke-linecap="round"/>
  <path d="M770 190 C880 210 910 260 920 320" stroke="#d8d4cc" stroke-width="22" stroke-linecap="round"/>
  <rect x="200" y="110" width="600" height="200" rx="100" stroke="url(#${id}-alu)" stroke-width="14"/>
  <rect x="230" y="136" width="540" height="148" rx="74" fill="rgba(18,20,24,0.55)"/>
</svg>
`;

export function mountVisors() {
  document.querySelectorAll("[data-visor]").forEach((node, index) => {
    const id = `v${index}`;
    node.innerHTML = node.dataset.simple === "true" ? visorSimple(id) : visorMarkup(id);
  });
}
