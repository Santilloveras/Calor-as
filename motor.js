// Motor: convierte texto libre en alimentos y calorías usando la base, sin IA.

const norm = s => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const aNum = s => parseFloat(String(s).replace(',', '.'));

const NUMS = { un: 1, una: 1, uno: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10, medio: 0.5, media: 0.5 };
const UNIDADES = ('porcion porciones unidad unidades feta fetas rodaja rodajas vaso vasos scoop scoops medida medidas ' +
  'cucharada cucharadas cucharadita cucharaditas cda cdas cdita cditas lata latas pinta pintas trago tragos plato platos ' +
  'taza tazas pieza piezas copa copas bocha bochas paquete paquetes rebanada rebanadas sobre sobres punado punados').split(' ');
const TAMANOS = 'chica chico chicas chicos mediana mediano medianas medianos grande grandes doble dobles triple triples xl'.split(' ');
const UNI_SET = new Set(UNIDADES);
const TAM_SET = new Set(TAMANOS);
const TAM_BASE = { chica: 0.7, mediana: 1, grande: 1.4, doble: 2, triple: 3 };

// Palabras que no son comida (no se reportan como "no reconocidas")
const IGNORAR = new Set(('con de del la las el los y e o a al en mi me que para por sin tipo algo poco poca mas casi ' +
  'comi come comimos comiendo tome tomamos tomo sali salimos comer cenar cene almorce almorzar desayune desayunar merende merendar ' +
  'desayuno almuerzo merienda cena colacion snack venia vinieron acompanada acompanado acompanadas acompanados ' +
  'casa afuera hoy ayer noche mediodia manana tarde aprox aproximadamente todo toda todos todas despues antes ' +
  'gym entreno entrenar pre post tambien ademas etc creo como fue era habia unos unas nada solo sola kcal gramos ' +
  'restaurant resto bar amigos novia bien muy rico rica lleno llena otro otra otros otras le lo les su sus ese esa esto eso ' +
  'porque pero cuando donde mientras vez veces postre cenamos almorzamos desayunamos merendamos picamos ' +
  'cocido cocida cocidos cocidas crudo cruda crudos crudas hervido hervida hervidos hervidas peso pesado pesada').split(/\s+/));

const RE_NUM = `\\d+(?:[.,]\\d+)?|${Object.keys(NUMS).join('|')}`;
const RE_GR_ANTES = new RegExp(`(\\d+(?:[.,]\\d+)?)\\s*(kg|kilos?|g|gr|grs|gramos|ml|cc)\\.?\\s*(?:de\\s+)?\\(?\\s*$`);
const RE_CANT_ANTES = new RegExp(`(?:^|[^a-z0-9.,])(?:(${RE_NUM})\\s+)?(?:(?:${UNIDADES.join('|')})\\s+)?(?:(${TAMANOS.join('|')})\\s+)?(?:de\\s+)?\\(?\\s*$`);
const RE_GR_DESPUES = /^\s*\(?\s*(\d+(?:[.,]\d+)?)\s*(kg|kilos?|g|gr|grs|gramos|ml|cc)(?![a-z])\.?\)?/;
const RE_TAM_DESPUES = new RegExp(`^\\s*(${TAMANOS.join('|')})(?![a-z])`);
const RE_X_DESPUES = /^\s*x\s*(\d+)(?!\d)/;
// Estado del alimento al pesarlo: "carne 150 g (cocido)", "arroz crudo 80 g"
const RE_ESTADO = /(?:^|[^a-z])(?:en\s+)?(cocid|crud|hervid)[oa]s?(?![a-z])/;
const RE_ESTADO_TAPAR = /(^|[^a-z])(\(?\s*(?:en\s+)?(?:cocid|crud|hervid)[oa]s?\s*\)?)(?![a-z])/g;
const RE_KCAL = /(\d+(?:[.,]\d+)?)\s*(?:kcal|calorias|cal)(?![a-z])/g;

