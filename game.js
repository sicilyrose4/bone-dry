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

// Shelf heights: each bottle at its rough real-life height, all at one scale
// (user, 2026-09-24). Width follows each bottle's own art. `shelf` above stays
// the Figma size — the pour screen still sizes bottles from it.
const REAL_HEIGHT_CM = {
  vodka: 30, 'white-rum': 29, gin: 29, 'triple-sec': 28, whiskey: 25, tequila: 24,   // 750 ml liquor
  'simple-syrup': 26, cranberry: 23, oj: 22, 'lime-juice': 21, grenadine: 19,        // bar bottles / juice
  'soda-water': 20, 'ginger-beer': 20, 'tonic-water': 18, cola: 14,                   // mixers, cola can
};
const SHELF_PX_PER_CM = 5.8;   // tallest (vodka, 30 cm) ≈ 174 px
function shelfSize(id) {
  const [w, h] = INGREDIENTS[id].shelf;
  const H = REAL_HEIGHT_CM[id] * SHELF_PX_PER_CM;
  return [w * H / h, H];
}

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

// How garnish amounts read on the recipe card
const GARNISH_UNITS = { lime:'slice', lemon:'slice', orange:'slice', mint:'sprig', cherry:'' };

/* ═══════════════════════════════════════════════════════════════
   ART — swap bar background / counter here
═══════════════════════════════════════════════════════════════ */
const ART = {
  barBackground: 'assets/bar/background.jpg',
  barCounter:    'assets/bar/counter-slate.png',   // slate indigo #3d3b70 (original purple: assets/bar/counter.png)
  glass:         'assets/glass-straight-on.png',
};

/* ═══════════════════════════════════════════════════════════════
   CUSTOMERS
   Box size (skeleton) and the selected image's rect inside it come from
   the Figma component sets on the "updates" page. `sink` lowers a
   customer behind the counter (purple sits 23px lower in the bar frames).
═══════════════════════════════════════════════════════════════ */
// `bubble`: speech bubble colors + where it sits over this customer (Figma 486:1923).
//   dx = bubble center relative to the customer's center, tail = tail's left edge relative to it.
const CUSTOMERS = {
  red:    { w:102, h:224, sel:{ x:-11,   y:-5.5, w:124, h:235 },           bubble:{ bg:'#c06b7f', text:'#551222', dx:-49, tail:-15.5 } },
  purple: { w:108, h:241, sel:{ x:-8,    y:1.5,  w:124, h:238 }, sink:23,  bubble:{ bg:'#9d9cb6', text:'#353454', dx:-41, tail:-7.5 } },
  lime:   { w:130, h:232, sel:{ x:-2.5,  y:0,    w:135, h:232 },           bubble:{ bg:'#c5c497', text:'#393308', dx:-35, tail:-1.5 } },
  pink:   { w:138, h:189, sel:{ x:-31.5, y:-12,  w:201, h:213 },           bubble:{ bg:'#c597b3', text:'#631041', dx:-49, tail:-15.5 } },
  green:  { w:116, h:222, sel:{ x:-5.5,  y:-2,   w:127, h:226 },           bubble:{ bg:'#8bb08f', text:'#304833', dx:32,  tail:-15 } },
  orange: { w:101, h:223, sel:{ x:0,     y:-14.5,w:101, h:252 },           bubble:{ bg:'#e6baa0', text:'#522408', dx:-41, tail:-7.5 } },
};
// Bubble on the counter, under the customer (Figma: orange example) — tail points up
const BUBBLE_BELOW = { dx:38.5, tail:-17.5 };

// How customers order (user, 2026-09-24) — same four for everyone, one picked per customer
const ORDER_LINES = ['{drink} please', '{drink}', 'one {drink}', 'just a {drink}'];
const orderLine = drink => ORDER_LINES[Math.floor(Math.random() * ORDER_LINES.length)].replace('{drink}', drink.name.toLowerCase());

// What each customer says after being served (user-approved, 2026-09-24). Kept vague on
// purpose — a hint, not a breakdown. Max 4 words; never "alcohol" or "drunk".
// Mood comes from scoreDrink(): perfect / good / strong / weak / sweet / off / bad / slow.
const REACTIONS = {
  red:    { perfect:'perfect, thank you!', good:'mm, lovely!', strong:'ooh, a little strong', weak:'a bit weak', sweet:'ooh, very sweet', off:'not quite right…', bad:'is this mine?', slow:'that took a while' },
  purple: { perfect:'splendid, thank you', good:"that'll do nicely", strong:"goodness, that's strong", weak:'rather weak', sweet:'a touch sweet', off:'not quite right', bad:'in my day…', slow:'took your time' },
  lime:   { perfect:'yooo perfect', good:'solid, thanks', strong:'woah. strong.', weak:'kinda weak ngl', sweet:'dang, sweet', off:'hm, not quite', bad:'bro, what?', slow:'finally lol' },
  pink:   { perfect:'okay, you ate', good:'not bad', strong:'heavy hand much?', weak:'forget something?', sweet:'too sweet, babe', off:'this is not it', bad:'absolutely not', slow:'took you long enough' },
  green:  { perfect:'yeah. perfect.', good:'fine. thanks.', strong:'strong.', weak:'weak.', sweet:'too sweet.', off:'not right.', bad:'no.', slow:'about time.' },
  orange: { perfect:'perfect!! thank you!', good:'yay, thanks!', strong:'whoa, strong!', weak:'kinda weak?', sweet:'sooo sweet', off:'not quite right…', bad:'oh no…', slow:'finally, yay!' },
};
const CUSTOMER_IDS = Object.keys(CUSTOMERS);
const customerImg = (id, state) => `assets/customers/${id}-${state}.png`;

// Slot centers (x) and counter top (y) from the bar frames
const SLOT_CX = [176, 399, 625];
const COUNTER_TOP = 348;

const SHIFT_SECONDS = 300;
const CONFIRM_MS = 1200;   // how long "ADDED ✓" / "GLASS EMPTIED ✓" / "GARNISH REMOVED ✓" stay before fading

/* ═══════════════════════════════════════════════════════════════
   PROGRESS
   Familiarity (user, 2026-09-25 — prototype rules): the first time a drink comes up,
   its recipe opens by itself and re-opening it is free ("new"). After that ("familiar")
   the recipe is always one tap away, but every peek costs PEEK_COST (after a confirm).
   No "mastered" tier. Which drinks you've made is NOT saved — it starts over every time
   the app opens, so a class demo plays like a first time. Shift history is still saved.
═══════════════════════════════════════════════════════════════ */
const SAVE_KEY = 'boneDry.progress.v1';
const PEEK_COST = 0.50;   // tip lost for each peek at a familiar recipe

