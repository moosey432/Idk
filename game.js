const state = {
  playerHp: 20,
  enemyHp: 30,
  maxEnemyHp: 30,
  acted: false,
  itemUsed: false,
  sparable: false,
  defending: false,
  gameOver: false,
  soul: { x: 50, y: 50 },
  velocity: { x: 0, y: 0 },
};

const el = {
  message: document.querySelector('#message'),
  playerHp: document.querySelector('#playerHp'),
  playerHpBar: document.querySelector('#playerHpBar'),
  enemyHpBar: document.querySelector('#enemyHpBar'),
  battleBox: document.querySelector('#battleBox'),
  soul: document.querySelector('#soul'),
  restartButton: document.querySelector('#restartButton'),
  arenaHint: document.querySelector('#arenaHint'),
  bullets: [document.querySelector('#bulletOne'), document.querySelector('#bulletTwo')],
  buttons: [...document.querySelectorAll('.action')],
};

const messages = {
  start: '* A tiny snow monster blocks the path.',
  fight: '* You swing bravely. Frostby looks more impressed than hurt.',
  act: '* You tell Frostby a warm joke. It starts to melt with laughter.',
  item: '* You ate the pocket pie. Your HP was restored.',
  mercyNo: '* Frostby is not ready to be spared.',
  mercyYes: '* You spared Frostby. It waves goodbye with chilly little hands.',
};

function setMessage(text) { el.message.textContent = text; }
function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }

function updateBars() {
  el.playerHp.textContent = state.playerHp;
  el.playerHpBar.style.width = `${(state.playerHp / 20) * 100}%`;
  el.enemyHpBar.style.width = `${(state.enemyHp / state.maxEnemyHp) * 100}%`;
}

function moveSoul() {
  state.soul.x = clamp(state.soul.x + state.velocity.x, 5, 95);
  state.soul.y = clamp(state.soul.y + state.velocity.y, 8, 92);
  el.soul.style.left = `${state.soul.x}%`;
  el.soul.style.top = `${state.soul.y}%`;
  requestAnimationFrame(moveSoul);
}

function setActionsDisabled(disabled) { el.buttons.forEach((button) => { button.disabled = disabled; }); }

function endGame(won) {
  state.gameOver = true;
  setActionsDisabled(true);
  el.arenaHint.textContent = won ? 'Victory!' : 'Stay determined.';
  el.bullets.forEach((bullet) => bullet.classList.add('hidden'));
  el.restartButton.classList.remove('hidden');
}

function defend() {
  if (state.gameOver) return;
  state.defending = true;
  setActionsDisabled(true);
  el.arenaHint.textContent = 'Dodge the blue snowballs!';
  const box = el.battleBox.getBoundingClientRect();
  const duration = 3600;
  const start = performance.now();
  el.bullets.forEach((bullet, index) => bullet.classList.remove('hidden'));

  function animate(time) {
    const progress = (time - start) / duration;
    el.bullets.forEach((bullet, index) => {
      const wave = Math.sin(progress * Math.PI * 6 + index * 1.8);
      const x = index === 0 ? progress * box.width : box.width - progress * box.width;
      const y = box.height * (0.34 + wave * 0.25 + index * 0.16);
      bullet.style.left = `${x}px`;
      bullet.style.top = `${y}px`;
      checkHit(bullet);
    });

    if (progress < 1 && !state.gameOver) {
      requestAnimationFrame(animate);
    } else if (!state.gameOver) {
      state.defending = false;
      setActionsDisabled(false);
      el.arenaHint.textContent = state.sparable ? 'Frostby can be spared.' : 'Choose an action.';
      el.bullets.forEach((bullet) => bullet.classList.add('hidden'));
    }
  }
  requestAnimationFrame(animate);
}

function checkHit(bullet) {
  const soul = el.soul.getBoundingClientRect();
  const snow = bullet.getBoundingClientRect();
  const overlap = !(soul.right < snow.left || soul.left > snow.right || soul.bottom < snow.top || soul.top > snow.bottom);
  if (overlap && !bullet.dataset.hit) {
    bullet.dataset.hit = 'true';
    setTimeout(() => { bullet.dataset.hit = ''; }, 500);
    state.playerHp = clamp(state.playerHp - 2, 0, 20);
    updateBars();
    if (state.playerHp <= 0) {
      setMessage('* You ran out of HP. Game over.');
      endGame(false);
    }
  }
}

