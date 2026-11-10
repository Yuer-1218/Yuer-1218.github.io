const content_dir = 'contents/'
const config_file = 'config.yml'
const section_names = ['home', 'research', 'publications', 'awards']

const urlLang = new URLSearchParams(location.search).get('lang')
const LANG = (urlLang === 'zh' || urlLang === 'en') ? urlLang : (localStorage.getItem('lang') === 'zh' ? 'zh' : 'en')
const content_prefix = LANG === 'zh' ? 'zh/' : ''

const DEMO_TEXT = LANG === 'zh' ? {
    tilt: '接收端倾角 θr',
    order: '光束阶数 m',
    aim: '光束指向 φ',
    gain: '增益',
    naive: '对准视线 (φ=0)',
    optimal: '最优偏角',
    optNone: '倾角为 0 时无需偏角。',
    offsetCap: '简化演示模型：P(φ) ∝ cosᵐ(φ)·cos(φ−θr)。最优指向位于"对准视线（φ=0）"与"接收端法向"之间的某个内点——这正是论文研究的反直觉"偏角指向"效应。',
    auvCap: 'SA-OPS 任务示意动画：AUV 先基于 SNR 发现节点（步骤 1），再根据节点能量状态决定"预充电 / 先通信后充电 / 仅通信"（步骤 2）。仅为可视化示意。',
    step1: '步骤 1：发现与接近',
    step2: '步骤 2：通信与充电',
    done: '全部节点服务完成，即将重新开始…',
} : {
    tilt: 'Receiver tilt θr',
    order: 'Beam order m',
    aim: 'Beam aim φ',
    gain: 'gain',
    naive: 'Perfect alignment (φ=0)',
    optimal: 'Optimal offset',
    optNone: 'Zero tilt needs no offset.',
    offsetCap: 'Simplified illustrative model: P(φ) ∝ cosᵐ(φ)·cos(φ−θr). The optimum aim lies strictly between perfect alignment (φ=0) and the receiver normal — the counter-intuitive "offset pointing" effect studied in the paper.',
    auvCap: 'Illustrative SA-OPS mission: the AUV discovers a node (SNR-based, Step 1), then chooses among charge / communicate / both based on the node energy state (Step 2). For visualization only.',
    step1: 'Step 1: find & approach',
    step2: 'Step 2: communicate & charge',
    done: 'All nodes serviced — restarting…',
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
                h.lastChild.textContent = ' ' + headMap[id];
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
        }).catch(() => {});
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