function loadProgress() {
  try {
    const p = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (p) return { drinks: {}, shifts: p.shifts || [] };
  } catch (e) { /* no saved progress yet */ }
  return { drinks: {}, shifts: [] };
}
const PROGRESS = loadProgress();

function saveProgress() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify({ shifts: PROGRESS.shifts })); } catch (e) { /* storage unavailable */ }
}

function timesMade(drinkId) {
  return PROGRESS.drinks[drinkId]?.made || 0;
}

function tierOf(drinkId) {
  return timesMade(drinkId) === 0 ? 'new' : 'familiar';
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
  dial: 0.35,                    // hidden difficulty: 0 = calm, 1 = rush (reset from PACE.startDial)
  customers: [],    // [{type, drink, state:'skeleton'|'selected'|'served', slot, el}]
  selectedIdx: null,
  lastDrinkId: null,
  drinksServed: 0,
  shelf: { order: [], selected: null, toast: null },
  drink: {
    forCustomer: null,   // index in G.customers
    recipe: null,
    poured: [],          // totals per ingredient [{id, oz?, count?}] — used for scoring
    layers: [],          // every pour in order [{id, oz}] — drawn as bands in the glass
    garnishes: [],       // placed on the drink [{id, spot}]
    tier: 'new',         // new | familiar (when the order started)
    peeks: 0,            // paid peeks at the recipe on a familiar drink
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

  barBg:            $('bar-bg'),
  barCounter:       $('bar-counter'),
  counterDrinks:    $('counter-drinks'),
  barTips:          $('bar-tips'),
  barPause:         $('bar-pause'),
  speechArea:       $('speech-area'),
  speechText:       $('speech-text'),
  speechCanvas:     $('speech-canvas'),
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
  // Recipe card closes whenever you change screens
  dom.recipeCard.classList.remove('slide-up'); dom.overlay.classList.remove('open', 'shown');
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
  dom.game.classList.toggle('paused', !G.timerRunning);
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
   DIFFICULTY DIAL — fast-paced: the bar fills quickly and keeps
   refilling; the dial climbs with every drink, eases off only at the very end.
═══════════════════════════════════════════════════════════════ */
const PACE = {
  startDial:   0.35,  // difficulty at the start of a shift (0 calm … 1 rush)
  calmGap:     4,     // seconds between customers at dial 0
  rushGap:     1.5,   // seconds between customers at dial 1
  refillGap:   1,     // when the bar is full, next customer steps up this soon after a spot opens
  taperSecs:   30,    // ease off over the last N seconds
  lastCallSecs:15,    // no new customers in the last N seconds
};
const lerp = (a, b, t) => a + (b - a) * Math.max(0, Math.min(1, t));

function effectiveDial() {
  const taper = Math.min(1, G.shiftRemaining / PACE.taperSecs);
  return G.dial * taper;
}

function scheduleNextArrival() {
  const gap = lerp(PACE.calmGap, PACE.rushGap, effectiveDial());
  G.nextArrivalIn = gap * (0.8 + Math.random() * 0.4);
}

function updateDial(score, drinkTime, peeked) {
  // score 0–100, drinkTime in seconds — every drink pushes the pace up; good ones push harder
  const accuracy = score / 100;
  const speed = drinkTime < 30 ? 1 : drinkTime < 60 ? 0.6 : drinkTime < 120 ? 0.3 : 0;
  const perf = 0.6 * accuracy + 0.25 * speed + 0.15 * (peeked ? 0 : 1);
  G.dial = Math.max(0.2, Math.min(1, G.dial + 0.08 + (perf - 0.5) * 0.3));
}

/* ═══════════════════════════════════════════════════════════════
   CUSTOMER MANAGEMENT
═══════════════════════════════════════════════════════════════ */
function pickDrink() {
  // Calm → more new drinks; as the dial climbs, drinks you've already made show up more
  const d = effectiveDial();
  const weight = { new: 0.6 * (1 - d) + 0.1, familiar: 0.8 + 0.7 * d };
  const pool = DRINKS.filter(x => x.id !== G.lastDrinkId);
  const total = pool.reduce((sum, x) => sum + weight[tierOf(x.id)], 0);
  let r = Math.random() * total;
  let pick = pool[pool.length - 1];
  for (const x of pool) { r -= weight[tierOf(x.id)]; if (r <= 0) { pick = x; break; } }
  G.lastDrinkId = pick.id;
  return pick;
}

function trySpawnCustomer() {
  // Last call: nobody new near the end — they couldn't be served in time
  if (G.shiftRemaining < PACE.lastCallSecs) { scheduleNextArrival(); return; }
  const empty = [0, 1, 2].filter(i => !G.customers[i]);
  // Bar full: check again shortly so a freed spot refills right away
  if (!empty.length) { G.nextArrivalIn = PACE.refillGap; return; }
  scheduleNextArrival();
  const present = G.customers.filter(Boolean).map(c => c.type);
  const types = CUSTOMER_IDS.filter(t => !present.includes(t));
  const slot = empty[Math.floor(Math.random() * empty.length)];
  const type = types[Math.floor(Math.random() * types.length)];
  createCustomer(slot, type);
}

function createCustomer(slot, type) {
  const el = document.getElementById(`slot-${slot}`);
  const drink = pickDrink();
  const customer = { type, drink, line: orderLine(drink), state: 'skeleton', slot, el };
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
  showSpeechArea(c.line, slot);   // orders are lowercase (Figma 459:1276)
  refreshBarControls();
}

function showSpeechArea(text, slotIdx) {
  placeBubble(dom.speechArea, dom.speechText, dom.speechCanvas, text, slotIdx, true);
  // The order bubble wins: clear any reaction bubble it would cover
  const box = dom.speechArea.getBoundingClientRect();
  document.querySelectorAll('.speech-bubble.reaction').forEach(r => {
    const o = r.getBoundingClientRect();
    if (o.left < box.right && o.right > box.left && o.top < box.bottom && o.bottom > box.top) r.remove();
  });
}

// Lay out one A6 bubble over a customer. `mayGoBelow`: the order bubble drops onto the
// counter when "above" would touch the tips / pause (never for the far-right customer);
// reaction bubbles slide sideways instead, since the served drink sits on the counter.
function placeBubble(area, textEl, canvas, text, slotIdx, mayGoBelow) {
  const c = G.customers[slotIdx];
  const style = CUSTOMERS[c.type].bubble;
  const cx = SLOT_CX[slotIdx];
  textEl.textContent = text;
  area.style.setProperty('--bubble-text', style.bg);   // A6: text in the outline color
  area.classList.remove('below');
  area.style.display = 'flex';
  const w = area.offsetWidth;
  const clampLeft = l => Math.min(Math.max(l, 8), 844 - w - 8);

  let left = clampLeft(cx + style.dx - w / 2);
  let tailX = cx + style.tail;
  if (bubbleHitsTopRow(left, w)) {
    if (mayGoBelow && slotIdx !== 2) {
      area.classList.add('below');
      left = clampLeft(cx + BUBBLE_BELOW.dx - w / 2);
      tailX = cx + BUBBLE_BELOW.tail;
    } else if (!mayGoBelow) {
      const GAP = 10, minLeft = 30 + dom.barTips.offsetWidth + GAP, maxLeft = 800 - GAP - w;
      left = Math.min(Math.max(left, minLeft), maxLeft);
    }
  }
  // `tail` offsets were measured for Figma's 30.5px tail — keep the same center for the narrower one
  tailX += (30.5 - BUBBLE_TAIL_W) / 2;
  const tailLeft = Math.min(Math.max(tailX - left, 14), w - 14 - BUBBLE_TAIL_W);
  area.style.left = left + 'px';
  drawChalkBubble(canvas, w, area.offsetHeight, tailLeft, style.bg, area.classList.contains('below'), c.type.length);
}

// Reaction after serving: the customer's A6 bubble with their line for this mood
function showReaction(slotIdx, mood) {
  const line = REACTIONS[G.customers[slotIdx].type]?.[mood];
  if (!line) return null;
  const area = document.createElement('div');
  area.className = 'speech-bubble reaction';
  area.innerHTML = '<div class="speech-text"></div><canvas aria-hidden="true"></canvas>';
  dom.screens.bar.appendChild(area);
  placeBubble(area, area.firstChild, area.lastChild, line, slotIdx, false);
  return area;
}

/* Speech bubble style "A6" (user, 2026-09-24): dark fill, chalky outline in the
   customer's color, radius 6, short straight tail. Drawn on a canvas, like the liquid. */
const BUBBLE_R = 6, BUBBLE_TAIL_W = 22, BUBBLE_TAIL_H = 16, BUBBLE_LINE = 3.2, BUBBLE_WOBBLE = 0.8;
const BUBBLE_FILL = 'rgba(4, 3, 24, 0.9)';

// Outline of the bubble (clockwise, box 0,0–w,h) with the tail hanging off the bottom edge
function bubbleOutline(w, h, tailLeft, seed) {
  const r = BUBBLE_R, step = 3, pts = [], P = Math.PI;
  const line = (x0, y0, x1, y1) => {
    const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / step));
    for (let i = 0; i < n; i++) pts.push([x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n]);
  };
  const arc = (cx, cy, a0) => { for (let i = 0; i < 4; i++) { const a = a0 + (P / 2) * i / 4; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } };
  const tl = tailLeft, tr = tailLeft + BUBBLE_TAIL_W, tip = [tailLeft + BUBBLE_TAIL_W * 0.45, h + BUBBLE_TAIL_H];
  line(r, 0, w - r, 0);            arc(w - r, r, -P / 2);
  line(w, r, w, h - r);            arc(w - r, h - r, 0);
  line(w - r, h, tr, h);           line(tr, h, tip[0], tip[1]);   line(tip[0], tip[1], tl, h);
  line(tl, h, r, h);               arc(r, h - r, P / 2);
  line(0, h - r, 0, r);            arc(r, r, P);
  // Hand-drawn wobble: nudge every point along its normal by a few overlapping waves
  const n = pts.length;
  return pts.map((p, i) => {
    const a = pts[(i - 1 + n) % n], b = pts[(i + 1) % n];
    let nx = b[1] - a[1], ny = a[0] - b[0];
    const L = Math.hypot(nx, ny) || 1;
    const t = i / n * 2 * P;
    const o = BUBBLE_WOBBLE * (Math.sin(t * 5 + seed) + 0.6 * Math.sin(t * 11 + seed * 2.3) + 0.3 * Math.sin(t * 23 + seed * 0.7));
    return [p[0] + nx / L * o, p[1] + ny / L * o];
  });
}

