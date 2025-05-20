// js/colorwheel.js
export function drawColorWheel(canvasId, dimensionData) {
  const canvas = typeof canvasId === 'string' ? document.getElementById(canvasId) : canvasId;
  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - 12;
  const dims = [
    { name: '変革性', color: '#FF5555', value: dimensionData.innovation || 0 },
    { name: '安定性', color: '#5555FF', value: dimensionData.stability || 0 },
    { name: '社会性', color: '#55FF55', value: dimensionData.social || 0 },
    { name: '自律性', color: '#FFFF55', value: dimensionData.autonomy || 0 },
    { name: '伝統性', color: '#AA55FF', value: dimensionData.tradition || 0 },
    { name: '国際性', color: '#FFAA55', value: dimensionData.global || 0 }
  ];
  const sectorAngle = (2 * Math.PI) / dims.length;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  dims.forEach((dim, i) => {
    const startAngle = i * sectorAngle;
    const endAngle = (i + 1) * sectorAngle;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius * dim.value, startAngle, endAngle, false);
    ctx.lineTo(centerX, centerY);
    ctx.fillStyle = dim.color;
    ctx.globalAlpha = 0.93;
    ctx.fill();
    ctx.globalAlpha = 1.0;
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    // ラベル
    const labelRadius = radius * 1.08 + 12;
    const labelX = centerX + Math.cos(startAngle + sectorAngle / 2) * labelRadius;
    const labelY = centerY + Math.sin(startAngle + sectorAngle / 2) * labelRadius + 2;
    ctx.fillStyle = '#555';
    ctx.font = '13px "Noto Sans JP", Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(dim.name, labelX, labelY);
  });
  // 中心丸
  ctx.beginPath();
  ctx.arc(centerX, centerY, 18, 0, 2 * Math.PI);
  ctx.fillStyle = "#fff";
  ctx.globalAlpha = 0.93;
  ctx.fill();
  ctx.globalAlpha = 1.0;
  ctx.strokeStyle = "#bfc6d1";
  ctx.lineWidth = 1.4;
  ctx.stroke();
}
