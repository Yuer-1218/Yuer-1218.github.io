<div class="research-list">

<div class="research-card">
  <div class="research-head">
    <span class="research-venue">IEEE Internet of Things Journal 2026</span>
    <h4 class="research-title">Offset Pointing for Energy-Efficient Reception in Underwater Optical Wireless Communication</h4>
  </div>
  <div class="research-body">
    <img class="research-fig" src="static/assets/img/research_iotj.png" alt="UWOC system model">
    <p>基于三维截断泊松点过程的 UWOC 随机几何框架，刻画水下环境的各向异性（Lambertian 发射、随机接收朝向、含消光效应的信道模型）。推导最近邻距离、接收功率、SNR、BER 等闭式性能指标，并揭示一个反直觉的结论：<em>"有意偏角"</em>（offset pointing）——将接收端故意偏移一个确定性最优角度——反而能最大化接收孔径上的积分功率，可将达到目标 BER 所需的发射功率降低近 20%。<span class="research-note">第一作者；vol. 13, no. 11, pp. 24777-24791.</span></p>
  </div>
  <div class="research-links">
    <a href="https://arxiv.org/abs/2603.10822" target="_blank" rel="noopener">arXiv</a>
    <a href="https://ieeexplore.ieee.org/document/11433693" target="_blank" rel="noopener">IEEE Xplore</a>
  </div>
  <details class="expander">
    <summary>详情与引用</summary>
    <div class="expander-body">
      <p><strong>Abstract.</strong> Underwater Wireless Optical Communication is a key enabling technology for future space-air-ground-sea integrated networks. However, UOWC faces critical hurdles from spatial randomness and stringent energy constraints. These challenges fundamentally limit network lifetime and sustainability. This paper develops a comprehensive stochastic geometry framework to perform a differential energy analysis of UOWC links. Instead of relying on simplified models, we employ a three-dimensional truncated Poisson point process to accurately capture the anisotropic nature of the underwater environment, specifically the disparity between horizontal spread and vertical depth. It incorporates a Lambertian emission pattern, random receiver positions and orientations, and a realistic channel model with extinction effects. Under this model, we derive a full suite of closed-form expressions for key performance indicators, including the nearest-neighbor distance distribution, expected received power, SNR, and BER. A principal and counter-intuitive finding of our analysis is an offset-pointing strategy: intentionally misaligning the receiver by a deterministically optimal angle maximizes the integrated received power across the aperture, contrary to the conventional pursuit of perfect alignment. We formulate and solve an energy-efficiency optimization problem; results show the optimal offset strategy can reduce the required transmit power by nearly 20% to achieve a target BER, extending network lifetime and total data throughput.</p>
      <pre class="bibtex">@article{ma2026offset,
  title   = {Offset Pointing for Energy-Efficient Reception in Underwater Optical Wireless Communication: Modeling and Performance Analysis},
  author  = {Ma, Qiyu and Xu, Jiajie and Alouini, Mohamed-Slim},
  journal = {IEEE Internet of Things Journal},
  volume  = {13},
  number  = {11},
  pages   = {24777--24791},
  year    = {2026}
}</pre>
      <button type="button" class="cite-btn">复制 BibTeX</button>
    </div>
  </details>
  <details class="expander demo-wrap">
    <summary>交互演示：偏角指向</summary>
    <div class="demo" data-demo="offset">正在加载交互演示…</div>
  </details>
</div>

