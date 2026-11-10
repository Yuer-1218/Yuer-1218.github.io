const content_dir = 'contents/'
const config_file = 'config.yml'
const section_names = ['home', 'research', 'publications', 'awards']

const urlLang = new URLSearchParams(location.search).get('lang')
const LANG = (urlLang === 'zh' || urlLang === 'en') ? urlLang : (localStorage.getItem('lang') === 'zh' ? 'zh' : 'en')
const content_prefix = LANG === 'zh' ? 'zh/' : ''

const DEMO_TEXT = LANG === 'zh' ? {
    phiHalf: '半功率角 φ½',
    delta: '指向偏角 δ',
    deltaOpt: '最优偏角 δ_opt',
    gain: '相对完美对准的增益',
    mOrder: 'Lambertian 阶数',
    modelNote: '随机节点/朝向模型下的期望接收功率（论文式 33）：P(δ) ∝ cos^(m+1)(δ) − cos^(m+1)(δ+φ½)，其中 m = −ln2/ln cos(φ½)，且 δ+φ½ ≤ 90°。最优偏角 δ_opt > 0：用中心峰值辐照度换取孔径上更均匀的光束区域，使孔径积分功率最大化。',
    step1: '步骤 1：发现与接近',
    step2: '步骤 2：通信与充电',
    done: '全部节点服务完成，即将重新开始…',
    nodesServiced: '个节点已服务',
    auvCap: 'SA-OPS 任务示意动画：AUV 先基于 SNR 发现节点（步骤 1），再根据节点能量状态决定"预充电 / 先通信后充电 / 仅通信"（步骤 2）。仅为可视化示意。',
} : {
    phiHalf: 'Half-power angle φ½',
    delta: 'Pointing offset δ',
    deltaOpt: 'Optimal offset δ_opt',
    gain: 'Gain vs perfect alignment',
    mOrder: 'Lambertian order',
    modelNote: 'Expected received power under the random node/orientation model, Eq. (33): P(δ) ∝ cos^(m+1)(δ) − cos^(m+1)(δ+φ½), with m = −ln2 / ln cos(φ½) and δ+φ½ ≤ 90°. The optimal offset δ_opt > 0 trades center irradiance for a more uniform beam region over the aperture.',
    step1: 'Step 1: find & approach',
    step2: 'Step 2: communicate & charge',
    done: 'All nodes serviced — restarting…',
    nodesServiced: 'nodes serviced',
    auvCap: 'Illustrative SA-OPS mission: the AUV discovers a node (SNR-based, Step 1), then chooses among charge / communicate / both based on the node energy state (Step 2). For visualization only.',
}