// Paint a bubble of box size w×h onto `canvas` (sits behind the text). Below = tail points up.
function drawChalkBubble(canvas, w, h, tailLeft, color, below, seed) {
  const pad = 6, cw = w + 2 * pad, ch = h + BUBBLE_TAIL_H + 2 * pad;
  const dpr = Math.min(3, window.devicePixelRatio || 1);
  canvas.width = Math.ceil(cw * dpr);
  canvas.height = Math.ceil(ch * dpr);
  Object.assign(canvas.style, {
    left: -pad + 'px', top: (below ? -(BUBBLE_TAIL_H + pad) : -pad) + 'px',
    width: cw + 'px', height: ch + 'px', transform: below ? 'scaleY(-1)' : 'none',
  });
  const pts = bubbleOutline(w, h, tailLeft, seed);
  const trace = ctx => {
    ctx.setTransform(dpr, 0, 0, dpr, pad * dpr, pad * dpr);
    ctx.beginPath();
    pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
    ctx.closePath();
  };
  const ctx = canvas.getContext('2d');
  trace(ctx);
  ctx.fillStyle = BUBBLE_FILL;
  ctx.fill();
  // Chalky outline: stroke on its own layer, knock grain out of it, then lay it on top
  const line = document.createElement('canvas');
  line.width = canvas.width; line.height = canvas.height;
  const lc = line.getContext('2d');
  trace(lc);
  lc.strokeStyle = color;
  lc.lineWidth = BUBBLE_LINE;
  lc.lineJoin = 'round';
  lc.stroke();
  lc.setTransform(1, 0, 0, 1, 0, 0);
  lc.globalCompositeOperation = 'destination-in';
  lc.fillStyle = lc.createPattern(grainTile(), 'repeat');
  lc.fillRect(0, 0, line.width, line.height);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(line, 0, 0);
}

// Would a bubble at the top (y 45–93) touch the tips amount or the pause button?
function bubbleHitsTopRow(left, w) {
  const GAP = 10;
  const tipsRight = 30 + dom.barTips.offsetWidth;          // "$0.00" starts at x=30
  const pauseLeft = 800;                                   // pause bars start at x=800
  return left < tipsRight + GAP || left + w > pauseLeft - GAP;
}