<div class="research-card">
  <div class="research-head">
    <span class="research-venue">IEEE TMC 2026 - 已接收</span>
    <h4 class="research-title">Integrated Discovery and State-Aware Servicing for Mobile AUVs With UOWC</h4>
  </div>
  <div class="research-body">
    <img class="research-fig" src="static/assets/img/research_tmc.png" alt="AUV mission framework">
    <p>面向随机分布水下传感节点的移动 AUV 任务级框架：AUV 先基于 SNR 模型发现节点，再依据节点实时能量状态在"预充电 / 先通信后充电 / 仅通信"三种动作中选择（<em>SA-OPS</em> 状态感知最优服务策略）。仿真与多准则决策分析表明，该策略能改善 AUV 能耗与全网能量健康度之间的权衡，并给出可工程化的充电阈值启发式规则。<span class="research-note">第一作者。</span></p>
  </div>
  <div class="research-links">
    <a href="https://arxiv.org/abs/2607.15183" target="_blank" rel="noopener">arXiv</a>
    <a href="https://ieeexplore.ieee.org/document/11727038" target="_blank" rel="noopener">IEEE Xplore</a>
    <a href="https://github.com/Yuer-1218/SA-OPS" target="_blank" rel="noopener">代码</a>
  </div>
  <details class="expander">
    <summary>详情与引用</summary>
    <div class="expander-body">
      <p><strong>Abstract.</strong> Underwater wireless optical communication (UWOC) is an enabling technology for high-throughput subsea networks, yet its long-term deployment is constrained by the finite energy budget of underwater nodes. To address this challenge, we investigate a mobile system wherein an autonomous underwater vehicle (AUV) performs joint wireless information transfer (WIT) and wireless power transfer (WPT) for a network of randomly distributed sensor nodes. This paper develops an integrated mission-level framework that combines stochastic node discovery with state-aware servicing. First, we present an analytical model for node discovery based on a signal-to-noise ratio (SNR) analysis, deriving performance metrics that include the probability distribution of the discovery distance. Second, we introduce a threshold-based scheduling framework, termed State-Aware Optimal Point Servicing (SA-OPS), which selects one of three actions according to the node's real-time energy state: preemptive charging, communication followed by charging, or communication only. Simulations and multi-criteria decision analysis show that, under the considered assumptions and parameter ranges, SA-OPS can improve the tradeoff between AUV energy expenditure and network-wide energy health relative to the adopted baseline strategies. The results also indicate that the selected charging threshold can be approximated by a simple state-dependent heuristic, providing a practical guideline for autonomous energy replenishment in underwater networks.</p>
      <pre class="bibtex">@article{ma2026integrated,
  title   = {Integrated Discovery and State-Aware Servicing for Mobile AUVs With UOWC: Modeling and Performance Analysis},
  author  = {Ma, Qiyu and Xu, Jiajie and Alouini, Mohamed-Slim},
  journal = {IEEE Transactions on Mobile Computing},
  year    = {2026},
  note    = {Early access}
}</pre>
      <button type="button" class="cite-btn">复制 BibTeX</button>
    </div>
  </details>
  <details class="expander demo-wrap">
    <summary>动画演示：SA-OPS 任务</summary>
    <div class="demo" data-demo="auv">正在加载动画…</div>
  </details>
</div>

<div class="research-card">
  <div class="research-head">
    <span class="research-venue">IEEE GLOBECOM 2025</span>
    <h4 class="research-title">Large AI Model-Enabled Generative Semantic Communications for Image Transmission</h4>
  </div>
  <div class="research-body">
    <img class="research-fig" src="static/assets/img/research_ai.png" alt="Generative semantic communication system">
    <p>生成式语义通信系统：将图像分割为关键区域与非关键区域，关键区经图像语义编码器处理，非关键区通过"图转文"建模高效压缩；结合量化与 LoRA 微调的轻量化部署策略，兼顾边缘设备的存储与算力限制，在低 SNR 等恶劣信道下显著优于传统 DeepJSCC。<span class="research-note">第一作者。</span></p>
  </div>
  <div class="research-links">
    <a href="https://arxiv.org/abs/2509.21394" target="_blank" rel="noopener">arXiv</a>
    <a href="https://ieeexplore.ieee.org/document/11432458" target="_blank" rel="noopener">IEEE Xplore</a>
    <a href="static/files/GLOBECOM2025_slides.pdf" target="_blank" rel="noopener">幻灯片</a>
  </div>
  <details class="expander">
    <summary>详情与引用</summary>
    <div class="expander-body">
      <p><strong>Abstract.</strong> The rapid development of generative artificial intelligence (AI) has introduced significant opportunities for enhancing the efficiency and accuracy of image transmission within semantic communication systems. Despite these advancements, existing methodologies often neglect the difference in importance of different regions of the image, potentially compromising the reconstruction quality of visually critical content. To address this issue, we introduce an innovative generative semantic communication system that refines semantic granularity by segmenting images into key and non-key regions. Key regions, which contain essential visual information, are processed using an image-oriented semantic encoder, while non-key regions are efficiently compressed through an image-to-text modeling approach. Additionally, to mitigate the substantial storage and computational demands posed by large AI models, the proposed system employs a lightweight deployment strategy incorporating model quantization and low-rank adaptation fine-tuning techniques, significantly boosting resource utilization without sacrificing performance. Simulation results demonstrate that the proposed system outperforms traditional methods in terms of both semantic fidelity and visual quality, thereby affirming its effectiveness for image transmission tasks.</p>
      <pre class="bibtex">@inproceedings{ma2025large,
  title     = {Large AI Model-Enabled Generative Semantic Communications for Image Transmission},
  author    = {Ma, Qiyu and Ni, Wanli and Qin, Zhijin},
  booktitle = {Proc. IEEE Global Communications Conference (GLOBECOM)},
  publisher = {IEEE},
  pages     = {6364--6369},
  year      = {2025}
}</pre>
      <button type="button" class="cite-btn">复制 BibTeX</button>
    </div>
  </details>
</div>

</div>
