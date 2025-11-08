import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

const centerTextPlugin = {
  id: 'centerText',
  beforeDraw(chart, args, pluginOptions) {
    const { ctx } = chart;
    const meta = chart.getDatasetMeta(0);
    const centerX = meta?.data?.[0]?.x ?? chart.width / 2;
    const centerY = meta?.data?.[0]?.y ?? chart.height / 2;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#111827';
    const title = pluginOptions?.title || '';
    if (title) {
      ctx.font = '600 14px Inter, sans-serif';
      ctx.fillText(title, centerX, centerY - 12);
    }
    ctx.font = '700 28px Inter, sans-serif';
    const value = pluginOptions?.value ?? '';
    ctx.fillText(String(value), centerX, centerY + 10);
    ctx.restore();
  },
};

const toHex = (v) => v.toString(16).padStart(2, '0');
const hexToRgb = (hex) => {
  const n = parseInt(hex.replace('#', ''), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
};
const lighten = (hex, amt = 0.22) => {
  const { r, g, b } = hexToRgb(hex);
  const lr = Math.min(255, Math.round(r + (255 - r) * amt));
  const lg = Math.min(255, Math.round(g + (255 - g) * amt));
  const lb = Math.min(255, Math.round(b + (255 - b) * amt));
  return `#${toHex(lr)}${toHex(lg)}${toHex(lb)}`;
};

const ringGlow = {
  id: 'ringGlow',
  afterDatasetDraw(chart, args) {
    if (args.index !== 0) return;
    const { ctx } = chart;
    const meta = chart.getDatasetMeta(0);
    const data = meta?.data || [];
    if (!Array.isArray(data) || data.length === 0) return;
    data.forEach((el) => {
      if (!el) return;
      const { x, y, innerRadius, outerRadius, startAngle, endAngle } = el;
      if (
        x == null || y == null || innerRadius == null || outerRadius == null ||
        startAngle == null || endAngle == null
      ) return;
      const g = ctx.createLinearGradient(x, y - outerRadius, x, y + outerRadius);
      g.addColorStop(0, 'rgba(56,189,248,0.35)');
      g.addColorStop(1, 'rgba(217,70,239,0.35)');
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, outerRadius + 3, startAngle, endAngle);
      ctx.arc(x, y, innerRadius - 3, endAngle, startAngle, true);
      ctx.closePath();
      ctx.globalCompositeOperation = 'lighter';
      ctx.shadowColor = 'rgba(168,85,247,0.35)';
      ctx.shadowBlur = 16;
      ctx.shadowOffsetY = 4;
      ctx.strokeStyle = g;
      ctx.lineWidth = 5;
      ctx.stroke();
      ctx.restore();
    });
  },
};

const FootprintChart = ({ dataObj, data, score, className = '' }) => {
  const defaultColors = ['#10B981', '#0EA5E9', '#6366F1', '#F59E0B'];

  let labels, values, colors;
  if (Array.isArray(data) && data.length) {
    labels = data.map((d) => d.label);
    values = data.map((d) => Number(d.value) || 0);
    colors = data.map((d, i) => d.color || defaultColors[i % defaultColors.length]);
  } else {
    labels = ['Consumption', 'Travel', 'Digital', 'Finance'];
    values = [dataObj.consumption, dataObj.travel, dataObj.digital, dataObj.finance];
    colors = defaultColors;
  }

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: (ctx) => {
          const { chart, dataIndex } = ctx;
          const base = colors[dataIndex % colors.length];
          const meta = chart.getDatasetMeta(0);
          const el = meta?.data?.[dataIndex];
          const c = chart.ctx;

          let g;
          if (el && el.x != null && el.y != null && el.outerRadius != null) {
            g = c.createLinearGradient(el.x, el.y - el.outerRadius, el.x, el.y + el.outerRadius);
          } else {
            const area = chart.chartArea;
            const x = area ? (area.left + area.right) / 2 : chart.width / 2;
            const yTop = area ? area.top : 0;
            const yBot = area ? area.bottom : chart.height;
            g = c.createLinearGradient(x, yTop, x, yBot);
          }

          g.addColorStop(0, lighten(base, 0.35));
          g.addColorStop(1, base);
          return g;
        },
        borderColor: '#FFFFFF',
        borderWidth: 3,
        radius: '90%',
        cutout: '62%',
        spacing: 6,
        borderRadius: 14,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    layout: { padding: { top: 16, bottom: 36, left: 16, right: 16 } },
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.parsed}%` } },
      centerText: score != null ? { title: 'Score', value: score } : undefined,
    },
  };

  return (
    <div className={`relative w-full h-full mx-auto ${className}`}>
      <Doughnut
        data={chartData}
        options={options}
        plugins={[centerTextPlugin, ringGlow]}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default FootprintChart;
