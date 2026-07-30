// Every adjustable gameplay, layout, animation, and color value lives here.
const CONFIG = Object.freeze({
  canvas: { width: 640, height: 480, backgroundColor: '#000000' },
  battleBox: { x: 32, y: 250, width: 576, height: 140, lineThickness: 4, lineColor: '#ffffff' },
  heart: { startX: 320, startY: 320, width: 16, height: 14, color: '#ff0000', movementSpeed: 120 },
  enemy: {
    x: 320, y: 118, width: 88, height: 88,
    bodyColor: '#d8d8d8', shadowColor: '#777777', eyeColor: '#111111', accentColor: '#ff8c32',
    idleDistance: 4, idleDuration: 1.4, maxHp: 100,
  },
  menu: {
    x: 28, y: 422, buttonWidth: 136, buttonHeight: 42, gap: 16, lineThickness: 3,
    fontSize: 22, heartOffsetX: 17, textOffsetX: 43, textBaselineOffset: 28,
    color: '#ff9d00', selectedColor: '#ffff00', disabledColor: '#8a5a27', crackColor: '#d8d8d8',
  },
  text: {
    x: 50, y: 276, lineHeight: 28, fontSize: 20, smallFontSize: 14,
    fontFamily: 'monospace', color: '#ffffff', damageColor: '#ff3030',
  },
  status: {
    x: 36, y: 409, fontSize: 16, hpLabelX: 155, hpBarX: 188, hpBarY: 396,
    hpBarWidth: 110, hpBarHeight: 14, hpColor: '#ffff00', hpLostColor: '#8b1a1a', maxHp: 20,
  },
  intro: { duration: 2.6, breakStart: 0.8, breakDuration: 0.75, flashDuration: 0.16 },
  attackMeter: {
    x: 72, y: 298, width: 496, height: 48, lineThickness: 4, lineColor: '#ffffff',
    centerWidth: 12, centerColor: '#00ff66', cursorWidth: 5, cursorColor: '#ff3030', speed: 430,
    minimumDamage: 4, maximumDamage: 24, resultDuration: 1.15,
  },
  choices: { x: 70, y: 294, gap: 38, heartOffsetX: 0, textOffsetX: 28 },
  items: { pieHealing: 20, burgerHealing: 12 },
  fireball: {
    radius: 8, speed: 170, spawnInterval: 0.48, attackDuration: 4.2, damage: 2,
    invulnerabilityDuration: 0.7, color: '#ff6a00', coreColor: '#ffff55', waveAmplitude: 25,
    waveFrequency: 3.2,
  },
  damageNumber: { yOffset: 70, fontSize: 28, duration: 1.15 },
  debug: {
    enabled: true, x: 8, y: 14, lineHeight: 14, fontSize: 11, fontFamily: 'monospace',
    color: '#00ff00', coordinateDecimals: 1, fpsSmoothing: 0.1,
  },
  timing: { maximumDeltaSeconds: 0.1, millisecondsPerSecond: 1000 },
});

const BATTLE_STATES = Object.freeze({
  INTRO: 'INTRO', PLAYER_MENU: 'PLAYER_MENU', FIGHT_MENU: 'FIGHT_MENU', ACT_MENU: 'ACT_MENU',
  ITEM_MENU: 'ITEM_MENU', ENEMY_TURN: 'ENEMY_TURN', GAME_OVER: 'GAME_OVER',
});

const MENU_OPTIONS = ['FIGHT', 'ACT', 'ITEM', 'MERCY'];
const ACT_OPTIONS = ['CHECK', 'TALK'];
const ITEM_DETAILS = Object.freeze([
  { name: 'PIE', healing: CONFIG.items.pieHealing },
  { name: 'BURGER', healing: CONFIG.items.burgerHealing },
]);

let canvas;
let context;
const canvas = document.querySelector('#gameCanvas');
const context = canvas.getContext('2d');
canvas.width = CONFIG.canvas.width;
canvas.height = CONFIG.canvas.height;

const state = {
  battleState: BATTLE_STATES.INTRO,
  stateTime: 0,
  heartX: CONFIG.heart.startX,
  heartY: CONFIG.heart.startY,
  pressedKeys: new Set(),
  previousTime: performance.now(),
  fps: 0,
  menuIndex: 0,
  choiceIndex: 0,
  message: '* A silent sentinel blocks the way.',
  mercyBroken: false,
  playerHp: CONFIG.status.maxHp,
  enemyHp: CONFIG.enemy.maxHp,
  inventory: ITEM_DETAILS.map((item) => ({ ...item })),
  meterX: CONFIG.attackMeter.x,
  meterStopped: false,
  actionTimer: 0,
  damageNumber: null,
  fireballs: [],
  fireballSpawnTimer: 0,
  invulnerabilityTimer: 0,
};

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
}

function setBattleState(nextState) {
  state.battleState = nextState;
  state.stateTime = 0;
  state.actionTimer = 0;
  state.choiceIndex = 0;
  state.pressedKeys.clear();
}

