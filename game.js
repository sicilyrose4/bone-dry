'use strict';

/* ═══════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════ */
const INGREDIENTS = {
  vodka:         { name:'Vodka',         type:'spirit',  file:'vodka.png',             oz:1.5, color:'#c8e8ff' },
  tequila:       { name:'Tequila',       type:'spirit',  file:'Tequila.png',           oz:1.5, color:'#ffe194' },
  'tonic-water': { name:'Tonic Water',   type:'mixer',   file:'Tonic water.png',       oz:4,   color:'#e0f5ff' },
  whiskey:       { name:'Whiskey',       type:'spirit',  file:'Whiskey.png',           oz:1.5, color:'#b8641a' },
  cola:          { name:'Cola',          type:'mixer',   file:'Cola.png',              oz:4,   color:'#3d1a0a' },
  'white-rum':   { name:'White Rum',     type:'spirit',  file:'White Rum.png',         oz:1.5, color:'#f0f0e8' },
  gin:           { name:'Gin',           type:'spirit',  file:'Gin.png',               oz:1.5, color:'#c0e8c0' },
  'soda-water':  { name:'Soda Water',    type:'mixer',   file:'soda water.png',        oz:4,   color:'#e8f8ff' },
  oj:            { name:'Orange Juice',  type:'mixer',   file:'orange juice.png',      oz:4,   color:'#ff9d00' },
  cranberry:     { name:'Cranberry',     type:'mixer',   file:'orange juice-1.png',    oz:4,   color:'#8b0030' },
  orange:        { name:'Orange',        type:'garnish', file:'orange.png' },
  mint:          { name:'Mint',          type:'garnish', file:'limt.png' },
  lemon:         { name:'Lemon',         type:'garnish', file:'lemon.png' },
  lime:          { name:'Lime',          type:'garnish', file:'lime.png' },
  cherry:        { name:'Cherry',        type:'garnish', file:'cherries.png' },
  salt:          { name:'Salt Rim',      type:'rim',     file:'salt.png' },
  sugar:         { name:'Sugar Rim',     type:'rim',     file:'sugar.png' },
};

const DRINKS = [
  { id:'screwdriver',     name:'Screwdriver',     base:'vodka',     order:"Can I get a Screwdriver?",         ingredients:[{id:'vodka',oz:1.5},{id:'oj',oz:4},{id:'orange',count:1}] },
  { id:'vodka-soda',      name:'Vodka Soda',       base:'vodka',     order:"Vodka Soda with a lime, please!",  ingredients:[{id:'vodka',oz:1.5},{id:'soda-water',oz:4},{id:'lime',count:1}] },
  { id:'vodka-tonic',     name:'Vodka Tonic',      base:'vodka',     order:"A Vodka Tonic please!",            ingredients:[{id:'vodka',oz:1.5},{id:'tonic-water',oz:4},{id:'lime',count:1}] },
  { id:'cape-cod',        name:'Cape Cod',         base:'vodka',     order:"Cape Cod please!",                 ingredients:[{id:'vodka',oz:1.5},{id:'cranberry',oz:4},{id:'lime',count:1}] },
  { id:'madras',          name:'Madras',           base:'vodka',     order:"Can I get a Madras?",              ingredients:[{id:'vodka',oz:1.5},{id:'cranberry',oz:2},{id:'oj',oz:2}] },
  { id:'gin-tonic',       name:'Gin and Tonic',      base:'gin',       order:"Gin and Tonic for me!",            ingredients:[{id:'gin',oz:1.5},{id:'tonic-water',oz:4},{id:'lime',count:1}] },
  { id:'gin-rickey',      name:'Gin Rickey',       base:'gin',       order:"Could I get a Gin Rickey?",        ingredients:[{id:'gin',oz:1.5},{id:'soda-water',oz:4},{id:'lime',count:1}] },
  { id:'gin-juice',       name:'Gin and Juice',      base:'gin',       order:"Gin and Juice please!",            ingredients:[{id:'gin',oz:1.5},{id:'oj',oz:4}] },
  { id:'tom-collins',     name:'Tom Collins',      base:'gin',       order:"Tom Collins please!",              ingredients:[{id:'gin',oz:1.5},{id:'soda-water',oz:4},{id:'lemon',count:1},{id:'sugar',count:1}] },
  { id:'cuba-libre',      name:'Cuba Libre',       base:'white-rum', order:"Can I get a Cuba Libre?",          ingredients:[{id:'white-rum',oz:1.5},{id:'cola',oz:4},{id:'lime',count:1}] },
  { id:'rum-punch',       name:'Rum Punch',        base:'white-rum', order:"Rum Punch for me!",                ingredients:[{id:'white-rum',oz:1.5},{id:'oj',oz:2},{id:'cranberry',oz:2},{id:'cherry',count:1}] },
  { id:'mojito',          name:'Mojito',           base:'white-rum', order:"A Mojito please!",                 ingredients:[{id:'white-rum',oz:1.5},{id:'soda-water',oz:3},{id:'mint',count:1},{id:'lime',count:1},{id:'sugar',count:1}] },
  { id:'margarita',       name:'Margarita',        base:'tequila',   order:"Margarita on the rocks!",          ingredients:[{id:'tequila',oz:1.5},{id:'lime',count:1},{id:'salt',count:1}] },
  { id:'tequila-sunrise', name:'Tequila Sunrise',  base:'tequila',   order:"Can I get a Tequila Sunrise?",     ingredients:[{id:'tequila',oz:1.5},{id:'oj',oz:4},{id:'cherry',count:1}] },
  { id:'jack-coke',       name:'Jack and Coke',      base:'whiskey',   order:"Jack and Coke please!",            ingredients:[{id:'whiskey',oz:1.5},{id:'cola',oz:4}] },
  { id:'whiskey-sour',    name:'Whiskey Sour',     base:'whiskey',   order:"Could I get a Whiskey Sour?",      ingredients:[{id:'whiskey',oz:1.5},{id:'lemon',count:1},{id:'sugar',count:1},{id:'cherry',count:1}] },
  { id:'mint-julep',      name:'Mint Julep',       base:'whiskey',   order:"Mint Julep please!",               ingredients:[{id:'whiskey',oz:1.5},{id:'mint',count:1},{id:'sugar',count:1}] },
];

