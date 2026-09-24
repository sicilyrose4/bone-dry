'use strict';

/* ═══════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════ */
// Liquids: `color` is the bottle's own line color (the art draws liquid as that
// color, semi-transparent). `shelf` = display size on the shelf from Figma
// (vodka isn't on the Figma shelf — sized at the same scale as the other bottles).
// `outline` = hand-drawn selection outline from Figma, positioned relative to the bottle.
const INGREDIENTS = {
  vodka:          { name:'Vodka',         type:'liquid',  file:'vodka.png',        color:'#6ce4f0', shelf:[53.1, 134.4] },
  gin:            { name:'Gin',           type:'liquid',  file:'gin.png',          color:'#843cfc', shelf:[66.91, 163.664] },
  tequila:        { name:'Tequila',       type:'liquid',  file:'tequila.png',      color:'#fc0cc0', shelf:[82.313, 128.396] },
  whiskey:        { name:'Whiskey',       type:'liquid',  file:'whiskey.png',      color:'#ff8147', shelf:[62.036, 145.615],
                    outline:{ src:'assets/ui/select-outline-whiskey.svg', x:-3.5, y:-3.4, w:70.05, h:151.51 } },
  'white-rum':    { name:'White Rum',     type:'liquid',  file:'white-rum.png',    color:'#fc00c0', shelf:[56.916, 146.818] },
  'triple-sec':   { name:'Triple Sec',    type:'liquid',  file:'triple-sec.png',   color:'#fc7830', shelf:[60.414, 198] },
  'soda-water':   { name:'Soda Water',    type:'liquid',  file:'soda-water.png',   color:'#fcfcfc', shelf:[52.7, 133.137] },
  'tonic-water':  { name:'Tonic Water',   type:'liquid',  file:'tonic-water.png',  color:'#6ce4f0', shelf:[46.535, 103.772] },
  cola:           { name:'Cola',          type:'liquid',  file:'cola.png',         color:'#f90049', shelf:[47.772, 79.512],
                    outline:{ src:'assets/ui/select-outline-cola.svg', x:-2.7, y:-3.0, w:53.12, h:86.44 } },
  'ginger-beer':  { name:'Ginger Beer',   type:'liquid',  file:'ginger-beer.png',  color:'#fce4b4', shelf:[46.928, 163.785] },
  cranberry:      { name:'Cranberry Juice', type:'liquid', file:'cranberry.png',   color:'#f00048', shelf:[64.653, 126.043] },
  oj:             { name:'Orange Juice',  type:'liquid',  file:'oj.png',           color:'#fc6000', shelf:[55.389, 111.184] },
  'lime-juice':   { name:'Lime Juice',    type:'liquid',  file:'lime-juice.png',   color:'#0cd830', shelf:[49.177, 141.23] },
  'simple-syrup': { name:'Simple Syrup',  type:'liquid',  file:'simple-syrup.png', color:'#fcd884', shelf:[47.177, 141.327] },
  grenadine:      { name:'Grenadine',     type:'liquid',  file:'grenadine.png',    color:'#fc0c3c', shelf:[64.343, 132.593] },
  lime:           { name:'Lime',          type:'garnish', file:'lime.png' },
  lemon:          { name:'Lemon',         type:'garnish', file:'lemon.png' },
  orange:         { name:'Orange',        type:'garnish', file:'orange.png' },
  cherry:         { name:'Cherry',        type:'garnish', file:'cherry.png' },
  mint:           { name:'Mint',          type:'garnish', file:'mint.png' },
};
const LIQUID_IDS = Object.keys(INGREDIENTS).filter(id => INGREDIENTS[id].type === 'liquid');