// This is the established delta-time movement and battle-box clamping mechanic.
function updateHeartMovement(deltaSeconds) {
  if (state.battleState !== BATTLE_STATES.ENEMY_TURN) return;

  let horizontalDirection = 0;
  let verticalDirection = 0;

function setBattleState(nextState) {
  state.battleState = nextState;
  state.stateTime = 0;
  state.actionTimer = 0;
  state.choiceIndex = 0;
  state.pressedKeys.clear();
}

// This is the established delta-time movement and battle-box clamping mechanic.
function updateHeartMovement(deltaSeconds) {
  if (state.battleState !== BATTLE_STATES.ENEMY_TURN) return;

  let horizontalDirection = 0;
  let verticalDirection = 0;
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
    horizontalDirection *= Math.SQRT1_2;
    verticalDirection *= Math.SQRT1_2;
  }

  state.heartX += horizontalDirection * CONFIG.heart.movementSpeed * deltaSeconds;
  state.heartY += verticalDirection * CONFIG.heart.movementSpeed * deltaSeconds;

  const innerLeft = CONFIG.battleBox.x + CONFIG.battleBox.lineThickness;
  const innerTop = CONFIG.battleBox.y + CONFIG.battleBox.lineThickness;
  const innerRight = CONFIG.battleBox.x + CONFIG.battleBox.width - CONFIG.battleBox.lineThickness;
  const innerBottom = CONFIG.battleBox.y + CONFIG.battleBox.height - CONFIG.battleBox.lineThickness;
  state.heartX = clamp(state.heartX, innerLeft + CONFIG.heart.width / 2, innerRight - CONFIG.heart.width / 2);
  state.heartY = clamp(state.heartY, innerTop + CONFIG.heart.height / 2, innerBottom - CONFIG.heart.height / 2);
}

function beginEnemyTurn() {
  setBattleState(BATTLE_STATES.ENEMY_TURN);
  state.heartX = CONFIG.heart.startX;
  state.heartY = CONFIG.heart.startY;
  state.fireballs = [];
  state.fireballSpawnTimer = 0;
  state.invulnerabilityTimer = 0;
  state.message = '';
}

function returnToPlayerMenu() {
  setBattleState(BATTLE_STATES.PLAYER_MENU);
  state.fireballs = [];
  state.message = '* Choose an action.';
}

function endGame(message) {
  setBattleState(BATTLE_STATES.GAME_OVER);
  state.fireballs = [];
  state.message = message;
}

function resetGame() {
  state.menuIndex = 0;
  state.message = '* A silent sentinel blocks the way.';
  state.mercyBroken = false;
  state.playerHp = CONFIG.status.maxHp;
  state.enemyHp = CONFIG.enemy.maxHp;
  state.inventory = ITEM_DETAILS.map((item) => ({ ...item }));
  state.damageNumber = null;
  state.meterStopped = false;
  state.meterX = CONFIG.attackMeter.x;
  state.heartX = CONFIG.heart.startX;
  state.heartY = CONFIG.heart.startY;
  setBattleState(BATTLE_STATES.INTRO);
}

function spawnFireball() {
  const fromLeft = state.fireballs.length % 2 === 0;
  const innerLeft = CONFIG.battleBox.x + CONFIG.battleBox.lineThickness;
  const innerRight = CONFIG.battleBox.x + CONFIG.battleBox.width - CONFIG.battleBox.lineThickness;
  const availableHeight = CONFIG.battleBox.height - CONFIG.battleBox.lineThickness * 2 - CONFIG.fireball.radius * 2;
  const sequence = (state.fireballs.length * 0.37) % 1;
  state.fireballs.push({
    x: fromLeft ? innerLeft - CONFIG.fireball.radius : innerRight + CONFIG.fireball.radius,
    baseY: CONFIG.battleBox.y + CONFIG.battleBox.lineThickness + CONFIG.fireball.radius + availableHeight * sequence,
    y: 0,
    direction: fromLeft ? 1 : -1,
    age: 0,
  });
}

function fireballHitsHeart(fireball) {
  const closestX = clamp(fireball.x, state.heartX - CONFIG.heart.width / 2, state.heartX + CONFIG.heart.width / 2);
  const closestY = clamp(fireball.y, state.heartY - CONFIG.heart.height / 2, state.heartY + CONFIG.heart.height / 2);
  return Math.hypot(fireball.x - closestX, fireball.y - closestY) <= CONFIG.fireball.radius;
}

function updateFireballs(deltaSeconds) {
  state.fireballSpawnTimer -= deltaSeconds;
  if (state.fireballSpawnTimer <= 0) {
    spawnFireball();
    state.fireballSpawnTimer = CONFIG.fireball.spawnInterval;
  }
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
  state.heartX = clamp(state.heartX, innerLeft + CONFIG.heart.width / 2, innerRight - CONFIG.heart.width / 2);
  state.heartY = clamp(state.heartY, innerTop + CONFIG.heart.height / 2, innerBottom - CONFIG.heart.height / 2);
}

function beginEnemyTurn() {
  setBattleState(BATTLE_STATES.ENEMY_TURN);
  state.heartX = CONFIG.heart.startX;
  state.heartY = CONFIG.heart.startY;
  state.fireballs = [];
  state.fireballSpawnTimer = 0;
  state.invulnerabilityTimer = 0;
  state.message = '';
}

function returnToPlayerMenu() {
  setBattleState(BATTLE_STATES.PLAYER_MENU);
  state.fireballs = [];
  state.message = '* Choose an action.';
}

function endGame(message) {
  setBattleState(BATTLE_STATES.GAME_OVER);
  state.fireballs = [];
  state.message = message;
}

function resetGame() {
  state.menuIndex = 0;
  state.message = '* A silent sentinel blocks the way.';
  state.mercyBroken = false;
  state.playerHp = CONFIG.status.maxHp;
  state.enemyHp = CONFIG.enemy.maxHp;
  state.inventory = ITEM_DETAILS.map((item) => ({ ...item }));
  state.damageNumber = null;
  state.meterStopped = false;
  state.meterX = CONFIG.attackMeter.x;
  state.heartX = CONFIG.heart.startX;
  state.heartY = CONFIG.heart.startY;
  setBattleState(BATTLE_STATES.INTRO);
}

function spawnFireball() {
  const fromLeft = state.fireballs.length % 2 === 0;
  const innerLeft = CONFIG.battleBox.x + CONFIG.battleBox.lineThickness;
  const innerRight = CONFIG.battleBox.x + CONFIG.battleBox.width - CONFIG.battleBox.lineThickness;
  const availableHeight = CONFIG.battleBox.height - CONFIG.battleBox.lineThickness * 2 - CONFIG.fireball.radius * 2;
  const sequence = (state.fireballs.length * 0.37) % 1;
  state.fireballs.push({
    x: fromLeft ? innerLeft - CONFIG.fireball.radius : innerRight + CONFIG.fireball.radius,
    baseY: CONFIG.battleBox.y + CONFIG.battleBox.lineThickness + CONFIG.fireball.radius + availableHeight * sequence,
    y: 0,
    direction: fromLeft ? 1 : -1,
    age: 0,
  });
}