function hideSpeechArea() {
  dom.speechArea.style.display = 'none';
  dom.speechText.textContent = '';
}

/* ═══════════════════════════════════════════════════════════════
   RECIPE CARD — Figma 502:1932
═══════════════════════════════════════════════════════════════ */
// Scratchy rules (user): its E is drawn small, so every E is 8px bigger than the rest,
// and the letter right before an E sits a little tighter (-2.25px at 45px = 5% of the size).
function scratchyHTML(text, size) {
  const chars = [...text];
  return chars.map((ch, i) => {
    const isE = ch.toUpperCase() === 'E';
    const beforeE = chars[i + 1] && chars[i + 1].toUpperCase() === 'E' && ch !== ' ';
    const style = [];
    if (isE) style.push(`font-size:${size + 8}px`);
    if (beforeE) style.push(`letter-spacing:${-(size * 0.05).toFixed(2)}px`);
    return style.length ? `<span style="${style.join(';')}">${ch}</span>` : ch;
  }).join('');
}

function recipeLine(ing) {
  const name = INGREDIENTS[ing.id].name.toLowerCase();
  let amount;
  if (ing.oz) amount = `${ing.oz} oz`;
  else {
    const unit = GARNISH_UNITS[ing.id] ?? '';
    amount = unit ? `${ing.count} ${unit}${ing.count > 1 ? 's' : ''}` : `${ing.count}`;
  }
  return `<div><span class="ing">${name}</span> - ${amount}</div>`;
}

function openRecipe(drink) {
  // Title: shrink to fit 260px if the name is long (E stays +8px)
  const title = $('recipe-title');
  let size = 45;
  title.innerHTML = scratchyHTML(drink.name.toUpperCase(), size);
  title.style.fontSize = size + 'px';
  dom.overlay.classList.add('open');           // needs layout to measure
  while (title.scrollWidth > 260 && size > 26) {
    size -= 1;
    title.style.fontSize = size + 'px';
    title.innerHTML = scratchyHTML(drink.name.toUpperCase(), size);
  }
  // Ingredients: 28px as designed; smaller when a recipe has more lines
  const list = $('recipe-list');
  const n = drink.ingredients.length;
  list.style.fontSize = (n <= 3 ? 28 : n === 4 ? 25 : n === 5 ? 21 : 19) + 'px';
  list.innerHTML = drink.ingredients.map(recipeLine).join('');
  // Mini drink: what the finished drink should look like
  const poured = drink.ingredients.filter(i => i.oz).map(i => ({ id: i.id, oz: i.oz }));
  const garnishes = [];
  drink.ingredients.filter(i => i.count).forEach(i => {
    for (let k = 0; k < i.count; k++) garnishes.push({ id: i.id, spot: garnishSpot(i.id, garnishes) });
  });
  renderDrinkView($('recipe-drink'), poured, garnishes);

  // Move in: card slides up while the dark layer fades in
  requestAnimationFrame(() => requestAnimationFrame(() => {
    dom.recipeCard.classList.add('slide-up');
    dom.overlay.classList.add('shown');
  }));
}