/* ═══════════════════════════════════════════════════════════════
   ART — swap bar background / counter here
═══════════════════════════════════════════════════════════════ */
const ART = {
  barBackground: 'assets/bar/background.jpg',
  barCounter:    'assets/bar/counter.png',
  glass:         'assets/glass-straight-on.png',
};

/* ═══════════════════════════════════════════════════════════════
   CUSTOMERS
   Box size (skeleton) and the selected image's rect inside it come from
   the Figma component sets on the "updates" page. `sink` lowers a
   customer behind the counter (purple sits 23px lower in the bar frames).
═══════════════════════════════════════════════════════════════ */
const CUSTOMERS = {
  red:    { w:102, h:224, sel:{ x:-11,   y:-5.5, w:124, h:235 } },
  purple: { w:108, h:241, sel:{ x:-8,    y:1.5,  w:124, h:238 }, sink:23 },
  lime:   { w:130, h:232, sel:{ x:-2.5,  y:0,    w:135, h:232 } },
  pink:   { w:138, h:189, sel:{ x:-31.5, y:-12,  w:201, h:213 } },
  green:  { w:116, h:222, sel:{ x:-5.5,  y:-2,   w:127, h:226 } },
  orange: { w:101, h:223, sel:{ x:0,     y:-14.5,w:101, h:252 } },
};
const CUSTOMER_IDS = Object.keys(CUSTOMERS);
const customerImg = (id, state) => `assets/customers/${id}-${state}.png`;

// Slot centers (x) and counter top (y) from the bar frames
const SLOT_CX = [176, 399, 625];
const COUNTER_TOP = 348;

const SHIFT_SECONDS = 300;

/* ═══════════════════════════════════════════════════════════════
   GAME STATE
═══════════════════════════════════════════════════════════════ */
const G = {
  screen: 'bar',
  tips: 0,
  shiftRemaining: SHIFT_SECONDS, // bar timer: counts down in the background
  drinkElapsed: 0,               // per-drink timer: counts up, resets each order
  shiftOver: false,              // timer hit 0 — finish the current drink, then end
  timerRunning: false,           // false while paused
  tickInterval: null,
  nextArrivalIn: 1,              // seconds until the next customer walks up
  dial: 0.15,                    // hidden difficulty: 0 = calm, 1 = rush
  customers: [],    // [{type, drink, state:'skeleton'|'selected'|'served', slot, el}]
  selectedIdx: null,
  lastDrinkId: null,
  drinksServed: 0,
  drink: {
    forCustomer: null,   // index in G.customers
    recipe: null,
    poured: [],          // [{id, oz?, count?}]
    activeIngredient: null,
  },
  pour: {
    ingredientId: null,
    mode: 'liquid',
    ozPoured: 0,
    pouring: false,
    lastTick: 0,
    garnishPlaced: [],
    dragging: false,
    dragOffsetX: 0,
    dragOffsetY: 0,
  },
  rafId: null,
  shiftEnded: false,
};

/* ═══════════════════════════════════════════════════════════════
   DOM REFS
═══════════════════════════════════════════════════════════════ */
const $ = id => document.getElementById(id);

const dom = {
  viewport:         $('viewport'),
  game:             $('game'),
  screens: {
    bar:            $('screen-bar'),
    shelf:          $('screen-shelf'),
    pour:           $('screen-pour'),
    end:            $('screen-end'),
  },
  overlay:          $('overlay-recipe'),
  recipeCard:       $('recipe-card'),
  recipeContent:    $('recipe-content'),
  recipeClose:      $('btn-recipe-close'),

  barBg:            $('bar-bg'),
  barCounter:       $('bar-counter'),
  counterDrinks:    $('counter-drinks'),
  barTips:          $('bar-tips'),
  barPause:         $('bar-pause'),
  speechArea:       $('speech-area'),
  speechText:       $('speech-text'),
  btnStartOrder:    $('btn-start-order'),

  shelfTimer:       $('shelf-timer'),
  shelfPause:       $('shelf-pause'),
  btnPourOut:       $('btn-pour-out'),
  btnServe:         $('btn-serve'),

  pourTimer:        $('pour-timer'),
  pourPause:        $('pour-pause'),
  btnBack:          $('btn-back-to-shelf'),
  btnDone:          $('btn-pour-done'),

  liquidMode:       $('pour-liquid-mode'),
  garnishMode:      $('pour-garnish-mode'),
  pourBottle:       $('pour-bottle-img'),
  pourGlassCont:    $('pour-glass-container'),
  pourGlassFill:    $('pour-glass-fill'),
  pourInstruction:  $('pour-instruction'),
  measureLines:     $('measure-lines'),

  garnishDraggable: $('garnish-draggable'),
  garnishPlacedLayer: $('garnish-placed-layer'),
  garnishGlassCont: $('garnish-glass-container'),
  garnishGlassFill: $('garnish-glass-fill'),
  garnishDropZone:  $('garnish-drop-zone'),
  garnishInstr:     $('garnish-instruction'),

  endTips:          $('end-tips'),
  endServed:        $('end-served'),
  btnPlayAgain:     $('btn-play-again'),

  pauseOverlay:     $('pause-overlay'),
  notifLayer:       $('notification-layer'),
  shelfDrinkName:   $('shelf-drink-name'),
};

/* ═══════════════════════════════════════════════════════════════
   VIEWPORT SCALING
═══════════════════════════════════════════════════════════════ */
let scale = 1;

function updateScale() {
  scale = Math.min(window.innerWidth / 844, window.innerHeight / 390);
  dom.viewport.style.transform = `scale(${scale})`;
  // Center
  const sw = 844 * scale;
  const sh = 390 * scale;
  dom.viewport.style.left = Math.max(0, (window.innerWidth  - sw) / 2) + 'px';
  dom.viewport.style.top  = Math.max(0, (window.innerHeight - sh) / 2) + 'px';
  dom.viewport.style.position = 'fixed';
}
window.addEventListener('resize', updateScale);
updateScale();

/* ═══════════════════════════════════════════════════════════════
   SCREEN MANAGEMENT
═══════════════════════════════════════════════════════════════ */
function showScreen(name) {
  G.screen = name;
  Object.values(dom.screens).forEach(s => s.classList.remove('active'));
  if (dom.screens[name]) dom.screens[name].classList.add('active');
  if (name === 'bar') { dom.overlay.classList.remove('open'); dom.overlay.classList.remove('recipe-image-mode'); }
  updateTimerDisplays();
}