function fireballHitsHeart(fireball) {
  const closestX = clamp(fireball.x, state.heartX - CONFIG.heart.width / 2, state.heartX + CONFIG.heart.width / 2);
  const closestY = clamp(fireball.y, state.heartY - CONFIG.heart.height / 2, state.heartY + CONFIG.heart.height / 2);
  return Math.hypot(fireball.x - closestX, fireball.y - closestY) <= CONFIG.fireball.radius;
}

function updateFireballs(deltaSeconds) {
  state.fireballSpawnTimer -= deltaSeconds;
  if (state.fireballSpawnTimer <= 0) {
    spawnFireball();
    state.fireballSpawnTimer = CONFIG.fireball.spawnInterval;
  }
  state.invulnerabilityTimer = Math.max(0, state.invulnerabilityTimer - deltaSeconds);
  const innerLeft = CONFIG.battleBox.x + CONFIG.battleBox.lineThickness;
  const innerRight = CONFIG.battleBox.x + CONFIG.battleBox.width - CONFIG.battleBox.lineThickness;

  state.fireballs.forEach((fireball) => {
    fireball.age += deltaSeconds;
    fireball.x += fireball.direction * CONFIG.fireball.speed * deltaSeconds;
    fireball.y = fireball.baseY + Math.sin(fireball.age * CONFIG.fireball.waveFrequency) * CONFIG.fireball.waveAmplitude;
    if (state.invulnerabilityTimer === 0 && fireballHitsHeart(fireball)) {
      state.playerHp = clamp(state.playerHp - CONFIG.fireball.damage, 0, CONFIG.status.maxHp);
      state.invulnerabilityTimer = CONFIG.fireball.invulnerabilityDuration;
      if (state.playerHp === 0) endGame('* You were defeated. Press Z or Enter to restart.');
    }
  });
  state.fireballs = state.fireballs.filter((fireball) => fireball.x > innerLeft - CONFIG.fireball.radius * 2 && fireball.x < innerRight + CONFIG.fireball.radius * 2);
}

function update(deltaSeconds) {
  state.stateTime += deltaSeconds;
  if (state.damageNumber) {
    state.damageNumber.time -= deltaSeconds;
    if (state.damageNumber.time <= 0) state.damageNumber = null;
  }

  if (state.battleState === BATTLE_STATES.INTRO) {
    if (state.stateTime >= CONFIG.intro.breakStart) state.mercyBroken = true;
    if (state.stateTime >= CONFIG.intro.duration) returnToPlayerMenu();
  } else if (state.battleState === BATTLE_STATES.FIGHT_MENU && !state.meterStopped) {
    state.meterX += CONFIG.attackMeter.speed * deltaSeconds;
    if (state.meterX >= CONFIG.attackMeter.x + CONFIG.attackMeter.width) stopFightMeter();
  } else if (state.actionTimer > 0) {
    state.actionTimer -= deltaSeconds;
    if (state.actionTimer <= 0 && state.battleState !== BATTLE_STATES.GAME_OVER) beginEnemyTurn();
  } else if (state.battleState === BATTLE_STATES.ENEMY_TURN) {
    updateHeartMovement(deltaSeconds);
    updateFireballs(deltaSeconds);
    if (state.battleState === BATTLE_STATES.ENEMY_TURN && state.stateTime >= CONFIG.fireball.attackDuration) returnToPlayerMenu();
  }
}

function stopFightMeter() {
  if (state.meterStopped) return;
  state.meterStopped = true;
  const center = CONFIG.attackMeter.x + CONFIG.attackMeter.width / 2;
  const distanceRatio = clamp(Math.abs(state.meterX - center) / (CONFIG.attackMeter.width / 2), 0, 1);
  const damage = Math.round(CONFIG.attackMeter.maximumDamage - distanceRatio * (CONFIG.attackMeter.maximumDamage - CONFIG.attackMeter.minimumDamage));
  state.enemyHp = clamp(state.enemyHp - damage, 0, CONFIG.enemy.maxHp);
  state.damageNumber = { value: damage, time: CONFIG.damageNumber.duration };
  state.message = `* ${damage} damage!`;
  if (state.enemyHp === 0) endGame('* Victory! Press Z or Enter to restart.');
  else state.actionTimer = CONFIG.attackMeter.resultDuration;
}

function confirmSelection() {
  if (state.battleState === BATTLE_STATES.INTRO || state.actionTimer > 0) return;
  if (state.battleState === BATTLE_STATES.GAME_OVER) {
    resetGame();
    return;
  }
  if (state.battleState === BATTLE_STATES.FIGHT_MENU) {
    stopFightMeter();
    return;
  }
  if (state.battleState === BATTLE_STATES.ACT_MENU) {
    state.message = state.choiceIndex === 0 ? `* SENTINEL - ATK 8 DEF 2\n* An original practice opponent.` : '* You talk. The sentinel listens in silence.';
    state.actionTimer = CONFIG.attackMeter.resultDuration;
    return;
  }
  if (state.battleState === BATTLE_STATES.ITEM_MENU) {
    if (state.inventory.length === 0) return;
    const [item] = state.inventory.splice(state.choiceIndex, 1);
    state.playerHp = clamp(state.playerHp + item.healing, 0, CONFIG.status.maxHp);
    state.message = `* You ate the ${item.name}. HP restored.`;
    state.choiceIndex = clamp(state.choiceIndex, 0, Math.max(0, state.inventory.length - 1));
    state.actionTimer = CONFIG.attackMeter.resultDuration;
    return;
  }
  if (state.battleState !== BATTLE_STATES.PLAYER_MENU) return;

  const selected = MENU_OPTIONS[state.menuIndex];
  if (selected === 'FIGHT') {
    setBattleState(BATTLE_STATES.FIGHT_MENU);
    state.meterX = CONFIG.attackMeter.x;
    state.meterStopped = false;
    state.message = '* Stop the line near the center!';
  } else if (selected === 'ACT') {
    setBattleState(BATTLE_STATES.ACT_MENU);
    state.message = '* Choose an action.';
  } else if (selected === 'ITEM') {
    setBattleState(BATTLE_STATES.ITEM_MENU);
    state.message = state.inventory.length ? '* Choose an item.' : '* Your inventory is empty.';
  } else {
    state.message = 'The MERCY button is broken.';
  }
}