// Approved menu (2026-09-24). Add a drink = add a line here.
const DRINKS = [
  { id:'vodka-soda',      name:'Vodka Soda',      ingredients:[{id:'vodka',oz:1.5},{id:'soda-water',oz:4},{id:'lime',count:1}] },
  { id:'vodka-tonic',     name:'Vodka Tonic',     ingredients:[{id:'vodka',oz:1.5},{id:'tonic-water',oz:4},{id:'lime',count:1}] },
  { id:'vodka-cranberry', name:'Vodka Cranberry', ingredients:[{id:'vodka',oz:1.5},{id:'cranberry',oz:4},{id:'lime',count:1}] },
  { id:'screwdriver',     name:'Screwdriver',     ingredients:[{id:'vodka',oz:1.5},{id:'oj',oz:4},{id:'orange',count:1}] },
  { id:'moscow-mule',     name:'Moscow Mule',     ingredients:[{id:'vodka',oz:1.5},{id:'ginger-beer',oz:4},{id:'lime-juice',oz:0.5},{id:'lime',count:1}] },
  { id:'cosmopolitan',    name:'Cosmopolitan',    ingredients:[{id:'vodka',oz:1.5},{id:'triple-sec',oz:0.5},{id:'cranberry',oz:1},{id:'lime-juice',oz:0.5},{id:'lime',count:1}] },
  { id:'gin-tonic',       name:'Gin and Tonic',   ingredients:[{id:'gin',oz:1.5},{id:'tonic-water',oz:4},{id:'lime',count:1}] },
  { id:'gin-rickey',      name:'Gin Rickey',      ingredients:[{id:'gin',oz:1.5},{id:'lime-juice',oz:0.5},{id:'soda-water',oz:4},{id:'lime',count:1}] },
  { id:'tom-collins',     name:'Tom Collins',     ingredients:[{id:'gin',oz:1.5},{id:'simple-syrup',oz:0.5},{id:'soda-water',oz:4},{id:'lemon',count:1}] },
  { id:'cuba-libre',      name:'Cuba Libre',      ingredients:[{id:'white-rum',oz:1.5},{id:'cola',oz:4},{id:'lime',count:1}] },
  { id:'rum-punch',       name:'Rum Punch',       ingredients:[{id:'white-rum',oz:1.5},{id:'oj',oz:2},{id:'cranberry',oz:2},{id:'grenadine',oz:0.5},{id:'cherry',count:1}] },
  { id:'mojito',          name:'Mojito',          ingredients:[{id:'white-rum',oz:1.5},{id:'lime-juice',oz:0.5},{id:'simple-syrup',oz:0.5},{id:'soda-water',oz:3},{id:'mint',count:1},{id:'lime',count:1}] },
  { id:'whiskey-coke',    name:'Whiskey Coke',    ingredients:[{id:'whiskey',oz:1.5},{id:'cola',oz:4},{id:'lime',count:1}] },
  { id:'whiskey-ginger',  name:'Whiskey Ginger',  ingredients:[{id:'whiskey',oz:1.5},{id:'ginger-beer',oz:4},{id:'lemon',count:1}] },
  { id:'margarita',       name:'Margarita',       ingredients:[{id:'tequila',oz:2},{id:'triple-sec',oz:1},{id:'lime-juice',oz:1},{id:'lime',count:1}] },
  { id:'tequila-sunrise', name:'Tequila Sunrise', ingredients:[{id:'tequila',oz:1.5},{id:'oj',oz:4},{id:'grenadine',oz:0.5},{id:'orange',count:1},{id:'cherry',count:1}] },
  { id:'ranch-water',     name:'Ranch Water',     ingredients:[{id:'tequila',oz:1.5},{id:'lime-juice',oz:0.5},{id:'soda-water',oz:4},{id:'lime',count:1}] },
];

// Drawn recipe cards (user will add one per drink)
const RECIPE_IMAGES = {
  'vodka-soda': 'assets/vodka soda recipe.png',
};

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
   PROGRESS — saved on this device between shifts
   Familiarity: never made → recipe shows automatically;
   made 1–2x (familiar) → hidden, can peek for a tip cost; 3+ (mastered) → no peek.
═══════════════════════════════════════════════════════════════ */
const SAVE_KEY = 'boneDry.progress.v1';
const PEEK_COST = 0.50;   // tip lost for peeking at a familiar recipe

function loadProgress() {
  try {
    const p = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (p && p.drinks) return { drinks: p.drinks, shifts: p.shifts || [] };
  } catch (e) { /* no saved progress yet */ }
  return { drinks: {}, shifts: [] };
}
const PROGRESS = loadProgress();

function saveProgress() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(PROGRESS)); } catch (e) { /* storage unavailable */ }
}

function timesMade(drinkId) {
  return PROGRESS.drinks[drinkId]?.made || 0;
}