const CONECTORES = new Set(['de', 'con', 'al', 'a', 'la', 'el', 'y', 'en', 'sin']);
const plWord = w => /[aeiou]$/.test(w) ? w + 's' : /z$/.test(w) ? w.slice(0, -1) + 'ces' : /s$/.test(w) ? w : w + 'es';
function plurales(a) {
  const ws = a.split(' ');
  const primero = [plWord(ws[0]), ...ws.slice(1)].join(' ');
  const todos = ws.map(w => CONECTORES.has(w) ? w : plWord(w)).join(' ');
  return [...new Set([primero, todos])];
}

let INDICE = [];
let VOCAB = new Set();

function todosLosAlimentos(propios = []) {
  const m = new Map();
  ALIMENTOS_BASE.forEach(f => m.set(norm(f.n), { ...f, propio: false }));
  propios.forEach(f => m.set(norm(f.n), { ...f, propio: true }));
  return [...m.values()];
}

function indexar(propios = []) {
  const lista = todosLosAlimentos(propios);
  const orden = [...lista.filter(f => f.propio), ...lista.filter(f => !f.propio)];
  const nombres = f => [f.n, ...(f.a || [])].map(x => norm(x).replace(/\s+/g, ' ').trim()).filter(Boolean);
  const mapa = new Map();
  for (const f of orden) for (const a of nombres(f)) if (!mapa.has(a)) mapa.set(a, f);
  for (const f of orden) for (const a of nombres(f)) for (const p of plurales(a)) if (!mapa.has(p)) mapa.set(p, f);
  INDICE = [...mapa.entries()].sort((x, y) => y[0].length - x[0].length);
  VOCAB = new Set(INDICE.flatMap(([a]) => a.split(' ')).filter(w => w.length >= 4 && !CONECTORES.has(w)));
}