function returnSelection() {
  if ([BATTLE_STATES.FIGHT_MENU, BATTLE_STATES.ACT_MENU, BATTLE_STATES.ITEM_MENU].includes(state.battleState) && state.actionTimer === 0) {
    returnToPlayerMenu();
  }
}

function moveSelection(direction) {
  if (state.battleState === BATTLE_STATES.PLAYER_MENU) {
    state.menuIndex = (state.menuIndex + direction + MENU_OPTIONS.length) % MENU_OPTIONS.length;
  } else if (state.battleState === BATTLE_STATES.ACT_MENU) {
    state.choiceIndex = (state.choiceIndex + direction + ACT_OPTIONS.length) % ACT_OPTIONS.length;
  } else if (state.battleState === BATTLE_STATES.ITEM_MENU && state.inventory.length) {
    state.choiceIndex = (state.choiceIndex + direction + state.inventory.length) % state.inventory.length;
  }
}

function drawHeart(x = state.heartX, y = state.heartY) {
  const left = x - CONFIG.heart.width / 2;
  const top = y - CONFIG.heart.height / 2;
  const unitX = CONFIG.heart.width / 4;
  const unitY = CONFIG.heart.height / 4;
  context.fillStyle = CONFIG.heart.color;
  context.beginPath();
  context.moveTo(x, top + unitY);
  context.bezierCurveTo(left + unitX, top - unitY, left, top + unitY, left, top + unitY * 2);
  context.bezierCurveTo(left, top + unitY * 3, x, top + CONFIG.heart.height, x, top + CONFIG.heart.height);
  context.bezierCurveTo(x, top + CONFIG.heart.height, left + CONFIG.heart.width, top + unitY * 3, left + CONFIG.heart.width, top + unitY * 2);
  context.bezierCurveTo(left + CONFIG.heart.width, top + unitY, left + unitX * 3, top - unitY, x, top + unitY);
  context.fill();
}

function drawEnemy() {
  const bob = Math.sin((state.stateTime / CONFIG.enemy.idleDuration) * Math.PI * 2) * CONFIG.enemy.idleDistance;
  const left = CONFIG.enemy.x - CONFIG.enemy.width / 2;
  const top = CONFIG.enemy.y - CONFIG.enemy.height / 2 + bob;
  const cellWidth = CONFIG.enemy.width / 11;
  const cellHeight = CONFIG.enemy.height / 11;
  const pixel = (x, y, width, height) => context.fillRect(
    left + x * cellWidth,
    top + y * cellHeight,
    width * cellWidth,
    height * cellHeight,
  );
  context.fillStyle = CONFIG.enemy.shadowColor;
  pixel(1, 2, 9, 6);
  context.fillStyle = CONFIG.enemy.bodyColor;
  pixel(2, 0, 7, 2);
  pixel(0, 2, 11, 6);
  pixel(2, 8, 2, 3);
  pixel(7, 8, 2, 3);
  context.fillStyle = CONFIG.enemy.eyeColor;
  pixel(2, 4, 1, 1);
  pixel(8, 4, 1, 1);
  context.fillStyle = CONFIG.enemy.accentColor;
  pixel(4, 6, 3, 1);
}

function drawBattleBox() {
  const halfLine = CONFIG.battleBox.lineThickness / 2;
  context.strokeStyle = CONFIG.battleBox.lineColor;
  context.lineWidth = CONFIG.battleBox.lineThickness;
  context.strokeRect(CONFIG.battleBox.x + halfLine, CONFIG.battleBox.y + halfLine,
    CONFIG.battleBox.width - CONFIG.battleBox.lineThickness, CONFIG.battleBox.height - CONFIG.battleBox.lineThickness);
}

function drawMenu() {
  context.font = `bold ${CONFIG.menu.fontSize}px ${CONFIG.text.fontFamily}`;
  MENU_OPTIONS.forEach((option, index) => {
    const x = CONFIG.menu.x + index * (CONFIG.menu.buttonWidth + CONFIG.menu.gap);
    const selected = state.battleState === BATTLE_STATES.PLAYER_MENU && state.menuIndex === index;
    context.strokeStyle = option === 'MERCY' && state.mercyBroken ? CONFIG.menu.disabledColor : selected ? CONFIG.menu.selectedColor : CONFIG.menu.color;
    context.lineWidth = CONFIG.menu.lineThickness;
    context.strokeRect(x, CONFIG.menu.y, CONFIG.menu.buttonWidth, CONFIG.menu.buttonHeight);
    context.fillStyle = context.strokeStyle;
    context.fillText(option, x + CONFIG.menu.textOffsetX, CONFIG.menu.y + CONFIG.menu.textBaselineOffset);
    if (selected) drawHeart(x + CONFIG.menu.heartOffsetX, CONFIG.menu.y + CONFIG.menu.buttonHeight / 2);
    if (option === 'MERCY' && state.mercyBroken) {
      context.strokeStyle = CONFIG.menu.crackColor;
      context.beginPath();
      context.moveTo(x + CONFIG.menu.buttonWidth * 0.38, CONFIG.menu.y);
      context.lineTo(x + CONFIG.menu.buttonWidth * 0.53, CONFIG.menu.y + CONFIG.menu.buttonHeight * 0.42);
      context.lineTo(x + CONFIG.menu.buttonWidth * 0.46, CONFIG.menu.y + CONFIG.menu.buttonHeight);
      context.stroke();
    }
  });
}