/* ═══════════════════════════════════════════════════════════════
   TIMER
═══════════════════════════════════════════════════════════════ */
function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

// One game clock drives the shift countdown, the per-drink timer and arrivals.
const TICK = 0.1; // seconds

function startTimer() {
  if (G.tickInterval) clearInterval(G.tickInterval);
  G.timerRunning = true;
  G.tickInterval = setInterval(tick, TICK * 1000);
}

function stopTimer() {
  G.timerRunning = false;
  if (G.tickInterval) { clearInterval(G.tickInterval); G.tickInterval = null; }
}

function tick() {
  if (!G.timerRunning || G.shiftEnded) return;

  if (!G.shiftOver) {
    G.shiftRemaining = Math.max(0, G.shiftRemaining - TICK);
    if (G.shiftRemaining === 0) onShiftTimeUp();
  }

  if (G.drink.forCustomer !== null) G.drinkElapsed += TICK;

  if (!G.shiftOver) {
    G.nextArrivalIn -= TICK;
    if (G.nextArrivalIn <= 0) trySpawnCustomer();
  }

  updateTimerDisplays();
}

function pauseToggle() {
  if (G.shiftEnded) return;
  G.timerRunning = !G.timerRunning;
  dom.pauseOverlay.style.display = G.timerRunning ? 'none' : 'flex';
}

function updateTimerDisplays() {
  const t = formatTime(Math.floor(G.drinkElapsed));
  dom.shelfTimer.textContent = t;
  dom.pourTimer.textContent  = t;
}

/* ═══════════════════════════════════════════════════════════════
   NOTIFICATIONS
═══════════════════════════════════════════════════════════════ */
function showNotif(msg) {
  const el = document.createElement('div');
  el.className = 'notification';
  el.textContent = msg;
  dom.notifLayer.appendChild(el);
  setTimeout(() => el.remove(), 1600);
}

function showTipFloat(msg, slotIdx) {
  // "$2" sits above the served customer (Figma: x = customer center - 16, y = 79)
  const el = document.createElement('div');
  el.className = 'bar-tip-float';
  el.textContent = msg;
  el.style.left = (SLOT_CX[slotIdx] - 16) + 'px';
  dom.screens.bar.appendChild(el);
  return el;
}

/* ═══════════════════════════════════════════════════════════════
   DIFFICULTY DIAL
   Calm open → rush builds as the player keeps up → eases off near the end.
═══════════════════════════════════════════════════════════════ */
const lerp = (a, b, t) => a + (b - a) * Math.max(0, Math.min(1, t));

function effectiveDial() {
  // Taper over the last minute so the shift ends on a win
  const taper = Math.min(1, G.shiftRemaining / 60);
  return G.dial * taper;
}

function scheduleNextArrival() {
  const d = effectiveDial();
  const base = lerp(16, 4, d);                     // seconds between arrivals
  G.nextArrivalIn = base * (0.8 + Math.random() * 0.4);
}

function updateDial(score, drinkTime, peeked) {
  // score 0–100, drinkTime in seconds
  const accuracy = score / 100;
  const speed = drinkTime < 30 ? 1 : drinkTime < 60 ? 0.6 : drinkTime < 120 ? 0.3 : 0;
  const perf = 0.6 * accuracy + 0.25 * speed + 0.15 * (peeked ? 0 : 1);
  G.dial = Math.max(0.1, Math.min(1, G.dial + 0.05 + (perf - 0.5) * 0.3));
}

/* ═══════════════════════════════════════════════════════════════
   CUSTOMER MANAGEMENT
═══════════════════════════════════════════════════════════════ */
function pickDrink() {
  const pool = DRINKS.filter(d => d.id !== G.lastDrinkId);
  const d = pool[Math.floor(Math.random() * pool.length)];
  G.lastDrinkId = d.id;
  return d;
}

function trySpawnCustomer() {
  scheduleNextArrival();
  // No new arrivals in the last 20s — they couldn't be served in time
  if (G.shiftRemaining < 20) return;
  const empty = [0, 1, 2].filter(i => !G.customers[i]);
  if (!empty.length) return;
  const present = G.customers.filter(Boolean).map(c => c.type);
  const types = CUSTOMER_IDS.filter(t => !present.includes(t));
  const slot = empty[Math.floor(Math.random() * empty.length)];
  const type = types[Math.floor(Math.random() * types.length)];
  createCustomer(slot, type);
}

function createCustomer(slot, type) {
  const el = document.getElementById(`slot-${slot}`);
  const customer = { type, drink: pickDrink(), state: 'skeleton', slot, el };
  G.customers[slot] = customer;
  renderCustomer(slot);
  el.classList.remove('leaving');
  el.classList.add('arriving');
  setTimeout(() => el.classList.remove('arriving'), 650);
  return customer;
}

function renderCustomer(slot) {
  const c = G.customers[slot];
  const el = document.getElementById(`slot-${slot}`);
  el.innerHTML = '';
  if (!c) { el.style.display = 'none'; return; }

  const spec = CUSTOMERS[c.type];
  el.style.display = 'block';
  el.style.width  = spec.w + 'px';
  el.style.height = spec.h + 'px';
  el.style.left   = (SLOT_CX[slot] - spec.w / 2) + 'px';
  el.style.top    = (COUNTER_TOP + (spec.sink || 0) - spec.h) + 'px';

  const img = document.createElement('img');
  img.alt = c.type + ' customer';
  const showSelected = c.state === 'selected' || c.state === 'served';
  const r = showSelected ? spec.sel : { x: 0, y: 0, w: spec.w, h: spec.h };
  img.src = customerImg(c.type, showSelected ? 'selected' : 'skeleton');
  img.style.left = r.x + 'px';
  img.style.top = r.y + 'px';
  img.style.width = r.w + 'px';
  img.style.height = r.h + 'px';
  el.appendChild(img);
}

function selectCustomer(slot) {
  if (G.shiftEnded) return;
  const c = G.customers[slot];
  if (!c || c.state === 'served') return;

  // Tapping the selected customer again deselects them
  if (slot === G.selectedIdx) {
    c.state = 'skeleton';
    renderCustomer(slot);
    G.selectedIdx = null;
    hideSpeechArea();
    dom.btnStartOrder.style.display = 'none';
    return;
  }

  const prev = G.selectedIdx;
  if (prev !== null && G.customers[prev] && G.customers[prev].state === 'selected') {
    G.customers[prev].state = 'skeleton';
    renderCustomer(prev);
  }
  G.selectedIdx = slot;
  c.state = 'selected';
  renderCustomer(slot);
  showSpeechArea(c.drink.name.toUpperCase(), slot);
  dom.btnStartOrder.style.display = 'block';
}