// Corrige errores de tipeo comparando con las palabras de la base
function lev(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

function corregir(t) {
  const cambios = [];
  const out = t.replace(/[a-z]{5,}/g, w => {
    if (VOCAB.has(w) || IGNORAR.has(w) || UNI_SET.has(w) || TAM_SET.has(w)) return w;
    const max = w.length >= 8 ? 2 : 1;
    let mejor = null, dist = 99;
    for (const v of VOCAB) {
      if (Math.abs(v.length - w.length) > max) continue;
      const d = lev(w, v);
      if (d < dist) { dist = d; mejor = v; }
    }
    if (mejor && dist <= max) { cambios.push([w, mejor]); return mejor; }
    return w;
  });
  return { t: out, cambios };
}

const esLetra = c => !!c && /[a-z0-9]/.test(c);

function buscar(t) {
  const usado = new Array(t.length).fill(false);
  const res = [];
  for (const [alias, f] of INDICE) {
    let i = t.indexOf(alias);
    while (i !== -1) {
      const e = i + alias.length;
      if (!esLetra(t[i - 1]) && !esLetra(t[e]) && !usado.slice(i, e).some(Boolean)) {
        for (let k = i; k < e; k++) usado[k] = true;
        res.push({ i, e, f });
      }
      i = t.indexOf(alias, i + 1);
    }
  }
  return res.sort((x, y) => x.i - y.i);
}

function tamKey(s) {
  if (!s) return null;
  s = s.replace(/s$/, '');
  if (s.startsWith('chic')) return 'chica';
  if (s.startsWith('median')) return 'mediana';
  if (s.startsWith('grand') || s === 'xl') return 'grande';
  if (s.startsWith('dobl')) return 'doble';
  if (s.startsWith('tripl')) return 'triple';
  return null;
}

const r1 = x => Math.round(x * 10) / 10;

function calcular(f, gramos, cant, tamTxt, estado) {
  const det = [];
  let v = [f.kcal, f.p, f.c, f.gr];
  let g;
  if (gramos != null) {
    g = gramos;
    det.push(`${Math.round(gramos)} ${f.ml ? 'ml' : 'g'}`);
  } else {
    const tk = tamKey(tamTxt);
    const mult = tk ? ({ ...TAM_BASE, ...(f.tam || {}) })[tk] : 1;
    g = (f.g || 100) * mult * cant;
    if (cant !== 1) det.push(cant === 0.5 ? 'media' : `x${String(cant).replace('.', ',')}`);
    if (tk) det.push(tk);
  }
  if (f.crudo) {
    if (estado === 'crudo') { v = f.crudo; det.push('crudo'); } else det.push('cocido');
  }
  const k = g / 100;
  return { n: f.n, det: det.join(', '), g: Math.round(g), kcal: Math.round(v[0] * k), p: r1(v[1] * k), c: r1(v[2] * k), gr: r1(v[3] * k), est: !!f.est };
}

function desconocidas(t, tapado) {
  const arr = t.split('');
  tapado.forEach(([a, b]) => { for (let i = a; i < b; i++) arr[i] = ' '; });
  const pal = arr.join('').split(/[^a-z0-9]+/).filter(w =>
    w.length >= 3 && !/^\d/.test(w) && !IGNORAR.has(w) && !(w in NUMS) && !UNI_SET.has(w) && !TAM_SET.has(w));
  return [...new Set(pal)];
}

function analizar(texto) {
  let t = norm(texto).replace(/\s+/g, ' ');
  const manual = [];
  t = t.replace(RE_KCAL, (m, n) => { manual.push(aNum(n)); return ' '.repeat(m.length); });
  const corr = corregir(t);
  t = corr.t;

  const ms = buscar(t);
  const items = [], tapado = [];
  let prev = 0;
  ms.forEach((m, k) => {
    const sig = k + 1 < ms.length ? ms[k + 1].i : t.length;
    const antes = t.slice(prev, m.i);
    let gramos = null, cant = 1, tam = null, fin = m.e, r;

    if ((r = antes.match(RE_GR_ANTES))) gramos = aNum(r[1]) * (/^k/.test(r[2]) ? 1000 : 1);
    else if ((r = antes.match(RE_CANT_ANTES))) {
      if (r[1]) cant = NUMS[r[1]] ?? aNum(r[1]);
      if (r[2]) tam = r[2];
    }

    const crudoDespues = t.slice(m.e, sig);
    let estado = null;
    if ((r = crudoDespues.match(RE_ESTADO))) estado = r[1] === 'crud' ? 'crudo' : 'cocido';
    const despues = crudoDespues.replace(RE_ESTADO_TAPAR, (x, a, b) => a + ' '.repeat(b.length));
    if ((r = despues.match(RE_GR_DESPUES))) {
      gramos = aNum(r[1]) * (/^k/.test(r[2]) ? 1000 : 1);
      fin += r[0].length;
    } else {
      if ((r = despues.match(RE_TAM_DESPUES))) { tam = tam || r[1]; fin += r[0].length; }
      if ((r = despues.slice(fin - m.e).match(RE_X_DESPUES))) { cant = aNum(r[1]); fin += r[0].length; }
    }

    tapado.push([m.i, fin]);
    prev = fin;
    items.push(calcular(m.f, gramos, cant, tam, estado));
  });

  manual.forEach(k => items.push({ n: 'Carga manual', det: '', g: 0, kcal: Math.round(k), p: 0, c: 0, gr: 0, est: false }));
  return { items, desconocidas: desconocidas(t, tapado), corregidas: corr.cambios };
}

function totales(items) {
  return items.reduce((t, i) => {
    t.kcal += i.kcal; t.p += i.p; t.c += i.c; t.gr += i.gr;
    const f = i.est ? 0.2 : 0;
    t.lo += i.kcal * (1 - f); t.hi += i.kcal * (1 + f);
    t.est = t.est || i.est;
    return t;
  }, { kcal: 0, p: 0, c: 0, gr: 0, lo: 0, hi: 0, est: false });
}

function comidaDe(t, fecha) {
  if (/desayun/.test(t)) return 'Desayuno';
  if (/almorc|almuer/.test(t)) return 'Almuerzo';
  if (/merien|meren/.test(t)) return 'Merienda';
  if (/\bcen[ae]/.test(t)) return 'Cena';
  if (/colacion|snack/.test(t)) return 'Colación';
  const h = fecha.getHours();
  return h < 11 ? 'Desayuno' : h < 16 ? 'Almuerzo' : h < 20 ? 'Merienda' : 'Cena';
}
