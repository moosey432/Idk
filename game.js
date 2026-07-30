// Every value intended for adjustment is kept in this configuration object.
const CONFIG = Object.freeze({
  canvas: {
    width: 640,
    height: 480,
    backgroundColor: '#000000',
  },
  battleBox: {
    x: 32,
    y: 250,
    width: 576,
    height: 140,
    lineThickness: 4,
    lineColor: '#ffffff',
  },
  heart: {
    startX: 320,
    startY: 320,
    width: 16,
    height: 14,
    color: '#ff0000',
    movementSpeed: 120,
  },
  debug: {
    enabled: true,
    x: 12,
    y: 18,
    lineHeight: 16,
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#00ff00',
    coordinateDecimals: 1,
    fpsSmoothing: 0.1,
  },
  timing: {
    maximumDeltaSeconds: 0.1,
    millisecondsPerSecond: 1000,
  },
});

const canvas = document.querySelector('#gameCanvas');
const context = canvas.getContext('2d');

canvas.width = CONFIG.canvas.width;
canvas.height = CONFIG.canvas.height;

const state = {
  heartX: CONFIG.heart.startX,
  heartY: CONFIG.heart.startY,
  pressedKeys: new Set(),
  previousTime: performance.now(),
  fps: 0,
};

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
}

function update(deltaSeconds) {
  let horizontalDirection = 0;
  let verticalDirection = 0;

  if (state.pressedKeys.has('ArrowLeft')) horizontalDirection -= 1;
  if (state.pressedKeys.has('ArrowRight')) horizontalDirection += 1;
  if (state.pressedKeys.has('ArrowUp')) verticalDirection -= 1;
  if (state.pressedKeys.has('ArrowDown')) verticalDirection += 1;

  if (horizontalDirection !== 0 && verticalDirection !== 0) {
    const diagonalScale = Math.SQRT1_2;
    horizontalDirection *= diagonalScale;
    verticalDirection *= diagonalScale;
  }

  state.heartX += horizontalDirection * CONFIG.heart.movementSpeed * deltaSeconds;
  state.heartY += verticalDirection * CONFIG.heart.movementSpeed * deltaSeconds;

  const innerLeft = CONFIG.battleBox.x + CONFIG.battleBox.lineThickness;
  const innerTop = CONFIG.battleBox.y + CONFIG.battleBox.lineThickness;
  const innerRight = CONFIG.battleBox.x + CONFIG.battleBox.width - CONFIG.battleBox.lineThickness;
  const innerBottom = CONFIG.battleBox.y + CONFIG.battleBox.height - CONFIG.battleBox.lineThickness;

  state.heartX = clamp(
    state.heartX,
    innerLeft + CONFIG.heart.width / 2,
    innerRight - CONFIG.heart.width / 2,
  );
  state.heartY = clamp(
    state.heartY,
    innerTop + CONFIG.heart.height / 2,
    innerBottom - CONFIG.heart.height / 2,
  );
}

function drawHeart() {
  const left = state.heartX - CONFIG.heart.width / 2;
  const top = state.heartY - CONFIG.heart.height / 2;
  const unitX = CONFIG.heart.width / 4;
  const unitY = CONFIG.heart.height / 4;

  context.fillStyle = CONFIG.heart.color;
  context.beginPath();
  context.moveTo(state.heartX, top + unitY);
  context.bezierCurveTo(left + unitX, top - unitY, left, top + unitY, left, top + unitY * 2);
  context.bezierCurveTo(left, top + unitY * 3, state.heartX, top + CONFIG.heart.height, state.heartX, top + CONFIG.heart.height);
  context.bezierCurveTo(state.heartX, top + CONFIG.heart.height, left + CONFIG.heart.width, top + unitY * 3, left + CONFIG.heart.width, top + unitY * 2);
  context.bezierCurveTo(left + CONFIG.heart.width, top + unitY, left + unitX * 3, top - unitY, state.heartX, top + unitY);
  context.fill();
}

function drawBattleBox() {
  const halfLine = CONFIG.battleBox.lineThickness / 2;

  context.strokeStyle = CONFIG.battleBox.lineColor;
  context.lineWidth = CONFIG.battleBox.lineThickness;
  context.strokeRect(
    CONFIG.battleBox.x + halfLine,
    CONFIG.battleBox.y + halfLine,
    CONFIG.battleBox.width - CONFIG.battleBox.lineThickness,
    CONFIG.battleBox.height - CONFIG.battleBox.lineThickness,
  );
}

function drawDebugInformation() {
  if (!CONFIG.debug.enabled) return;

  const lines = [
    `Heart X: ${state.heartX.toFixed(CONFIG.debug.coordinateDecimals)}`,
    `Heart Y: ${state.heartY.toFixed(CONFIG.debug.coordinateDecimals)}`,
    `Battle box: ${CONFIG.battleBox.width} x ${CONFIG.battleBox.height}`,
    `FPS: ${Math.round(state.fps)}`,
    `Heart speed: ${CONFIG.heart.movementSpeed} px/s`,
  ];

  context.fillStyle = CONFIG.debug.color;
  context.font = `${CONFIG.debug.fontSize}px ${CONFIG.debug.fontFamily}`;
  context.textBaseline = 'alphabetic';
  lines.forEach((line, index) => {
    context.fillText(line, CONFIG.debug.x, CONFIG.debug.y + index * CONFIG.debug.lineHeight);
  });
}

function draw() {
  context.fillStyle = CONFIG.canvas.backgroundColor;
  context.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);
  drawBattleBox();
  drawHeart();
  drawDebugInformation();
}

function gameLoop(currentTime) {
  const elapsedMilliseconds = currentTime - state.previousTime;
  const deltaSeconds = Math.min(
    elapsedMilliseconds / CONFIG.timing.millisecondsPerSecond,
    CONFIG.timing.maximumDeltaSeconds,
  );

  state.previousTime = currentTime;
  if (deltaSeconds > 0) {
    const instantaneousFps = 1 / deltaSeconds;
    state.fps += (instantaneousFps - state.fps) * CONFIG.debug.fpsSmoothing;
  }

  update(deltaSeconds);
  draw();
  requestAnimationFrame(gameLoop);
}

const arrowKeys = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);

window.addEventListener('keydown', (event) => {
  if (!arrowKeys.has(event.key)) return;
  event.preventDefault();
  state.pressedKeys.add(event.key);
});

window.addEventListener('keyup', (event) => {
  if (!arrowKeys.has(event.key)) return;
  event.preventDefault();
  state.pressedKeys.delete(event.key);
});

window.addEventListener('blur', () => {
  state.pressedKeys.clear();
});

draw();
requestAnimationFrame(gameLoop);