function showSpeechArea(text, slotIdx) {
  // Figma: bubble centered 41px left of the customer, tail 7.5px left of center
  const cx = SLOT_CX[slotIdx];
  dom.speechText.textContent = text;
  dom.speechArea.style.display = 'flex';
  const w = dom.speechArea.offsetWidth;
  const left = Math.min(Math.max(cx - 41 - w / 2, 8), 844 - w - 8);
  const tailLeft = Math.min(Math.max(cx - 7.5 - left, 13), w - 13 - 30.5);
  dom.speechArea.style.left = left + 'px';
  dom.speechArea.style.setProperty('--tail-left', tailLeft + 'px');
}

function hideSpeechArea() {
  dom.speechArea.style.display = 'none';
  dom.speechText.textContent = '';
}

/* ═══════════════════════════════════════════════════════════════
   RECIPE OVERLAY
═══════════════════════════════════════════════════════════════ */
function openRecipe(drink) {
  dom.overlay.classList.add('open');
  dom.recipeContent.innerHTML = '';
  if (drink.id === 'vodka-soda') {
    dom.overlay.classList.add('recipe-image-mode');
    const img = document.createElement('img');
    img.src = 'assets/vodka soda recipe.png';
    img.className = 'recipe-img';
    dom.recipeContent.appendChild(img);
  } else {
    dom.overlay.classList.remove('recipe-image-mode');
    const nameEl = document.createElement('div');
    nameEl.className = 'recipe-drink-name';
    nameEl.textContent = drink.name;
    dom.recipeContent.appendChild(nameEl);

    const hr = document.createElement('div');
    hr.className = 'recipe-hr';
    hr.style.cssText = 'width:100%;border:none;border-top:1.5px solid #ccc;margin-bottom:12px;';
    dom.recipeContent.appendChild(hr);

    drink.ingredients.forEach(ing => {
      const ingData = INGREDIENTS[ing.id];
      const line = document.createElement('div');
      line.className = 'recipe-ingredient';
      if (ing.oz) {
        line.textContent = `* ${ingData.name} — ${ing.oz} oz`;
      } else {
        line.textContent = `* ${ingData.name}`;
      }
      dom.recipeContent.appendChild(line);
    });
  }
  // Animate slide up
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      dom.recipeCard.classList.add('slide-up');
    });
  });
}

function closeRecipe() {
  dom.recipeCard.classList.remove('slide-up');
  setTimeout(() => {
    dom.overlay.classList.remove('open');
    dom.overlay.classList.remove('recipe-image-mode');
  }, 350);
}

/* ═══════════════════════════════════════════════════════════════
   SHELF SCREEN
═══════════════════════════════════════════════════════════════ */
function openShelf() {
  showScreen('shelf');
  refreshShelfState();
  renderActiveSlot();
}

function refreshShelfState() {
  // Mark shelf items that have already been added
  const pouredIds = G.drink.poured.map(p => p.id);

  document.querySelectorAll('#top-shelf .shelf-item, #bottom-shelf .shelf-item, .counter-bottle').forEach(el => {
    const id = el.dataset.id;
    el.classList.toggle('added', pouredIds.includes(id));
  });
  document.querySelectorAll('.counter-rim').forEach(el => {
    const id = el.dataset.id;
    el.classList.toggle('added', pouredIds.includes(id));
  });
}

function ingPath(id) {
  return `assets/ingredients2/${INGREDIENTS[id].file}`;
}

function renderActiveSlot() { /* active slot removed per Figma */ }

/* ═══════════════════════════════════════════════════════════════
   POUR SCREEN — LIQUID MODE
═══════════════════════════════════════════════════════════════ */
function openPourLiquid(ingredientId) {
  G.pour.ingredientId = ingredientId;
  G.pour.mode = 'liquid';
  G.pour.ozPoured = 0;
  G.pour.pouring = false;
  G.pour.lastTick = 0;

  // Carry over existing fill from previous pours this drink
  const alreadyOz = G.drink.poured.reduce((s, p) => s + (p.oz || 0), 0);
  G.pour.baselineOz = alreadyOz;

  const ing = INGREDIENTS[ingredientId];
  dom.pourBottle.src = ingPath(ingredientId);
  dom.pourBottle.classList.remove('pouring');
  const existingFillH = Math.min((alreadyOz / 8) * 180, 180);
  dom.pourGlassFill.style.height = existingFillH + 'px';
  dom.pourGlassFill.style.background = ing.color || '#c8e8ff';
  dom.pourGlassCont.classList.remove('overpour');

  dom.pourInstruction.style.display = 'block';
  dom.pourInstruction.textContent = 'HOLD ANYWHERE TO POUR';

  dom.liquidMode.style.display = 'block';
  dom.garnishMode.style.display = 'none';

  showScreen('pour');
}

function openPourGarnish(ingredientId) {
  G.pour.ingredientId = ingredientId;
  G.pour.mode = 'garnish';
  G.pour.garnishPlaced = [];
  G.pour.dragging = false;

  const ing = INGREDIENTS[ingredientId];
  dom.garnishDraggable.src = ingPath(ingredientId);
  dom.garnishDraggable.style.left = '140px';
  dom.garnishDraggable.style.top  = '155px';
  dom.garnishDraggable.style.transform = 'none';
  dom.garnishDraggable.style.opacity = '1';

  // Sync glass fill from any previously poured liquids
  let totalOz = 0;
  G.drink.poured.forEach(p => { if (p.oz) totalOz += p.oz; });
  const fillH = Math.min((totalOz / 8) * 180, 180);
  dom.garnishGlassFill.style.height = fillH + 'px';
  // Use last liquid color or default
  const lastLiquid = [...G.drink.poured].reverse().find(p => p.oz);
  if (lastLiquid) dom.garnishGlassFill.style.background = INGREDIENTS[lastLiquid.id]?.color || '#c8e8ff';

  dom.garnishPlacedLayer.innerHTML = '';

  dom.liquidMode.style.display = 'none';
  dom.garnishMode.style.display = 'block';

  showScreen('pour');
}