function closeRecipe() {
  dom.recipeCard.classList.remove('slide-up');
  dom.overlay.classList.remove('shown');
  setTimeout(() => {
    if (!dom.recipeCard.classList.contains('slide-up')) dom.overlay.classList.remove('open');
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

// The last visible bottle must be cut off by the right edge (like the OJ in Figma)
// so it's obvious the row scrolls. Bottles start at x=38 with 56px gaps (buildShelf sets the row's gap from SHELF_GAP).
const SHELF_START_X = 38, SHELF_GAP = 56, SCREEN_W = 844;
function edgeBottleVisible(order) {
  let x = SHELF_START_X;
  for (const id of order) {
    const [w] = shelfSize(id);
    if (x < SCREEN_W && x + w > SCREEN_W) return (SCREEN_W - x) / w;   // fraction showing
    x += w + SHELF_GAP;
  }
  return null; // edge fell in a gap
}
function shuffleShelfOrder() {
  let order;
  for (let tries = 0; tries < 500; tries++) {
    order = shuffleArray(LIQUID_IDS);
    const v = edgeBottleVisible(order);
    if (v !== null && v >= 0.3 && v <= 0.75) break;
  }
  return order;
}

function buildShelf() {
  G.shelf.order = shuffleShelfOrder();
  dom.shelfRow.innerHTML = '';
  dom.shelfRow.style.gap = SHELF_GAP + 'px';
  dom.shelfRow.scrollLeft = 0;
  G.shelf.order.forEach(id => {
    const ing = INGREDIENTS[id];
    const el = document.createElement('div');
    el.className = 'shelf-bottle' + (ing.outline ? '' : ' traced');
    el.dataset.id = id;
    const [w, h] = shelfSize(id), k = h / ing.shelf[1];
    el.style.width = w + 'px';
    el.style.height = h + 'px';
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
      Object.assign(o.style, { left: ing.outline.x * k + 'px', top: ing.outline.y * k + 'px', width: ing.outline.w * k + 'px', height: ing.outline.h * k + 'px' });
      el.appendChild(o);
    }
    el.addEventListener('click', () => toggleBottle(id));
    dom.shelfRow.appendChild(el);
  });
}

function toggleBottle(id) {
  if (G.screen !== 'shelf' || !G.timerRunning) return;
  G.shelf.selected = G.shelf.selected === id ? null : id;
  G.shelf.toast = null;
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
  dom.btnPour.style.display = sel ? '' : 'none';
  // Confirmation: "WHISKEY ADDED ✓" / "GLASS EMPTIED ✓"
  const added = !sel && G.shelf.toast;
  dom.shelfAdded.style.display = added ? 'flex' : 'none';
  if (added) dom.shelfAddedText.textContent = G.shelf.toast;
  if (added && !G.shelf.addedShown) {
    // fades out after CONFIRM_MS
    G.shelf.addedShown = true;
    dom.shelfAdded.classList.remove('fading');
    clearTimeout(G.shelf.addedTimer);
    G.shelf.addedTimer = setTimeout(() => {
      dom.shelfAdded.classList.add('fading');
      G.shelf.addedTimer = setTimeout(() => {
        G.shelf.toast = null;
        G.shelf.addedShown = false;
        dom.shelfAdded.classList.remove('fading');
        dom.shelfAdded.style.display = 'none';
      }, 400);
    }, CONFIRM_MS);
  } else if (!added) {
    clearTimeout(G.shelf.addedTimer);
    G.shelf.addedShown = false;
    dom.shelfAdded.classList.remove('fading');
  }
  dom.btnToGarnish.disabled = !G.drink.poured.some(p => p.oz > 0);
  updateRecipeButtons();
}

function openShelf() {
  showScreen('shelf');
  renderShelf();
}

/* Bar controls while an order exists: START ORDER before it starts,
   POUR → (back to the drink) once it's in progress */
function refreshBarControls() {
  const inProgress = G.drink.forCustomer !== null;
  dom.btnStartOrder.style.display = !inProgress && G.selectedIdx !== null ? '' : 'none';
  dom.btnBackToPour.style.display = inProgress ? 'flex' : 'none';
}

/* ═══════════════════════════════════════════════════════════════
   POUR SCREEN — LIQUID MODE
   Hold anywhere to pour at 1 oz/sec; release to stop; BACK saves the pour.
   The glass reads the TOTAL level — every pour stacks as its own band.
═══════════════════════════════════════════════════════════════ */
const MAX_OZ = 8;
const OZ_ZERO_Y = 366;   // glass bottom (0 oz) — from Figma tick marks
const PX_PER_OZ = 28;    // ticks are 14px apart, one per 0.5 oz
const ozToY = oz => OZ_ZERO_Y - oz * PX_PER_OZ;

// Bottle poses from Figma: idle box + tilted center/rotation.
// Other bottles: idle = shelf size x3.08 standing at y=380 (like whiskey/cola),
// tilted so the mouth lands where whiskey's/cola's do (~455, 62).
// Layout = Figma 512:97 (no DONE button): bottle 90px and glass 59px right of the older frames.
const POUR_POSE = {
  whiskey: { idle:{ x:177, y:-68, w:191, h:448 }, tilt:{ cx:241.5, cy:156,  rot:68.63 } },
  cola:    { idle:{ x:185, y:87,  w:176, h:293 }, tilt:{ cx:317.6, cy:85.3, rot:75.8 } },
  vodka:   { idle:{ x:182, y:-66, w:175, h:444 }, tilt:{ cx:239.5, cy:134,  rot:77.42 } },  // Figma 437:295 / 437:333
};
function pourPose(id) {
  if (POUR_POSE[id]) return POUR_POSE[id];
  const [sw, sh] = INGREDIENTS[id].shelf;
  const w = sw * 3.079, h = sh * 3.079, rot = 72, r = rot * Math.PI / 180;
  return {
    idle: { x: 272.75 - w / 2, y: 380 - h, w, h },
    tilt: { cx: 455 - (h / 2) * Math.sin(r), cy: 62 + (h / 2) * Math.cos(r), rot },
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

/* Hand-drawn liquid details (style "C", matching the bottle art):
   a drawn surface line on top of each liquid, bubble outlines in fizzy ones,
   a soft shine streak down the side, all with a chalky grain.
   Drawn on a <canvas> — Safari chokes on SVG noise filters redrawn every frame. */
const FIZZY_IDS = new Set(['soda-water', 'tonic-water', 'cola', 'ginger-beer']);
const WAVE_FIZZY = { amp: 2.6, cycles: 2.2 };
const WAVE_STILL = { amp: 0.8, cycles: 1.2 };
const SHINE = 'rgba(255,255,255,0.41)', SHINE_DIM = 'rgba(255,255,255,0.33)';

function wavePoints(x0, x1, y, { amp, cycles }) {
  const steps = 28, pts = [];
  for (let k = 0; k <= steps; k++) {
    const t = k / steps;
    pts.push([x0 + (x1 - x0) * t, y + amp * Math.sin(t * cycles * 2 * Math.PI)]);
  }
  return pts;
}

// Tiny seeded random so bubbles stay put while the glass fills
function seededRandom(seed) {
  let s = seed * 9301 + 49297;
  return () => (s = (s * 9301 + 49297) % 233280) / 233280;
}

// Chalky grain: a tile of random alpha that knocks bits out of every stroke
let grainTileCanvas = null;
function grainTile() {
  if (grainTileCanvas) return grainTileCanvas;
  const n = 128, c = document.createElement('canvas');
  c.width = c.height = n;
  const ctx = c.getContext('2d'), img = ctx.createImageData(n, n);
  for (let y = 0; y < n; y += 2) for (let x = 0; x < n; x += 2) {
    const a = 90 + Math.random() * 165;
    for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) img.data[((y + dy) * n + x + dx) * 4 + 3] = a;
  }
  ctx.putImageData(img, 0, 0);
  return (grainTileCanvas = c);
}

// Strokes (lines / circles) onto a canvas covering box [x, y, w, h] in the caller's coordinates
function drawLiquidDetail(canvas, [bx, by, bw, bh], strokes) {
  const dpr = Math.min(3, window.devicePixelRatio || 1);
  const W = Math.ceil(bw * dpr), H = Math.ceil(bh * dpr);
  if (canvas.width !== W) canvas.width = W;
  if (canvas.height !== H) canvas.height = H;
  canvas.style.width = bw + 'px';
  canvas.style.height = bh + 'px';
  const ctx = canvas.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = 'source-over';
  ctx.clearRect(0, 0, W, H);
  if (!strokes.length) return;
  ctx.setTransform(dpr, 0, 0, dpr, -bx * dpr, -by * dpr);
  ctx.lineCap = ctx.lineJoin = 'round';
  strokes.forEach(st => {
    ctx.strokeStyle = st.color;
    ctx.lineWidth = st.width;
    ctx.beginPath();
    if (st.r) ctx.arc(st.x, st.y, st.r, 0, 2 * Math.PI);
    else st.pts.forEach(([x, y], k) => k ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
    ctx.stroke();
  });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = 'destination-in';
  ctx.fillStyle = ctx.createPattern(grainTile(), 'repeat');
  ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'source-over';
}

// Inside walls of the pour glass (same trace as the #pour-liquid clip-path)
const TICK_LABEL_OZ = [8, 6, 4, 2.5, 1.5];   // the oz labels printed on the pour glass
const POUR_WALL_L = [[465,132],[473,192],[485,276],[496.5,331.5],[500.5,352],[506.5,365.5]];
const POUR_WALL_R = [[631.5,132],[625.5,192],[613,276],[610,331.5],[605,358.5],[597,366.5]];
const POUR_DETAIL_BOX = [449, 110, 200, 270];   // matches .liquid-detail in style.css
function wallX(wall, y) {
  if (y <= wall[0][1]) return wall[0][0];
  for (let i = 1; i < wall.length; i++) {
    const [x0, y0] = wall[i - 1], [x1, y1] = wall[i];
    if (y <= y1) return x0 + (x1 - x0) * (y - y0) / (y1 - y0);
  }
  return wall[wall.length - 1][0];
}

// Stacked bands: every committed pour, plus the one in progress
let pourDetailCanvas = null;
function renderPourLiquid() {
  const layers = [...G.drink.layers];
  if (G.pour.ozPoured > 0) layers.push({ id: G.pour.ingredientId, oz: G.pour.ozPoured });
  dom.pourLiquid.innerHTML = '';
  let total = 0;
  const strokes = [];
  layers.forEach((l, i) => {
    const band = document.createElement('div');
    band.className = 'liquid-band';
    const bottom = i === 0 ? OZ_ZERO_Y + 6 : ozToY(total);   // first band fills the rounded bottom
    total = Math.min(MAX_OZ, total + l.oz);
    const top = ozToY(total);
    const color = INGREDIENTS[l.id].color;
    band.style.top = top + 'px';
    band.style.height = Math.max(0, bottom - top) + 'px';
    band.style.background = hexToRgba(color, 0.3);
    dom.pourLiquid.appendChild(band);
    if (bottom - top < 1) return;

    const fizzy = FIZZY_IDS.has(l.id);
    // Bubbles fill in from the bottom of the layer as it rises
    if (fizzy) {
      const rand = seededRandom(i + 1);
      const floor = Math.min(bottom, 358);
      const placed = [];
      for (let k = 0; k < 40; k++) {
        const y = floor - 12 - k * 7 - rand() * 4, r = 3.5 + rand() * 3.5, f = rand();
        if (y - r < top + 8) break;
        // Stay right of the ticks and clear of the shine; hop over the oz labels
        const xl = 529, xr = wallX(POUR_WALL_R, y) - 26;
        if (y + r > floor - 4 || xr - xl < 2 * r) continue;
        const x = xl + r + (xr - xl - 2 * r) * f;
        const onLabel = TICK_LABEL_OZ.some(oz => Math.abs(ozToY(oz) - y) < r + 8 && x - r < 573);
        if (onLabel || placed.some(([px, py]) => Math.hypot(px - x, py - y) < 22)) continue;
        placed.push([x, y]);
        strokes.push({ x, y, r, color, width: 2.6 });
      }
    }
    // Surface line on top of this layer
    strokes.push({ pts: wavePoints(wallX(POUR_WALL_L, top) + 8, wallX(POUR_WALL_R, top) - 8, top, fizzy ? WAVE_FIZZY : WAVE_STILL), color, width: 4 });
  });

  // Shine streak down the side of the whole drink (right side here — the ticks sit on the left)
  const top = ozToY(total), y1 = top + 18, len = Math.min(60, (356 - y1) * 0.6);
  const shineX = y => wallX(POUR_WALL_R, y) - 13;
  if (strokes.length && len >= 12) {
    const y2 = y1 + len, y3 = y2 + 12, y4 = y3 + 10;
    strokes.push({ pts: [[shineX(y1), y1], [shineX(y2), y2]], color: SHINE, width: 3.5 });
    if (y4 < 350) strokes.push({ pts: [[shineX(y3), y3], [shineX(y4), y4]], color: SHINE_DIM, width: 3.5 });
  }
  if (!pourDetailCanvas) {
    pourDetailCanvas = document.createElement('canvas');
    pourDetailCanvas.className = 'liquid-detail';
  }
  drawLiquidDetail(pourDetailCanvas, POUR_DETAIL_BOX, strokes);
  dom.pourLiquid.appendChild(pourDetailCanvas);
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
  updateRecipeButtons();
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
// For the customer's reaction: which pours make a drink taste strong / sweet
const SPIRIT_IDS = new Set(['vodka', 'gin', 'tequila', 'whiskey', 'white-rum']);
const SWEET_IDS  = new Set(['simple-syrup', 'grenadine', 'triple-sec']);

function scoreDrink(recipe, poured, drinkTime, tier, peeks) {
  let score = 100;
  const reqIds = recipe.ingredients.map(r => r.id);
  const pouredIds = poured.map(p => p.id);
  let wrongOrMissing = false, amountsOff = false;
  let spirit = 0, sweet = 0, mixer = 0;   // oz over (+) / under (−) the recipe, by kind

  pouredIds.forEach(id => {
    if (!reqIds.includes(id)) { score -= 35; wrongOrMissing = true; }
  });

  recipe.ingredients.forEach(req => {
    const actual = poured.find(p => p.id === req.id);
    if (!actual) { score -= 30; wrongOrMissing = true; return; }
    if (req.count && (actual.count || 0) !== req.count) score -= 10;  // e.g. 2 limes when they asked for 1
    if (req.oz) {
      const delta = (actual.oz || 0) - req.oz, diff = Math.abs(delta);
      if (diff > 1.5)       score -= 20;
      else if (diff > 0.75) score -= 12;
      else if (diff > 0.3)  score -= 5;
      if (diff > 0.75) amountsOff = true;
      if (SPIRIT_IDS.has(req.id)) spirit += delta;
      else if (SWEET_IDS.has(req.id)) sweet += delta;
      else mixer += delta;
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
  tip = Math.max(0, tip - PEEK_COST * peeks);
  tip = Math.round(tip * 100) / 100;

  // Mood for the reaction — the biggest reason behind the tip, said vaguely
  let mood;
  if (base === 0)          mood = 'bad';
  else if (wrongOrMissing) mood = 'off';
  else if (amountsOff) {
    const strength = spirit - mixer;   // more spirit or less mixer → strong
    const taste = { strong: strength, weak: -strength, sweet };
    mood = Object.keys(taste).reduce((a, b) => taste[b] > taste[a] ? b : a);
  }
  else if (timeMult < 1)   mood = 'slow';
  else                     mood = score >= 95 ? 'perfect' : 'good';
  return { tip, score, mood };
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
const TIP_AFTER_REACTION_MS = 1000; // tip appears this long after the reaction bubble
const SERVED_LINGER_MS = 3500; // customer stays ~3.5s (time to read their reaction), then fades
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
  const result = scoreDrink(G.drink.recipe, G.drink.poured, drinkTime, G.drink.tier, G.drink.peeks);
  G.tips += result.tip;
  G.drinksServed++;
  updateDial(result.score, drinkTime, G.drink.peeks > 0);

  // Familiarity: every served drink counts toward new → familiar (this session only)
  const rec = PROGRESS.drinks[G.drink.recipe.id] || (PROGRESS.drinks[G.drink.recipe.id] = { made: 0 });
  rec.made++;
  saveProgress();

  // Served customer keeps their "selected" look, drink lands on the counter, tip shows
  customer.state = 'served';
  renderCustomer(customerIdx);
  const drinkEl = putDrinkOnCounter(customerIdx, G.drink.poured, G.drink.garnishes);
  hideSpeechArea();
  showScreen('bar');   // before measuring the reaction bubble (hidden screens measure 0)
  const tipEl = showTipFloat(`$${result.tip % 1 === 0 ? result.tip : result.tip.toFixed(2)}`, customerIdx);
  const reactionEl = showReaction(customerIdx, result.mood);
  if (reactionEl) {
    // The reaction takes the spot over their head — the tip sits beside it instead
    tipEl.classList.add('with-reaction');
    const right = reactionEl.offsetLeft + reactionEl.offsetWidth + 12;
    tipEl.style.left = (right + tipEl.offsetWidth <= 790 ? right : reactionEl.offsetLeft - 12 - tipEl.offsetWidth) + 'px';
    // The customer speaks first; the tip follows a beat later, like it's their answer
    tipEl.classList.add('pending');
  }
  const tipsNow = G.tips;
  setTimeout(() => {
    tipEl.classList.remove('pending');
    if (G.customers[customerIdx] === customer) dom.barTips.textContent = '$' + tipsNow.toFixed(2);
  }, reactionEl ? TIP_AFTER_REACTION_MS : 0);
  G.selectedIdx = null;
  resetCurrentDrink();
  refreshBarControls();
  G.serving = (G.serving || 0) + 1;

  setTimeout(() => {
    [customer.el, drinkEl, tipEl, reactionEl].forEach(e => e && e.classList.add('leaving'));
    setTimeout(() => {
      drinkEl.remove();
      tipEl.remove();
      if (reactionEl) reactionEl.remove();
      if (G.customers[customerIdx] === customer) {
        G.customers[customerIdx] = null;
        renderCustomer(customerIdx);
      }
      G.serving--;
      maybeEndShift();
    }, FADE_MS);
  }, SERVED_LINGER_MS);
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
  G.drink.peeks = 0;
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

function endShift(early = false) {
  if (G.shiftEnded) return;
  G.shiftEnded = true;
  stopTimer();
  stopPourRAF();
  // Ending early from pause: the drink in progress (if any) is dropped
  if (early) resetCurrentDrink();
  dom.pauseOverlay.style.display = 'none';
  dom.game.classList.remove('paused');
  PROGRESS.shifts.push({ date: new Date().toISOString(), tips: Math.round(G.tips * 100) / 100, served: G.drinksServed,
                         ...(early ? { endedEarly: true, secondsLeft: Math.ceil(G.shiftRemaining) } : {}) });
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
  G.dial = PACE.startDial;
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
  dom.game.classList.remove('paused');
  dom.counterDrinks.innerHTML = '';
  document.querySelectorAll('.bar-tip-float, .speech-bubble.reaction').forEach(e => e.remove());
  hideSpeechArea();
  G.shelf = { order: [], selected: null, toast: null };
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
  G.shelf.toast = null;
  G.drink.tier = tierOf(customer.drink.id);
  G.drink.peeks = 0;
  buildShelf();
  openShelf();
  if (G.drink.tier === 'new') setTimeout(() => openRecipe(customer.drink), 50);
});

dom.barPause.addEventListener('pointerdown', (e) => { e.stopPropagation(); pauseToggle(); });

/* ═══════════════════════════════════════════════════════════════
   EVENT WIRING — RECIPE CARD
═══════════════════════════════════════════════════════════════ */
// Close with the X or by tapping outside the card (taps on the card itself do nothing)
dom.overlay.addEventListener('pointerdown', (e) => {
  e.stopPropagation();
  if (e.target.closest('#btn-recipe-close') || !e.target.closest('#recipe-card')) closeRecipe();
});

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
  G.shelf.toast = 'GLASS EMPTIED';
  G.shelf.addedShown = false;   // restart its fade timer
  renderShelf();
});

dom.shelfPause.addEventListener('pointerdown', (e) => { e.stopPropagation(); pauseToggle(); });

// Recipe icon (shelf, pour, garnish) — always there while a drink is in progress.
// New drink: re-open for free. Familiar drink: every peek costs PEEK_COST, after a confirm.
const RECIPE_BUTTON_IDS = ['btn-recipe-peek', 'btn-recipe-peek-pour', 'btn-recipe-peek-garnish'];
function updateRecipeButtons() {
  RECIPE_BUTTON_IDS.forEach(id => { $(id).style.display = G.drink.recipe ? 'block' : 'none'; });
}
RECIPE_BUTTON_IDS.forEach(id => $(id).addEventListener('pointerdown', (e) => {
  e.stopPropagation();   // don't start a pour on the pour screen
  if (!G.timerRunning || !G.drink.recipe) return;
  if (G.drink.tier === 'new') openRecipe(G.drink.recipe);
  else openPeekConfirm();
}));

// Peek confirm — Figma 509:88 (wording as designed: "Peek at the recipe for 0.50?")
function openPeekConfirm() {
  $('peek-confirm-text').textContent = `Peek at the recipe for ${PEEK_COST.toFixed(2)}?`;
  $('peek-confirm').style.display = 'flex';
}
function closePeekConfirm() { $('peek-confirm').style.display = 'none'; }
$('btn-peek-yes').addEventListener('click', (e) => {
  e.stopPropagation();
  closePeekConfirm();
  if (!G.drink.recipe) return;
  G.drink.peeks++;
  openRecipe(G.drink.recipe);
});
$('btn-peek-no').addEventListener('click', (e) => { e.stopPropagation(); closePeekConfirm(); });
$('peek-confirm').addEventListener('pointerdown', (e) => { if (e.target.id === 'peek-confirm') closePeekConfirm(); });

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
  // BACK keeps what was poured (Figma 512:97 — there's no DONE button anymore)
  commitLiquidPour();
});

dom.pourPause.addEventListener('pointerdown', (e) => { e.stopPropagation(); pauseToggle(); });


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
    G.shelf.toast = `${INGREDIENTS[id].name.toUpperCase()} ADDED`;   // "WHISKEY ADDED ✓"
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

// Bubble outlines for a mixed drink (liquid-shape coords); fizzier drinks show more of them
const MIXED_BUBBLES = [[0.30,0.20,2.4],[0.66,0.16,1.5],[0.50,0.45,2.9],[0.74,0.52,1.8],[0.30,0.62,1.5],[0.58,0.78,1.1],[0.40,0.88,1.4]];

// One blended liquid in the hand-drawn style: surface line, bubbles, shine (on top of the fill)
function mixedLiquidStrokes(poured, color) {
  const totalOz = poured.reduce((s, p) => s + (p.oz || 0), 0);
  const fizzyShare = poured.reduce((s, p) => s + (FIZZY_IDS.has(p.id) ? p.oz || 0 : 0), 0) / totalOz;
  const strokes = [];
  if (fizzyShare > 0) {
    MIXED_BUBBLES.slice(0, Math.max(3, Math.round(MIXED_BUBBLES.length * Math.min(1, fizzyShare * 1.4)))).forEach(([fx, fy, r]) => {
      const y = 11 + 104 * fy;
      strokes.push({ x: 13 + 68 * fx - (y - 9) * 0.05, y, r, color, width: 1.2 });
    });
  }
  const wave = fizzyShare > 0 ? { amp: 1.1, cycles: 2.2 } : { amp: 0.45, cycles: 1.2 };
  strokes.push({ pts: wavePoints(6, 83, 3.2, wave), color, width: 1.9 });
  strokes.push({ pts: [[13, 13], [16, 39]], color: SHINE, width: 1.8 });
  strokes.push({ pts: [[18, 47], [19, 52]], color: SHINE_DIM, width: 1.8 });
  return strokes;
}

// Glass + one blended liquid color + placed garnishes (garnish screen and bar counter)
function renderDrinkView(el, poured, garnishes) {
  el.innerHTML = '';
  const color = blendLiquids(poured);
  if (color) {
    el.insertAdjacentHTML('beforeend', `<svg class="dv-liquid" viewBox="0 0 100.091 126.534" preserveAspectRatio="none"><path d="${LIQUID_PATH}" fill="${color}" fill-opacity="0.3"/></svg>`);
    const detail = document.createElement('canvas');
    detail.className = 'dv-liquid';
    drawLiquidDetail(detail, [0, 0, 100.091, 126.534], mixedLiquidStrokes(poured, color));
    el.appendChild(detail);
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
  hideGarnishToast();
  updateRecipeButtons();
  showScreen('garnish');
  renderGarnishScreen();
}

function toggleGarnish(id) {
  if (G.screen !== 'garnish' || !G.timerRunning) return;
  hideGarnishToast();
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

// "GARNISH REMOVED ✓" — same look and fade as the shelf confirmations
let garnishToastTimer = null;
function hideGarnishToast() {
  clearTimeout(garnishToastTimer);
  const t = $('garnish-toast');
  t.classList.remove('fading');
  t.style.display = 'none';
}
function flashGarnishToast(msg) {
  hideGarnishToast();
  const t = $('garnish-toast');
  $('garnish-toast-text').textContent = msg;
  t.style.display = 'flex';
  garnishToastTimer = setTimeout(() => {
    t.classList.add('fading');
    garnishToastTimer = setTimeout(hideGarnishToast, 400);
  }, CONFIRM_MS);
}

$('btn-remove-garnish').addEventListener('click', (e) => {
  e.stopPropagation();
  if (!G.timerRunning) return;
  G.drink.garnishes = [];
  G.drink.poured = G.drink.poured.filter(p => INGREDIENTS[p.id].type !== 'garnish');
  G.garnishSel = null;
  renderGarnishScreen();
  flashGarnishToast('GARNISH REMOVED');
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
$('btn-end-shift').addEventListener('pointerdown', (e) => {
  e.stopPropagation();
  endShift(true);
});

dom.pauseOverlay.addEventListener('pointerdown', (e) => {
  e.stopPropagation();
  if (!G.timerRunning) pauseToggle();
});

/* ═══════════════════════════════════════════════════════════════
   BOOT — loading screen preloads every image, then home
═══════════════════════════════════════════════════════════════ */
function allImagePaths() {
  const ui = ['icon-restart.svg','arrow-bar.svg','shelf-line.svg','icon-check.svg','icon-back.svg',
              'pour-ticks.svg','tap-target.png','icon-settings.svg','select-outline-whiskey.svg','select-outline-cola.svg',
              'select-outline-lime.svg','icon-recipe.svg','recipe-underline.svg?v=2','icon-close.svg'].map(f => `assets/ui/${f}`);
  return [
    ...Object.values(ART),
    ...CUSTOMER_IDS.flatMap(id => [customerImg(id, 'skeleton'), customerImg(id, 'selected')]),
    ...Object.keys(INGREDIENTS).map(ingPath),
    ...ui,
  ];
}

function preload(onProgress) {
  const paths = allImagePaths();
  const fonts = [document.fonts.load("28px 'BarFont'"), document.fonts.load("26px 'BarFontBold'"), document.fonts.load("45px 'Scratchy'")];
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

// The bar fills on an eased curve over at least LOAD_MIN_MS, but never runs ahead of
// real loading. Then it holds at full for a beat and fades into home.
const LOAD_MIN_MS  = 2200;
const LOAD_HOLD_MS = 350;
const LOAD_FADE_MS = 400;
const easeInOut = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

window.addEventListener('DOMContentLoaded', () => {
  buildGarnishTray();
  showScreen('loading');
  const fill = $('loading-fill');
  fill.style.transition = 'none';
  let real = 0, done = false;
  preload(p => { real = p; }).then(() => { real = 1; done = true; });

  const start = performance.now();
  const frame = (now) => {
    const timed = easeInOut(Math.min(1, (now - start) / LOAD_MIN_MS));
    const shown = Math.min(timed, real);
    fill.style.width = (382 * shown) + 'px';
    if (done && timed >= 1) {
      setTimeout(() => {
        // Crossfade: home fades in over the loading screen
        const home = dom.screens.home;
        home.style.opacity = '0';
        home.classList.add('active');
        void home.offsetWidth;
        home.style.transition = `opacity ${LOAD_FADE_MS}ms ease`;
        home.style.opacity = '1';
        setTimeout(() => { showScreen('home'); home.style.transition = ''; home.style.opacity = ''; }, LOAD_FADE_MS);
      }, LOAD_HOLD_MS);
      return;
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
});

