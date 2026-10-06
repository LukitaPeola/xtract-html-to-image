// ==========================================================================
// Xtract — Estilos de carrusel (1080 x 1350, 4:5)
// --------------------------------------------------------------------------
// UN ESTILO POR POST: n8n sortea `style` una vez por carrusel y todas las
// slides de ese post usan el mismo. Cada estilo tiene 3 roles de slide:
//   cover   -> slide 1
//   content -> slides intermedias
//   closing -> última slide (CTA)
// El rol se deduce de slide_number / total_slides (o se fuerza con `role`).
// ==========================================================================

export const STYLES = ['clasico', 'editorial', 'tarjeta', 'destacado', 'banda', 'tecnico'];

const LOGO_PLACEHOLDER = `<div class="logo-ph">LOGO</div>`;

const FONT_LINK = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">`;

// Paleta de marca (fija para todos los estilos)
//   --navy   #1C1A3E  fondo base
//   --indigo #263D89  centro del degradado radial
//   --blue   #4E89FF  acento / palabras destacadas en headline
//   --sky    #93C5FD  destacados en body, hints, chips
export const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1350px;background:#1C1A3E}
.slide{--navy:#1C1A3E;--indigo:#263D89;--blue:#4E89FF;--sky:#93C5FD;--white:#FFFFFF;--muted:#CBD5E1;
  --line:rgba(255,255,255,.10);--mono:'JetBrains Mono',ui-monospace,monospace;
  position:relative;width:1080px;height:1350px;overflow:hidden;display:flex;flex-direction:column;
  padding:88px 88px 72px;color:var(--white);background:var(--navy);
  font-family:'Inter','Segoe UI',system-ui,-apple-system,sans-serif;-webkit-font-smoothing:antialiased}