function resetGame() {
  state.playerHp = 20;
  state.enemyHp = state.maxEnemyHp;
  state.acted = false;
  state.itemUsed = false;
  state.sparable = false;
  state.defending = false;
  state.gameOver = false;
  state.soul = { x: 50, y: 50 };
  state.velocity = { x: 0, y: 0 };
  el.restartButton.classList.add('hidden');
  setActionsDisabled(false);
  el.arenaHint.textContent = 'Choose an action, then dodge attacks.';
  setMessage(messages.start);
  updateBars();
}

function moveSoulToPointer(event) {
  if (!state.defending || state.gameOver) return;
  const box = el.battleBox.getBoundingClientRect();
  state.soul.x = clamp(((event.clientX - box.left) / box.width) * 100, 5, 95);
  state.soul.y = clamp(((event.clientY - box.top) / box.height) * 100, 8, 92);
  el.soul.style.left = `${state.soul.x}%`;
  el.soul.style.top = `${state.soul.y}%`;
}

function playerTurn(kind) {
  if (state.defending || state.gameOver) return;
  if (kind === 'fight') {
    state.enemyHp = clamp(state.enemyHp - 8, 0, state.maxEnemyHp);
    setMessage(messages.fight);
  }
  if (kind === 'act') {
    state.acted = true;
    state.sparable = true;
    setMessage(messages.act);
  }
  if (kind === 'item') {
    if (state.itemUsed) setMessage('* The pocket is empty.');
    else {
      state.itemUsed = true;
      state.playerHp = clamp(state.playerHp + 8, 0, 20);
      setMessage(messages.item);
    }
  }
  if (kind === 'mercy') {
    if (state.sparable || state.enemyHp <= 8) {
      setMessage(messages.mercyYes);
      updateBars();
      endGame(true);
      return;
    }
    setMessage(messages.mercyNo);
  }
  if (state.enemyHp <= 0) {
    setMessage('* Frostby tumbles into a harmless pile of snow. You won!');
    updateBars();
    endGame(true);
    return;
  }
  updateBars();
  setTimeout(defend, 650);
}

document.querySelector('#fightButton').addEventListener('click', () => playerTurn('fight'));
document.querySelector('#actButton').addEventListener('click', () => playerTurn('act'));
document.querySelector('#itemButton').addEventListener('click', () => playerTurn('item'));
document.querySelector('#mercyButton').addEventListener('click', () => playerTurn('mercy'));
el.restartButton.addEventListener('click', resetGame);
el.battleBox.addEventListener('pointerdown', moveSoulToPointer);
el.battleBox.addEventListener('pointermove', (event) => {
  if (event.buttons || event.pointerType === 'touch') moveSoulToPointer(event);
});

const keys = { ArrowUp: [0, -1.5], ArrowDown: [0, 1.5], ArrowLeft: [-1.5, 0], ArrowRight: [1.5, 0], w: [0, -1.5], s: [0, 1.5], a: [-1.5, 0], d: [1.5, 0] };
document.addEventListener('keydown', (event) => {
  if (!keys[event.key]) return;
  event.preventDefault();
  const [x, y] = keys[event.key];
  state.velocity.x = x;
  state.velocity.y = y;
});
document.addEventListener('keyup', (event) => {
  if (!keys[event.key]) return;
  state.velocity.x = 0;
  state.velocity.y = 0;
});

document.querySelectorAll('[data-dir]').forEach((button) => {
  const vectors = { up: [0, -1.2], down: [0, 1.2], left: [-1.2, 0], right: [1.2, 0] };
  const start = (event) => {
    event.preventDefault();
    const [x, y] = vectors[button.dataset.dir];
    state.velocity.x = x;
    state.velocity.y = y;
  };
  const stop = () => { state.velocity.x = 0; state.velocity.y = 0; };
  button.addEventListener('pointerdown', start);
  button.addEventListener('pointerup', stop);
  button.addEventListener('pointercancel', stop);
  button.addEventListener('pointerleave', stop);
});

updateBars();
moveSoul();
setMessage(messages.start);