/* ---------------- Offset pointing demo ---------------- */
function initOffsetDemo(host) {
    host.innerHTML = `
      <div class="demo-controls">
        <label>${DEMO_TEXT.tilt} <input type="range" id="od-tilt" min="0" max="60" value="30" step="1"><output id="od-tilt-out">30°</output></label>
        <label>${DEMO_TEXT.order} <input type="range" id="od-m" min="1" max="16" value="4" step="1"><output id="od-m-out">4</output></label>
        <label>${DEMO_TEXT.aim} <input type="range" id="od-phi" min="0" max="60" value="0" step="1"><output id="od-phi-out">0°</output></label>
      </div>
      <svg class="demo-svg" viewBox="0 0 660 240">
        <line x1="70" y1="120" x2="560" y2="120" stroke="#9db4c0" stroke-dasharray="6 5"/>
        <polygon id="od-beam" points="0,0 0,0 0,0" fill="rgba(54,182,200,0.20)" stroke="rgba(54,182,200,0.45)"/>
        <line id="od-axis" x1="70" y1="120" x2="70" y2="120" stroke="#36b6c8" stroke-width="1.5"/>
        <circle cx="70" cy="120" r="9" fill="#37474f"/>
        <text x="70" y="150" text-anchor="middle" font-size="13" fill="#37474f">Tx</text>
        <line id="od-disc" x1="560" y1="120" x2="560" y2="120" stroke="#701e5e" stroke-width="5" stroke-linecap="round"/>
        <circle cx="560" cy="120" r="3.5" fill="#701e5e"/>
        <line id="od-normal" x1="560" y1="120" x2="560" y2="120" stroke="#c2185b" stroke-width="1.6"/>
        <text id="od-normal-label" x="0" y="0" font-size="13" fill="#c2185b">n</text>
        <text x="560" y="150" text-anchor="middle" font-size="13" fill="#701e5e">Rx</text>
      </svg>
      <svg class="demo-svg demo-plot" viewBox="0 0 660 150">
        <line x1="60" y1="120" x2="620" y2="120" stroke="#c9c9c9" stroke-width="1"/>
        <line x1="60" y1="18" x2="60" y2="120" stroke="#c9c9c9" stroke-width="1"/>
        <text x="60" y="140" text-anchor="middle" font-size="11" fill="#888">0°</text>
        <text x="340" y="140" text-anchor="middle" font-size="11" fill="#888">30°</text>
        <text x="620" y="140" text-anchor="middle" font-size="11" fill="#888">60°</text>
        <text x="16" y="24" font-size="11" fill="#888">P</text>
        <polyline id="od-curve" fill="none" stroke="#36b6c8" stroke-width="2" points=""/>
        <line id="od-opt-line" x1="0" y1="18" x2="0" y2="120" stroke="#701e5e" stroke-dasharray="4 4"/>
        <circle id="od-opt-dot" cx="0" cy="0" r="4" fill="#701e5e"/>
        <line id="od-cur-line" x1="0" y1="18" x2="0" y2="120" stroke="#c2185b" stroke-dasharray="2 3"/>
        <circle id="od-cur-dot" cx="0" cy="0" r="4" fill="#c2185b"/>
      </svg>
      <div class="demo-readout" id="od-readout"></div>
      <div class="demo-caption">${DEMO_TEXT.offsetCap}</div>
    `;
    const $ = id => host.querySelector('#' + id);
    const tilt = $('od-tilt'), mIn = $('od-m'), phi = $('od-phi');
    function power(phiDeg, tiltDeg, m) {
        const a = phiDeg * Math.PI / 180;
        const b = Math.abs(phiDeg - tiltDeg) * Math.PI / 180;
        return Math.max(0, Math.pow(Math.cos(a), m)) * Math.max(0, Math.cos(b));
    }
    function update() {
        const tiltD = +tilt.value, m = +mIn.value, phiD = +phi.value;
        $('od-tilt-out').textContent = tiltD + '°';
        $('od-m-out').textContent = m;
        $('od-phi-out').textContent = phiD + '°';
        // scene
        const Tx = { x: 70, y: 120 }, Rx = { x: 560, y: 120 };
        const L = 480, half = 7;
        const pt = (ang, len) => [Tx.x + len * Math.cos(ang * Math.PI / 180), Tx.y + len * Math.sin(ang * Math.PI / 180)];
        const p1 = pt(phiD - half, L), p2 = pt(phiD + half, L), ax = pt(phiD, 470);
        $('od-beam').setAttribute('points', `${Tx.x},${Tx.y} ${p1[0]},${p1[1]} ${p2[0]},${p2[1]}`);
        $('od-axis').setAttribute('x2', ax[0]);
        $('od-axis').setAttribute('y2', ax[1]);
        const discAng = (90 + tiltD) * Math.PI / 180, hw = 24;
        $('od-disc').setAttribute('x1', Rx.x - hw * Math.cos(discAng));
        $('od-disc').setAttribute('y1', Rx.y - hw * Math.sin(discAng));
        $('od-disc').setAttribute('x2', Rx.x + hw * Math.cos(discAng));
        $('od-disc').setAttribute('y2', Rx.y + hw * Math.sin(discAng));
        const nAng = (180 + tiltD) * Math.PI / 180, nL = 42;
        $('od-normal').setAttribute('x2', Rx.x + nL * Math.cos(nAng));
        $('od-normal').setAttribute('y2', Rx.y + nL * Math.sin(nAng));
        $('od-normal-label').setAttribute('x', Rx.x + (nL + 16) * Math.cos(nAng) - 4);
        $('od-normal-label').setAttribute('y', Rx.y + (nL + 16) * Math.sin(nAng) + 5);
        // curve
        const x0 = 60, x1 = 620, y0 = 18, y1 = 120;
        let pts = [], bestPhi = 0, bestP = 0;
        for (let p = 0; p <= 60; p += 0.5) {
            const P = power(p, tiltD, m);
            if (P > bestP) { bestP = P; bestPhi = p; }
            const px = x0 + (p / 60) * (x1 - x0);
            const py = y1 - P * (y1 - y0);
            pts.push(px.toFixed(1) + ',' + py.toFixed(1));
        }
        $('od-curve').setAttribute('points', pts.join(' '));
        const optPx = x0 + (bestPhi / 60) * (x1 - x0);
        const optPy = y1 - bestP * (y1 - y0);
        $('od-opt-line').setAttribute('x1', optPx);
        $('od-opt-line').setAttribute('x2', optPx);
        $('od-opt-dot').setAttribute('cx', optPx);
        $('od-opt-dot').setAttribute('cy', optPy);
        const curP = power(phiD, tiltD, m);
        const curPx = x0 + (phiD / 60) * (x1 - x0);
        const curPy = y1 - curP * (y1 - y0);
        $('od-cur-line').setAttribute('x1', curPx);
        $('od-cur-line').setAttribute('x2', curPx);
        $('od-cur-dot').setAttribute('cx', curPx);
        $('od-cur-dot').setAttribute('cy', curPy);
        // readout
        const naive = power(0, tiltD, m);
        const gain = naive > 0 ? (bestP - naive) / naive * 100 : 0;
        const noOffset = tiltD === 0 ? DEMO_TEXT.optNone + ' ' : '';
        $('od-readout').innerHTML = `${noOffset}${DEMO_TEXT.naive}: <strong>${(naive * 100).toFixed(1)}%</strong> · ${DEMO_TEXT.optimal} (φ*=${bestPhi.toFixed(0)}°): <strong>${(bestP * 100).toFixed(1)}%</strong> · ${DEMO_TEXT.gain}: <strong>+${gain.toFixed(1)}%</strong>`;
    }
    [tilt, mIn, phi].forEach(el => el.addEventListener('input', update));
    update();
}