.slide>*{position:relative;z-index:1}
.logo{height:56px;display:flex;align-items:center;color:var(--white)}
.logo svg,.logo img{height:100%;width:auto;display:block}
.logo-ph{height:56px;min-width:56px;padding:0 12px;border:2px dashed rgba(255,255,255,.35);border-radius:10px;display:flex;align-items:center;justify-content:center;font:700 16px/1 var(--mono);letter-spacing:.1em;color:rgba(255,255,255,.55)}
.main{flex:1;display:flex;flex-direction:column;justify-content:center;min-height:0}
h1{font-weight:800;letter-spacing:-.025em;line-height:1.08}
h1 .hl{color:var(--blue)}
.body{font-size:36px;line-height:1.5;color:var(--muted)}
.body .hl{color:var(--sky);font-weight:700}
.hint{font-weight:700;font-size:30px;color:var(--sky)}
.btn{display:inline-flex;align-items:center;padding:28px 48px;border-radius:999px;background:var(--blue);color:#fff;font-weight:800;font-size:34px}
.site{font-weight:700;font-size:32px;color:var(--sky)}
.cta-row{display:flex;gap:36px;align-items:center;margin-top:64px}

/* ===================== 1. CLÁSICO (el actual) ===================== */
.s-clasico{background:radial-gradient(900px 800px at 85% 15%,#263D89 0%,rgba(38,61,137,0) 70%),radial-gradient(700px 600px at 10% 90%,rgba(38,61,137,.7) 0%,rgba(38,61,137,0) 70%),#1C1A3E}
.s-clasico .top{display:flex;justify-content:space-between;align-items:center}
.s-clasico .chip{display:inline-flex;align-items:center;gap:14px;padding:16px 30px;border-radius:999px;border:2px solid rgba(78,137,255,.45);background:rgba(78,137,255,.12);color:var(--sky);font-weight:700;font-size:28px}
.s-clasico .chip i{width:12px;height:12px;border-radius:50%;background:var(--blue)}
.s-clasico .body{margin-top:52px;padding-left:36px;border-left:6px solid var(--blue)}
.s-clasico .bottom{display:flex;justify-content:space-between;align-items:center;border-top:2px solid var(--line);padding-top:40px}
.s-clasico .dots{display:flex;gap:10px}
.s-clasico .dots span{width:24px;height:6px;border-radius:3px;background:rgba(255,255,255,.2)}
.s-clasico .dots span.on{width:56px;background:var(--blue)}
.s-clasico.r-closing .body{border-left:0;padding-left:0}

/* ===================== 2. EDITORIAL ===================== */
.s-editorial{background:radial-gradient(1100px 900px at 100% 0%,#263D89 0%,rgba(38,61,137,0) 65%),#1C1A3E;padding:96px 96px 80px}
.s-editorial .top{display:flex;justify-content:space-between;align-items:center}
.s-editorial .kicker{font-size:24px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--sky)}
.s-editorial .main{justify-content:flex-end;padding-bottom:24px}
.s-editorial .num{font-size:280px;font-weight:800;line-height:.8;letter-spacing:-.06em;color:transparent;-webkit-text-stroke:3px var(--blue);margin-bottom:56px}
.s-editorial .rule{width:100%;height:2px;background:var(--line);margin:48px 0}
.s-editorial .body{max-width:860px}
.s-editorial .bottom{display:flex;justify-content:space-between;align-items:baseline}
.s-editorial .count{font-size:28px;font-weight:700;letter-spacing:.12em;color:rgba(255,255,255,.55)}
.s-editorial .count b{color:var(--white)}
.s-editorial.r-cover .main{justify-content:flex-end}
.s-editorial.r-cover .bar{width:140px;height:12px;background:var(--blue);margin-bottom:56px}

/* ===================== 3. TARJETA ===================== */
.s-tarjeta{background:radial-gradient(1000px 1000px at 50% 45%,#263D89 0%,#1C1A3E 72%)}
.s-tarjeta .top{display:flex;justify-content:space-between;align-items:center;margin-bottom:48px}
.s-tarjeta .badge{font-size:28px;font-weight:700;color:var(--sky)}
.s-tarjeta .card{flex:1;display:flex;flex-direction:column;justify-content:center;border-radius:44px;padding:80px 72px;
  background:linear-gradient(160deg,rgba(255,255,255,.07),rgba(255,255,255,.02));border:2px solid rgba(147,197,253,.22);box-shadow:0 40px 80px rgba(10,10,40,.35)}
.s-tarjeta .card .body{margin-top:48px}
.s-tarjeta .icon{width:88px;height:88px;border-radius:24px;background:var(--blue);display:flex;align-items:center;justify-content:center;margin-bottom:56px}
.s-tarjeta .icon svg{width:44px;height:44px}
.s-tarjeta .bottom{display:flex;justify-content:space-between;align-items:center;margin-top:48px}
.s-tarjeta .dots{display:flex;gap:14px}
.s-tarjeta .dots span{width:14px;height:14px;border-radius:50%;background:rgba(255,255,255,.2)}
.s-tarjeta .dots span.on{background:var(--sky)}

/* ===================== 4. DESTACADO ===================== */
.s-destacado{background:radial-gradient(1000px 900px at 0% 0%,#263D89 0%,rgba(38,61,137,0) 68%),#1C1A3E}
.s-destacado .top{display:flex;justify-content:space-between;align-items:center}
.s-destacado .counter{font-size:30px;font-weight:800;color:var(--white);padding:14px 26px;border-radius:999px;background:rgba(255,255,255,.08)}
.s-destacado .counter span{color:rgba(255,255,255,.5);font-weight:600}
.s-destacado .main{justify-content:flex-start;padding-top:120px}
.s-destacado h1{line-height:1.16}
.s-destacado h1 .hl{color:#fff;background:var(--blue);padding:0 .16em;border-radius:.14em;-webkit-box-decoration-break:clone;box-decoration-break:clone}
.s-destacado .foot{display:flex;flex-direction:column;gap:48px}
.s-destacado .foot .body{font-size:38px;color:var(--white);opacity:.86;max-width:880px}
.s-destacado .bottom{display:flex;justify-content:space-between;align-items:center}
.s-destacado .badge{font-size:26px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--sky)}
.s-destacado.r-cover .main{justify-content:center;padding-top:0}

/* ===================== 5. BANDA ===================== */
.s-banda{padding:0;background:#1C1A3E}
.s-banda .progress{position:absolute;top:0;left:0;right:0;height:10px;background:rgba(255,255,255,.08);z-index:2}
.s-banda .progress i{display:block;height:100%;background:var(--blue)}
.s-banda .upper{flex:1;display:flex;flex-direction:column;padding:98px 88px 72px;background:radial-gradient(900px 700px at 80% 20%,#263D89 0%,rgba(38,61,137,0) 70%),#1C1A3E}
.s-banda .top{display:flex;justify-content:space-between;align-items:center}
.s-banda .badge{display:inline-flex;align-items:center;gap:16px;font-size:28px;font-weight:700;color:var(--sky)}
.s-banda .badge i{width:36px;height:4px;background:var(--blue)}
.s-banda .upper .main{justify-content:flex-end;padding-bottom:8px}
.s-banda .lower{background:#263D89;padding:64px 88px 64px;display:flex;flex-direction:column;gap:48px}
.s-banda .lower .body{color:#E2E8F0}
.s-banda .lower .body .hl{color:#fff}
.s-banda .bottom{display:flex;justify-content:space-between;align-items:center}
.s-banda .count{font-size:28px;font-weight:700;color:rgba(255,255,255,.6)}
.s-banda .hint{color:#fff}
.s-banda .btn{background:#fff;color:#263D89}

/* ===================== 6. TÉCNICO ===================== */
.s-tecnico{background:
  repeating-linear-gradient(0deg,rgba(147,197,253,.06) 0 2px,transparent 2px 60px),
  repeating-linear-gradient(90deg,rgba(147,197,253,.06) 0 2px,transparent 2px 60px),
  radial-gradient(900px 900px at 70% 35%,#263D89 0%,#1C1A3E 70%)}
.s-tecnico .top{display:flex;justify-content:space-between;align-items:center}
.s-tecnico .label{font:700 26px/1 var(--mono);color:var(--sky);letter-spacing:.04em}
.s-tecnico .label b{color:var(--blue)}
.s-tecnico .frame{position:relative;padding:64px 56px}
.s-tecnico .frame::before,.s-tecnico .frame::after{content:'';position:absolute;width:56px;height:56px;border-color:var(--blue);border-style:solid}
.s-tecnico .frame::before{top:0;left:0;border-width:4px 0 0 4px}
.s-tecnico .frame::after{bottom:0;right:0;border-width:0 4px 4px 0}
.s-tecnico .body{margin-top:44px;position:relative;padding-left:56px}
.s-tecnico .body::before{content:'→';position:absolute;left:0;top:0;color:var(--blue);font-weight:800}
.s-tecnico .bottom{display:flex;justify-content:space-between;align-items:center}
.s-tecnico .count{font:700 28px/1 var(--mono);color:rgba(255,255,255,.6)}
.s-tecnico .hint{font-family:var(--mono);font-size:26px}
.s-tecnico .btn{border-radius:14px;font-family:var(--mono);font-size:30px}
`;

// ---------- helpers ----------
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const hl = (s) => esc(s).replace(/\*\*?([^*]+)\*\*?/g, '<span class="hl">$1</span>');
const plainLen = (s) => String(s ?? '').replace(/\*/g, '').length;
const fit = (base, text, limit, min = 0.6) => {
  const len = plainLen(text);
  return Math.round(len <= limit ? base : base * Math.max(min, Math.sqrt(limit / len)));
};
const pad = (n) => String(n).padStart(2, '0');
const H1 = (t, base, limit) => `<h1 style="font-size:${fit(base, t, limit)}px">${hl(t)}</h1>`;
const BODY = (t) => (t ? `<p class="body">${hl(t)}</p>` : '');
const CTA = (d, extraSite = true) =>
  `<div class="cta-row"><div class="btn">${esc(d.cta_label || 'Guardá este post')}</div>${extraSite && d.cta_secondary !== '' ? `<div class="site">${esc(d.cta_secondary || 'xtract.app')}</div>` : ''}</div>`;
const hintOf = (d, role) => esc(d.footer_hint || (role === 'closing' ? 'Guardá este post' : 'Deslizá →'));
const dots = (n, total) => Array.from({ length: Math.min(total, 10) }, (_, i) => `<span class="${i + 1 === n ? 'on' : ''}"></span>`).join('');

// ---------- estilos ----------
const R = {
  clasico: (d, c) => `
    <div class="top"><div class="chip"><i></i>${esc(d.badge)}</div><div class="logo">${c.logo}</div></div>
    <div class="main">${c.role === 'cover' ? H1(d.headline, 100, 50) : H1(d.headline, 76, 60)}${BODY(d.body)}${c.role === 'closing' ? CTA(d) : ''}</div>
    <div class="bottom"><div class="dots">${dots(c.n, c.total)}</div>${c.role === 'closing' ? '' : `<div class="hint">${hintOf(d, c.role)}</div>`}</div>`,

  editorial: (d, c) => `
    <div class="top"><div class="kicker">${esc(d.badge)}</div><div class="logo">${c.logo}</div></div>
    <div class="main">
      ${c.role === 'cover' ? `<div class="bar"></div>${H1(d.headline, 112, 46)}` : `<div class="num">${pad(c.n)}</div>${H1(d.headline, 72, 60)}`}
      ${d.body ? `<div class="rule"></div>${BODY(d.body)}` : ''}
      ${c.role === 'closing' ? CTA(d) : ''}
    </div>
    <div class="bottom"><div class="count"><b>${pad(c.n)}</b> / ${pad(c.total)}</div>${c.role === 'closing' ? '' : `<div class="hint">${hintOf(d, c.role)}</div>`}</div>`,

  tarjeta: (d, c) => `
    <div class="top"><div class="badge">${esc(d.badge)}</div><div class="logo">${c.logo}</div></div>
    <div class="card">
      ${c.role === 'content' ? '' : `<div class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${c.role === 'cover' ? '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>' : '<path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>'}</svg></div>`}
      ${c.role === 'cover' ? H1(d.headline, 88, 50) : H1(d.headline, 68, 60)}${BODY(d.body)}${c.role === 'closing' ? CTA(d) : ''}
    </div>
    <div class="bottom"><div class="dots">${dots(c.n, c.total)}</div>${c.role === 'closing' ? '' : `<div class="hint">${hintOf(d, c.role)}</div>`}</div>`,

  destacado: (d, c) => `
    <div class="top"><div class="logo">${c.logo}</div><div class="counter">${c.n}<span> / ${c.total}</span></div></div>
    <div class="main">${c.role === 'cover' ? H1(d.headline, 118, 44) : H1(d.headline, 86, 55)}</div>
    <div class="foot">${BODY(d.body)}${c.role === 'closing' ? CTA(d) : ''}
      <div class="bottom"><div class="badge">${esc(d.badge)}</div>${c.role === 'closing' ? '' : `<div class="hint">${hintOf(d, c.role)}</div>`}</div></div>`,

  banda: (d, c) => `
    <div class="progress"><i style="width:${Math.round((c.n / c.total) * 100)}%"></i></div>
    <div class="upper">
      <div class="top"><div class="badge"><i></i>${esc(d.badge)}</div><div class="logo">${c.logo}</div></div>
      <div class="main">${c.role === 'cover' ? H1(d.headline, 104, 48) : H1(d.headline, 76, 60)}</div>
    </div>
    <div class="lower">${BODY(d.body)}${c.role === 'closing' ? CTA(d, false) : ''}
      <div class="bottom"><div class="count">${pad(c.n)} / ${pad(c.total)}</div>${c.role === 'closing' ? '<div class="hint">xtract.app</div>' : `<div class="hint">${hintOf(d, c.role)}</div>`}</div></div>`,

  tecnico: (d, c) => `
    <div class="top"><div class="label"><b>//</b> ${pad(c.n)} — ${esc(String(d.badge || '').toUpperCase())}</div><div class="logo">${c.logo}</div></div>
    <div class="main"><div class="frame">${c.role === 'cover' ? H1(d.headline, 96, 48) : H1(d.headline, 70, 60)}${BODY(d.body)}${c.role === 'closing' ? CTA(d) : ''}</div></div>
    <div class="bottom"><div class="count">[ ${pad(c.n)}/${pad(c.total)} ]</div>${c.role === 'closing' ? '' : `<div class="hint">${hintOf(d, c.role)}</div>`}</div>`,
};

// Solo el <div class="slide"> (previews / galerías)
export function renderSlideFragment(d = {}, opts = {}) {
  const style = STYLES.includes(d.style) ? d.style : 'clasico';
  const total = Math.max(1, parseInt(d.total_slides, 10) || 1);
  const n = Math.min(total, Math.max(1, parseInt(d.slide_number, 10) || 1));
  const role = ['cover', 'content', 'closing'].includes(d.role) ? d.role : n === 1 ? 'cover' : n === total ? 'closing' : 'content';
  const ctx = { n, total, role, logo: opts.logo || LOGO_PLACEHOLDER };
  const data = { ...d, badge: d.badge || 'Cuentas por Pagar' };
  return `<div class="slide s-${style} r-${role}">${R[style](data, ctx)}</div>`;
}

// Documento completo para screenshot a 1080x1350
export function renderSlideHTML(d = {}, opts = {}) {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8">${FONT_LINK}<style>${CSS}</style></head><body>${renderSlideFragment(d, opts)}</body></html>`;
}
