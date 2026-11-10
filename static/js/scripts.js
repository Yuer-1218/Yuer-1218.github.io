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
    annTitle: '图示说明',
    ann1: 'sin u：节点角度密度',
    ann2: 'cosᵐ u：Lambertian 强度',
    ann3: 'g(u)：二者乘积（单峰）',
    ann4: '窗口 [δ, δ+φ½] 积分 = P(δ)',
    gLabel: '机制：g(u) = cosᵐ(u)·sin(u) 上宽度为 φ½ 的滑动窗口',
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
    annTitle: 'Annotations',
    ann1: 'sin u: node angular density',
    ann2: 'cosᵐ u: Lambertian intensity',
    ann3: 'g(u) = product of both (single peak)',
    ann4: 'window [δ, δ+φ½] → P(δ)',
    gLabel: 'Mechanism: width-φ½ window sliding over g(u) = cosᵐ(u)·sin(u)',
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
    // radial schematic: Tx at the origin of an angular (polar) diagram, 0°–90°
    const TXR = { x: 110, y: 300 };
    const R0 = 30, RK = 200; // radial mapping r(u) = R0 + RK * value(u)

    host.innerHTML = `
    <div class="demo-panel">
      <svg class="demo-scene" viewBox="0 0 680 340" role="img" aria-label="Sliding angular window over the received-power density">
        <line class="od-plot-axis" x1="110" y1="300" x2="366" y2="300"></line>
        <line class="od-plot-axis" x1="110" y1="300" x2="110" y2="38"></line>
        <path id="od-rp-arc" class="od-rp-arc" d=""></path>
        <g class="od-tick">
          <line x1="350" y1="300" x2="360" y2="300"></line>
          <line x1="317.8" y1="180" x2="326.6" y2="175"></line>
          <line x1="230" y1="92.2" x2="235" y2="83.5"></line>
          <line x1="110" y1="60" x2="110" y2="50"></line>
        </g>
        <g class="od-label-sm">
          <text x="368" y="305">0°</text>
          <text x="334" y="172">30°</text>
          <text x="243" y="80">60°</text>
          <text x="110" y="40" text-anchor="middle">90°</text>
        </g>
        <path id="od-rp-wedge" class="od-rp-wedge" d=""></path>
        <path id="od-rp-g" class="od-rp-g" d=""></path>
        <line id="od-rp-edge1" class="od-rp-edge" x1="0" y1="0" x2="0" y2="0"></line>
        <line id="od-rp-edge2" class="od-rp-edge" x1="0" y1="0" x2="0" y2="0"></line>
        <line id="od-rp-peak" class="od-g-peak-line" x1="0" y1="0" x2="0" y2="0"></line>
        <circle id="od-rp-dot1" class="od-g-edge" r="4" cx="0" cy="0"></circle>
        <circle id="od-rp-dot2" class="od-g-edge" r="4" cx="0" cy="0"></circle>
        <text id="od-rp-lab-g" class="od-label-sm" x="0" y="0">g(u)</text>
        <text id="od-rp-lab-phi" class="od-label-sm" x="0" y="0"></text>
        <text id="od-rp-lab-delta" class="od-delta-label" x="0" y="0"></text>
        <g class="od-tx">
          <circle cx="110" cy="300" r="6" class="od-tx-dot"></circle>
          <circle cx="110" cy="300" r="11" class="od-tx-ring"></circle>
          <path d="M 125 289 A 15 15 0 0 1 125 311" class="od-tx-wave"></path>
        </g>
        <text x="110" y="322" class="od-label" text-anchor="middle">Tx</text>
        <g class="od-ann">
          <text class="od-ann-title" x="398" y="56">${DEMO_TEXT.annTitle}</text>
          <line class="od-ann-swatch od-swatch-sin" x1="398" y1="82" x2="424" y2="82"></line>
          <text class="od-label-sm" x="432" y="86">${DEMO_TEXT.ann1}</text>
          <line class="od-ann-swatch od-swatch-cos" x1="398" y1="108" x2="424" y2="108"></line>
          <text class="od-label-sm" x="432" y="112">${DEMO_TEXT.ann2}</text>
          <line class="od-ann-swatch od-swatch-prod" x1="398" y1="134" x2="424" y2="134"></line>
          <text class="od-label-sm" x="432" y="138">${DEMO_TEXT.ann3}</text>
          <line class="od-ann-swatch od-swatch-win" x1="398" y1="164" x2="424" y2="164"></line>
          <text class="od-label-sm" x="432" y="168">${DEMO_TEXT.ann4}</text>
        </g>
      </svg>
      <div class="demo-controls">
        <label>${DEMO_TEXT.phiHalf} <input id="od-phi" type="range" min="15" max="75" value="60" step="1"><output id="od-phi-out">60°</output></label>
        <label>${DEMO_TEXT.delta} <input id="od-del" type="range" min="0" max="30" value="0" step="0.5"><output id="od-del-out">0°</output></label>
      </div>
      <svg class="demo-plot" viewBox="0 0 680 190" role="img" aria-label="Density, intensity and their product with a sliding window">
        <text id="od-g-label" class="od-plot-tick" x="70" y="12"></text>
        <line class="od-plot-axis" x1="70" y1="150" x2="648" y2="150"></line>
        <line class="od-plot-axis" x1="70" y1="24" x2="70" y2="150"></line>
        <g class="od-tick">
          <line x1="262.7" y1="150" x2="262.7" y2="156"></line>
          <line x1="455.3" y1="150" x2="455.3" y2="156"></line>
          <line x1="648" y1="150" x2="648" y2="156"></line>
          <line x1="70" y1="87" x2="64" y2="87"></line>
          <line x1="70" y1="24" x2="64" y2="24"></line>
        </g>
        <text class="od-plot-tick" x="70" y="170" text-anchor="middle">0°</text>
        <text class="od-plot-tick" x="262.7" y="170" text-anchor="middle">30°</text>
        <text class="od-plot-tick" x="455.3" y="170" text-anchor="middle">60°</text>
        <text class="od-plot-tick" x="648" y="170" text-anchor="middle">90°</text>
        <text class="od-plot-tick" x="58" y="28" text-anchor="end">1</text>
        <text class="od-plot-tick" x="58" y="91" text-anchor="end">.5</text>
        <text class="od-plot-tick" x="58" y="154" text-anchor="end">0</text>
        <text class="od-plot-tick" x="658" y="146">u</text>
        <rect id="od-g-band" x="0" y="24" width="0" height="126" class="od-g-band"></rect>
        <path id="od-g-fill" class="od-g-fill" d=""></path>
        <path id="od-p-sin" class="od-rp-sin" d=""></path>
        <path id="od-p-cos" class="od-rp-cos" d=""></path>
        <path id="od-g-curve" class="od-g-curve" d=""></path>
        <polyline id="od-g-hi" class="od-g-hi" points=""></polyline>
        <line id="od-g-peak-line" class="od-g-peak-line" x1="0" y1="24" x2="0" y2="150"></line>
        <circle id="od-g-edge1" class="od-g-edge" r="4" cx="0" cy="0"></circle>
        <circle id="od-g-edge2" class="od-g-edge" r="4" cx="0" cy="0"></circle>
      </svg>
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

    function drawRadial(phiHalfDeg, deltaDeg) {
        const m = lambertOrder(phiHalfDeg);
        const gfn = u => Math.pow(Math.cos(u * Math.PI / 180), m) * Math.sin(u * Math.PI / 180);
        let gPeak = -1, uStar = 0;
        for (let u = 0; u <= 90; u += 0.25) {
            const gv = gfn(u);
            if (gv > gPeak) { gPeak = gv; uStar = u; }
        }
        const radius = v => R0 + RK * Math.max(0, Math.min(1, v));
        const pt = (angDeg, r) => [
            TXR.x + r * Math.cos(angDeg * Math.PI / 180),
            TXR.y - r * Math.sin(angDeg * Math.PI / 180)
        ];
        // g profile on a common 0–1 scale (the product is honestly smaller than its factors)
        const pts = [];
        for (let u = 0; u <= 90; u += 1) {
            const q = pt(u, radius(gfn(u)));
            pts.push(`${q[0].toFixed(1)},${q[1].toFixed(1)}`);
        }
        $('od-rp-g').setAttribute('d', 'M ' + pts.join(' L '));
        // guide arc 0°–90°
        const arcR = 245;
        const a1 = pt(0, arcR), a2 = pt(90, arcR);
        $('od-rp-arc').setAttribute('d', `M ${a1[0]} ${a1[1]} A ${arcR} ${arcR} 0 0 0 ${a2[0]} ${a2[1]}`);
        // sliding window [δ, δ+φ½]
        const d1 = deltaDeg, d2 = Math.min(90, deltaDeg + phiHalfDeg);
        const w1 = pt(d1, arcR), w2 = pt(d2, arcR);
        $('od-rp-wedge').setAttribute('d', `M ${TXR.x} ${TXR.y} L ${w1[0]} ${w1[1]} A ${arcR} ${arcR} 0 0 0 ${w2[0]} ${w2[1]} Z`);
        // edge rays + edge dots on the g profile
        const e1 = pt(d1, arcR), e2 = pt(d2, arcR);
        $('od-rp-edge1').setAttribute('x1', TXR.x); $('od-rp-edge1').setAttribute('y1', TXR.y);
        $('od-rp-edge1').setAttribute('x2', e1[0]); $('od-rp-edge1').setAttribute('y2', e1[1]);
        $('od-rp-edge2').setAttribute('x1', TXR.x); $('od-rp-edge2').setAttribute('y1', TXR.y);
        $('od-rp-edge2').setAttribute('x2', e2[0]); $('od-rp-edge2').setAttribute('y2', e2[1]);
        const g1 = pt(d1, radius(gfn(d1))), g2 = pt(d2, radius(gfn(d2)));
        $('od-rp-dot1').setAttribute('cx', g1[0]); $('od-rp-dot1').setAttribute('cy', g1[1]);
        $('od-rp-dot2').setAttribute('cx', g2[0]); $('od-rp-dot2').setAttribute('cy', g2[1]);
        // peak ray
        const pk = pt(uStar, arcR);
        $('od-rp-peak').setAttribute('x1', TXR.x); $('od-rp-peak').setAttribute('y1', TXR.y);
        $('od-rp-peak').setAttribute('x2', pk[0]); $('od-rp-peak').setAttribute('y2', pk[1]);
        // labels
        const gp = pt(uStar, radius(gPeak) + 16);
        $('od-rp-lab-g').setAttribute('x', gp[0] - 8);
        $('od-rp-lab-g').setAttribute('y', gp[1] + 4);
        const dl1 = pt(d1, 74);
        $('od-rp-lab-delta').setAttribute('x', dl1[0] - 2);
        $('od-rp-lab-delta').setAttribute('y', dl1[1] + 13);
        $('od-rp-lab-delta').textContent = 'δ';
        const midLbl = pt(d1 + (d2 - d1) / 2, arcR - 45);
        $('od-rp-lab-phi').setAttribute('x', midLbl[0]);
        $('od-rp-lab-phi').setAttribute('y', midLbl[1] + 4);
        $('od-rp-lab-phi').textContent = 'φ½';
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

    function drawG(phiHalfDeg, deltaDeg) {
        const m = lambertOrder(phiHalfDeg);
        const x0 = 70, x1 = 648, y0 = 24, y1 = 150;
        const U = u => x0 + (u / 90) * (x1 - x0);
        const Y = v => y1 - Math.max(0, Math.min(1, v)) * (y1 - y0);
        const sinF = u => Math.sin(u * Math.PI / 180);
        const cosF = u => Math.pow(Math.cos(u * Math.PI / 180), m);
        const gF = u => sinF(u) * cosF(u);
        let uStar = 0, gPeak = -1;
        for (let u = 0; u <= 90; u += 0.25) {
            const gv = gF(u);
            if (gv > gPeak) { gPeak = gv; uStar = u; }
        }
        const pathFor = fn => {
            const pts = [];
            for (let u = 0; u <= 90; u += 1) pts.push(`${U(u).toFixed(1)},${Y(fn(u)).toFixed(1)}`);
            return 'M ' + pts.join(' L ');
        };
        $('od-p-sin').setAttribute('d', pathFor(sinF));
        $('od-p-cos').setAttribute('d', pathFor(cosF));
        $('od-g-curve').setAttribute('d', pathFor(gF));
        // subtle fill under g
        const fillPts = [`M ${x0} ${y1}`];
        for (let u = 0; u <= 90; u += 1) fillPts.push(`${U(u).toFixed(1)} ${Y(gF(u)).toFixed(1)}`);
        fillPts.push(`${x1} ${y1}`, 'Z');
        $('od-g-fill').setAttribute('d', fillPts.join(' '));
        // sliding window (width φ½) starting at δ
        const d2 = Math.min(90, deltaDeg + phiHalfDeg);
        $('od-g-band').setAttribute('x', U(deltaDeg));
        $('od-g-band').setAttribute('width', Math.max(0, U(d2) - U(deltaDeg)));
        const seg = [];
        for (let u = deltaDeg; u <= d2 + 1e-9; u += 0.5) {
            seg.push(`${U(u).toFixed(1)},${Y(gF(u)).toFixed(1)}`);
        }
        $('od-g-hi').setAttribute('points', seg.join(' '));
        $('od-g-peak-line').setAttribute('x1', U(uStar));
        $('od-g-peak-line').setAttribute('x2', U(uStar));
        $('od-g-edge1').setAttribute('cx', U(deltaDeg));
        $('od-g-edge1').setAttribute('cy', Y(gF(deltaDeg)));
        $('od-g-edge2').setAttribute('cx', U(d2));
        $('od-g-edge2').setAttribute('cy', Y(gF(d2)));
        $('od-g-label').textContent = DEMO_TEXT.gLabel;
    }

    function update() {
        const phiHalf = +phiIn.value;
        const maxD = 90 - phiHalf;
        delIn.setAttribute('max', maxD.toFixed(1));
        if (+delIn.value > maxD) delIn.value = maxD.toFixed(1);
        const delta = +delIn.value;
        $('od-phi-out').textContent = phiHalf + '°';
        $('od-del-out').textContent = delta.toFixed(1) + '°';
        drawRadial(phiHalf, delta);
        drawG(phiHalf, delta);
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