/* Pour RAF loop */
function pourLoop(now) {
  if (G.screen !== 'pour' || G.pour.mode !== 'liquid') return;
  if (G.pour.pouring && !G.shiftEnded && G.timerRunning) {
    if (G.pour.lastTick === 0) G.pour.lastTick = now;
    const dt = (now - G.pour.lastTick) / 1000;
    G.pour.lastTick = now;
    const rate = 1; // oz per second
    G.pour.ozPoured += dt * rate;

    const MAX_FILL = 8;
    const targetOz = getTargetOz(G.pour.ingredientId);
    const overLimit = (G.pour.baselineOz || 0) + targetOz * 1.5;
    const totalOz = (G.pour.baselineOz || 0) + G.pour.ozPoured;

    if (totalOz > overLimit) {
      dom.pourGlassCont.classList.add('overpour');
    } else {
      dom.pourGlassCont.classList.remove('overpour');
    }

    G.pour.ozPoured = Math.min(G.pour.ozPoured, MAX_FILL);
    const fillH = Math.min((totalOz / MAX_FILL) * 180, 180);
    dom.pourGlassFill.style.height = fillH + 'px';

    dom.pourInstruction.style.display = 'none';
  } else {
    G.pour.lastTick = 0;
  }
  G.rafId = requestAnimationFrame(pourLoop);
}

function startPourRAF() {
  if (G.rafId) cancelAnimationFrame(G.rafId);
  G.rafId = requestAnimationFrame(pourLoop);
}

function stopPourRAF() {
  if (G.rafId) { cancelAnimationFrame(G.rafId); G.rafId = null; }
}

function getTargetOz(ingredientId) {
  if (!G.drink.recipe) return 1.5;
  const req = G.drink.recipe.ingredients.find(r => r.id === ingredientId);
  return req?.oz || 1.5;
}

/* ═══════════════════════════════════════════════════════════════
   SCORING
═══════════════════════════════════════════════════════════════ */
function scoreDrink(recipe, poured, drinkTime) {
  let score = 100;
  const reqIds = recipe.ingredients.map(r => r.id);
  const pouredIds = poured.map(p => p.id);

  pouredIds.forEach(id => {
    if (!reqIds.includes(id)) score -= 35;
  });

  recipe.ingredients.forEach(req => {
    const actual = poured.find(p => p.id === req.id);
    if (!actual) { score -= 30; return; }
    if (req.oz) {
      const diff = Math.abs((actual.oz || 0) - req.oz);
      if (diff > 1.5)       score -= 20;
      else if (diff > 0.75) score -= 12;
      else if (diff > 0.3)  score -= 5;
    }
  });

  score = Math.max(0, Math.min(100, score));

  // Time bonus: faster service → higher tip
  let timeMult = 1.0;
  if (drinkTime < 30)       timeMult = 1.5;
  else if (drinkTime < 60)  timeMult = 1.25;
  else if (drinkTime > 120) timeMult = 0.75;

  let base;
  if (score >= 80) base = 2.00;
  else if (score >= 60) base = 1.00;
  else if (score >= 40) base = 0.50;
  else base = 0.00;

  const tip = Math.round(base * timeMult * 100) / 100;
  return { tip, score };
}

/* ═══════════════════════════════════════════════════════════════
   LIQUID COLOR — blend of every liquid poured, weighted by ounces
═══════════════════════════════════════════════════════════════ */
function blendLiquids(poured) {
  let total = 0, r = 0, g = 0, b = 0;
  poured.forEach(p => {
    const hex = p.oz && INGREDIENTS[p.id]?.color;
    if (!hex) return;
    const n = parseInt(hex.slice(1), 16);
    r += (n >> 16 & 255) * p.oz; g += (n >> 8 & 255) * p.oz; b += (n & 255) * p.oz;
    total += p.oz;
  });
  if (!total) return null;
  const h = v => Math.round(v / total).toString(16).padStart(2, '0');
  return `#${h(r)}${h(g)}${h(b)}`;
}

/* ═══════════════════════════════════════════════════════════════
   SERVE DRINK
═══════════════════════════════════════════════════════════════ */
const SERVED_LINGER_MS = 2000; // customer stays ~2s, then fades
const FADE_MS = 600;

function putDrinkOnCounter(slot, poured) {
  // Figma (461:1361): glass at customer center + 70, y = 293; liquid inset inside it
  const el = document.createElement('div');
  el.className = 'counter-drink';
  el.style.left = (SLOT_CX[slot] + 70) + 'px';
  el.style.top = '293px';
  el.style.width = '48.54px';
  el.style.height = '64.99px';
  const color = blendLiquids(poured);
  if (color) {
    el.innerHTML = `<svg class="cd-liquid" viewBox="0 0 39.4984 50.2667" preserveAspectRatio="none">
      <path d="M5.91766 36.5478C3.84362 29.5749 1.26241 11.6705 0.0142927 1.943C-0.118298 0.909626 0.688582 0 1.73043 0H37.7932C38.7921 0 39.5827 0.835523 39.4912 1.83022C38.6305 11.1869 35.0329 35.173 33.072 47.7153C32.9631 48.4114 32.4437 48.9713 31.7545 49.1173C22.349 51.1093 14.1169 50.1058 10.2746 49.1386C9.66077 48.9841 9.21132 48.4792 9.06296 47.8639C8.63973 46.1086 7.67664 42.4615 5.91766 36.5478Z" fill="${color}" fill-opacity="0.3"/></svg>`;
  }
  const glass = document.createElement('img');
  glass.className = 'cd-glass';
  glass.src = ART.glass;
  glass.alt = '';
  el.appendChild(glass);
  dom.counterDrinks.appendChild(el);
  return el;
}

function serveDrink() {
  if (G.drink.forCustomer === null) return;
  const customerIdx = G.drink.forCustomer;
  const customer = G.customers[customerIdx];
  if (!customer) return;

  const drinkTime = G.drinkElapsed;
  const result = scoreDrink(G.drink.recipe, G.drink.poured, drinkTime);
  G.tips += result.tip;
  G.drinksServed++;
  updateDial(result.score, drinkTime, false);

  dom.barTips.textContent = '$' + G.tips.toFixed(2);

  // Served customer keeps their "selected" look, drink lands on the counter, tip shows
  customer.state = 'served';
  renderCustomer(customerIdx);
  const drinkEl = putDrinkOnCounter(customerIdx, G.drink.poured);
  const tipEl = showTipFloat(`$${result.tip % 1 === 0 ? result.tip : result.tip.toFixed(2)}`, customerIdx);

  hideSpeechArea();
  dom.btnStartOrder.style.display = 'none';
  G.selectedIdx = null;
  resetCurrentDrink();
  G.serving = (G.serving || 0) + 1;

  setTimeout(() => {
    [customer.el, drinkEl, tipEl].forEach(e => e.classList.add('leaving'));
    setTimeout(() => {
      drinkEl.remove();
      tipEl.remove();
      if (G.customers[customerIdx] === customer) {
        G.customers[customerIdx] = null;
        renderCustomer(customerIdx);
      }
      G.serving--;
      maybeEndShift();
    }, FADE_MS);
  }, SERVED_LINGER_MS);

  showScreen('bar');
}