function drawStatus() {
  context.font = `${CONFIG.status.fontSize}px ${CONFIG.text.fontFamily}`;
  context.fillStyle = CONFIG.text.color;
  context.fillText('LV 1', CONFIG.status.x, CONFIG.status.y);
  context.fillText('HP', CONFIG.status.hpLabelX, CONFIG.status.y);
  context.fillStyle = CONFIG.status.hpLostColor;
  context.fillRect(CONFIG.status.hpBarX, CONFIG.status.hpBarY, CONFIG.status.hpBarWidth, CONFIG.status.hpBarHeight);
  context.fillStyle = CONFIG.status.hpColor;
  context.fillRect(CONFIG.status.hpBarX, CONFIG.status.hpBarY, CONFIG.status.hpBarWidth * state.playerHp / CONFIG.status.maxHp, CONFIG.status.hpBarHeight);
  context.fillStyle = CONFIG.text.color;
  context.fillText(`${state.playerHp} / ${CONFIG.status.maxHp}`, CONFIG.status.hpBarX + CONFIG.status.hpBarWidth + CONFIG.menu.gap, CONFIG.status.y);
}

function drawMessage() {
  context.fillStyle = CONFIG.text.color;
  context.font = `${CONFIG.text.fontSize}px ${CONFIG.text.fontFamily}`;
  state.message.split('\n').forEach((line, index) => context.fillText(line, CONFIG.text.x, CONFIG.text.y + index * CONFIG.text.lineHeight));
}

function drawChoices(options) {
  context.font = `${CONFIG.text.fontSize}px ${CONFIG.text.fontFamily}`;
  options.forEach((option, index) => {
    const y = CONFIG.choices.y + index * CONFIG.choices.gap;
    if (index === state.choiceIndex) drawHeart(CONFIG.choices.x + CONFIG.choices.heartOffsetX, y - CONFIG.heart.height / 4);
    context.fillStyle = CONFIG.text.color;
    context.fillText(option.name || option, CONFIG.choices.x + CONFIG.choices.textOffsetX, y);
  });
}

function drawFightMeter() {
  context.strokeStyle = CONFIG.attackMeter.lineColor;
  context.lineWidth = CONFIG.attackMeter.lineThickness;
  context.strokeRect(CONFIG.attackMeter.x, CONFIG.attackMeter.y, CONFIG.attackMeter.width, CONFIG.attackMeter.height);
  context.fillStyle = CONFIG.attackMeter.centerColor;
  context.fillRect(CONFIG.attackMeter.x + CONFIG.attackMeter.width / 2 - CONFIG.attackMeter.centerWidth / 2,
    CONFIG.attackMeter.y, CONFIG.attackMeter.centerWidth, CONFIG.attackMeter.height);
  context.fillStyle = CONFIG.attackMeter.cursorColor;
  context.fillRect(state.meterX - CONFIG.attackMeter.cursorWidth / 2, CONFIG.attackMeter.y,
    CONFIG.attackMeter.cursorWidth, CONFIG.attackMeter.height);
}

function drawFireballs() {
  state.fireballs.forEach((fireball) => {
    context.fillStyle = CONFIG.fireball.color;
    context.beginPath();
    context.arc(fireball.x, fireball.y, CONFIG.fireball.radius, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = CONFIG.fireball.coreColor;
    context.beginPath();
    context.arc(fireball.x, fireball.y, CONFIG.fireball.radius / 2, 0, Math.PI * 2);
    context.fill();
  });
}

function drawIntroEffect() {
  const elapsed = state.stateTime - CONFIG.intro.breakStart;
  if (elapsed < 0 || elapsed > CONFIG.intro.breakDuration) return;
  const mercyX = CONFIG.menu.x + 3 * (CONFIG.menu.buttonWidth + CONFIG.menu.gap);
  const progress = elapsed / CONFIG.intro.breakDuration;
  context.strokeStyle = progress < CONFIG.intro.flashDuration / CONFIG.intro.breakDuration ? CONFIG.menu.selectedColor : CONFIG.menu.crackColor;
  context.lineWidth = CONFIG.menu.lineThickness;
  context.beginPath();
  context.moveTo(CONFIG.enemy.x, CONFIG.enemy.y);
  context.lineTo(mercyX + CONFIG.menu.buttonWidth / 2, CONFIG.menu.y + CONFIG.menu.buttonHeight / 2);
  context.stroke();
}

function drawDebugInformation() {
  if (!CONFIG.debug.enabled) return;
  const lines = [
    `State: ${state.battleState}`,
    `Heart X: ${state.heartX.toFixed(CONFIG.debug.coordinateDecimals)}`,
    `Heart Y: ${state.heartY.toFixed(CONFIG.debug.coordinateDecimals)}`,
    `Battle box: ${CONFIG.battleBox.width} x ${CONFIG.battleBox.height}`,
    `FPS: ${Math.round(state.fps)}`,
    `Heart speed: ${CONFIG.heart.movementSpeed} px/s`,
  ];
  context.fillStyle = CONFIG.debug.color;
  context.font = `${CONFIG.debug.fontSize}px ${CONFIG.debug.fontFamily}`;
  lines.forEach((line, index) => context.fillText(line, CONFIG.debug.x, CONFIG.debug.y + index * CONFIG.debug.lineHeight));
}

function draw() {
  context.fillStyle = CONFIG.canvas.backgroundColor;
  context.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);
  drawEnemy();
  drawBattleBox();
  drawStatus();
  drawMenu();

  if (state.battleState === BATTLE_STATES.ENEMY_TURN) {
    drawFireballs();
    if (state.invulnerabilityTimer === 0 || Math.floor(state.invulnerabilityTimer * 10) % 2 === 0) drawHeart();
  } else if (state.battleState === BATTLE_STATES.FIGHT_MENU) drawFightMeter();
  else if (state.battleState === BATTLE_STATES.ACT_MENU) drawChoices(ACT_OPTIONS);
  else if (state.battleState === BATTLE_STATES.ITEM_MENU && state.inventory.length) drawChoices(state.inventory);
  else drawMessage();

  if (state.damageNumber) {
    context.fillStyle = CONFIG.text.damageColor;
    context.font = `bold ${CONFIG.damageNumber.fontSize}px ${CONFIG.text.fontFamily}`;
    context.textAlign = 'center';
    context.fillText(String(state.damageNumber.value), CONFIG.enemy.x, CONFIG.enemy.y - CONFIG.damageNumber.yOffset);
    context.textAlign = 'start';
  }
  if (state.battleState === BATTLE_STATES.INTRO) drawIntroEffect();
  drawDebugInformation();
}