window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Theme toggle
    const themeBtn = document.getElementById('theme-toggle');
    const applyTheme = (dark) => {
        if (dark) document.documentElement.dataset.theme = 'dark';
        else delete document.documentElement.dataset.theme;
        if (themeBtn) themeBtn.textContent = dark ? '☀' : '☾';
    };
    const urlTheme = new URLSearchParams(location.search).get('theme');
    applyTheme(urlTheme ? urlTheme === 'dark' : localStorage.getItem('theme') === 'dark');
    if (themeBtn) themeBtn.addEventListener('click', () => {
        const dark = document.documentElement.dataset.theme !== 'dark';
        localStorage.setItem('theme', dark ? 'dark' : 'light');
        applyTheme(dark);
    });

    // Language toggle
    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
        langBtn.textContent = LANG === 'zh' ? 'EN' : '中文';
        langBtn.addEventListener('click', () => {
            const next = LANG === 'zh' ? 'en' : 'zh';
            localStorage.setItem('lang', next);
            const url = new URL(location.href);
            if (url.searchParams.has('lang')) {
                url.searchParams.set('lang', next);
                location.href = url.toString();
            } else {
                location.reload();
            }
        });
    }
    if (LANG === 'zh') {
        const navMap = { 'HOME': '首页', 'RESEARCH': '研究', 'PUBLICATIONS': '论文', 'AWARDS': '荣誉' };
        document.querySelectorAll('#navbarResponsive .nav-link').forEach(a => {
            const k = a.textContent.trim();
            if (navMap[k]) a.textContent = navMap[k];
        });
        const headMap = { 'research-subtitle': '研究', 'publications-subtitle': '论文', 'awards-subtitle': '荣誉' };
        Object.keys(headMap).forEach(id => {
            const h = document.getElementById(id);
            if (h && h.lastChild && h.lastChild.nodeType === 3) {
                h.lastChild.textContent = ' ' + headMap[id];
            }
        });
    }

    // Yaml
    fetch(content_dir + config_file)
        .then(response => response.text())
        .then(text => {
            const yml = jsyaml.load(text);
            Object.keys(yml).forEach(key => {
                try {
                    document.getElementById(key).innerHTML = yml[key];
                } catch {
                    console.log("Unknown id and value: " + key + "," + yml[key].toString())
                }
            })
        })
        .catch(error => console.log(error));

    // Marked
    marked.use({ mangle: false, headerIds: false })
    section_names.forEach((name, idx) => {
        fetch(content_dir + content_prefix + name + '.md')
            .then(response => response.text())
            .then(markdown => {
                const html = marked.parse(markdown);
                const el = document.getElementById(name + '-md');
                el.innerHTML = html;
                el.classList.add('loaded');
            }).then(() => {
                // MathJax
                MathJax.typeset();
                if (name === 'research' && new URLSearchParams(location.search).get('demo') === 'open') {
                    document.querySelectorAll('#research-md details.demo-wrap').forEach(d => { d.open = true; });
                }
            })
            .catch(error => console.log(error));
    })

});

/* ---------------- Copy BibTeX ---------------- */
document.addEventListener('click', event => {
    const btn = event.target.closest('.cite-btn');
    if (!btn) return;
    const box = btn.closest('.expander-body') || btn.closest('li');
    const pre = box && box.querySelector('.bibtex');
    if (!pre) return;
    const text = pre.textContent.trim();
    const restore = () => setTimeout(() => { btn.textContent = LANG === 'zh' ? '复制 BibTeX' : 'Copy BibTeX'; }, 1500);
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            btn.textContent = LANG === 'zh' ? '已复制！' : 'Copied!';
            restore();
        }).catch(() => { });
    } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) { }
        document.body.removeChild(ta);
        btn.textContent = 'Copied!';
        restore();
    }
});

/* ---------------- Lazy interactive demos (collapsed by default) ---------------- */
document.addEventListener('toggle', event => {
    const details = event.target;
    if (!details.classList || !details.classList.contains('demo-wrap')) return;
    if (!details.open || details.dataset.init) return;
    details.dataset.init = '1';
    const host = details.querySelector('.demo');
    if (!host) return;
    const kind = host.dataset.demo;
    if (kind === 'offset') initOffsetDemo(host);
    else if (kind === 'auv') initAuvDemo(host);
}, true);

const SVGS = 'http://www.w3.org/2000/svg';
function svgEl(tag, attrs) {
    const e = document.createElementNS(SVGS, tag);
    if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
}

