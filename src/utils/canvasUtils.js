// --- Main drawing guide ---
export const drawFormGuide = (ctx, width, height, score) => {
  const centerX = width / 2;
  const centerY = height / 2;

  // Set dynamic color based on score
  ctx.strokeStyle = score >= 70 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';

  // Shoulder line
  const shoulderY = centerY - 80;
  ctx.beginPath();
  ctx.moveTo(centerX - 80, shoulderY);
  ctx.lineTo(centerX + 80, shoulderY);
  ctx.stroke();

  // Spine line
  ctx.beginPath();
  ctx.moveTo(centerX, shoulderY);
  ctx.lineTo(centerX, centerY + 100);
  ctx.stroke();

  // Hip line
  const hipY = centerY + 20;
  ctx.beginPath();
  ctx.moveTo(centerX - 60, hipY);
  ctx.lineTo(centerX + 60, hipY);
  ctx.stroke();

  // Arms
  ctx.beginPath();
  ctx.moveTo(centerX - 80, shoulderY);
  ctx.lineTo(centerX - 120, centerY - 20);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(centerX + 80, shoulderY);
  ctx.lineTo(centerX + 120, centerY - 20);
  ctx.stroke();

  // Legs
  ctx.beginPath();
  ctx.moveTo(centerX - 30, hipY);
  ctx.lineTo(centerX - 40, centerY + 120);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(centerX + 30, hipY);
  ctx.lineTo(centerX + 40, centerY + 120);
  ctx.stroke();

  // Alignment feedback circles
  drawAlignmentCircle(ctx, centerX, shoulderY - 30, 15, score >= 80);
  drawAlignmentCircle(ctx, centerX, centerY, 15, score >= 70);
  drawAlignmentCircle(ctx, centerX, hipY + 30, 15, score >= 60);

  // Display score
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(`Form Score: ${score}%`, width - 100, 30);
};

// --- Helper to draw circles ---
const drawAlignmentCircle = (ctx, x, y, radius, isAligned) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = isAligned ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)';
  ctx.fill();
  ctx.strokeStyle = isAligned ? '#10B981' : '#EF4444';
  ctx.lineWidth = 2;
  ctx.stroke();
};

// --- Simulated scoring logic ---
export const calculateFormScore = (ctx, width, height) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  let totalBrightness = 0;
  let pixelCount = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const brightness = (r + g + b) / 3;
    totalBrightness += brightness;
    pixelCount++;
  }

  const avgBrightness = totalBrightness / pixelCount;

  // Simulated logic
  const base = 75;
  const brightnessVariation = Math.sin(Date.now() / 1000) * 15;
  const randomFactor = (Math.random() - 0.5) * 10;

  let score = base + brightnessVariation + randomFactor;

  if (avgBrightness < 50) score -= 10; // Too dark
  if (avgBrightness > 200) score -= 5; // Too bright

  return Math.max(0, Math.min(100, Math.round(score)));
};

// --- Optional workout-specific overlays ---
export const drawWorkoutOverlay = (ctx, width, height, workoutType) => {
  const overlays = {
    'push-ups': () => drawPushUpGuide(ctx, width, height),
    'squats': () => drawSquatGuide(ctx, width, height),
    'plank': () => drawPlankGuide(ctx, width, height),
    'lunges': () => drawLungeGuide(ctx, width, height)
  };

  const draw = overlays[workoutType];
  if (draw) draw();
};

const drawPushUpGuide = (ctx, width, height) => {
  const centerX = width / 2;
  const centerY = height / 2;

  ctx.strokeStyle = '#3B82F6';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);

  ctx.beginPath();
  ctx.moveTo(centerX - 100, centerY);
  ctx.lineTo(centerX + 100, centerY);
  ctx.stroke();

  ctx.setLineDash([]);
};

const drawSquatGuide = (ctx, width, height) => {
  const centerX = width / 2;
  const centerY = height / 2;

  ctx.strokeStyle = '#10B981';
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.arc(centerX, centerY + 50, 80, 0, Math.PI);
  ctx.stroke();
};

const drawPlankGuide = (ctx, width, height) => {
  const centerX = width / 2;
  const centerY = height / 2;

  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(centerX - 120, centerY - 20);
  ctx.lineTo(centerX + 120, centerY - 20);
  ctx.stroke();
};

const drawLungeGuide = (ctx, width, height) => {
  const centerX = width / 2;
  const centerY = height / 2;

  ctx.strokeStyle = '#8B5CF6';
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.arc(centerX - 40, centerY + 60, 20, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(centerX + 40, centerY + 60, 20, 0, 2 * Math.PI);
  ctx.stroke();
};
