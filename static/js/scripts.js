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
    distCenter: '分布中心',
    beamAxis: 'Tx 光轴',
    distFan: '节点分布（均匀 PPP）',
    modelNote: '随机节点/朝向模型下的期望接收功率（论文式 33）：P(δ) ∝ cos^(m+1)(δ) − cos^(m+1)(δ+φ½)，其中 m = −ln2/ln cos(φ½)，δ 为 Tx 光轴与节点分布中心之间的夹角，且 δ+φ½ ≤ 90°。关键假设：节点服从均匀 PPP（体积密度恒定）——对径向积分后单位立体角内密度恒定，折算到每度角度密度 ∝ sinθ（球坐标雅可比），离中心轴越远越密——这正是偏转光轴可以收集到更多节点的原因。',
    fDiscover: '发现节点',
    fEnergy: '读取能量状态',
    fPre: '预充电',
    fMid: '先通信后充电',
    fPost: '仅通信',
    fServiced: '服务完成',
    narrPre: '发现节点 · E = {e}% 低于阈值 → 预充电，随后通信',
    narrMid: '发现节点 · E = {e}% 处于正常范围 → 先通信后充电',
    narrPost: '发现节点 · E = {e}% 电量健康 → 仅通信',
    serviced: '服务完成 · 前往下一个节点…',
    flowCap: 'SA-OPS 决策流程示意：根据节点实时能量状态，在三种动作中选择其一（论文 §III-E）。',
} : {
    phiHalf: 'Half-power angle φ½',
    delta: 'Pointing offset δ',
    deltaOpt: 'Optimal offset δ_opt',
    gain: 'Gain vs perfect alignment',
    mOrder: 'Lambertian order',
    distCenter: 'Distribution center',
    beamAxis: 'Tx optical axis',
    distFan: 'Node distribution (homogeneous PPP)',
    modelNote: 'Expected received power under the random node/orientation model, Eq. (33): P(δ) ∝ cos^(m+1)(δ) − cos^(m+1)(δ+φ½), with m = −ln2 / ln cos(φ½); δ is the angle between the Tx optical axis and the node-distribution center, and δ+φ½ ≤ 90°. Key assumption: a homogeneous PPP (constant volume density) — after marginalizing over range this gives a constant density per unit solid angle, i.e. per-degree density ∝ sinθ (the spherical Jacobian), so nodes get denser away from the center axis. That is why offsetting the axis can collect more nodes.',
    fDiscover: 'Discover node',
    fEnergy: 'Read energy state',
    fPre: 'Preemptive charging',
    fMid: 'Communicate, then charge',
    fPost: 'Communicate only',
    fServiced: 'Serviced',
    narrPre: 'Node found · E = {e}% below threshold → preemptive charging, then communication',
    narrMid: 'Node found · E = {e}% in normal range → communicate, then charge',
    narrPost: 'Node found · E = {e}% healthy → communicate only',
    serviced: 'Serviced · moving to the next node…',
    flowCap: 'SA-OPS decision flow: one of three actions is selected from the node\'s real-time energy state (paper §III-E).',
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
    const TX = { x: 90, y: 150 };
    const R = 150; // fan radius (fixed so the scene never gets clipped)

    // deterministic node cloud — FIXED deployment, independent of the beam width.
    // Uniform over solid angle ⇒ per-degree density ∝ sinθ (sparser near the axis).
    const DIST_MAX = 80; // fixed angular extent of the distribution (degrees, half-fan)
    function cloudPoints(n) {
        let seed = 421;
        const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
        const cosMax = Math.cos(DIST_MAX * Math.PI / 180);
        const pts = [];
        for (let i = 0; i < n; i++) {
            const u = rnd();
            const ang = Math.acos(1 - u * (1 - cosMax)) * 180 / Math.PI; // density ∝ sinθ
            const sign = rnd() < 0.5 ? -1 : 1;
            const rr = 0.15 + rnd() * 0.85;
            const s = 1.6 + rnd() * 1.8;
            const o = 0.25 + rnd() * 0.45;
            pts.push({ ang: sign * ang, rr, s, o });
        }
        return pts;
    }
    const cloud = cloudPoints(56);

    host.innerHTML = `
    <div class="demo-panel">
      <svg class="demo-scene" viewBox="0 0 680 300" role="img" aria-label="Tx optical axis versus node distribution">
        <defs>
          <linearGradient id="odBeamGrad" x1="0" y1="0" x2="0" y2="1">
            <stop class="od-stop-a" offset="0"></stop>
            <stop class="od-stop-b" offset="0.5"></stop>
            <stop class="od-stop-a" offset="1"></stop>
          </linearGradient>
        </defs>
        <path id="od-dist" class="od-dist" d=""></path>
        <g id="od-cloud"></g>
        <path id="od-beam" d="" fill="url(#odBeamGrad)"></path>
        <line id="od-dist-axis" class="od-dist-axis" x1="0" y1="0" x2="0" y2="0"></line>
        <line id="od-beam-axis" class="od-beam-axis" x1="0" y1="0" x2="0" y2="0"></line>
        <path id="od-delta-arc" class="od-delta-arc" d=""></path>
        <text id="od-delta-label" class="od-delta-label" x="0" y="0"></text>
        <text id="od-dist-label" class="od-label-sm" x="0" y="0"></text>
        <text id="od-beam-label" class="od-label-sm" x="0" y="0"></text>
        <text id="od-fan-label" class="od-label-sm" x="0" y="0"></text>
        <text id="od-distfan-label" class="od-label-sm" x="0" y="0"></text>
        <g class="od-tx">
          <circle cx="90" cy="150" r="7" class="od-tx-dot"></circle>
          <circle cx="90" cy="150" r="13" class="od-tx-ring"></circle>
          <path d="M 108 137 A 18 18 0 0 1 108 163" class="od-tx-wave"></path>
          <path d="M 115 130 A 27 27 0 0 1 115 170" class="od-tx-wave"></path>
        </g>
        <text x="90" y="188" class="od-label" text-anchor="middle">Tx</text>
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

    const polar = (angDeg, r) => [TX.x + r * Math.cos(angDeg * Math.PI / 180), TX.y + r * Math.sin(angDeg * Math.PI / 180)];

    function drawScene(phiHalfDeg, deltaDeg) {
        // fixed radius → constant scene size, nothing gets clipped
        // node distribution sector: FIXED ±DIST_MAX, independent of the beam width
        const s1 = polar(-DIST_MAX, R), s2 = polar(DIST_MAX, R);
        $('od-dist').setAttribute('d', `M ${TX.x} ${TX.y} L ${s1[0]} ${s1[1]} A ${R} ${R} 0 0 1 ${s2[0]} ${s2[1]} Z`);
        // beam sector: half-power angle φ½, axis offset δ from the distribution center
        const b1 = polar(deltaDeg - phiHalfDeg, R), b2 = polar(deltaDeg + phiHalfDeg, R);
        $('od-beam').setAttribute('d', `M ${TX.x} ${TX.y} L ${b1[0]} ${b1[1]} A ${R} ${R} 0 0 1 ${b2[0]} ${b2[1]} Z`);
        // axes: distribution-center axis vs Tx optical axis
        const da = polar(0, R + 24);
        $('od-dist-axis').setAttribute('x1', TX.x);
        $('od-dist-axis').setAttribute('y1', TX.y);
        $('od-dist-axis').setAttribute('x2', da[0]);
        $('od-dist-axis').setAttribute('y2', da[1]);
        const ba = polar(deltaDeg, R + 24);
        $('od-beam-axis').setAttribute('x1', TX.x);
        $('od-beam-axis').setAttribute('y1', TX.y);
        $('od-beam-axis').setAttribute('x2', ba[0]);
        $('od-beam-axis').setAttribute('y2', ba[1]);
        // δ arc between the two axes
        if (deltaDeg > 1) {
            const r = 66;
            const q1 = polar(0, r), q2 = polar(deltaDeg, r);
            $('od-delta-arc').setAttribute('d', `M ${q1[0]} ${q1[1]} A ${r} ${r} 0 0 1 ${q2[0]} ${q2[1]}`);
            const mid = polar(deltaDeg / 2, r + 15);
            $('od-delta-label').setAttribute('x', mid[0]);
            $('od-delta-label').setAttribute('y', mid[1] + 4);
            $('od-delta-label').textContent = 'δ';
        } else {
            $('od-delta-arc').setAttribute('d', '');
            $('od-delta-label').textContent = '';
        }
        // labels
        const dl = polar(0, R + 48);
        $('od-dist-label').setAttribute('x', dl[0] - 8);
        $('od-dist-label').setAttribute('y', dl[1] + 16);
        $('od-dist-label').textContent = DEMO_TEXT.distCenter;
        const bl = polar(deltaDeg, R + 44);
        $('od-beam-label').setAttribute('x', bl[0] - 10);
        $('od-beam-label').setAttribute('y', bl[1] - 8);
        $('od-beam-label').textContent = DEMO_TEXT.beamAxis;
        const fl = polar(deltaDeg - phiHalfDeg, R + 14);
        $('od-fan-label').setAttribute('x', fl[0] - 6);
        $('od-fan-label').setAttribute('y', fl[1] + 2);
        $('od-fan-label').textContent = 'φ½';
        const df = polar(-DIST_MAX, R + 12);
        $('od-distfan-label').setAttribute('x', df[0] - 10);
        $('od-distfan-label').setAttribute('y', df[1] + 14);
        $('od-distfan-label').textContent = DEMO_TEXT.distFan;
        // node cloud: fixed angles (independent of φ½)
        dots.forEach(({ c, p }) => {
            const ang = p.ang * Math.PI / 180;
            const d = 26 + p.rr * (R - 30);
            c.setAttribute('cx', TX.x + d * Math.cos(ang));
            c.setAttribute('cy', TX.y + d * Math.sin(ang));
        });
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
        const ox = P2x(opt.delta), oy = P2y(pmax);
        $('od-opt-line').setAttribute('x1', ox);
        $('od-opt-line').setAttribute('x2', ox);
        $('od-opt-dot').setAttribute('cx', ox);
        $('od-opt-dot').setAttribute('cy', oy);
        const optLab = $('od-opt-label');
        optLab.setAttribute('x', Math.min(ox + 6, x1 - 90));
        optLab.setAttribute('y', Math.max(oy - 8, 26));
        optLab.textContent = 'δ_opt = ' + opt.delta.toFixed(1) + '°';
        const cp = power(phiHalfDeg, deltaDeg);
        const cx = P2x(deltaDeg), cy = P2y(cp);
        $('od-del-line').setAttribute('x1', cx);
        $('od-del-line').setAttribute('x2', cx);
        $('od-del-dot').setAttribute('cx', cx);
        $('od-del-dot').setAttribute('cy', cy);
        const bp = power(phiHalfDeg, 0);
        $('od-base-dot').setAttribute('cx', x0);
        $('od-base-dot').setAttribute('cy', P2y(bp));
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

/* ---------------- SA-OPS decision-flow animation ---------------- */
function initAuvDemo(host) {
    const BOX_H = 42;
    const BRANCHES = [
        { id: 'box-br0', y: 34, label: DEMO_TEXT.fPre, e: 12, narr: DEMO_TEXT.narrPre },
        { id: 'box-br1', y: 108, label: DEMO_TEXT.fMid, e: 45, narr: DEMO_TEXT.narrMid },
        { id: 'box-br2', y: 182, label: DEMO_TEXT.fPost, e: 82, narr: DEMO_TEXT.narrPost },
    ];
    const BOXES = [
        { id: 'box-a', x: 18, y: 105, w: 120, h: BOX_H, label: DEMO_TEXT.fDiscover },
        { id: 'box-b', x: 178, y: 105, w: 140, h: BOX_H, label: DEMO_TEXT.fEnergy },
        ...BRANCHES.map(b => ({ id: b.id, x: 362, y: b.y, w: 186, h: 36, label: b.label })),
        { id: 'box-c', x: 582, y: 105, w: 84, h: BOX_H, label: DEMO_TEXT.fServiced },
    ];
    const rects = {}, labels = {};
    const svgNS = SVGS;

    host.innerHTML = `
    <div class="demo-panel">
      <svg class="demo-scene" viewBox="0 0 680 280" role="img" aria-label="SA-OPS decision flow">
        <defs>
          <marker id="flowArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
            <path class="flow-arrow-head" d="M0 0L10 5L0 10z"></path>
          </marker>
        </defs>
        <g id="flow-boxes"></g>
        <g class="flow-arrows">
          <path class="flow-arrow" marker-end="url(#flowArrow)" d="M 138 126 L 172 126"></path>
          <path class="flow-arrow" marker-end="url(#flowArrow)" d="M 318 120 L 356 52"></path>
          <path class="flow-arrow" marker-end="url(#flowArrow)" d="M 318 126 L 356 126"></path>
          <path class="flow-arrow" marker-end="url(#flowArrow)" d="M 318 132 L 356 200"></path>
          <path class="flow-arrow" marker-end="url(#flowArrow)" d="M 548 52 L 578 118"></path>
          <path class="flow-arrow" marker-end="url(#flowArrow)" d="M 548 126 L 578 126"></path>
          <path class="flow-arrow" marker-end="url(#flowArrow)" d="M 548 200 L 578 134"></path>
          <path class="flow-arrow flow-wrap" marker-end="url(#flowArrow)" d="M 624 147 L 624 258 L 78 258 L 78 151"></path>
        </g>
        <circle id="flow-dot" class="flow-dot" r="5.5" cx="78" cy="126"></circle>
      </svg>
      <div class="demo-status">
        <span class="status-chip" id="flow-status"></span>
      </div>
      <div class="demo-caption">${DEMO_TEXT.flowCap}</div>
    </div>`;

    const boxesG = host.querySelector('#flow-boxes');
    const dot = host.querySelector('#flow-dot');
    const statusEl = host.querySelector('#flow-status');
    BOXES.forEach(b => {
        const rect = svgEl('rect', { x: b.x, y: b.y, width: b.w, height: b.h, rx: 9, class: 'flow-box' });
        const label = svgEl('text', { x: b.x + b.w / 2, y: b.y + b.h / 2 + 4, class: 'flow-label' });
        label.textContent = b.label;
        boxesG.appendChild(rect);
        boxesG.appendChild(label);
        rects[b.id] = rect;
        labels[b.id] = label;
    });

    const det = host.closest('details');
    let running = false, raf = null, last = 0;
    let scenario = 0, phaseIdx = 0, phaseT = 0;
    const PHASE_DUR = [850, 900, 900, 1250];

    function framesFor(s) {
        const cb = BRANCHES[s].y + 18;
        return [
            { pts: [[78, 126], [248, 126]], active: 'box-a' },
            { pts: [[248, 126], [455, cb]], active: 'box-b' },
            { pts: [[455, cb], [624, 126]], active: BRANCHES[s].id },
            { pts: [[624, 126], [624, 258], [78, 258], [78, 126]], active: 'box-c' },
        ];
    }
    function setActive(id) {
        BOXES.forEach(b => rects[b.id].classList.toggle('active', b.id === id));
    }
    function pointOn(pts, f) {
        let total = 0;
        const lens = [];
        for (let i = 1; i < pts.length; i++) {
            const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
            lens.push(l); total += l;
        }
        let rem = f * total;
        for (let i = 0; i < lens.length; i++) {
            if (rem <= lens[i] || i === lens.length - 1) {
                const g = lens[i] === 0 ? 0 : Math.min(1, rem / lens[i]);
                return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * g, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * g];
            }
            rem -= lens[i];
        }
        return pts[pts.length - 1];
    }
    function startScenario(now) {
        const br = BRANCHES[scenario];
        statusEl.textContent = br.narr.replace('{e}', br.e);
        phaseIdx = 0;
        phaseT = now;
    }
    function step(now) {
        if (!running) { raf = null; return; }
        if (!phaseT) startScenario(now);
        const frames = framesFor(scenario);
        const frame = frames[phaseIdx];
        const dur = PHASE_DUR[phaseIdx];
        const f = Math.min(1, (now - phaseT) / dur);
        const pos = pointOn(frame.pts, f);
        dot.setAttribute('cx', pos[0]);
        dot.setAttribute('cy', pos[1]);
        setActive(frame.active);
        if (f >= 1) {
            phaseIdx++;
            phaseT = now;
            if (phaseIdx >= frames.length) {
                scenario = (scenario + 1) % BRANCHES.length;
                phaseIdx = 0;
                startScenario(now);
            }
        }
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
        phaseT = 0;
        setActive(null);
    };
    det.addEventListener('toggle', () => { if (det.open) resume(); else pause(); });
    resume();
}