/* ---------------- Offset pointing demo — paper Eq. (33) ---------------- */
function initOffsetDemo(host) {
    const TX = { x: 70, y: 130 };

    // deterministic pseudo-random PPP-like cloud
    function cloudPoints(n) {
        let seed = 421;
        const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
        const pts = [];
        for (let i = 0; i < n; i++) {
            const t = rnd() * 2 - 1;          // angle fraction in [-1, 1] of half-angle
            const rr = 0.18 + rnd() * 0.78;   // distance fraction
            const s = 1.6 + rnd() * 1.8;      // dot radius
            const o = 0.25 + rnd() * 0.45;    // opacity
            pts.push({ t, rr, s, o });
        }
        return pts;
    }
    const cloud = cloudPoints(46);

    host.innerHTML = `
    <div class="demo-panel">
      <svg class="demo-scene" viewBox="0 0 680 260" role="img" aria-label="Offset pointing geometry">
        <defs>
          <linearGradient id="odBeamGrad" x1="0" y1="0" x2="0" y2="1">
            <stop class="od-stop-a" offset="0"></stop>
            <stop class="od-stop-b" offset="0.5"></stop>
            <stop class="od-stop-a" offset="1"></stop>
          </linearGradient>
        </defs>
        <g id="od-cloud"></g>
        <path id="od-beam" d="" fill="url(#odBeamGrad)"></path>
        <line id="od-axis" class="od-axis" x1="70" y1="130" x2="640" y2="130"></line>
        <path id="od-hp-arc" class="od-hp-arc" d=""></path>
        <text id="od-hp-label" class="od-label-sm" x="0" y="0"></text>
        <g class="od-tx">
          <circle cx="70" cy="130" r="7" class="od-tx-dot"></circle>
          <circle cx="70" cy="130" r="13" class="od-tx-ring"></circle>
          <path d="M 88 117 A 18 18 0 0 1 88 143" class="od-tx-wave"></path>
          <path d="M 95 110 A 27 27 0 0 1 95 150" class="od-tx-wave"></path>
        </g>
        <text x="70" y="168" class="od-label" text-anchor="middle">Tx</text>
        <g id="od-rx"></g>
      </svg>
      <div class="demo-controls">
        <label>${DEMO_TEXT.phiHalf} <input id="od-phi" type="range" min="15" max="75" value="60" step="1"><output id="od-phi-out">60°</output></label>
        <label>${DEMO_TEXT.delta} <input id="od-del" type="range" min="0" max="30" value="0" step="0.5"><output id="od-del-out">0°</output></label>
      </div>
      <svg class="demo-plot" viewBox="0 0 680 150" role="img" aria-label="Normalized received power versus offset">
        <line class="od-plot-axis" x1="70" y1="122" x2="648" y2="122"></line>
        <line class="od-plot-axis" x1="70" y1="16" x2="70" y2="122"></line>
        <text class="od-plot-tick" x="70" y="142" text-anchor="middle">0°</text>
        <text class="od-plot-tick" id="od-tick-mid" x="360" y="142" text-anchor="middle"></text>
        <text class="od-plot-tick" id="od-tick-end" x="640" y="142" text-anchor="middle"></text>
        <text class="od-plot-tick" x="58" y="20" text-anchor="end">1</text>
        <text class="od-plot-tick" x="58" y="72" text-anchor="end">.5</text>
        <text class="od-plot-tick" x="58" y="126" text-anchor="end">0</text>
        <path id="od-curve-fill" class="od-curve-fill" d=""></path>
        <polyline id="od-curve" class="od-curve" points=""></polyline>
        <line id="od-opt-line" class="od-opt-line" x1="0" y1="16" x2="0" y2="122"></line>
        <circle id="od-opt-dot" class="od-opt-dot" r="4.5" cx="0" cy="0"></circle>
        <text id="od-opt-label" class="od-label-opt" x="0" y="0"></text>
        <line id="od-del-line" class="od-del-line" x1="0" y1="16" x2="0" y2="122"></line>
        <circle id="od-del-dot" class="od-del-dot" r="4.5" cx="0" cy="0"></circle>
        <circle id="od-base-dot" class="od-base-dot" r="3.5" cx="0" cy="0"></circle>
      </svg>
      <div class="demo-stats" id="od-stats"></div>
      <div class="demo-caption">${DEMO_TEXT.modelNote}</div>
    </div>`;

    const $ = id => host.querySelector('#' + id);
    const phiIn = $('od-phi'), delIn = $('od-del');

    // Paper Eq. (33): P(δ) ∝ cos^(m+1)(δ) − cos^(m+1)(δ+φ½), m = −ln2/ln cos(φ½)
    function lambertOrder(phiHalfDeg) {
        return -Math.log(2) / Math.log(Math.cos(phiHalfDeg * Math.PI / 180));
    }
    function power(phiHalfDeg, deltaDeg) {
        if (deltaDeg + phiHalfDeg > 90 + 1e-9) return 0;
        const m = lambertOrder(phiHalfDeg);
        const c1 = Math.pow(Math.cos(deltaDeg * Math.PI / 180), m + 1);
        const c2 = Math.pow(Math.cos((deltaDeg + phiHalfDeg) * Math.PI / 180), m + 1);
        return Math.max(0, c1 - c2);
    }
    function optimum(phiHalfDeg) {
        const maxD = 90 - phiHalfDeg;
        let best = 0, bestP = -1;
        for (let d = 0; d <= maxD + 1e-9; d += 0.05) {
            const P = power(phiHalfDeg, d);
            if (P > bestP) { bestP = P; best = d; }
        }
        return { delta: best, P: bestP };
    }

    const cloudG = $('od-cloud');
    const dots = cloud.map(p => {
        const c = svgEl('circle', { r: p.s, class: 'od-node', opacity: p.o });
        cloudG.appendChild(c);
        return { c, p };
    });

    function drawScene(phiHalfDeg, deltaDeg, optDeg) {
        // beam sector (bounded by an arc, like a lighthouse lobe)
        const L = 560;
        const a1 = (-phiHalfDeg) * Math.PI / 180, a2 = (phiHalfDeg) * Math.PI / 180;
        const p1 = [TX.x + L * Math.cos(a1), TX.y + L * Math.sin(a1)];
        const p2 = [TX.x + L * Math.cos(a2), TX.y + L * Math.sin(a2)];
        $('od-beam').setAttribute('d', `M ${TX.x} ${TX.y} L ${p1[0]} ${p1[1]} A ${L} ${L} 0 0 1 ${p2[0]} ${p2[1]} Z`);
        // half-power arc
        const ar = 150;
        const s1 = [TX.x + ar * Math.cos(a1), TX.y + ar * Math.sin(a1)];
        const s2 = [TX.x + ar * Math.cos(a2), TX.y + ar * Math.sin(a2)];
        $('od-hp-arc').setAttribute('d', `M ${s1[0]} ${s1[1]} A ${ar} ${ar} 0 0 1 ${s2[0]} ${s2[1]}`);
        const midA = 0; // label at axis end of arc? put near upper edge
        $('od-hp-label').setAttribute('x', TX.x + (ar + 22) * Math.cos(a2) - 12);
        $('od-hp-label').setAttribute('y', TX.y + (ar + 22) * Math.sin(a2) + 4);
        $('od-hp-label').textContent = 'φ½ = ' + Math.round(phiHalfDeg) + '°';
        // cloud positions
        dots.forEach(({ c, p }) => {
            const ang = p.t * phiHalfDeg * Math.PI / 180;
            const d = 70 + p.rr * 470;
            c.setAttribute('cx', TX.x + d * Math.cos(ang));
            c.setAttribute('cy', TX.y + d * Math.sin(ang));
        });
        // highlighted receiver: inside the beam, with random-ish orientation + deterministic offset δ
        const rxAng = 0.28 * phiHalfDeg * Math.PI / 180;
        const rxD = 400;
        const rx = [TX.x + rxD * Math.cos(rxAng), TX.y + rxD * Math.sin(rxAng)];
        const rxG = $('od-rx');
        rxG.setAttribute('transform', `translate(${rx[0]}, ${rx[1]})`);
        const rot = deltaDeg; // aperture rotated by δ from facing the transmitter
        let html = `
          <line x1="${-rxD * Math.cos(rxAng)}" y1="0" x2="0" y2="0" class="od-link"></line>
          <g transform="rotate(${rot})">
            <rect x="-4" y="-28" width="8" height="56" rx="4" class="od-disc"></rect>
            <line x1="0" y1="0" x2="-58" y2="0" class="od-normal"></line>
            <text x="-74" y="-6" class="od-label-sm od-normal-label">n</text>
          </g>
          <text x="12" y="-30" class="od-label-sm">Rx</text>
          <path id="od-delta-arc" d="" class="od-delta-arc"></path>
          <text id="od-delta-label" x="0" y="0" class="od-delta-label"></text>
          <circle cx="0" cy="0" r="3.2" class="od-disc-dot"></circle>`;
        rxG.innerHTML = html;
        // delta arc from the LOS direction (pointing to Tx, angle 180°) to rotated normal (180°+δ)
        if (deltaDeg > 0.5) {
            const r = 34;
            const pStart = [r * Math.cos(Math.PI), r * Math.sin(Math.PI)];
            const endA = (180 + deltaDeg) * Math.PI / 180;
            const pEnd = [r * Math.cos(endA), r * Math.sin(endA)];
            const arc = rxG.querySelector('#od-delta-arc');
            arc.setAttribute('d', `M ${pStart[0]} ${pStart[1]} A ${r} ${r} 0 0 1 ${pEnd[0]} ${pEnd[1]}`);
            const lab = rxG.querySelector('#od-delta-label');
            const midA = (180 + deltaDeg / 2) * Math.PI / 180;
            lab.setAttribute('x', (r + 14) * Math.cos(midA));
            lab.setAttribute('y', (r + 14) * Math.sin(midA) + 4);
            lab.textContent = 'δ';
        }
        // draw node-orientation tick for a few cloud nodes? keep minimal
    }

    function drawPlot(phiHalfDeg, deltaDeg) {
        const opt = optimum(phiHalfDeg);
        const maxD = 90 - phiHalfDeg;
        const pmax = opt.P || 1;
        const x0 = 70, x1 = 648, y0 = 16, y1 = 122;
        const P2x = d => x0 + (d / maxD) * (x1 - x0);
        const P2y = p => y1 - Math.max(0, p / pmax) * (y1 - y0);
        let pts = [], area = [`M ${x0} ${y1}`];
        for (let d = 0; d <= maxD + 1e-9; d += maxD / 90) {
            const p = power(phiHalfDeg, d);
            const X = P2x(d), Y = P2y(p);
            pts.push(X.toFixed(1) + ',' + Y.toFixed(1));
            area.push(`${X.toFixed(1)} ${Y.toFixed(1)}`);
        }
        area.push(`${x1} ${y1}`, 'Z');
        $('od-curve').setAttribute('points', pts.join(' '));
        $('od-curve-fill').setAttribute('d', area.join(' '));
        // optimum marker
        const ox = P2x(opt.delta), oy = P2y(pmax);
        $('od-opt-line').setAttribute('x1', ox);
        $('od-opt-line').setAttribute('x2', ox);
        $('od-opt-dot').setAttribute('cx', ox);
        $('od-opt-dot').setAttribute('cy', oy);
        const optLab = $('od-opt-label');
        optLab.setAttribute('x', Math.min(ox + 6, x1 - 90));
        optLab.setAttribute('y', Math.max(oy - 8, 26));
        optLab.textContent = 'δ_opt = ' + opt.delta.toFixed(1) + '°';
        // current delta marker
        const cp = power(phiHalfDeg, deltaDeg);
        const cx = P2x(deltaDeg), cy = P2y(cp);
        $('od-del-line').setAttribute('x1', cx);
        $('od-del-line').setAttribute('x2', cx);
        $('od-del-dot').setAttribute('cx', cx);
        $('od-del-dot').setAttribute('cy', cy);
        // baseline marker
        const bp = power(phiHalfDeg, 0);
        $('od-base-dot').setAttribute('cx', x0);
        $('od-base-dot').setAttribute('cy', P2y(bp));
        // ticks
        $('od-tick-mid').textContent = (maxD / 2).toFixed(0) + '°';
        $('od-tick-end').textContent = maxD.toFixed(0) + '°';
        return { opt, cur: cp, base: bp };
    }

    function update() {
        const phiHalf = +phiIn.value;
        const maxD = 90 - phiHalf;
        delIn.setAttribute('max', maxD.toFixed(1));
        if (+delIn.value > maxD) delIn.value = maxD.toFixed(1);
        const delta = +delIn.value;
        $('od-phi-out').textContent = phiHalf + '°';
        $('od-del-out').textContent = delta.toFixed(1) + '°';
        drawScene(phiHalf, delta);
        const { opt, cur, base } = drawPlot(phiHalf, delta);
        const m = lambertOrder(phiHalf);
        const gain = base > 0 ? (opt.P - base) / base * 100 : 0;
        $('od-stats').innerHTML = `
          <div class="stat"><span class="stat-k">${DEMO_TEXT.mOrder}</span><span class="stat-v">m = ${m.toFixed(2)}</span></div>
          <div class="stat"><span class="stat-k">${DEMO_TEXT.deltaOpt}</span><span class="stat-v">${opt.delta.toFixed(1)}°</span></div>
          <div class="stat stat-gain"><span class="stat-k">${DEMO_TEXT.gain}</span><span class="stat-v">+${gain.toFixed(1)}%</span></div>`;
    }

    phiIn.addEventListener('input', update);
    delIn.addEventListener('input', update);
    update();
}