/* ═══════════════════════════════════════════════════════════════
   RESET DRINK
═══════════════════════════════════════════════════════════════ */
function resetCurrentDrink() {
  G.drink.forCustomer = null;
  G.drink.recipe = null;
  G.drink.poured = [];
  G.drink.activeIngredient = null;
  G.drinkElapsed = 0;
}

/* ═══════════════════════════════════════════════════════════════
   END SHIFT
   At 0:00 the player finishes the drink they're making, serves it,
   gets the tip — then the shift ends.
═══════════════════════════════════════════════════════════════ */
function onShiftTimeUp() {
  G.shiftOver = true;
  maybeEndShift();
}

function maybeEndShift() {
  if (G.shiftOver && G.drink.forCustomer === null && !G.serving) endShift();
}

function endShift() {
  if (G.shiftEnded) return;
  G.shiftEnded = true;
  stopTimer();
  stopPourRAF();
  dom.endTips.textContent   = `Total Tips: $${G.tips.toFixed(2)}`;
  dom.endServed.textContent = `Customers served: ${G.drinksServed}`;
  showScreen('end');
}

/* ═══════════════════════════════════════════════════════════════
   INIT / RESET
═══════════════════════════════════════════════════════════════ */
function initGame() {
  G.screen = 'bar';
  G.tips = 0;
  G.shiftRemaining = SHIFT_SECONDS;
  G.shiftOver = false;
  G.dial = 0.15;
  G.nextArrivalIn = 1;
  G.serving = 0;
  G.timerRunning = false;
  G.customers = [];
  G.selectedIdx = null;
  G.lastDrinkId = null;
  G.drinksServed = 0;
  G.shiftEnded = false;
  resetCurrentDrink();

  dom.barBg.src = ART.barBackground;
  dom.barCounter.src = ART.barCounter;
  dom.barTips.textContent = '$0.00';
  dom.pauseOverlay.style.display = 'none';
  dom.counterDrinks.innerHTML = '';
  document.querySelectorAll('.bar-tip-float').forEach(e => e.remove());
  hideSpeechArea();
  dom.btnStartOrder.style.display = 'none';
  for (let i = 0; i < 3; i++) renderCustomer(i);

  stopPourRAF();
  showScreen('bar');
  updateTimerDisplays();
  startTimer(); // first customer walks up after ~1s, the dial paces the rest
}

/* ═══════════════════════════════════════════════════════════════
   EVENT WIRING — BAR SCREEN
═══════════════════════════════════════════════════════════════ */

// Customer slot clicks
for (let i = 0; i < 3; i++) {
  const slot = document.getElementById(`slot-${i}`);
  slot.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    if (G.screen !== 'bar' || G.shiftEnded || !G.timerRunning) return;
    selectCustomer(i);
  });
}

dom.btnStartOrder.addEventListener('pointerdown', (e) => {
  e.stopPropagation();
  if (G.selectedIdx === null || !G.timerRunning) return;
  const customer = G.customers[G.selectedIdx];
  if (!customer) return;
  G.drink.forCustomer = G.selectedIdx;
  G.drink.recipe = customer.drink;
  G.drink.poured = [];
  G.drink.activeIngredient = null;
  G.drinkElapsed = 0;
  dom.shelfDrinkName.textContent = customer.drink.name.toUpperCase();
  openShelf();
  setTimeout(() => openRecipe(customer.drink), 50);
});

dom.barPause.addEventListener('pointerdown', (e) => { e.stopPropagation(); pauseToggle(); });

/* ═══════════════════════════════════════════════════════════════
   EVENT WIRING — RECIPE OVERLAY
═══════════════════════════════════════════════════════════════ */
dom.recipeClose.addEventListener('pointerdown', (e) => {
  e.stopPropagation();
  closeRecipe();
  // Already on shelf screen — no redirect needed
});

dom.recipeCard.addEventListener('pointerdown', e => e.stopPropagation());

/* ═══════════════════════════════════════════════════════════════
   EVENT WIRING — SHELF SCREEN
═══════════════════════════════════════════════════════════════ */
dom.btnPourOut.addEventListener('pointerdown', (e) => {
  e.stopPropagation();
  resetCurrentDrink();
  if (G.selectedIdx !== null && G.customers[G.selectedIdx]) {
    G.customers[G.selectedIdx].state = 'skeleton';
    renderCustomer(G.selectedIdx);
  }
  G.selectedIdx = null;
  hideSpeechArea();
  dom.btnStartOrder.style.display = 'none';
  showScreen('bar');
  maybeEndShift();
});

dom.shelfPause.addEventListener('pointerdown', (e) => { e.stopPropagation(); pauseToggle(); });

dom.btnServe.addEventListener('pointerdown', (e) => {
  e.stopPropagation();
  serveDrink();
});

/* ═══════════════════════════════════════════════════════════════
   DRAG-AND-DROP — shelf ingredients → center drop zone
═══════════════════════════════════════════════════════════════ */
const dragState = {
  active: false,
  id: null,
  ghost: null,
  sourceEl: null,
};

const dropZoneEl = document.getElementById('counter-center-group');

function startIngredientDrag(e, id, imgSrc, sourceEl) {
  if (G.screen !== 'shelf') return;
  dragState.active = true;
  dragState.id = id;
  dragState.sourceEl = sourceEl || null;

  const ghost = document.createElement('img');
  ghost.src = imgSrc;
  ghost.className = 'drag-ghost';
  dom.game.appendChild(ghost);
  dragState.ghost = ghost;

  dom.shelfDrinkName.textContent = INGREDIENTS[id]?.name?.toUpperCase() || '';
  dom.shelfDrinkName.classList.add('dragging');

  dropZoneEl.classList.add('drag-over');
  moveDragGhost(e);
}

