import React from 'react'
import './AIApproach.css'

const humanSignals = [
  ['01', 'Strategy'],
  ['02', 'Taste'],
  ['03', 'Judgment'],
  ['04', 'Empathy'],
]

const aiSignals = [
  ['01', 'Research'],
  ['02', 'Variation'],
  ['03', 'Automation'],
  ['04', 'Optimization'],
]

const workflow = [
  ['Discover', 'AI scans wider. We decide what matters.'],
  ['Design', 'AI multiplies directions. We protect the taste.'],
  ['Build', 'AI removes repetition. We engineer the experience.'],
  ['Grow', 'AI finds patterns. We choose the next move.'],
]


export default function AIApproach() {
  return (
    <section className="ai-os" id="ai-approach">
      <div className="ai-os__shell">
        <header className="ai-os__intro">
          <div className="ai-os__eyebrow">
            <span>OUR AI APPROACH</span>
            <i />
            <span>HUMAN-LED / AI-ASSISTED</span>
          </div>

          <h2 className="ai-os__heading">
            <span>AI makes us faster.</span>
            <em>Good thinking makes us better.</em>
          </h2>

          <div className="ai-os__intro-row">
            <p>
              We use AI to expand speed, range and possibility — without handing
              over the decisions that shape the work.
            </p>
            <div className="ai-os__mode">
              <span className="ai-os__mode-dot" />
              <span>OPERATING MODE</span>
              <strong>Human judgment at the centre.</strong>
            </div>
          </div>
        </header>

        <div className="ai-os__stage">
          <div className="ai-os__stage-grid" aria-hidden="true" />

          <section className="ai-os__side ai-os__side--human">
            <div className="ai-os__side-head">
              <span>HUMAN</span>
              <strong>Sets the standard.</strong>
            </div>
            <div className="ai-os__signal-list">
              {humanSignals.map(([number, label]) => (
                <div className="ai-os__signal" key={label}>
                  <small>{number}</small>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="ai-os__core" aria-label="LLeveLL intelligence bridge">
            <div className="ai-os__core-orbit ai-os__core-orbit--outer" />
            <div className="ai-os__core-orbit ai-os__core-orbit--inner" />
            <svg
              className="ai-os__brand-logo ai-os__brand-logo--animated"
              viewBox="0 0 1070 222"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="LLeveLL"
            >
              <path className="ai-os__logo-letter" d="M391.367 165.033C381.45 165.033 373.768 162.24 368.321 156.653C363.013 151.066 360.36 143.314 360.36 133.397V8.52854H375.235V132.14C375.235 138.705 376.771 143.733 379.844 147.225C382.917 150.577 387.526 152.253 393.672 152.253C397.583 152.253 400.935 151.625 403.728 150.368L404.776 162.729C400.446 164.265 395.976 165.033 391.367 165.033Z" fill="white" fillOpacity="0.25" />
              <path className="ai-os__logo-letter" d="M435.07 165.033C425.153 165.033 417.471 162.24 412.024 156.653C406.716 151.066 404.062 143.314 404.062 133.397V8.52854H418.938V132.14C418.938 138.705 420.474 143.733 423.547 147.225C426.62 150.577 431.229 152.253 437.375 152.253C441.285 152.253 444.638 151.625 447.431 150.368L448.479 162.729C444.149 164.265 439.679 165.033 435.07 165.033Z" fill="white" fillOpacity="0.75" />
              <path className="ai-os__logo-letter" d="M555.712 151.834C562.556 151.834 568.842 150.647 574.568 148.272C580.435 145.758 585.393 142.127 589.444 137.378L597.824 147.015C592.935 152.882 586.86 157.351 579.597 160.424C572.334 163.497 564.302 165.033 555.503 165.033C544.189 165.033 534.133 162.659 525.333 157.91C516.534 153.021 509.69 146.317 504.801 137.797C499.913 129.277 497.468 119.639 497.468 108.884C497.468 98.1294 499.773 88.4919 504.382 79.9718C509.131 71.4517 515.626 64.8172 523.867 60.0683C532.107 55.3193 541.466 52.9449 551.941 52.9449C561.718 52.9449 570.518 55.1797 578.339 59.6492C586.301 64.1188 592.586 70.3343 597.195 78.2957C601.944 86.2571 604.459 95.336 604.738 105.532L514.229 123.131C517.023 132.07 522.051 139.124 529.314 144.292C536.717 149.32 545.516 151.834 555.712 151.834ZM551.941 65.7251C544.259 65.7251 537.345 67.5408 531.2 71.1724C525.194 74.6642 520.445 79.6226 516.953 86.0476C513.601 92.333 511.924 99.596 511.924 107.837C511.924 109.932 511.994 111.468 512.134 112.446L589.863 97.3612C588.187 88.1428 583.926 80.6004 577.082 74.734C570.238 68.7281 561.858 65.7251 551.941 65.7251Z" fill="white" />
              <path className="ai-os__logo-letter" d="M763.285 53.7829L714.26 163.986H698.966L650.149 53.7829H665.653L706.927 147.644L748.62 53.7829H763.285Z" fill="white" />
              <path className="ai-os__logo-letter" d="M866.018 151.834C872.862 151.834 879.147 150.647 884.874 148.272C890.74 145.758 895.699 142.127 899.749 137.378L908.13 147.015C903.241 152.882 897.165 157.351 889.902 160.424C882.639 163.497 874.608 165.033 865.808 165.033C854.495 165.033 844.438 162.659 835.639 157.91C826.839 153.021 819.995 146.317 815.107 137.797C810.218 129.277 807.774 119.639 807.774 108.884C807.774 98.1294 810.078 88.4919 814.688 79.9718C819.437 71.4517 825.931 64.8172 834.172 60.0683C842.413 55.3193 851.771 52.9449 862.247 52.9449C872.024 52.9449 880.823 55.1797 888.645 59.6492C896.606 64.1188 902.892 70.3343 907.501 78.2957C912.25 86.2571 914.764 95.336 915.043 105.532L824.535 123.131C827.328 132.07 832.356 139.124 839.619 144.292C847.022 149.32 855.822 151.834 866.018 151.834ZM862.247 65.7251C854.565 65.7251 847.651 67.5408 841.505 71.1724C835.499 74.6642 830.75 79.6226 827.258 86.0476C823.906 92.333 822.23 99.596 822.23 107.837C822.23 109.932 822.3 111.468 822.44 112.446L900.168 97.3612C898.492 88.1428 894.232 80.6004 887.388 74.734C880.544 68.7281 872.163 65.7251 862.247 65.7251Z" fill="white" />
              <path className="ai-os__logo-letter" d="M1014.04 165.033C1004.12 165.033 996.442 162.24 990.994 156.653C985.687 151.066 983.033 143.314 983.033 133.397V8.52854H997.908V132.14C997.908 138.705 999.445 143.733 1002.52 147.225C1005.59 150.577 1010.2 152.253 1016.35 152.253C1020.26 152.253 1023.61 151.625 1026.4 150.368L1027.45 162.729C1023.12 164.265 1018.65 165.033 1014.04 165.033Z" fill="white" fillOpacity="0.75" />
              <path className="ai-os__logo-letter" d="M1055.65 165.033C1045.73 165.033 1038.05 162.24 1032.6 156.653C1027.29 151.066 1024.64 143.314 1024.64 133.397V8.52854H1039.52V132.14C1039.52 138.705 1041.05 143.733 1044.13 147.225C1047.2 150.577 1051.81 152.253 1057.95 152.253C1061.86 152.253 1065.22 151.625 1068.01 150.368L1069.06 162.729C1064.73 164.265 1060.26 165.033 1055.65 165.033Z" fill="white" fillOpacity="0.25" />
              <path className="ai-os__logo-cell" d="M0 180.554C0 175.58 4.03276 171.547 9.00743 171.547H41.4342C46.4089 171.547 50.4416 175.58 50.4416 180.554V212.981C50.4416 217.956 46.4089 221.989 41.4342 221.989H9.00742C4.03276 221.989 0 217.956 0 212.981V180.554Z" fill="white" fillOpacity="0.25" style={{ "--cell-index": 0 }} />
              <path className="ai-os__logo-cell" d="M0 123.37C0 118.396 4.03276 114.363 9.00743 114.363H41.4342C46.4089 114.363 50.4416 118.396 50.4416 123.37V155.797C50.4416 160.772 46.4089 164.804 41.4342 164.804H9.00742C4.03276 164.804 0 160.772 0 155.797V123.37Z" fill="white" fillOpacity="0.25" style={{ "--cell-index": 1 }} />
              <path className="ai-os__logo-cell" d="M57.1841 180.554C57.1841 175.58 61.2169 171.547 66.1916 171.547H98.6183C103.593 171.547 107.626 175.58 107.626 180.554V212.981C107.626 217.956 103.593 221.989 98.6183 221.989H66.1916C61.2169 221.989 57.1841 217.956 57.1841 212.981V180.554Z" fill="white" fillOpacity="0.25" style={{ "--cell-index": 2 }} />
              <path className="ai-os__logo-cell" d="M114.368 180.554C114.368 175.58 118.401 171.547 123.376 171.547H155.802C160.777 171.547 164.81 175.58 164.81 180.554V212.981C164.81 217.956 160.777 221.989 155.802 221.989H123.376C118.401 221.989 114.368 217.956 114.368 212.981V180.554Z" fill="white" fillOpacity="0.25" style={{ "--cell-index": 3 }} />
              <path className="ai-os__logo-cell" d="M0 66.1916C0 61.2169 4.03276 57.1841 9.00743 57.1841H41.4342C46.4089 57.1841 50.4416 61.2169 50.4416 66.1916V98.6183C50.4416 103.593 46.4089 107.626 41.4342 107.626H9.00742C4.03276 107.626 0 103.593 0 98.6183V66.1916Z" fill="white" fillOpacity="0.25" style={{ "--cell-index": 4 }} />
              <path className="ai-os__logo-cell ai-os__logo-cell--active" d="M57.1841 123.37C57.1841 118.396 61.2169 114.363 66.1916 114.363H98.6183C103.593 114.363 107.626 118.396 107.626 123.37V155.797C107.626 160.772 103.593 164.804 98.6183 164.804H66.1916C61.2169 164.804 57.1841 160.772 57.1841 155.797V123.37Z" fill="white" style={{ "--cell-index": 5 }} />
              <path className="ai-os__logo-cell ai-os__logo-cell--active" d="M114.368 123.37C114.368 118.396 118.401 114.363 123.376 114.363H155.802C160.777 114.363 164.81 118.396 164.81 123.37V155.797C164.81 160.772 160.777 164.804 155.802 164.804H123.376C118.401 164.804 114.368 160.772 114.368 155.797V123.37Z" fill="white" style={{ "--cell-index": 6 }} />
              <path className="ai-os__logo-cell" d="M171.552 123.37C171.552 118.396 175.585 114.363 180.56 114.363H212.987C217.961 114.363 221.994 118.396 221.994 123.37V155.797C221.994 160.772 217.961 164.804 212.987 164.804H180.56C175.585 164.804 171.552 160.772 171.552 155.797V123.37Z" fill="white" fillOpacity="0.25" style={{ "--cell-index": 7 }} />
              <path className="ai-os__logo-cell ai-os__logo-cell--active" d="M57.1841 66.1916C57.1841 61.2169 61.2169 57.1841 66.1916 57.1841H98.6183C103.593 57.1841 107.626 61.2169 107.626 66.1916V98.6183C107.626 103.593 103.593 107.626 98.6183 107.626H66.1916C61.2169 107.626 57.1841 103.593 57.1841 98.6183V66.1916Z" fill="white" style={{ "--cell-index": 8 }} />
              <path className="ai-os__logo-cell ai-os__logo-cell--active" d="M57.1841 9.00742C57.1841 4.03276 61.2169 0 66.1916 0H98.6183C103.593 0 107.626 4.03276 107.626 9.00743V41.4342C107.626 46.4089 103.593 50.4416 98.6183 50.4416H66.1916C61.2169 50.4416 57.1841 46.4089 57.1841 41.4342V9.00742Z" fill="white" style={{ "--cell-index": 9 }} />
              <path className="ai-os__logo-cell" d="M114.368 66.1916C114.368 61.2169 118.401 57.1841 123.376 57.1841H155.802C160.777 57.1841 164.81 61.2169 164.81 66.1916V98.6183C164.81 103.593 160.777 107.626 155.802 107.626H123.376C118.401 107.626 114.368 103.593 114.368 98.6183V66.1916Z" fill="white" fillOpacity="0.25" style={{ "--cell-index": 10 }} />
              <path className="ai-os__logo-cell" d="M114.368 9.00742C114.368 4.03276 118.401 0 123.376 0H155.802C160.777 0 164.81 4.03276 164.81 9.00743V41.4342C164.81 46.4089 160.777 50.4416 155.802 50.4416H123.376C118.401 50.4416 114.368 46.4089 114.368 41.4342V9.00742Z" fill="white" fillOpacity="0.25" style={{ "--cell-index": 11 }} />
              <path className="ai-os__logo-cell" d="M171.552 66.1916C171.552 61.2169 175.585 57.1841 180.56 57.1841H212.987C217.961 57.1841 221.994 61.2169 221.994 66.1916V98.6183C221.994 103.593 217.961 107.626 212.987 107.626H180.56C175.585 107.626 171.552 103.593 171.552 98.6183V66.1916Z" fill="white" fillOpacity="0.25" style={{ "--cell-index": 12 }} />
              <path className="ai-os__logo-cell" d="M171.552 9.00742C171.552 4.03276 175.585 0 180.56 0H212.987C217.961 0 221.994 4.03276 221.994 9.00743V41.4342C221.994 46.4089 217.961 50.4416 212.987 50.4416H180.56C175.585 50.4416 171.552 46.4089 171.552 41.4342V9.00742Z" fill="white" fillOpacity="0.25" style={{ "--cell-index": 13 }} />
            </svg>

            <span className="ai-os__core-kicker">LLEVELL / INTELLIGENCE BRIDGE</span>
            <strong>Direction in.<br />Acceleration out.</strong>
            <small>Strategy stays human.</small>
          </div>

          <section className="ai-os__side ai-os__side--ai">
            <div className="ai-os__side-head">
              <span>AI</span>
              <strong>Expands the range.</strong>
            </div>
            <div className="ai-os__signal-list">
              {aiSignals.map(([number, label]) => (
                <div className="ai-os__signal" key={label}>
                  <small>{number}</small>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="ai-os__workflow">
          <div className="ai-os__workflow-head">
            <span>HOW IT MOVES THROUGH THE WORK</span>
            <span>01 → 04</span>
          </div>

          <div className="ai-os__workflow-list">
            {workflow.map(([title, copy], index) => (
              <article className="ai-os__workflow-item" key={title}>
                <small>0{index + 1}</small>
                <h3>{title}</h3>
                <p>{copy}</p>
                <span className="ai-os__workflow-arrow">↗</span>
              </article>
            ))}
          </div>
        </div>

        <div className="ai-os__thesis">
          <span>THE PRINCIPLE</span>
          <p>
            AI multiplies the output.
            <strong> Human thinking protects the outcome.</strong>
          </p>
          <div className="ai-os__thesis-badge">
            <i />
            HUMAN IN CONTROL
          </div>
        </div>
      </div>
    </section>
  )
}