function gameLoop(currentTime) {
  const deltaSeconds = Math.min((currentTime - state.previousTime) / CONFIG.timing.millisecondsPerSecond,
    CONFIG.timing.maximumDeltaSeconds);
  state.previousTime = currentTime;
  if (deltaSeconds > 0) state.fps += (1 / deltaSeconds - state.fps) * CONFIG.debug.fpsSmoothing;
  update(deltaSeconds);
  draw();
  requestAnimationFrame(gameLoop);
}

const handledKeys = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'z', 'Z', 'Enter', 'x', 'X', 'Backspace']);

function setUpInput() {
  window.addEventListener('keydown', (event) => {
    if (!handledKeys.has(event.key)) return;
    event.preventDefault();
    if (state.battleState === BATTLE_STATES.ENEMY_TURN && event.key.startsWith('Arrow')) {
      state.pressedKeys.add(event.key);
      return;
    }
    if (event.repeat) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') moveSelection(-1);
    else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') moveSelection(1);
    else if (event.key === 'z' || event.key === 'Z' || event.key === 'Enter') confirmSelection();
    else returnSelection();
  });

  window.addEventListener('keyup', (event) => {
    if (!handledKeys.has(event.key)) return;
    event.preventDefault();
    state.pressedKeys.delete(event.key);
  });

  window.addEventListener('blur', () => state.pressedKeys.clear());
}

function initializeGame() {
  canvas = document.querySelector('#gameCanvas');
  if (!canvas) {
    console.error('Unable to start: canvas#gameCanvas was not found.');
    return;
  }

  context = canvas.getContext('2d');
  if (!context) {
    canvas.textContent = 'Unable to start: this browser does not support a 2D canvas.';
    return;
  }

  canvas.width = CONFIG.canvas.width;
  canvas.height = CONFIG.canvas.height;
  state.previousTime = performance.now();
  setUpInput();
  draw();
  requestAnimationFrame(gameLoop);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeGame, { once: true });
} else {
  initializeGame();
}
  }
  if (state.battleState === BATTLE_STATES.FIGHT_MENU) {
    stopFightMeter();
    return;
  }
  if (state.battleState === BATTLE_STATES.ACT_MENU) {
    state.message = state.choiceIndex === 0 ? `* SENTINEL - ATK 8 DEF 2\n* An original practice opponent.` : '* You talk. The sentinel listens in silence.';
    state.actionTimer = CONFIG.attackMeter.resultDuration;
    return;
  }
  if (state.battleState === BATTLE_STATES.ITEM_MENU) {
    if (state.inventory.length === 0) return;
    const [item] = state.inventory.splice(state.choiceIndex, 1);
    state.playerHp = clamp(state.playerHp + item.healing, 0, CONFIG.status.maxHp);
    state.message = `* You ate the ${item.name}. HP restored.`;
    state.choiceIndex = clamp(state.choiceIndex, 0, Math.max(0, state.inventory.length - 1));
    state.actionTimer = CONFIG.attackMeter.resultDuration;
    return;
  }
  if (state.battleState !== BATTLE_STATES.PLAYER_MENU) return;

  const selected = MENU_OPTIONS[state.menuIndex];
  if (selected === 'FIGHT') {
    setBattleState(BATTLE_STATES.FIGHT_MENU);
    state.meterX = CONFIG.attackMeter.x;
    state.meterStopped = false;
    state.message = '* Stop the line near the center!';
  } else if (selected === 'ACT') {
    setBattleState(BATTLE_STATES.ACT_MENU);
    state.message = '* Choose an action.';
  } else if (selected === 'ITEM') {
    setBattleState(BATTLE_STATES.ITEM_MENU);
    state.message = state.inventory.length ? '* Choose an item.' : '* Your inventory is empty.';
  } else {
    state.message = 'The MERCY button is broken.';
  }
}

function returnSelection() {
  if ([BATTLE_STATES.FIGHT_MENU, BATTLE_STATES.ACT_MENU, BATTLE_STATES.ITEM_MENU].includes(state.battleState) && state.actionTimer === 0) {
    returnToPlayerMenu();
  }
}

function moveSelection(direction) {
  if (state.battleState === BATTLE_STATES.PLAYER_MENU) {
    state.menuIndex = (state.menuIndex + direction + MENU_OPTIONS.length) % MENU_OPTIONS.length;
  } else if (state.battleState === BATTLE_STATES.ACT_MENU) {
    state.choiceIndex = (state.choiceIndex + direction + ACT_OPTIONS.length) % ACT_OPTIONS.length;
  } else if (state.battleState === BATTLE_STATES.ITEM_MENU && state.inventory.length) {
    state.choiceIndex = (state.choiceIndex + direction + state.inventory.length) % state.inventory.length;
  }
}

