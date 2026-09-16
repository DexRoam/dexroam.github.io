(() => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const header = $('[data-header]');
  const progress = $('.scroll-progress span');

  const updateScrollUI = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
    progress.style.transform = `scaleX(${ratio})`;
    header.classList.toggle('is-scrolled', window.scrollY > 16);
  };
  updateScrollUI();
  window.addEventListener('scroll', updateScrollUI, { passive: true });

  const menuButton = $('.menu-toggle');
  const menu = $('#site-menu');
  const setMenu = (open) => {
    menu.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    $('.menu-label', menuButton).textContent = open ? 'Close' : 'Menu';
    document.body.classList.toggle('has-open-menu', open);
  };
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  $$('.nav-menu a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  window.addEventListener('resize', () => { if (window.innerWidth > 760) setMenu(false); });

  if (!reducedMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    $$('.reveal').forEach((element) => revealObserver.observe(element));
  } else {
    $$('.reveal').forEach((element) => element.classList.add('is-visible'));
  }

  const sectionLinks = $$('.nav-links a');
  const sections = sectionLinks.map((link) => $(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach((section) => navObserver.observe(section));
  }

  const sideTocLinks = $$('.side-toc a[href^="#"]');
  const sideTocSections = sideTocLinks
    .map((link) => $(link.getAttribute('href')))
    .filter(Boolean);
  const sideToc = $('[data-side-toc]');
  const heroSection = $('#top');
  if (sideToc && heroSection && 'IntersectionObserver' in window) {
    const sideTocVisibilityObserver = new IntersectionObserver(([entry]) => {
      const visible = !entry.isIntersecting;
      sideToc.classList.toggle('is-visible', visible);
      sideToc.setAttribute('aria-hidden', String(!visible));
      sideToc.inert = !visible;
    }, { threshold: .01 });
    sideTocVisibilityObserver.observe(heroSection);
  }
  if (sideTocLinks.length && 'IntersectionObserver' in window) {
    const sideTocObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      sideTocLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${visible.target.id}`;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-24% 0px -58% 0px', threshold: [0, .05, .2, .5] });
    sideTocSections.forEach((section) => sideTocObserver.observe(section));
  }

  const deploymentTasks = [
    { title: 'Pick Chips Can', src: 'assets/video/tasks/task_pick_chips_can.mp4' },
    { title: 'Pour Water', src: 'assets/video/tasks/task_pour_water.mp4' },
    { title: 'Throw Trash', src: 'assets/video/tasks/task_throw_trash.mp4' },
    { title: 'Deliver Fruit', src: 'assets/video/tasks/task_move_basket.mp4' },
    { title: 'Push Chair & Close Laptop', src: 'assets/video/tasks/task_push_chair.mp4' }
  ];
  const deploymentCarousel = $('[data-deployment-carousel]');
  const deploymentCards = $$('[data-deployment-card]');
  const deploymentTitle = $('[data-deployment-title]');
  const deploymentStatus = $('[data-deployment-status]');
  if (deploymentCarousel && deploymentCards.length) {
    let deploymentIndex = 0;
    let pointerStart = null;
    const wrapDeployment = (index) => (index + deploymentTasks.length) % deploymentTasks.length;
    const renderDeployment = (index) => {
      deploymentIndex = wrapDeployment(index);
      const current = deploymentTasks[deploymentIndex];
      deploymentStatus.hidden = true;
      deploymentStatus.textContent = '';
      deploymentTitle.classList.add('is-changing');
      deploymentTitle.textContent = current.title;
      deploymentCards.forEach((card, cardIndex) => {
        let distance = cardIndex - deploymentIndex;
        if (distance > deploymentTasks.length / 2) distance -= deploymentTasks.length;
        if (distance < -deploymentTasks.length / 2) distance += deploymentTasks.length;
        const absoluteDistance = Math.abs(distance);
        const video = $('video', card);
        const active = absoluteDistance === 0;
        card.style.setProperty('--deployment-x', `${distance * 30}%`);
        card.style.setProperty('--deployment-scale', String(1 - absoluteDistance * .1));
        card.style.zIndex = String(10 - absoluteDistance);
        card.style.opacity = String(1 - absoluteDistance * .2);
        card.style.filter = active ? 'none' : 'blur(1px) brightness(.8)';
        card.classList.toggle('is-active', active);
        card.toggleAttribute('aria-current', active);
        video.controls = active;
        if (active) {
          video.play()?.catch((error) => {
            if (error.name === 'AbortError') return;
            deploymentStatus.textContent = 'Press play to start the selected video.';
            deploymentStatus.hidden = false;
          });
        } else {
          video.pause();
        }
      });
      requestAnimationFrame(() => deploymentTitle.classList.remove('is-changing'));
    };
    deploymentCards.forEach((card, cardIndex) => {
      card.addEventListener('click', (event) => {
        if (event.target.closest('button, video')) return;
        if (cardIndex !== deploymentIndex) renderDeployment(cardIndex);
      });
    });
    $$('[data-deployment-nav]', deploymentCarousel).forEach((button) => button.addEventListener('click', () => renderDeployment(deploymentIndex + Number(button.dataset.deploymentNav))));
    deploymentCarousel.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      renderDeployment(event.key === 'Home' ? 0 : event.key === 'End' ? deploymentTasks.length - 1 : deploymentIndex + (event.key === 'ArrowRight' ? 1 : -1));
    });
    deploymentCarousel.addEventListener('pointerdown', (event) => { pointerStart = event.clientX; });
    deploymentCarousel.addEventListener('pointerup', (event) => {
      if (pointerStart === null || Math.abs(event.clientX - pointerStart) < 48) { pointerStart = null; return; }
      const direction = event.clientX < pointerStart ? 1 : -1;
      renderDeployment(deploymentIndex + direction);
      pointerStart = null;
    });
    deploymentCarousel.addEventListener('pointercancel', () => { pointerStart = null; });
    renderDeployment(0);
  }

  const distributionTasks = {
    pick: {
      label: 'Pick Chips Can',
      before: 'assets/images/action_distribution/pick_shutiao_abs.png',
      after: 'assets/images/action_distribution/pick_shutaio_retarget.png',
      metrics: { mmd: [0.598, 0.313], swd: [0.926, 0.563] }
    },
    pour: {
      label: 'Pour Water',
      before: 'assets/images/action_distribution/pour_water_abs.png',
      after: 'assets/images/action_distribution/pour_water_retarget.png',
      metrics: { mmd: [0.631, 0.384], swd: [1.277, 0.860] }
    },
    stool: {
      label: 'Push Chair & Close Laptop',
      before: 'assets/images/action_distribution/push_stool_abs.png',
      after: 'assets/images/action_distribution/push_stool_retarget.png',
      metrics: { mmd: [0.553, 0.274], swd: [0.940, 0.719] }
    },
    bin: {
      label: 'Throw Trash',
      before: 'assets/images/action_distribution/put_bottle_bin_abs.png',
      after: 'assets/images/action_distribution/put_bottle_bin_retarget.png',
      metrics: { mmd: [0.628, 0.359], swd: [1.004, 0.729] }
    }
  };
  const distributionButtons = $$('[data-distribution-task]');
  const distributionComparison = $('[data-distribution-comparison]');
  const distributionBefore = $('[data-distribution-before]');
  const distributionAfter = $('[data-distribution-after]');
  const distributionMetricCharts = $$('[data-distribution-metric]');
  if (distributionButtons.length && distributionComparison && distributionBefore && distributionAfter) {
    let distributionRenderToken = 0;
    const renderDistributionMetrics = (task) => {
      distributionMetricCharts.forEach((chart) => {
        const metric = chart.dataset.distributionMetric;
        const values = task.metrics[metric];
        const scaleMaximum = metric === 'mmd' ? 0.8 : 1.4;
        chart.setAttribute('aria-label', `${task.label} ${metric === 'mmd' ? 'Maximum Mean Discrepancy' : 'Sliced Wasserstein Distance'}: Raw ${values[0].toFixed(3)}, Aligned ${values[1].toFixed(3)}`);
        ['raw', 'aligned'].forEach((series, seriesIndex) => {
          const value = values[seriesIndex];
          const bar = $(`[data-metric-bar="${series}"]`, chart);
          const column = bar.closest('.distribution-metric-column');
          $(`[data-metric-value="${series}"]`, chart).textContent = value.toFixed(3);
          bar.style.height = '0%';
          column.style.setProperty('--metric-height', '0%');
          requestAnimationFrame(() => requestAnimationFrame(() => {
            const height = `${Math.min(value / scaleMaximum * 100, 100)}%`;
            bar.style.height = height;
            column.style.setProperty('--metric-height', height);
          }));
        });
      });
    };
    const renderDistribution = (taskKey, focusButton = false) => {
      const task = distributionTasks[taskKey];
      if (!task) return;
      const token = ++distributionRenderToken;
      distributionComparison.classList.add('is-switching');
      distributionButtons.forEach((button) => {
        const active = button.dataset.distributionTask === taskKey;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-selected', String(active));
        button.tabIndex = active ? 0 : -1;
        if (active && focusButton) button.focus();
      });
      distributionBefore.src = task.before;
      distributionBefore.alt = `${task.label} human and robot action distributions before alignment`;
      distributionAfter.src = task.after;
      distributionAfter.alt = `${task.label} human and robot action distributions after full alignment`;
      renderDistributionMetrics(task);
      Promise.allSettled([distributionBefore.decode(), distributionAfter.decode()]).then(() => {
        if (token !== distributionRenderToken) return;
        distributionComparison.classList.remove('is-switching');
      });
    };
    distributionButtons.forEach((button, buttonIndex) => {
      button.addEventListener('click', () => renderDistribution(button.dataset.distributionTask));
      button.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const nextIndex = event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? distributionButtons.length - 1
            : (buttonIndex + (event.key === 'ArrowRight' ? 1 : -1) + distributionButtons.length) % distributionButtons.length;
        renderDistribution(distributionButtons[nextIndex].dataset.distributionTask, true);
      });
    });
    renderDistribution('pick');
  }

  const policyResults = {
    groot: {
      sr: [
        [0.50, 0.70, 0.65, 0.90], [0.35, 0.60, 0.55, 0.65], [0.40, 0.55, 0.60, 0.75],
        [0.10, 0.20, 0.15, 0.25], [0.10, 0.25, 0.15, 0.25], [0.29, 0.46, 0.42, 0.56]
      ],
      tcs: [
        [0.63, 0.86, 0.74, 0.96], [0.67, 0.80, 0.80, 0.86], [0.80, 0.83, 0.83, 0.92],
        [0.49, 0.64, 0.64, 0.71], [0.19, 0.40, 0.33, 0.42], [0.56, 0.70, 0.67, 0.77]
      ]
    },
    pi: {
      sr: [
        [0.40, 0.50, 0.75, 0.75], [0.35, 0.65, 0.55, 0.65], [0.60, 0.70, 0.70, 0.75],
        [0.20, 0.30, 0.35, 0.40], [0.05, 0.30, 0.10, 0.30], [0.32, 0.49, 0.49, 0.57]
      ],
      tcs: [
        [0.60, 0.66, 0.85, 0.84], [0.59, 0.81, 0.79, 0.84], [0.74, 0.86, 0.90, 0.89],
        [0.48, 0.61, 0.59, 0.62], [0.19, 0.42, 0.34, 0.44], [0.52, 0.67, 0.69, 0.73]
      ]
    }
  };
  const policyTasks = ['Pick Chips Can', 'Throw Trash', 'Deliver Fruit', 'Push Chair & Close Laptop', 'Pour Water', 'Average'];
  const policyMethods = [
    { label: 'Robot Only', color: '#bae0fe' },
    { label: 'Human-Robot Cotrain', color: '#fef5ce' },
    { label: 'Human Pretrain + Robot FT', color: '#fdcfb4' },
    { label: 'Human Pretrain + Cotrain FT', color: '#fc9595' }
  ];
  const policyBackbone = $('[data-policy-backbone]');
  const policyMetric = $('[data-policy-metric]');
  const policyPlot = $('[data-policy-plot]');
  const policyChart = $('[data-policy-chart]');
  if (policyBackbone && policyMetric && policyPlot && policyChart) {
    let policyChartRevealed = false;
    const animatePolicyBars = () => {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        $$('.policy-chart-bar', policyPlot).forEach((bar) => { bar.style.height = bar.dataset.target; });
      }));
    };
    const renderPolicyResults = () => {
      const backbone = policyBackbone.value;
      const metric = policyMetric.value;
      const backboneLabel = backbone === 'groot' ? 'GR00T N1.7' : 'π0.5';
      const metricLabel = metric === 'sr' ? 'Task Success Rate' : 'Task Completion Score';
      const values = policyResults[backbone][metric];
      $('[data-policy-chart-title]').textContent = `${backboneLabel} · ${metricLabel}`;
      $('[data-policy-y-label]').textContent = metricLabel;
      policyChart.setAttribute('aria-label', `${backboneLabel} ${metricLabel} grouped bar chart across five tasks and the average`);
      policyPlot.innerHTML = '';
      const grid = document.createElement('div');
      grid.className = 'policy-chart-grid';
      for (let line = 0; line < 6; line += 1) grid.append(document.createElement('i'));
      policyPlot.append(grid);
      policyTasks.forEach((task, taskIndex) => {
        const group = document.createElement('div');
        group.className = `policy-chart-group${task === 'Average' ? ' is-average' : ''}`;
        const bars = document.createElement('div');
        bars.className = 'policy-chart-bars';
        values[taskIndex].forEach((value, methodIndex) => {
          const bar = document.createElement('div');
          bar.className = 'policy-chart-bar';
          bar.style.setProperty('--bar-color', policyMethods[methodIndex].color);
          bar.dataset.target = `${value * 100}%`;
          bar.setAttribute('aria-label', `${policyMethods[methodIndex].label}: ${value.toFixed(2)}`);
          const valueLabel = document.createElement('span');
          valueLabel.textContent = value.toFixed(2);
          bar.append(valueLabel);
          bars.append(bar);
        });
        const taskLabel = document.createElement('span');
        taskLabel.className = 'policy-chart-task';
        taskLabel.textContent = task;
        group.append(bars, taskLabel);
        policyPlot.append(group);
      });
      if (policyChartRevealed) animatePolicyBars();
    };
    policyBackbone.addEventListener('change', renderPolicyResults);
    policyMetric.addEventListener('change', renderPolicyResults);
    renderPolicyResults();
    const policyObserver = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      policyChartRevealed = true;
      animatePolicyBars();
      policyObserver.disconnect();
    }, { threshold: .2 });
    policyObserver.observe(policyChart);
  }

  const dataEfficiencyRows = [
    {
      label: 'GR00T N1.7',
      tasks: [
        { title: 'Pick Chips Can', robot: [null, null, null, 50], cotrain: [0, 40, 50, 70], pretrain: [0, 35, 50, 65] },
        { title: 'Throw Trash', robot: [null, null, null, 35], cotrain: [0, 40, 50, 60], pretrain: [0, 50, 70, 55] },
        { title: 'Deliver Fruit', robot: [null, null, null, 40], cotrain: [0, 20, 50, 55], pretrain: [0, 25, 65, 60] }
      ]
    },
    {
      label: 'π0.5',
      tasks: [
        { title: 'Pick Chips Can', robot: [null, null, null, 40], cotrain: [0, 20, 40, 50], pretrain: [0, 50, 35, 75] },
        { title: 'Throw Trash', robot: [null, null, null, 35], cotrain: [0, 50, 45, 60], pretrain: [0, 20, 30, 50] },
        { title: 'Deliver Fruit', robot: [null, null, null, 60], cotrain: [0, 50, 55, 70], pretrain: [0, 35, 60, 70] }
      ]
    }
  ];
  const dataEfficiencySeries = {
    robot: { label: 'Robot Data', color: '#acdafa', marker: 'circle' },
    cotrain: { label: 'Human-Robot Cotrain', color: '#ee8a73', marker: 'cross' },
    pretrain: { label: 'Human Pretrain + Robot FT', color: '#fdbe76', marker: 'diamond' }
  };
  const dataEfficiencyChart = $('[data-efficiency-chart]');
  const dataEfficiencyLegendButtons = $$('[data-efficiency-series]');
  if (dataEfficiencyChart && dataEfficiencyLegendButtons.length) {
    const svgNamespace = 'http://www.w3.org/2000/svg';
    const createSvgNode = (tag, attributes = {}) => {
      const node = document.createElementNS(svgNamespace, tag);
      Object.entries(attributes).forEach(([name, value]) => node.setAttribute(name, String(value)));
      return node;
    };
    const appendSvgText = (parent, content, attributes = {}) => {
      const textNode = createSvgNode('text', attributes);
      textNode.textContent = content;
      parent.append(textNode);
      return textNode;
    };
    const chartWidth = 1180;
    const chartHeight = 640;
    const marginLeft = 84;
    const marginRight = 20;
    const marginTop = 42;
    const marginBottom = 56;
    const panelGapX = 18;
    const panelGapY = 70;
    const panelWidth = (chartWidth - marginLeft - marginRight - panelGapX * 2) / 3;
    const panelHeight = (chartHeight - marginTop - marginBottom - panelGapY) / 2;
    const robotBudgets = [0, 10, 25, 50];
    const yTicks = [0, 20, 40, 60, 80, 100];
    const svg = createSvgNode('svg', {
      viewBox: `0 0 ${chartWidth} ${chartHeight}`,
      role: 'img',
      'aria-label': 'Robot-data efficiency success-rate curves for GR00T N1.7 and π0.5 across three real-world tasks'
    });
    const background = createSvgNode('rect', { x: 0, y: 0, width: chartWidth, height: chartHeight, rx: 18, fill: '#ffffff' });
    svg.append(background);
    const getPoint = (budget, success, panelX, panelY) => ({
      x: panelX + budget / 50 * panelWidth,
      y: panelY + panelHeight - success / 100 * panelHeight
    });
    const appendMarker = (parent, marker, point, color, label) => {
      const markerGroup = createSvgNode('g', { class: 'data-efficiency-point' });
      const title = createSvgNode('title');
      title.textContent = label;
      markerGroup.append(title);
      if (marker === 'circle') {
        markerGroup.append(createSvgNode('circle', { cx: point.x, cy: point.y, r: 7, fill: color, stroke: '#fff', 'stroke-width': 2 }));
      } else if (marker === 'diamond') {
        markerGroup.append(createSvgNode('polygon', { points: `${point.x},${point.y - 8} ${point.x + 8},${point.y} ${point.x},${point.y + 8} ${point.x - 8},${point.y}`, fill: color, stroke: '#fff', 'stroke-width': 2 }));
      } else {
        markerGroup.append(createSvgNode('line', { x1: point.x - 7, y1: point.y - 7, x2: point.x + 7, y2: point.y + 7, stroke: '#fff', 'stroke-width': 6, 'stroke-linecap': 'round' }));
        markerGroup.append(createSvgNode('line', { x1: point.x - 7, y1: point.y + 7, x2: point.x + 7, y2: point.y - 7, stroke: '#fff', 'stroke-width': 6, 'stroke-linecap': 'round' }));
        markerGroup.append(createSvgNode('line', { x1: point.x - 7, y1: point.y - 7, x2: point.x + 7, y2: point.y + 7, stroke: color, 'stroke-width': 3.5, 'stroke-linecap': 'round' }));
        markerGroup.append(createSvgNode('line', { x1: point.x - 7, y1: point.y + 7, x2: point.x + 7, y2: point.y - 7, stroke: color, 'stroke-width': 3.5, 'stroke-linecap': 'round' }));
      }
      parent.append(markerGroup);
    };
    dataEfficiencyRows.forEach((row, rowIndex) => {
      const panelY = marginTop + rowIndex * (panelHeight + panelGapY);
      appendSvgText(svg, `${row.label} Success Rate`, {
        x: 23,
        y: panelY + panelHeight / 2,
        fill: '#243852',
        'font-size': 15,
        'font-weight': 650,
        'text-anchor': 'middle',
        transform: `rotate(-90 23 ${panelY + panelHeight / 2})`
      });
      row.tasks.forEach((task, taskIndex) => {
        const panelX = marginLeft + taskIndex * (panelWidth + panelGapX);
        svg.append(createSvgNode('rect', { x: panelX, y: panelY, width: panelWidth, height: panelHeight, rx: 12, fill: '#fbfcff', stroke: '#d8e2f5', 'stroke-width': 1 }));
        appendSvgText(svg, task.title, { x: panelX + panelWidth / 2, y: panelY - 13, fill: '#162338', 'font-size': 13, 'font-weight': 650, 'text-anchor': 'middle' });
        yTicks.forEach((tick) => {
          const y = panelY + panelHeight - tick / 100 * panelHeight;
          svg.append(createSvgNode('line', { x1: panelX, y1: y, x2: panelX + panelWidth, y2: y, stroke: '#dfe7f4', 'stroke-width': 1, 'stroke-dasharray': '4 4' }));
          if (taskIndex === 0) appendSvgText(svg, String(tick), { x: panelX - 9, y: y + 4, fill: '#718097', 'font-size': 10, 'text-anchor': 'end' });
        });
        robotBudgets.forEach((budget) => {
          const x = panelX + budget / 50 * panelWidth;
          appendSvgText(svg, String(budget), { x, y: panelY + panelHeight + 18, fill: '#526179', 'font-size': 10, 'text-anchor': 'middle' });
        });
        appendSvgText(svg, 'Robot Demos', { x: panelX + panelWidth / 2, y: panelY + panelHeight + 36, fill: '#526179', 'font-size': 10, 'font-weight': 600, 'text-anchor': 'middle' });
        Object.entries(dataEfficiencySeries).forEach(([seriesKey, seriesStyle]) => {
          const values = task[seriesKey];
          const points = values.map((value, valueIndex) => value === null ? null : getPoint(robotBudgets[valueIndex], value, panelX, panelY));
          const visiblePoints = points.filter(Boolean);
          const seriesGroup = createSvgNode('g', { class: 'data-efficiency-series', 'data-series': seriesKey });
          if (visiblePoints.length > 1) {
            seriesGroup.append(createSvgNode('polyline', {
              class: 'data-efficiency-line',
              points: visiblePoints.map((point) => `${point.x},${point.y}`).join(' '),
              fill: 'none',
              stroke: seriesStyle.color,
              'stroke-width': 3,
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round',
              pathLength: 1
            }));
          }
          points.forEach((point, pointIndex) => {
            if (!point) return;
            appendMarker(seriesGroup, seriesStyle.marker, point, seriesStyle.color, `${row.label}, ${task.title}, ${seriesStyle.label}, ${robotBudgets[pointIndex]} robot demos: ${values[pointIndex]}% success`);
          });
          svg.append(seriesGroup);
        });
      });
    });
    dataEfficiencyChart.append(svg);
    let activeEfficiencySeries = null;
    let hoveredEfficiencySeries = null;
    const updateEfficiencyFocus = () => {
      const focused = activeEfficiencySeries || hoveredEfficiencySeries;
      $$('.data-efficiency-series', svg).forEach((series) => series.classList.toggle('is-muted', focused && series.dataset.series !== focused));
      dataEfficiencyLegendButtons.forEach((button) => {
        button.classList.toggle('is-dimmed', focused && button.dataset.efficiencySeries !== focused);
        button.setAttribute('aria-pressed', String(activeEfficiencySeries === button.dataset.efficiencySeries));
      });
    };
    dataEfficiencyLegendButtons.forEach((button) => {
      const seriesKey = button.dataset.efficiencySeries;
      button.addEventListener('mouseenter', () => { hoveredEfficiencySeries = seriesKey; updateEfficiencyFocus(); });
      button.addEventListener('mouseleave', () => { hoveredEfficiencySeries = null; updateEfficiencyFocus(); });
      button.addEventListener('focus', () => { hoveredEfficiencySeries = seriesKey; updateEfficiencyFocus(); });
      button.addEventListener('blur', () => { hoveredEfficiencySeries = null; updateEfficiencyFocus(); });
      button.addEventListener('click', () => { activeEfficiencySeries = activeEfficiencySeries === seriesKey ? null : seriesKey; updateEfficiencyFocus(); });
    });
  }

  const copyButton = $('[data-copy-citation]');
  const copyStatus = $('[data-copy-status]');
  copyButton.addEventListener('click', async () => {
    const citation = $('#bibtex').textContent;
    try {
      await navigator.clipboard.writeText(citation);
      copyButton.textContent = 'Copied';
      copyStatus.textContent = 'BibTeX copied to your clipboard.';
    } catch {
      const range = document.createRange();
      range.selectNodeContents($('#bibtex'));
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      copyStatus.textContent = 'Citation selected. Press Ctrl/Cmd + C to copy.';
    }
    window.setTimeout(() => { copyButton.textContent = 'Copy citation'; copyStatus.textContent = ''; }, 2600);
  });

})();