/* ---------------- SA-OPS AUV animation ---------------- */
function initAuvDemo(host) {
    host.innerHTML = `
      <svg class="demo-svg" viewBox="0 0 660 260">
        <defs>
          <linearGradient id="auv-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#0e2233"/>
            <stop offset="1" stop-color="#17394f"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="660" height="260" rx="8" fill="url(#auv-water)"/>
        <g id="auv-nodes"></g>
        <g id="auv-group">
          <polygon id="auv-beam" points="0,0 0,0 0,0" fill="rgba(77,208,225,0.35)" style="display:none"/>
          <ellipse cx="0" cy="0" rx="26" ry="10" fill="#cfd8dc"/>
          <rect x="-2" y="-17" width="11" height="9" rx="3" fill="#b0bec5"/>
          <circle cx="-14" cy="0" r="2.4" fill="#4dd0e1"/>
          <polygon points="26,0 36,-6 36,6" fill="#b0bec5"/>
        </g>
      </svg>
      <div class="demo-readout" id="auv-readout"></div>
      <div class="demo-caption">${DEMO_TEXT.auvCap}</div>
    `;
    const NODES = [{ x: 520, y: 80 }, { x: 600, y: 200 }, { x: 420, y: 195 }, { x: 280, y: 70 }];
    const state = NODES.map(() => 'awaiting');
    const group = host.querySelector('#auv-group');
    const beam = host.querySelector('#auv-beam');
    const nodesG = host.querySelector('#auv-nodes');
    const readout = host.querySelector('#auv-readout');
    const circles = NODES.map(n => {
        const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        c.setAttribute('cx', n.x);
        c.setAttribute('cy', n.y);
        c.setAttribute('r', 7);
        nodesG.appendChild(c);
        return c;
    });
    const paint = () => circles.forEach((c, i) => {
        c.setAttribute('fill', state[i] === 'serviced' ? '#66bb6a' : '#ffd54f');
    });
    const AUV = { x: 90, y: 130 };
    const SPEED = 160;
    let phase = 'move', target = 0, phaseT = 0, running = false, raf = null;
    const det = host.closest('details');
    const setBeam = (n) => {
        const dx = n.x - AUV.x, dy = n.y - AUV.y;
        const d = Math.hypot(dx, dy) || 1;
        const px = -dy / d, py = dx / d, w = 9;
        beam.setAttribute('points', `${AUV.x},${AUV.y} ${n.x + px * w},${n.y + py * w} ${n.x - px * w},${n.y - py * w}`);
    };
    let last = 0;
    function step(now) {
        if (!running) { raf = null; return; }
        if (!last) last = now;
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        if (phase === 'move') {
            const n = NODES[target];
            const dx = n.x - AUV.x, dy = n.y - AUV.y;
            const dist = Math.hypot(dx, dy);
            const v = SPEED * dt;
            if (dist <= Math.max(v, 4)) {
                AUV.x = n.x; AUV.y = n.y;
                phase = 'service';
                phaseT = now;
                beam.style.display = 'block';
                setBeam(n);
                readout.textContent = DEMO_TEXT.step2;
            } else {
                AUV.x += dx / dist * v;
                AUV.y += dy / dist * v;
            }
        } else if (phase === 'service') {
            setBeam(NODES[target]);
            if (now - phaseT > 1100) {
                state[target] = 'serviced';
                paint();
                beam.style.display = 'none';
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
                    readout.textContent = DEMO_TEXT.step1;
                } else {
                    phase = 'wait';
                    phaseT = now;
                    readout.textContent = DEMO_TEXT.done;
                }
            }
        } else if (phase === 'wait') {
            if (now - phaseT > 2200) {
                state.fill('awaiting');
                paint();
                AUV.x = 90; AUV.y = 130;
                target = 0;
                phase = 'move';
                readout.textContent = DEMO_TEXT.step1;
            }
        }
        group.setAttribute('transform', `translate(${AUV.x}, ${AUV.y})`);
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
    readout.textContent = DEMO_TEXT.step1;
    resume();
}