function drawHeart(x = state.heartX, y = state.heartY) {
  const left = x - CONFIG.heart.width / 2;
  const top = y - CONFIG.heart.height / 2;
  const unitX = CONFIG.heart.width / 4;
  const unitY = CONFIG.heart.height / 4;
  context.fillStyle = CONFIG.heart.color;
  context.beginPath();
  context.moveTo(x, top + unitY);
  context.bezierCurveTo(left + unitX, top - unitY, left, top + unitY, left, top + unitY * 2);
  context.bezierCurveTo(left, top + unitY * 3, x, top + CONFIG.heart.height, x, top + CONFIG.heart.height);
  context.bezierCurveTo(x, top + CONFIG.heart.height, left + CONFIG.heart.width, top + unitY * 3, left + CONFIG.heart.width, top + unitY * 2);
  context.bezierCurveTo(left + CONFIG.heart.width, top + unitY, left + unitX * 3, top - unitY, x, top + unitY);
  context.fill();
}

function drawEnemy() {
  const bob = Math.sin((state.stateTime / CONFIG.enemy.idleDuration) * Math.PI * 2) * CONFIG.enemy.idleDistance;
  const left = CONFIG.enemy.x - CONFIG.enemy.width / 2;
  const top = CONFIG.enemy.y - CONFIG.enemy.height / 2 + bob;
  const cellWidth = CONFIG.enemy.width / 11;
  const cellHeight = CONFIG.enemy.height / 11;
  const pixel = (x, y, width, height) => context.fillRect(
    left + x * cellWidth,
    top + y * cellHeight,
    width * cellWidth,
    height * cellHeight,
  );
  context.fillStyle = CONFIG.enemy.shadowColor;
  pixel(1, 2, 9, 6);
  context.fillStyle = CONFIG.enemy.bodyColor;
  pixel(2, 0, 7, 2);
  pixel(0, 2, 11, 6);
  pixel(2, 8, 2, 3);
  pixel(7, 8, 2, 3);
  context.fillStyle = CONFIG.enemy.eyeColor;
  pixel(2, 4, 1, 1);
  pixel(8, 4, 1, 1);
  context.fillStyle = CONFIG.enemy.accentColor;
  pixel(4, 6, 3, 1);
}

function drawBattleBox() {
  const halfLine = CONFIG.battleBox.lineThickness / 2;
  context.strokeStyle = CONFIG.battleBox.lineColor;
  context.lineWidth = CONFIG.battleBox.lineThickness;
  context.strokeRect(CONFIG.battleBox.x + halfLine, CONFIG.battleBox.y + halfLine,
    CONFIG.battleBox.width - CONFIG.battleBox.lineThickness, CONFIG.battleBox.height - CONFIG.battleBox.lineThickness);
}

function drawMenu() {
  context.font = `bold ${CONFIG.menu.fontSize}px ${CONFIG.text.fontFamily}`;
  MENU_OPTIONS.forEach((option, index) => {
    const x = CONFIG.menu.x + index * (CONFIG.menu.buttonWidth + CONFIG.menu.gap);
    const selected = state.battleState === BATTLE_STATES.PLAYER_MENU && state.menuIndex === index;
    context.strokeStyle = option === 'MERCY' && state.mercyBroken ? CONFIG.menu.disabledColor : selected ? CONFIG.menu.selectedColor : CONFIG.menu.color;
    context.lineWidth = CONFIG.menu.lineThickness;
    context.strokeRect(x, CONFIG.menu.y, CONFIG.menu.buttonWidth, CONFIG.menu.buttonHeight);
    context.fillStyle = context.strokeStyle;
    context.fillText(option, x + CONFIG.menu.textOffsetX, CONFIG.menu.y + CONFIG.menu.textBaselineOffset);
    if (selected) drawHeart(x + CONFIG.menu.heartOffsetX, CONFIG.menu.y + CONFIG.menu.buttonHeight / 2);
    if (option === 'MERCY' && state.mercyBroken) {
      context.strokeStyle = CONFIG.menu.crackColor;
      context.beginPath();
      context.moveTo(x + CONFIG.menu.buttonWidth * 0.38, CONFIG.menu.y);
      context.lineTo(x + CONFIG.menu.buttonWidth * 0.53, CONFIG.menu.y + CONFIG.menu.buttonHeight * 0.42);
      context.lineTo(x + CONFIG.menu.buttonWidth * 0.46, CONFIG.menu.y + CONFIG.menu.buttonHeight);
      context.stroke();
    }
  });
}

function drawStatus() {
  context.font = `${CONFIG.status.fontSize}px ${CONFIG.text.fontFamily}`;
  context.fillStyle = CONFIG.text.color;
  context.fillText('LV 1', CONFIG.status.x, CONFIG.status.y);
  context.fillText('HP', CONFIG.status.hpLabelX, CONFIG.status.y);
  context.fillStyle = CONFIG.status.hpLostColor;
  context.fillRect(CONFIG.status.hpBarX, CONFIG.status.hpBarY, CONFIG.status.hpBarWidth, CONFIG.status.hpBarHeight);
  context.fillStyle = CONFIG.status.hpColor;
  context.fillRect(CONFIG.status.hpBarX, CONFIG.status.hpBarY, CONFIG.status.hpBarWidth * state.playerHp / CONFIG.status.maxHp, CONFIG.status.hpBarHeight);
  context.fillStyle = CONFIG.text.color;
  context.fillText(`${state.playerHp} / ${CONFIG.status.maxHp}`, CONFIG.status.hpBarX + CONFIG.status.hpBarWidth + CONFIG.menu.gap, CONFIG.status.y);
}