function moveDragGhost(e) {
  if (!dragState.ghost) return;
  const rect = dom.game.getBoundingClientRect();
  const x = (e.clientX - rect.left) / scale;
  const y = (e.clientY - rect.top) / scale;
  dragState.ghost.style.left = x + 'px';
  dragState.ghost.style.top = y + 'px';
}

function endIngredientDrag(e) {
  if (!dragState.active) return;

  const rect = dom.game.getBoundingClientRect();
  const x = (e.clientX - rect.left) / scale;
  const y = (e.clientY - rect.top) / scale;

  // Check if released over drop zone
  const dzRect = dropZoneEl.getBoundingClientRect();
  const dx1 = (dzRect.left   - rect.left) / scale;
  const dx2 = (dzRect.right  - rect.left) / scale;
  const dy1 = (dzRect.top    - rect.top)  / scale;
  const dy2 = (dzRect.bottom - rect.top)  / scale;
  const dropped = x >= dx1 - 20 && x <= dx2 + 20 && y >= dy1 - 20 && y <= dy2 + 20;

  if (dragState.ghost) { dragState.ghost.remove(); dragState.ghost = null; }
  dropZoneEl.classList.remove('drag-over');

  dom.shelfDrinkName.textContent = G.drink.recipe ? G.drink.recipe.name.toUpperCase() : '';
  dom.shelfDrinkName.classList.remove('dragging');

  const id = dragState.id;
  dragState.active = false;
  dragState.id = null;

  if (dropped && G.screen === 'shelf') {
    const ing = INGREDIENTS[id];
    if (!ing) return;

    // Swap: center shows dragged item, source slot shows old center item
    const centerBottle = document.querySelector('#counter-center-group .counter-bottle');
    if (centerBottle && dragState.sourceEl && dragState.sourceEl !== centerBottle) {
      const oldCenterId  = centerBottle.dataset.id;
      const oldCenterSrc = `assets/ingredients2/${INGREDIENTS[oldCenterId]?.file || ''}`;

      // Source slot now holds old center item
      dragState.sourceEl.dataset.id = oldCenterId;
      const srcImg = dragState.sourceEl.querySelector('img');
      if (srcImg && INGREDIENTS[oldCenterId]) srcImg.src = oldCenterSrc;

      // Center now holds dragged item
      centerBottle.dataset.id = id;
      const ctrImg = centerBottle.querySelector('img');
      if (ctrImg) ctrImg.src = `assets/ingredients2/${ing.file}`;
    }

    if (ing.type === 'garnish') {
      openPourGarnish(id);
    } else {
      openPourLiquid(id);
      startPourRAF();
    }
  }
}

// Wire drag onto all shelf items and the counter soda-water bottle
document.querySelectorAll('#top-shelf .shelf-item, #bottom-shelf .shelf-item, .counter-bottle').forEach(el => {
  el.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    if (G.screen !== 'shelf') return;
    el.setPointerCapture(e.pointerId);
    startIngredientDrag(e, el.dataset.id, el.querySelector('img').src, el);
  });
  el.addEventListener('pointermove', (e) => {
    if (!dragState.active) return;
    moveDragGhost(e);
  });
  el.addEventListener('pointerup',     (e) => { endIngredientDrag(e); });
  el.addEventListener('pointercancel', () => {
    if (dragState.ghost) { dragState.ghost.remove(); dragState.ghost = null; }
    dropZoneEl.classList.remove('drag-over');
    dom.shelfDrinkName.textContent = G.drink.recipe ? G.drink.recipe.name.toUpperCase() : '';
    dom.shelfDrinkName.classList.remove('dragging');
    dragState.active = false; dragState.id = null;
  });
});

// Rim items (salt/sugar) — drag to drop zone to apply
document.querySelectorAll('.counter-rim').forEach(el => {
  el.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    if (G.screen !== 'shelf') return;
    el.setPointerCapture(e.pointerId);
    startIngredientDrag(e, el.dataset.id, el.querySelector('img').src, el);
  });
  el.addEventListener('pointermove', (e) => {
    if (!dragState.active) return;
    moveDragGhost(e);
  });
  el.addEventListener('pointerup', (e) => {
    if (!dragState.active) return;
    const rect = dom.game.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    const dzRect = dropZoneEl.getBoundingClientRect();
    const dropped = x >= (dzRect.left - rect.left)/scale - 20
                 && x <= (dzRect.right - rect.left)/scale + 20
                 && y >= (dzRect.top - rect.top)/scale - 20
                 && y <= (dzRect.bottom - rect.top)/scale + 20;

    if (dragState.ghost) { dragState.ghost.remove(); dragState.ghost = null; }
    dropZoneEl.classList.remove('drag-over');
    const id = dragState.id;
    dragState.active = false; dragState.id = null;

    if (dropped && G.screen === 'shelf') {
      const existing = G.drink.poured.find(p => p.id === id);
      if (!existing) {
        G.drink.poured.push({ id, count: 1 });
        G.drink.activeIngredient = id;
        showNotif(`${INGREDIENTS[id].name} added`);
      } else {
        showNotif(`${INGREDIENTS[id].name} already added`);
      }
      refreshShelfState();
    }
  });
  el.addEventListener('pointercancel', () => {
    if (dragState.ghost) { dragState.ghost.remove(); dragState.ghost = null; }
    dropZoneEl.classList.remove('drag-over');
    dom.shelfDrinkName.textContent = G.drink.recipe ? G.drink.recipe.name.toUpperCase() : '';
    dom.shelfDrinkName.classList.remove('dragging');
    dragState.active = false; dragState.id = null;
  });
});

/* ═══════════════════════════════════════════════════════════════
   EVENT WIRING — POUR SCREEN (LIQUID)
═══════════════════════════════════════════════════════════════ */
dom.btnBack.addEventListener('pointerdown', (e) => {
  e.stopPropagation();
  // Return to shelf without recording
  G.pour.pouring = false;
  stopPourRAF();
  dom.pourBottle.classList.remove('pouring');
  openShelf();
});

dom.pourPause.addEventListener('pointerdown', (e) => { e.stopPropagation(); pauseToggle(); });

dom.btnDone.addEventListener('pointerdown', (e) => {
  e.stopPropagation();
  if (G.pour.mode === 'liquid') {
    commitLiquidPour();
  } else {
    commitGarnishPour();
  }
});