function tierOf(drinkId) {
  const n = timesMade(drinkId);
  return n === 0 ? 'new' : n <= 2 ? 'familiar' : 'mastered';
}

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
  shelf: { order: [], selected: null, lastAdded: null },
  drink: {
    forCustomer: null,   // index in G.customers
    recipe: null,
    poured: [],          // totals per ingredient [{id, oz?, count?}] — used for scoring
    layers: [],          // every pour in order [{id, oz}] — drawn as bands in the glass
    garnishes: [],       // placed on the drink [{id, spot}]
    tier: 'new',         // new | familiar | mastered (when the order started)
    peeked: false,       // looked at the recipe on a familiar drink
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
    loading:        $('screen-loading'),
    home:           $('screen-home'),
    bar:            $('screen-bar'),
    shelf:          $('screen-shelf'),
    pour:           $('screen-pour'),
    garnish:        $('screen-garnish'),
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
  shelfRow:         $('shelf-row'),
  shelfTitle:       $('shelf-title'),
  btnPour:          $('btn-pour'),
  shelfAdded:       $('shelf-added'),
  shelfAddedText:   $('shelf-added-text'),
  btnToBar:         $('btn-to-bar'),
  btnToGarnish:     $('btn-to-garnish'),
  btnBackToPour:    $('btn-back-to-pour'),

  pourTimer:        $('pour-timer'),
  pourPause:        $('pour-pause'),
  btnBack:          $('btn-back-to-shelf'),
  btnDone:          $('btn-pour-done'),

  pourBottle:       $('pour-bottle-img'),
  pourGlass:        $('pour-glass'),
  pourLiquid:       $('pour-liquid'),

  endTips:          $('end-tips'),
  endServed:        $('end-served'),
  btnPlayAgain:     $('btn-play-again'),

  pauseOverlay:     $('pause-overlay'),
  notifLayer:       $('notification-layer'),
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
  if (name !== 'shelf') { dom.recipeCard.classList.remove('slide-up'); dom.overlay.classList.remove('open'); dom.overlay.classList.remove('recipe-image-mode'); }
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
  $('garnish-timer').textContent = t;
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
  // Calm → mostly new/familiar drinks; as the dial climbs, mastered drinks show up more
  const d = effectiveDial();
  const weight = { new: 0.6 * (1 - d) + 0.1, familiar: 1, mastered: 0.3 + 1.2 * d };
  const pool = DRINKS.filter(x => x.id !== G.lastDrinkId);
  const total = pool.reduce((sum, x) => sum + weight[tierOf(x.id)], 0);
  let r = Math.random() * total;
  let pick = pool[pool.length - 1];
  for (const x of pool) { r -= weight[tierOf(x.id)]; if (r <= 0) { pick = x; break; } }
  G.lastDrinkId = pick.id;
  return pick;
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
  // While a drink is being made, customers can't be switched or deselected
  if (G.drink.forCustomer !== null) return;
  const c = G.customers[slot];
  if (!c || c.state === 'served') return;

  // Tapping the selected customer again deselects them
  if (slot === G.selectedIdx) {
    c.state = 'skeleton';
    renderCustomer(slot);
    G.selectedIdx = null;
    hideSpeechArea();
    refreshBarControls();
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
  refreshBarControls();
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
  if (RECIPE_IMAGES[drink.id]) {
    dom.overlay.classList.add('recipe-image-mode');
    const img = document.createElement('img');
    img.src = RECIPE_IMAGES[drink.id];
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
   One swipeable row. Tap a bottle to select it (tap again to deselect),
   POUR opens the pour screen. The order shuffles every new order.
═══════════════════════════════════════════════════════════════ */
function ingPath(id) {
  return `assets/ingredients-bd/${INGREDIENTS[id].file}`;
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildShelf() {
  G.shelf.order = shuffleArray(LIQUID_IDS);
  dom.shelfRow.innerHTML = '';
  dom.shelfRow.scrollLeft = 0;
  G.shelf.order.forEach(id => {
    const ing = INGREDIENTS[id];
    const el = document.createElement('div');
    el.className = 'shelf-bottle' + (ing.outline ? '' : ' traced');
    el.dataset.id = id;
    el.style.width = ing.shelf[0] + 'px';
    el.style.height = ing.shelf[1] + 'px';
    const img = document.createElement('img');
    img.className = 'bottle';
    img.src = ingPath(id);
    img.alt = ing.name;
    el.appendChild(img);
    if (ing.outline) {
      const o = document.createElement('img');
      o.className = 'outline';
      o.src = ing.outline.src;
      o.alt = '';
      Object.assign(o.style, { left: ing.outline.x + 'px', top: ing.outline.y + 'px', width: ing.outline.w + 'px', height: ing.outline.h + 'px' });
      el.appendChild(o);
    }
    el.addEventListener('click', () => toggleBottle(id));
    dom.shelfRow.appendChild(el);
  });
}

function toggleBottle(id) {
  if (G.screen !== 'shelf' || !G.timerRunning) return;
  G.shelf.selected = G.shelf.selected === id ? null : id;
  G.shelf.lastAdded = null;
  renderShelf();
}

function renderShelf() {
  const sel = G.shelf.selected;
  dom.shelfRow.querySelectorAll('.shelf-bottle').forEach(el => {
    el.classList.toggle('selected', el.dataset.id === sel);
  });
  if (sel) {
    dom.shelfTitle.textContent = INGREDIENTS[sel].name.toUpperCase();
    dom.shelfTitle.classList.add('ingredient');
  } else {
    dom.shelfTitle.textContent = G.drink.recipe ? G.drink.recipe.name.toUpperCase() : '';
    dom.shelfTitle.classList.remove('ingredient');
  }
  dom.btnPour.style.display = sel ? 'block' : 'none';
  const added = !sel && G.shelf.lastAdded;
  dom.shelfAdded.style.display = added ? 'flex' : 'none';
  if (added) dom.shelfAddedText.textContent = `${INGREDIENTS[G.shelf.lastAdded].name.toUpperCase()} ADDED`;
  if (added && !G.shelf.addedShown) {
    // "WHISKEY ADDED ✓" fades out after ~1.5s
    G.shelf.addedShown = true;
    dom.shelfAdded.classList.remove('fading');
    clearTimeout(G.shelf.addedTimer);
    G.shelf.addedTimer = setTimeout(() => {
      dom.shelfAdded.classList.add('fading');
      G.shelf.addedTimer = setTimeout(() => {
        G.shelf.lastAdded = null;
        G.shelf.addedShown = false;
        dom.shelfAdded.classList.remove('fading');
        dom.shelfAdded.style.display = 'none';
      }, 400);
    }, 1500);
  } else if (!added) {
    clearTimeout(G.shelf.addedTimer);
    G.shelf.addedShown = false;
    dom.shelfAdded.classList.remove('fading');
  }
  dom.btnToGarnish.disabled = !G.drink.poured.some(p => p.oz > 0);
  $('btn-recipe-peek').style.display = G.drink.tier === 'familiar' ? 'block' : 'none';
}

function openShelf() {
  showScreen('shelf');
  renderShelf();
}

/* Bar controls while an order exists: START ORDER before it starts,
   POUR → (back to the drink) once it's in progress */
function refreshBarControls() {
  const inProgress = G.drink.forCustomer !== null;
  dom.btnStartOrder.style.display = !inProgress && G.selectedIdx !== null ? 'block' : 'none';
  dom.btnBackToPour.style.display = inProgress ? 'flex' : 'none';
}

/* ═══════════════════════════════════════════════════════════════
   POUR SCREEN — LIQUID MODE
   Hold anywhere to pour at 1 oz/sec; release to stop; DONE commits.
   The glass reads the TOTAL level — every pour stacks as its own band.
═══════════════════════════════════════════════════════════════ */
const MAX_OZ = 8;
const OZ_ZERO_Y = 366;   // glass bottom (0 oz) — from Figma tick marks
const PX_PER_OZ = 28;    // ticks are 14px apart, one per 0.5 oz
const ozToY = oz => OZ_ZERO_Y - oz * PX_PER_OZ;

// Bottle poses from Figma: idle box + tilted center/rotation.
// Other bottles: idle = shelf size x3.08 standing at y=380 (like whiskey/cola),
// tilted so the mouth lands where whiskey's/cola's do (~396, 62).
const POUR_POSE = {
  whiskey: { idle:{ x:87, y:-68, w:191, h:448 }, tilt:{ cx:182.5, cy:156,  rot:68.63 } },
  cola:    { idle:{ x:95, y:87,  w:176, h:293 }, tilt:{ cx:258.6, cy:85.3, rot:75.8 } },
  vodka:   { idle:{ x:92, y:-66, w:175, h:444 }, tilt:{ cx:180.5, cy:134,  rot:77.42 } },  // Figma 437:295 / 437:333
};
function pourPose(id) {
  if (POUR_POSE[id]) return POUR_POSE[id];
  const [sw, sh] = INGREDIENTS[id].shelf;
  const w = sw * 3.079, h = sh * 3.079, rot = 72, r = rot * Math.PI / 180;
  return {
    idle: { x: 182.75 - w / 2, y: 380 - h, w, h },
    tilt: { cx: 396 - (h / 2) * Math.sin(r), cy: 62 + (h / 2) * Math.cos(r), rot },
  };
}

function setBottleTilt(tilted) {
  const pose = pourPose(G.pour.ingredientId);
  const { idle, tilt } = pose;
  if (!tilted) { dom.pourBottle.style.transform = 'none'; return; }
  const dx = tilt.cx - (idle.x + idle.w / 2);
  const dy = tilt.cy - (idle.y + idle.h / 2);
  dom.pourBottle.style.transform = `translate(${dx}px, ${dy}px) rotate(${tilt.rot}deg)`;
}

function hexToRgba(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16 & 255}, ${n >> 8 & 255}, ${n & 255}, ${a})`;
}

// Stacked bands: every committed pour, plus the one in progress
function renderPourLiquid() {
  const layers = [...G.drink.layers];
  if (G.pour.ozPoured > 0) layers.push({ id: G.pour.ingredientId, oz: G.pour.ozPoured });
  dom.pourLiquid.innerHTML = '';
  let total = 0;
  layers.forEach((l, i) => {
    const band = document.createElement('div');
    band.className = 'liquid-band';
    const bottom = i === 0 ? OZ_ZERO_Y + 6 : ozToY(total);   // first band fills the rounded bottom
    total = Math.min(MAX_OZ, total + l.oz);
    const top = ozToY(total);
    band.style.top = top + 'px';
    band.style.height = Math.max(0, bottom - top) + 'px';
    band.style.background = hexToRgba(INGREDIENTS[l.id].color, 0.3);
    dom.pourLiquid.appendChild(band);
  });
}

function totalPouredOz() {
  return G.drink.layers.reduce((s, l) => s + l.oz, 0);
}

function openPourLiquid(ingredientId) {
  G.pour.ingredientId = ingredientId;
  G.pour.mode = 'liquid';
  G.pour.ozPoured = 0;
  G.pour.pouring = false;
  G.pour.lastTick = 0;
  G.pour.baselineOz = totalPouredOz();

  const { idle } = pourPose(ingredientId);
  dom.pourBottle.src = ingPath(ingredientId);
  Object.assign(dom.pourBottle.style, { left: idle.x + 'px', top: idle.y + 'px', width: idle.w + 'px', height: idle.h + 'px' });
  setBottleTilt(false);
  dom.screens.pour.classList.remove('is-pouring');
  renderPourLiquid();
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
    // Past 8 oz the glass is full — the pour just stops
    G.pour.ozPoured = Math.min(G.pour.ozPoured + dt * rate, MAX_OZ - G.pour.baselineOz);
    renderPourLiquid();
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

// Tick labels sit on their tick marks
document.querySelectorAll('.tick-label').forEach(el => {
  el.style.top = (ozToY(parseFloat(el.dataset.oz)) - 7) + 'px';
});

/* ═══════════════════════════════════════════════════════════════
   SCORING
═══════════════════════════════════════════════════════════════ */
function scoreDrink(recipe, poured, drinkTime, tier, peeked) {
  let score = 100;
  const reqIds = recipe.ingredients.map(r => r.id);
  const pouredIds = poured.map(p => p.id);

  pouredIds.forEach(id => {
    if (!reqIds.includes(id)) score -= 35;
  });

  recipe.ingredients.forEach(req => {
    const actual = poured.find(p => p.id === req.id);
    if (!actual) { score -= 30; return; }
    if (req.count && (actual.count || 0) !== req.count) score -= 10;  // e.g. 2 limes when they asked for 1
    if (req.oz) {
      const diff = Math.abs((actual.oz || 0) - req.oz);
      if (diff > 1.5)       score -= 20;
      else if (diff > 0.75) score -= 12;
      else if (diff > 0.3)  score -= 5;
    }
  });

  score = Math.max(0, Math.min(100, score));

  // Time bonus: faster service → higher tip (a brand-new drink has no time pressure)
  let timeMult = 1.0;
  if (tier === 'new')       timeMult = 1.0;
  else if (drinkTime < 30)  timeMult = 1.5;
  else if (drinkTime < 60)  timeMult = 1.25;
  else if (drinkTime > 120) timeMult = 0.75;

  let base;
  if (score >= 80) base = 2.00;
  else if (score >= 60) base = 1.00;
  else if (score >= 40) base = 0.50;
  else base = 0.00;

  let tip = base * timeMult;
  if (peeked) tip = Math.max(0, tip - PEEK_COST);
  tip = Math.round(tip * 100) / 100;
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

function putDrinkOnCounter(slot, poured, garnishes) {
  // Figma 461:1361: glass 48.54 wide at customer center + 70, y = 293 —
  // the garnish-screen drink scaled down (48.54 / 122.49)
  const el = document.createElement('div');
  el.className = 'counter-drink drink-view';
  el.style.left = (SLOT_CX[slot] + 70) + 'px';
  el.style.top = '293px';
  el.style.transformOrigin = '0 0';
  el.style.transform = `scale(${48.54 / 122.49})`;
  renderDrinkView(el, poured, garnishes);
  dom.counterDrinks.appendChild(el);
  return el;
}

function serveDrink() {
  if (G.drink.forCustomer === null) return;
  const customerIdx = G.drink.forCustomer;
  const customer = G.customers[customerIdx];
  if (!customer) return;

  const drinkTime = G.drinkElapsed;
  const result = scoreDrink(G.drink.recipe, G.drink.poured, drinkTime, G.drink.tier, G.drink.peeked);
  G.tips += result.tip;
  G.drinksServed++;
  updateDial(result.score, drinkTime, G.drink.peeked);

  // Familiarity: every served drink counts toward new → familiar → mastered
  const rec = PROGRESS.drinks[G.drink.recipe.id] || (PROGRESS.drinks[G.drink.recipe.id] = { made: 0 });
  rec.made++;
  saveProgress();

  dom.barTips.textContent = '$' + G.tips.toFixed(2);

  // Served customer keeps their "selected" look, drink lands on the counter, tip shows
  customer.state = 'served';
  renderCustomer(customerIdx);
  const drinkEl = putDrinkOnCounter(customerIdx, G.drink.poured, G.drink.garnishes);
  const tipEl = showTipFloat(`$${result.tip % 1 === 0 ? result.tip : result.tip.toFixed(2)}`, customerIdx);

  hideSpeechArea();
  G.selectedIdx = null;
  resetCurrentDrink();
  refreshBarControls();
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
  G.drink.layers = [];
  G.drink.garnishes = [];
  G.drink.activeIngredient = null;
  G.drink.tier = 'new';
  G.drink.peeked = false;
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
  PROGRESS.shifts.push({ date: new Date().toISOString(), tips: Math.round(G.tips * 100) / 100, served: G.drinksServed });
  saveProgress();
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
  dom.pourGlass.src = ART.glass;
  dom.barTips.textContent = '$0.00';
  dom.pauseOverlay.style.display = 'none';
  dom.counterDrinks.innerHTML = '';
  document.querySelectorAll('.bar-tip-float').forEach(e => e.remove());
  hideSpeechArea();
  G.shelf = { order: [], selected: null, lastAdded: null };
  refreshBarControls();
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
  G.drink.layers = [];
  G.drink.garnishes = [];
  G.drink.activeIngredient = null;
  G.drinkElapsed = 0;
  G.shelf.selected = null;
  G.shelf.lastAdded = null;
  G.drink.tier = tierOf(customer.drink.id);
  G.drink.peeked = false;
  buildShelf();
  openShelf();
  if (G.drink.tier === 'new') setTimeout(() => openRecipe(customer.drink), 50);
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
// POUR OUT empties the glass; you stay on the shelf with the same order
dom.btnPourOut.addEventListener('click', (e) => {
  e.stopPropagation();
  if (!G.timerRunning) return;
  G.drink.poured = [];
  G.drink.layers = [];
  G.drink.garnishes = [];
  G.drink.activeIngredient = null;
  G.shelf.selected = null;
  G.shelf.lastAdded = null;
  renderShelf();
});

dom.shelfPause.addEventListener('pointerdown', (e) => { e.stopPropagation(); pauseToggle(); });

// Peek at a familiar recipe — costs a little tip (once per drink)
$('btn-recipe-peek').addEventListener('click', (e) => {
  e.stopPropagation();
  if (!G.timerRunning || G.drink.tier !== 'familiar' || !G.drink.recipe) return;
  G.drink.peeked = true;
  openRecipe(G.drink.recipe);
});

dom.btnPour.addEventListener('click', (e) => {
  e.stopPropagation();
  if (!G.shelf.selected || !G.timerRunning) return;
  openPourLiquid(G.shelf.selected);
  startPourRAF();
});

// ← BAR keeps the drink in progress so the player can check the bar
dom.btnToBar.addEventListener('click', (e) => {
  e.stopPropagation();
  G.shelf.selected = null;
  showScreen('bar');
  refreshBarControls();
});

dom.btnToGarnish.addEventListener('click', (e) => {
  e.stopPropagation();
  if (dom.btnToGarnish.disabled || !G.timerRunning) return;
  G.shelf.selected = null;
  openGarnishScreen();
});

// Bar: POUR → returns to the drink in progress
dom.btnBackToPour.addEventListener('click', (e) => {
  e.stopPropagation();
  if (G.drink.forCustomer === null) return;
  openShelf();
});

/* ═══════════════════════════════════════════════════════════════
   EVENT WIRING — POUR SCREEN
═══════════════════════════════════════════════════════════════ */
dom.btnBack.addEventListener('pointerdown', (e) => {
  e.stopPropagation();
  // Back to the shelf without recording this pour
  G.pour.pouring = false;
  G.pour.ozPoured = 0;
  stopPourRAF();
  openShelf();
});

dom.pourPause.addEventListener('pointerdown', (e) => { e.stopPropagation(); pauseToggle(); });

dom.btnDone.addEventListener('pointerdown', (e) => {
  e.stopPropagation();
  commitLiquidPour();
});

// Hold anywhere (except buttons) to pour
dom.screens.pour.addEventListener('pointerdown', (e) => {
  if (G.screen !== 'pour' || G.pour.mode !== 'liquid') return;
  if (e.target.closest('button')) return;
  if (!G.timerRunning) return;
  G.pour.pouring = true;
  G.pour.lastTick = 0;
  dom.screens.pour.classList.add('is-pouring');
  setBottleTilt(true);
});

dom.screens.pour.addEventListener('pointerup', stopPouring);
dom.screens.pour.addEventListener('pointercancel', stopPouring);

function stopPouring() {
  if (G.pour.mode !== 'liquid' || !G.pour.pouring) return;
  G.pour.pouring = false;
  G.pour.lastTick = 0;
  dom.screens.pour.classList.remove('is-pouring');
  setBottleTilt(false);
}

function commitLiquidPour() {
  G.pour.pouring = false;
  stopPourRAF();
  dom.screens.pour.classList.remove('is-pouring');

  const id = G.pour.ingredientId;
  const oz = parseFloat(G.pour.ozPoured.toFixed(2));

  if (oz > 0) {
    G.drink.layers.push({ id, oz });
    const existing = G.drink.poured.find(p => p.id === id);
    if (existing) {
      existing.oz = (existing.oz || 0) + oz;
    } else {
      G.drink.poured.push({ id, oz });
    }
    G.drink.activeIngredient = id;
    G.shelf.lastAdded = id;   // "WHISKEY ADDED ✓"
    G.shelf.addedShown = false; // restart its fade timer
  }
  G.pour.ozPoured = 0;
  G.shelf.selected = null;
  openShelf();
}

/* ═══════════════════════════════════════════════════════════════
   GARNISH SCREEN
   Tap a garnish (tap again to deselect) → a TAP circle appears where it goes
   → tap it to place. REMOVE GARNISH clears them all. SERVE hands it over.
═══════════════════════════════════════════════════════════════ */
// Tray positions from Figma 454:1147 (center, unrotated box, rotation, mirrored)
const GARNISH_TRAY = {
  lemon:  { cx:228.32, cy:114.45, w:42.81, h:86.74, rot:-89.84 },
  orange: { cx:228.01, cy:189.82, w:46.86, h:95.65, rot:-90.47 },
  lime:   { cx:227.8,  cy:262.19, w:44.38, h:95.61, rot:-90, flip:true,
            outline:{ src:'assets/ui/select-outline-lime.svg', cx:227.77, cy:261.48, w:102.53, h:51.04 } },
  mint:   { cx:610.56, cy:135.5,  w:75.13, h:45,    rot:0 },
  cherry: { cx:620.01, cy:228.51, w:32.02, h:67.03, rot:0 },
};

// Where a garnish lands, relative to the glass's top-left (glass is 122.49 x 164).
// Rim slice = Figma 459:1230 (lime). Cherry/mint spots aren't designed yet.
const RIM_SPOTS = [
  { target:{ x:106, y:4 },  cx:108.29, cy:0.12, w:31.98, h:68.88, rot:125.81, flip:true },   // Figma lime
  { target:{ x:16,  y:4 },  cx:14.2,   cy:0.12, w:31.98, h:68.88, rot:-125.81 },             // mirrored, left rim
  { target:{ x:61,  y:2 },  cx:61,     cy:-4,   w:31.98, h:68.88, rot:180 },                 // back of the rim
];
// Cherry drops into the drink; mint floats on top. Extras fan out a little.
const GARNISH_SPOTS = {
  cherry: { target:{ x:61, y:45 }, cx:61, cy:45, w:23.05, h:48.26, rot:0,
            extra:[[0,0], [-17,8], [17,8], [0,18], [-9,26], [9,26]] },
  mint:   { target:{ x:45, y:20 }, cx:45, cy:20, w:54.1,  h:32.4,  rot:0,
            extra:[[0,0], [30,3], [-12,8], [16,12]] },
};
const RIM_GARNISHES = ['lime', 'lemon', 'orange'];

// Any number of garnishes can go on a drink — each new one takes the next spot
function garnishSpot(id, placed) {
  if (RIM_GARNISHES.includes(id)) {
    const n = placed.filter(g => RIM_GARNISHES.includes(g.id)).length;
    const base = RIM_SPOTS[n % RIM_SPOTS.length];
    const lap = Math.floor(n / RIM_SPOTS.length) * 6;   // later laps sit a bit lower
    return { ...base, cy: base.cy + lap, target: { x: base.target.x, y: base.target.y + lap } };
  }
  const s = GARNISH_SPOTS[id];
  const n = placed.filter(g => g.id === id).length;
  const [dx, dy] = s.extra[n % s.extra.length];
  return { ...s, cx: s.cx + dx, cy: s.cy + dy, target: { x: s.target.x + dx, y: s.target.y + dy } };
}

const LIQUID_PATH = 'M15.2349 92C9.81188 73.7941 3.01339 25.9849 0.0160161 2.24516C-0.134587 1.05236 0.796158 0 1.99843 0H98.1087C99.2614 0 100.176 0.963895 100.085 2.11295C98.3598 23.9369 88.5012 89.4568 83.4396 121.698C83.3135 122.501 82.7139 123.124 81.9206 123.302C56.3859 129.03 34.0433 125.913 24.8618 123.334C24.1586 123.137 23.6472 122.559 23.4847 121.847C22.6398 118.146 20.1902 108.635 15.2349 92Z';

// Glass + one blended liquid color + placed garnishes (garnish screen and bar counter)
function renderDrinkView(el, poured, garnishes) {
  el.innerHTML = '';
  const color = blendLiquids(poured);
  if (color) {
    el.insertAdjacentHTML('beforeend', `<svg class="dv-liquid" viewBox="0 0 100.091 126.534" preserveAspectRatio="none"><path d="${LIQUID_PATH}" fill="${color}" fill-opacity="0.3"/></svg>`);
  }
  const glass = document.createElement('img');
  glass.className = 'dv-glass';
  glass.src = ART.glass;
  glass.alt = '';
  el.appendChild(glass);
  garnishes.forEach(g => {
    const img = document.createElement('img');
    img.className = 'dv-garnish';
    img.src = ingPath(g.id);
    img.alt = '';
    const p = g.spot;
    Object.assign(img.style, { left: (p.cx - p.w / 2) + 'px', top: (p.cy - p.h / 2) + 'px', width: p.w + 'px', height: p.h + 'px',
      transform: `rotate(${p.rot}deg)${p.flip ? ' scaleY(-1)' : ''}` });
    el.appendChild(img);
  });
}

function buildGarnishTray() {
  const tray = $('garnish-tray');
  tray.innerHTML = '';
  Object.entries(GARNISH_TRAY).forEach(([id, t]) => {
    const r = t.rot * Math.PI / 180;
    const bw = Math.abs(t.w * Math.cos(r)) + Math.abs(t.h * Math.sin(r));
    const bh = Math.abs(t.w * Math.sin(r)) + Math.abs(t.h * Math.cos(r));
    const el = document.createElement('div');
    el.className = 'tray-garnish' + (t.outline ? '' : ' traced');
    el.dataset.id = id;
    Object.assign(el.style, { left: (t.cx - bw / 2) + 'px', top: (t.cy - bh / 2) + 'px', width: bw + 'px', height: bh + 'px' });
    const img = document.createElement('img');
    img.className = 'g';
    img.src = ingPath(id);
    img.alt = INGREDIENTS[id].name;
    Object.assign(img.style, { inset: 'auto', left: (bw - t.w) / 2 + 'px', top: (bh - t.h) / 2 + 'px', width: t.w + 'px', height: t.h + 'px',
      transform: `rotate(${t.rot}deg)${t.flip ? ' scaleY(-1)' : ''}` });
    el.appendChild(img);
    if (t.outline) {
      const o = document.createElement('img');
      o.className = 'outline';
      o.src = t.outline.src;
      o.alt = '';
      const ox = t.outline.cx - t.outline.w / 2 - (t.cx - bw / 2);
      const oy = t.outline.cy - t.outline.h / 2 - (t.cy - bh / 2);
      Object.assign(o.style, { left: ox + 'px', top: oy + 'px', width: t.outline.w + 'px', height: t.outline.h + 'px' });
      el.appendChild(o);
    }
    el.addEventListener('click', () => toggleGarnish(id));
    tray.appendChild(el);
  });
}

function openGarnishScreen() {
  G.garnishSel = null;
  showScreen('garnish');
  renderGarnishScreen();
}

function toggleGarnish(id) {
  if (G.screen !== 'garnish' || !G.timerRunning) return;
  G.garnishSel = G.garnishSel === id ? null : id;
  renderGarnishScreen();
}

function renderGarnishScreen() {
  const sel = G.garnishSel;
  document.querySelectorAll('.tray-garnish').forEach(el => el.classList.toggle('selected', el.dataset.id === sel));
  const title = $('garnish-title');
  if (sel) {
    title.textContent = INGREDIENTS[sel].name.toUpperCase();
    title.classList.add('ingredient');
  } else {
    title.textContent = G.drink.recipe ? G.drink.recipe.name.toUpperCase() : '';
    title.classList.remove('ingredient');
  }
  renderDrinkView($('garnish-drink'), G.drink.poured, G.drink.garnishes);

  const target = $('garnish-target');
  if (sel) {
    const spot = garnishSpot(sel, G.drink.garnishes);
    target.style.left = (355 + spot.target.x - 31) + 'px';
    target.style.top = (120 + spot.target.y - 31) + 'px';
    target.style.display = 'block';
  } else {
    target.style.display = 'none';
  }
}

function placeSelectedGarnish() {
  const id = G.garnishSel;
  if (!id || !G.timerRunning) return;
  G.drink.garnishes.push({ id, spot: garnishSpot(id, G.drink.garnishes) });
  const existing = G.drink.poured.find(p => p.id === id);
  if (existing) existing.count = (existing.count || 0) + 1;
  else G.drink.poured.push({ id, count: 1 });
  G.garnishSel = null;
  renderGarnishScreen();
}

$('garnish-target').addEventListener('click', (e) => { e.stopPropagation(); placeSelectedGarnish(); });

$('btn-remove-garnish').addEventListener('click', (e) => {
  e.stopPropagation();
  if (!G.timerRunning) return;
  G.drink.garnishes = [];
  G.drink.poured = G.drink.poured.filter(p => INGREDIENTS[p.id].type !== 'garnish');
  G.garnishSel = null;
  renderGarnishScreen();
});

$('btn-garnish-to-pour').addEventListener('click', (e) => {
  e.stopPropagation();
  G.garnishSel = null;
  openShelf();
});

$('btn-serve').addEventListener('click', (e) => {
  e.stopPropagation();
  if (!G.timerRunning) return;
  serveDrink();
});

$('garnish-pause').addEventListener('pointerdown', (e) => { e.stopPropagation(); pauseToggle(); });

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
   BOOT — loading screen preloads every image, then home
═══════════════════════════════════════════════════════════════ */
function allImagePaths() {
  const ui = ['speech-tail.svg','icon-restart.svg','arrow-bar.svg','shelf-line.svg','icon-check.svg','icon-back.svg',
              'pour-ticks.svg','tap-target.png','icon-settings.svg','select-outline-whiskey.svg','select-outline-cola.svg',
              'select-outline-lime.svg'].map(f => `assets/ui/${f}`);
  return [
    ...Object.values(ART),
    ...CUSTOMER_IDS.flatMap(id => [customerImg(id, 'skeleton'), customerImg(id, 'selected')]),
    ...Object.keys(INGREDIENTS).map(ingPath),
    ...Object.values(RECIPE_IMAGES),
    ...ui,
  ];
}

function preload(onProgress) {
  const paths = allImagePaths();
  const fonts = [document.fonts.load("28px 'BarFont'"), document.fonts.load("26px 'BarFontBold'")];
  const total = paths.length + fonts.length;
  let done = 0;
  const tick = () => onProgress(++done / total);
  const images = paths.map(src => new Promise(res => {
    const img = new Image();
    img.onload = img.onerror = () => { tick(); res(); };
    img.src = src;
  }));
  return Promise.all([...images, ...fonts.map(f => f.then(tick, tick))]);
}

$('btn-start-shift').addEventListener('click', (e) => { e.stopPropagation(); initGame(); });

window.addEventListener('DOMContentLoaded', () => {
  buildGarnishTray();
  showScreen('loading');
  const fill = $('loading-fill');
  preload(p => { fill.style.width = (382 * p) + 'px'; })
    .then(() => setTimeout(() => showScreen('home'), 300));
});