function drawMessage() {
  context.fillStyle = CONFIG.text.color;
  context.font = `${CONFIG.text.fontSize}px ${CONFIG.text.fontFamily}`;
  state.message.split('\n').forEach((line, index) => context.fillText(line, CONFIG.text.x, CONFIG.text.y + index * CONFIG.text.lineHeight));
}

function drawChoices(options) {
  context.font = `${CONFIG.text.fontSize}px ${CONFIG.text.fontFamily}`;
  options.forEach((option, index) => {
    const y = CONFIG.choices.y + index * CONFIG.choices.gap;
    if (index === state.choiceIndex) drawHeart(CONFIG.choices.x + CONFIG.choices.heartOffsetX, y - CONFIG.heart.height / 4);
    context.fillStyle = CONFIG.text.color;
    context.fillText(option.name || option, CONFIG.choices.x + CONFIG.choices.textOffsetX, y);
  });
}

function drawFightMeter() {
  context.strokeStyle = CONFIG.attackMeter.lineColor;
  context.lineWidth = CONFIG.attackMeter.lineThickness;
  context.strokeRect(CONFIG.attackMeter.x, CONFIG.attackMeter.y, CONFIG.attackMeter.width, CONFIG.attackMeter.height);
  context.fillStyle = CONFIG.attackMeter.centerColor;
  context.fillRect(CONFIG.attackMeter.x + CONFIG.attackMeter.width / 2 - CONFIG.attackMeter.centerWidth / 2,
    CONFIG.attackMeter.y, CONFIG.attackMeter.centerWidth, CONFIG.attackMeter.height);
  context.fillStyle = CONFIG.attackMeter.cursorColor;
  context.fillRect(state.meterX - CONFIG.attackMeter.cursorWidth / 2, CONFIG.attackMeter.y,
    CONFIG.attackMeter.cursorWidth, CONFIG.attackMeter.height);
}

function drawFireballs() {
  state.fireballs.forEach((fireball) => {
    context.fillStyle = CONFIG.fireball.color;
    context.beginPath();
    context.arc(fireball.x, fireball.y, CONFIG.fireball.radius, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = CONFIG.fireball.coreColor;
    context.beginPath();
    context.arc(fireball.x, fireball.y, CONFIG.fireball.radius / 2, 0, Math.PI * 2);
    context.fill();
  });
}

function drawIntroEffect() {
  const elapsed = state.stateTime - CONFIG.intro.breakStart;
  if (elapsed < 0 || elapsed > CONFIG.intro.breakDuration) return;
  const mercyX = CONFIG.menu.x + 3 * (CONFIG.menu.buttonWidth + CONFIG.menu.gap);
  const progress = elapsed / CONFIG.intro.breakDuration;
  context.strokeStyle = progress < CONFIG.intro.flashDuration / CONFIG.intro.breakDuration ? CONFIG.menu.selectedColor : CONFIG.menu.crackColor;
  context.lineWidth = CONFIG.menu.lineThickness;
  context.beginPath();
  context.moveTo(CONFIG.enemy.x, CONFIG.enemy.y);
  context.lineTo(mercyX + CONFIG.menu.buttonWidth / 2, CONFIG.menu.y + CONFIG.menu.buttonHeight / 2);
  context.stroke();
}

function drawDebugInformation() {
  if (!CONFIG.debug.enabled) return;
  const lines = [
    `State: ${state.battleState}`,

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
  lines.forEach((line, index) => context.fillText(line, CONFIG.debug.x, CONFIG.debug.y + index * CONFIG.debug.lineHeight));

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
  drawEnemy();
  drawBattleBox();
  drawStatus();
  drawMenu();

  if (state.battleState === BATTLE_STATES.ENEMY_TURN) {
    drawFireballs();
    if (state.invulnerabilityTimer === 0 || Math.floor(state.invulnerabilityTimer * 10) % 2 === 0) drawHeart();
  } else if (state.battleState === BATTLE_STATES.FIGHT_MENU) drawFightMeter();
  else if (state.battleState === BATTLE_STATES.ACT_MENU) drawChoices(ACT_OPTIONS);
  else if (state.battleState === BATTLE_STATES.ITEM_MENU && state.inventory.length) drawChoices(state.inventory);
  else drawMessage();

  if (state.damageNumber) {
    context.fillStyle = CONFIG.text.damageColor;
    context.font = `bold ${CONFIG.damageNumber.fontSize}px ${CONFIG.text.fontFamily}`;
    context.textAlign = 'center';
    context.fillText(String(state.damageNumber.value), CONFIG.enemy.x, CONFIG.enemy.y - CONFIG.damageNumber.yOffset);
    context.textAlign = 'start';
  }
  if (state.battleState === BATTLE_STATES.INTRO) drawIntroEffect();
  drawDebugInformation();
}

function gameLoop(currentTime) {
  const deltaSeconds = Math.min((currentTime - state.previousTime) / CONFIG.timing.millisecondsPerSecond,
    CONFIG.timing.maximumDeltaSeconds);
  state.previousTime = currentTime;
  if (deltaSeconds > 0) state.fps += (1 / deltaSeconds - state.fps) * CONFIG.debug.fpsSmoothing;
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

const handledKeys = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'z', 'Z', 'Enter', 'x', 'X', 'Backspace']);
window.addEventListener('keydown', (event) => {
  if (!handledKeys.has(event.key)) return;
  event.preventDefault();
  if (state.battleState === BATTLE_STATES.ENEMY_TURN && event.key.startsWith('Arrow')) {
    state.pressedKeys.add(event.key);
    return;
  }
  if (event.repeat) return;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') moveSelection(-1);
  else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') moveSelection(1);
  else if (event.key === 'z' || event.key === 'Z' || event.key === 'Enter') confirmSelection();
  else returnSelection();
});

window.addEventListener('keyup', (event) => {
  if (!handledKeys.has(event.key)) return;
  event.preventDefault();
  state.pressedKeys.delete(event.key);
});

window.addEventListener('blur', () => state.pressedKeys.clear());
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