/* ---------------- SA-OPS AUV animation ---------------- */
function initAuvDemo(host) {
    host.innerHTML = `
    <div class="demo-panel demo-ocean">
      <svg class="demo-scene" viewBox="0 0 680 300" role="img" aria-label="SA-OPS mission animation">
        <defs>
          <linearGradient id="auvWater" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#0a2131"></stop>
            <stop offset="1" stop-color="#15415b"></stop>
          </linearGradient>
          <linearGradient id="auvBeamGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="rgba(93,214,232,0.55)"></stop>
            <stop offset="1" stop-color="rgba(93,214,232,0.02)"></stop>
          </linearGradient>
        </defs>
        <rect width="680" height="300" fill="url(#auvWater)" rx="12"></rect>
        <polygon points="70,0 200,0 96,300 0,300" fill="rgba(255,255,255,0.030)"></polygon>
        <polygon points="300,0 360,0 246,300 176,300" fill="rgba(255,255,255,0.022)"></polygon>
        <path d="M0 268 Q 170 250 340 264 T 680 256 L680 300 L0 300 Z" fill="rgba(3,14,23,0.55)"></path>
        <g id="auv-nodes"></g>
        <g id="auv-group">
          <polygon id="auv-beam" class="auv-beam" points="0,0 0,0 0,0" fill="url(#auvBeamGrad)" style="display:none"></polygon>
          <g id="auv-flip">
            <path class="auv-fin" d="M-30 -3 L-42 -13 L-28 -7 Z"></path>
            <path class="auv-fin" d="M-30 3 L-42 13 L-28 7 Z"></path>
            <path class="auv-body" d="M-34 0 Q -34 -12 6 -12 Q 28 -12 40 0 Q 28 12 6 12 Q -34 12 -34 0 Z"></path>
            <path class="auv-tower" d="M-10 -12 Q -9 -22 3 -22 Q 13 -22 14 -12 Z"></path>
            <circle class="auv-port" cx="-18" cy="0" r="2.6"></circle>
            <ellipse class="auv-prop" cx="42" cy="0" rx="3.5" ry="8"></ellipse>
          </g>
        </g>
      </svg>
      <div class="demo-status">
        <span class="status-chip" id="auv-status"></span>
        <span class="status-progress" id="auv-progress"></span>
      </div>
      <div class="demo-caption">${DEMO_TEXT.auvCap}</div>
    </div>`;

    const NODES = [{ x: 520, y: 92 }, { x: 612, y: 208 }, { x: 412, y: 226 }, { x: 258, y: 82 }];
    const state = NODES.map(() => 'awaiting');
    const nodesG = host.querySelector('#auv-nodes');
    const group = host.querySelector('#auv-group');
    const flip = host.querySelector('#auv-flip');
    const beam = host.querySelector('#auv-beam');
    const statusEl = host.querySelector('#auv-status');
    const progressEl = host.querySelector('#auv-progress');
    const nodeG = NODES.map(n => {
        const g = svgEl('g', { transform: `translate(${n.x}, ${n.y})` });
        const halo = svgEl('circle', { r: 13, class: 'node-halo' });
        const dot = svgEl('circle', { r: 6, class: 'node-dot' });
        g.appendChild(halo);
        g.appendChild(dot);
        nodesG.appendChild(g);
        return { g, halo, dot };
    });
    const paint = () => {
        nodeG.forEach((n, i) => {
            n.g.setAttribute('class', state[i] === 'serviced' ? 'node st-serv' : 'node st-await');
        });
    };
    const AUV = { x: 100, y: 160 };
    const SPEED = 170;
    const det = host.closest('details');
    let phase = 'move', target = 0, phaseT = 0, running = false, raf = null, last = 0;
    let vxSign = 1;

    function setBeam(n) {
        const dx = n.x - AUV.x, dy = n.y - AUV.y;
        const d = Math.hypot(dx, dy) || 1;
        const px = -dy / d, py = dx / d, w = 10;
        beam.setAttribute('points', `0,0 ${dx + px * w},${dy + py * w} ${dx - px * w},${dy - py * w}`);
    }
    function setStatus(txt, count) {
        statusEl.textContent = txt;
        progressEl.textContent = count + ' / ' + NODES.length + ' ' + DEMO_TEXT.nodesServiced;
    }
    function ripple(n) {
        const c = svgEl('circle', { cx: n.x, cy: n.y, r: 8, class: 'node-ripple' });
        nodesG.appendChild(c);
        setTimeout(() => c.remove(), 900);
    }
    function step(now) {
        if (!running) { raf = null; return; }
        if (!last) last = now;
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        if (phase === 'move') {
            const n = NODES[target];
            const dx = n.x - AUV.x, dy = n.y - AUV.y;
            const dist = Math.hypot(dx, dy);
            if (dist < SPEED * dt * 1.2 + 6) {
                AUV.x = n.x; AUV.y = n.y;
                phase = 'service';
                phaseT = now;
                beam.style.display = 'block';
                setBeam(n);
                setStatus(DEMO_TEXT.step2, state.filter(s => s === 'serviced').length);
            } else {
                const k = 1 - Math.exp(-dt * 3.4);
                const vx = dx * k, vy = dy * k;
                AUV.x += vx; AUV.y += vy;
                vxSign = vx >= 0 ? 1 : -1;
            }
        } else if (phase === 'service') {
            setBeam(NODES[target]);
            if (now - phaseT > 1050) {
                state[target] = 'serviced';
                paint();
                ripple(NODES[target]);
                beam.style.display = 'none';
                const done = state.filter(s => s === 'serviced').length;
                setStatus(DEMO_TEXT.step1, done);
                let best = -1, bd = Infinity;
                state.forEach((s, i) => {
                    if (s === 'awaiting') {
                        const d = Math.hypot(NODES[i].x - AUV.x, NODES[i].y - AUV.y);
                        if (d < bd) { bd = d; best = i; }
                    }
                });
                if (best >= 0) {
                    target = best;
                    phase = 'move';
                } else {
                    phase = 'wait';
                    phaseT = now;
                    setStatus(DEMO_TEXT.done, done);
                }
            }
        } else if (phase === 'wait') {
            if (now - phaseT > 2200) {
                state.fill('awaiting');
                paint();
                AUV.x = 100; AUV.y = 160;
                vxSign = 1;
                target = 0;
                phase = 'move';
                setStatus(DEMO_TEXT.step1, 0);
            }
        }
        const bob = Math.sin(now * 0.0022) * 2.2;
        group.setAttribute('transform', `translate(${AUV.x}, ${AUV.y + bob})`);
        flip.style.transform = vxSign >= 0 ? 'scaleX(1)' : 'scaleX(-1)';
        flip.style.transformBox = 'fill-box';
        flip.style.transformOrigin = 'center';
        raf = requestAnimationFrame(step);
    }
    const resume = () => {
        if (raf === null) {
            running = true;
            last = 0;
            raf = requestAnimationFrame(step);
        }
    };
    const pause = () => {
        running = false;
        if (raf !== null) { cancelAnimationFrame(raf); raf = null; }
    };
    det.addEventListener('toggle', () => { if (det.open) resume(); else pause(); });
    paint();
    setStatus(DEMO_TEXT.step1, 0);
    resume();
}