// Pour: hold anywhere except buttons
dom.screens.pour.addEventListener('pointerdown', (e) => {
  if (G.screen !== 'pour' || G.pour.mode !== 'liquid') return;
  if (e.target.closest('button, .hud-left-btn')) return;
  if (!G.timerRunning) return;
  G.pour.pouring = true;
  G.pour.lastTick = 0;
  dom.pourBottle.classList.add('pouring');
});

dom.screens.pour.addEventListener('pointerup', stopPouring);
dom.screens.pour.addEventListener('pointercancel', stopPouring);

function stopPouring() {
  if (G.pour.mode !== 'liquid') return;
  G.pour.pouring = false;
  G.pour.lastTick = 0;
  dom.pourBottle.classList.remove('pouring');
  if (G.pour.ozPoured === 0) {
    dom.pourInstruction.style.display = 'block';
  }
}

function commitLiquidPour() {
  G.pour.pouring = false;
  stopPourRAF();
  dom.pourBottle.classList.remove('pouring');

  const id = G.pour.ingredientId;
  const oz = parseFloat(G.pour.ozPoured.toFixed(2));

  if (oz > 0) {
    const existing = G.drink.poured.find(p => p.id === id);
    if (existing) {
      existing.oz = (existing.oz || 0) + oz;
    } else {
      G.drink.poured.push({ id, oz });
    }
    G.drink.activeIngredient = id;
    showNotif(`${INGREDIENTS[id].name} added`);
  }

  openShelf();
}

/* ═══════════════════════════════════════════════════════════════
   EVENT WIRING — POUR SCREEN (GARNISH / DRAG)
═══════════════════════════════════════════════════════════════ */
let garnishDragActive = false;
let garnishDragStartX = 0, garnishDragStartY = 0;
let garnishPosX = 140, garnishPosY = 155;

dom.garnishDraggable.addEventListener('pointerdown', (e) => {
  if (G.screen !== 'pour' || G.pour.mode !== 'garnish') return;
  e.stopPropagation();
  e.preventDefault();
  dom.garnishDraggable.setPointerCapture(e.pointerId);
  garnishDragActive = true;
  const rect = dom.screens.pour.getBoundingClientRect();
  const cx = (e.clientX - rect.left) / scale;
  const cy = (e.clientY - rect.top) / scale;
  // offset from center of image
  const imgRect = dom.garnishDraggable.getBoundingClientRect();
  const imgCx = (imgRect.left + imgRect.width/2 - rect.left) / scale;
  const imgCy = (imgRect.top  + imgRect.height/2 - rect.top) / scale;
  G.pour.dragOffsetX = cx - imgCx;
  G.pour.dragOffsetY = cy - imgCy;
});

dom.garnishDraggable.addEventListener('pointermove', (e) => {
  if (!garnishDragActive) return;
  e.preventDefault();
  const rect = dom.screens.pour.getBoundingClientRect();
  const cx = (e.clientX - rect.left) / scale;
  const cy = (e.clientY - rect.top)  / scale;
  const nx = cx - G.pour.dragOffsetX;
  const ny = cy - G.pour.dragOffsetY;
  dom.garnishDraggable.style.left = (nx - 40) + 'px'; // 40 = half of 80px
  dom.garnishDraggable.style.top  = (ny - 40) + 'px';
});

dom.garnishDraggable.addEventListener('pointerup', (e) => {
  if (!garnishDragActive) return;
  garnishDragActive = false;
  dom.garnishDraggable.releasePointerCapture(e.pointerId);

  const rect = dom.screens.pour.getBoundingClientRect();
  const cx = (e.clientX - rect.left) / scale;
  const cy = (e.clientY - rect.top)  / scale;

  // Glass drop zone: glass is centered at x=610, top y = 195-100 = 95
  const glassLeft = 610 - 65;
  const glassTop  = 195 - 100;
  const dropY = glassTop - 20; // slightly above glass top
  const inZone = cx >= glassLeft - 10 && cx <= glassLeft + 150 && Math.abs(cy - dropY) < 50;

  if (inZone) {
    // Snap to glass rim
    const snapX = cx < glassLeft + 65 ? cx : 610;
    placeGarnish(snapX, glassTop - 10);
    showNotif(`${INGREDIENTS[G.pour.ingredientId].name} added`);
    // Reset draggable to start
    dom.garnishDraggable.style.left = '140px';
    dom.garnishDraggable.style.top  = '155px';
  } else {
    // Snap back
    dom.garnishDraggable.style.left = '140px';
    dom.garnishDraggable.style.top  = '155px';
  }
});

dom.garnishDraggable.addEventListener('pointercancel', () => {
  garnishDragActive = false;
  dom.garnishDraggable.style.left = '140px';
  dom.garnishDraggable.style.top  = '155px';
});

function placeGarnish(x, y) {
  G.pour.garnishPlaced.push({ x, y });
  const img = document.createElement('img');
  img.src = ingPath(G.pour.ingredientId);
  img.className = 'placed-garnish';
  img.style.left = x + 'px';
  img.style.top  = y + 'px';
  dom.garnishPlacedLayer.appendChild(img);
}

function commitGarnishPour() {
  const id = G.pour.ingredientId;
  const count = G.pour.garnishPlaced.length;
  if (count > 0) {
    const existing = G.drink.poured.find(p => p.id === id);
    if (existing) {
      existing.count = (existing.count || 0) + count;
    } else {
      G.drink.poured.push({ id, count });
    }
    G.drink.activeIngredient = id;
    showNotif(`${INGREDIENTS[id].name} added`);
  }
  openShelf();
}

/* ═══════════════════════════════════════════════════════════════
   EVENT WIRING — END SCREEN
═══════════════════════════════════════════════════════════════ */
dom.btnPlayAgain.addEventListener('pointerdown', (e) => {
  e.stopPropagation();
  initGame();
});

/* ═══════════════════════════════════════════════════════════════
   PAUSE OVERLAY click to unpause
═══════════════════════════════════════════════════════════════ */
dom.pauseOverlay.addEventListener('pointerdown', (e) => {
  e.stopPropagation();
  if (!G.timerRunning) pauseToggle();
});

/* ═══════════════════════════════════════════════════════════════
   BOOT
═══════════════════════════════════════════════════════════════ */
window.addEventListener('DOMContentLoaded', () => {
  initGame();
});
