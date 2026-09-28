// Base de alimentos.
// Valores cada 100 g (o cada 100 ml si ml:true).
// g = gramos (o ml) de una porción o unidad típica: se usa cuando escribís "2 huevos" o "una porción".
// est:true = comida de afuera o valor aproximado. La app muestra un rango.
// tam = multiplicadores propios para chica, mediana, grande, doble, triple.
// a = alias: otras formas de escribir el mismo alimento.

const ALIMENTOS_BASE = [
  // Proteínas
  { n: "Huevo", a: ["huevo entero", "huevo duro", "huevo revuelto", "huevo frito"], g: 50, kcal: 143, p: 12.6, c: 0.7, gr: 9.5 },
  { n: "Clara de huevo", a: ["clara"], g: 33, kcal: 52, p: 10.9, c: 0.7, gr: 0.2 },
  { n: "Pechuga de pollo", a: ["pechuga", "pollo", "pollo a la plancha"], g: 150, kcal: 165, p: 31, c: 0, gr: 3.6 },
  { n: "Pollo al horno con piel", a: ["pollo al horno", "pata muslo", "cuarto de pollo"], g: 250, kcal: 215, p: 25, c: 0, gr: 12.5 },
  { n: "Carne magra", a: ["bife", "nalga", "lomo", "peceto", "cuadril", "bola de lomo", "carne", "churrasco"], g: 200, kcal: 190, p: 30, c: 0, gr: 7.5 },
  { n: "Carne picada", a: ["picada", "carne picada comun"], g: 150, kcal: 250, p: 26, c: 0, gr: 17 },
  { n: "Carne picada magra", a: ["picada magra", "picada especial"], g: 150, kcal: 175, p: 28, c: 0, gr: 7 },
  { n: "Atún al natural", a: ["atun", "lata de atun"], g: 120, kcal: 116, p: 26, c: 0, gr: 1 },
  { n: "Milanesa de carne al horno", a: ["milanesa", "milanesa al horno", "mila"], g: 130, kcal: 230, p: 20, c: 14, gr: 10 },
  { n: "Milanesa de carne frita", a: ["milanesa frita", "mila frita"], g: 130, kcal: 300, p: 18, c: 14, gr: 19 },
  { n: "Milanesa de pollo", a: ["mila de pollo", "suprema"], g: 130, kcal: 210, p: 23, c: 13, gr: 7 },
  { n: "Jamón cocido", a: ["jamon", "feta de jamon"], g: 20, kcal: 110, p: 18, c: 2, gr: 3.5 },

  // Carbohidratos
  { n: "Arroz cocido", a: ["arroz", "arroz blanco"], g: 200, kcal: 130, p: 2.7, c: 28, gr: 0.3 },
  { n: "Fideos cocidos", a: ["fideos", "pasta", "tallarines", "mostachol", "tirabuzones", "spaghetti"], g: 250, kcal: 158, p: 5.8, c: 31, gr: 0.9 },
  { n: "Ñoquis", a: ["noquis"], g: 250, kcal: 130, p: 3.5, c: 27, gr: 0.7 },
  { n: "Papa hervida", a: ["papa", "papa al horno"], g: 200, kcal: 87, p: 1.9, c: 20, gr: 0.1 },
  { n: "Puré de papa", a: ["pure", "pure de papas"], g: 200, kcal: 105, p: 2, c: 16, gr: 4 },
  { n: "Batata", a: ["batata al horno"], g: 200, kcal: 90, p: 2, c: 21, gr: 0.1 },
  { n: "Avena", a: ["avena arrollada", "copos de avena"], g: 40, kcal: 380, p: 13, c: 60, gr: 7 },
  { n: "Pan francés", a: ["pan", "pancito", "flauta", "miñon"], g: 60, kcal: 270, p: 9, c: 55, gr: 1.5 },
  { n: "Pan lactal", a: ["lactal", "rebanada de pan", "pan de molde", "tostada"], g: 25, kcal: 265, p: 8, c: 49, gr: 4 },
  { n: "Galleta de arroz", a: ["galletas de arroz"], g: 9, kcal: 387, p: 8, c: 81, gr: 2.8 },
  { n: "Lentejas cocidas", a: ["lentejas"], g: 200, kcal: 116, p: 9, c: 20, gr: 0.4 },
  { n: "Garbanzos cocidos", a: ["garbanzos"], g: 150, kcal: 164, p: 8.9, c: 27, gr: 2.6 },

  // Lácteos y suplementos
  { n: "Leche entera", a: ["leche"], g: 200, ml: true, kcal: 61, p: 3.2, c: 4.8, gr: 3.3 },
  { n: "Leche descremada", a: [], g: 200, ml: true, kcal: 35, p: 3.4, c: 5, gr: 0.1 },
  { n: "Yogur casero", a: ["yogur", "yogurt", "yogur natural"], g: 200, kcal: 61, p: 3.5, c: 4.7, gr: 3.3 },
  { n: "Queso cremoso", a: ["queso", "cremoso", "queso fresco", "muzzarella"], g: 30, kcal: 300, p: 20, c: 2, gr: 24 },
  { n: "Queso untable", a: ["casancrem", "queso crema"], g: 15, kcal: 230, p: 7, c: 4, gr: 21 },
  { n: "Queso rallado", a: ["rallado"], g: 10, kcal: 390, p: 33, c: 3, gr: 27 },
  { n: "Proteína whey", a: ["whey", "proteina", "batido de proteina", "prote"], g: 30, kcal: 400, p: 78, c: 7, gr: 6 },

  // Grasas, untables y extras
  { n: "Aceite", a: ["aceite de oliva", "oliva"], g: 14, kcal: 884, p: 0, c: 0, gr: 100 },
  { n: "Manteca", a: [], g: 10, kcal: 717, p: 0.9, c: 0.1, gr: 81 },
  { n: "Mayonesa", a: ["mayo"], g: 15, kcal: 680, p: 1, c: 1, gr: 75 },
  { n: "Ketchup", a: [], g: 15, kcal: 110, p: 1.2, c: 26, gr: 0.1 },
  { n: "Mantequilla de maní", a: ["pasta de mani", "mantequilla de mani"], g: 16, kcal: 590, p: 25, c: 20, gr: 50 },
  { n: "Maní", a: ["mani"], g: 30, kcal: 570, p: 26, c: 16, gr: 49 },
  { n: "Frutos secos", a: ["nueces", "almendras", "mix de frutos secos"], g: 30, kcal: 620, p: 18, c: 14, gr: 55 },
  { n: "Palta", a: ["aguacate"], g: 70, kcal: 160, p: 2, c: 8.5, gr: 14.7 },
  { n: "Dulce de leche", a: ["ddl"], g: 20, kcal: 315, p: 6.5, c: 55, gr: 7.5 },
  { n: "Mermelada", a: [], g: 20, kcal: 250, p: 0.4, c: 62, gr: 0.1 },
  { n: "Miel", a: [], g: 20, kcal: 304, p: 0.3, c: 82, gr: 0 },
  { n: "Azúcar", a: ["azucar"], g: 5, kcal: 400, p: 0, c: 100, gr: 0 },

  // Frutas y verduras
  { n: "Banana", a: ["banano"], g: 120, kcal: 89, p: 1.1, c: 23, gr: 0.3 },
  { n: "Manzana", a: [], g: 180, kcal: 52, p: 0.3, c: 14, gr: 0.2 },
  { n: "Naranja", a: [], g: 160, kcal: 47, p: 0.9, c: 12, gr: 0.1 },
  { n: "Mandarina", a: [], g: 100, kcal: 53, p: 0.8, c: 13, gr: 0.3 },
  { n: "Frutilla", a: ["frutillas"], g: 150, kcal: 32, p: 0.7, c: 7.7, gr: 0.3 },
  { n: "Lechuga", a: [], g: 30, kcal: 15, p: 1.4, c: 2.9, gr: 0.2 },
  { n: "Tomate", a: [], g: 100, kcal: 18, p: 0.9, c: 3.9, gr: 0.2 },
  { n: "Cebolla", a: [], g: 30, kcal: 40, p: 1.1, c: 9.3, gr: 0.1 },
  { n: "Zanahoria", a: [], g: 80, kcal: 41, p: 0.9, c: 10, gr: 0.2 },
  { n: "Brócoli", a: ["brocoli"], g: 150, kcal: 35, p: 2.4, c: 7, gr: 0.4 },
  { n: "Ensalada mixta", a: ["ensalada"], g: 250, kcal: 60, p: 1, c: 4, gr: 4.5, est: true },

  // Comida de afuera (estimados)
  { n: "Hamburguesa de local", a: ["hamburguesa", "burger", "hamburguesa completa", "hamburguesa con queso", "hamburguesa de carne", "cheeseburger"], g: 250, kcal: 240, p: 13, c: 18, gr: 13, est: true, tam: { chica: 0.8, grande: 1.25, doble: 1.55, triple: 2.05 } },
  { n: "Hamburguesa casera", a: [], g: 200, kcal: 240, p: 15, c: 18, gr: 12, tam: { doble: 1.5, triple: 2 } },
  { n: "Papas fritas", a: ["papas", "fritas", "papitas"], g: 150, kcal: 312, p: 3.4, c: 41, gr: 15, est: true, tam: { chica: 0.65, grande: 1.45 } },
  { n: "Lomito completo", a: ["lomito", "lomo completo", "sanguche de lomo"], g: 350, kcal: 230, p: 13, c: 17, gr: 12, est: true },
  { n: "Choripán", a: ["choripan", "chori"], g: 220, kcal: 250, p: 10, c: 24, gr: 13, est: true },
  { n: "Pancho", a: ["hot dog"], g: 130, kcal: 225, p: 8, c: 22, gr: 12, est: true },
  { n: "Pizza de muzzarella", a: ["pizza", "porcion de pizza", "muzza"], g: 120, kcal: 270, p: 11, c: 30, gr: 11.5, est: true },
  { n: "Empanada", a: ["empanada de carne", "empanada de jamon y queso", "empanada de pollo"], g: 90, kcal: 280, p: 10, c: 27, gr: 14, est: true },
  { n: "Milanesa napolitana", a: ["napolitana", "mila napo", "milanesa a la napolitana"], g: 280, kcal: 250, p: 16, c: 11, gr: 15.5, est: true },
  { n: "Tostado de jamón y queso", a: ["tostado", "sandwich de jamon y queso"], g: 150, kcal: 280, p: 14, c: 30, gr: 11, est: true },
  { n: "Sándwich de miga", a: ["miga", "sandwich de miga", "sanguche de miga"], g: 45, kcal: 250, p: 9, c: 25, gr: 12 },
  { n: "Tarta", a: ["tarta de verdura", "tarta de jamon y queso", "porcion de tarta"], g: 150, kcal: 270, p: 10, c: 22, gr: 16, est: true },
  { n: "Sushi (pieza)", a: ["sushi", "pieza de sushi", "roll"], g: 30, kcal: 150, p: 5, c: 25, gr: 3, est: true },
  { n: "Asado de tira", a: ["asado", "tira de asado"], g: 250, kcal: 290, p: 24, c: 0, gr: 22, est: true },
  { n: "Vacío", a: ["vacio"], g: 250, kcal: 280, p: 25, c: 0, gr: 20, est: true },
  { n: "Chorizo", a: [], g: 100, kcal: 300, p: 15, c: 2, gr: 26, est: true },
  { n: "Morcilla", a: [], g: 100, kcal: 330, p: 14, c: 4, gr: 29, est: true },
  { n: "Salsa de la casa", a: ["salsa", "aderezo", "salsa golf", "alioli", "salsa barbacoa", "barbacoa", "cheddar"], g: 20, kcal: 400, p: 1, c: 8, gr: 40, est: true },
  { n: "Salsa de tomate", a: ["tuco", "fileto", "salsa pomodoro"], g: 100, kcal: 45, p: 1.5, c: 7, gr: 1.5 },
  { n: "Fideos instantáneos", a: ["ramen", "samyang", "fideos instantaneos", "maruchan", "sopa instantanea"], g: 130, kcal: 420, p: 9, c: 60, gr: 16 },

  // Dulces
  { n: "Medialuna", a: ["medialunas de manteca", "medialuna de grasa"], g: 45, kcal: 400, p: 7, c: 45, gr: 21 },
  { n: "Factura", a: ["vigilante", "bola de fraile", "cañoncito"], g: 55, kcal: 400, p: 6, c: 48, gr: 20 },
  { n: "Alfajor", a: [], g: 50, kcal: 440, p: 5, c: 63, gr: 19 },
  { n: "Helado (bocha)", a: ["helado", "cucurucho"], g: 70, kcal: 210, p: 4, c: 25, gr: 11, est: true },
  { n: "Chocolate", a: [], g: 25, kcal: 540, p: 7, c: 57, gr: 31 },
  { n: "Galletitas dulces", a: ["galletitas", "galletas", "oreo", "pepitos"], g: 10, kcal: 470, p: 6, c: 68, gr: 19 },
  { n: "Galletitas de agua", a: ["criollitas", "crackers"], g: 8, kcal: 420, p: 10, c: 70, gr: 11 },
  { n: "Barra de cereal", a: ["barrita", "barrita de cereal"], g: 25, kcal: 400, p: 6, c: 70, gr: 10 },

  // Bebidas
  { n: "Mate", a: ["mates", "terere"], g: 300, ml: true, kcal: 1, p: 0, c: 0.2, gr: 0 },
  { n: "Café", a: ["cafe", "cafe solo", "espresso"], g: 150, ml: true, kcal: 1, p: 0.1, c: 0, gr: 0 },
  { n: "Café con leche", a: ["cafe con leche", "cortado", "lagrima"], g: 250, ml: true, kcal: 30, p: 1.6, c: 2.4, gr: 1.6 },
  { n: "Gaseosa común", a: ["gaseosa", "coca", "coca cola", "sprite", "fanta", "pepsi"], g: 350, ml: true, kcal: 42, p: 0, c: 10.6, gr: 0 },
  { n: "Gaseosa zero", a: ["coca zero", "coca light", "gaseosa zero", "pepsi black", "sprite zero"], g: 350, ml: true, kcal: 0.3, p: 0, c: 0, gr: 0 },
  { n: "Jugo de naranja", a: ["jugo", "exprimido"], g: 250, ml: true, kcal: 45, p: 0.7, c: 10, gr: 0.2 },
  { n: "Isotónica", a: ["gatorade", "powerade"], g: 500, ml: true, kcal: 24, p: 0, c: 6, gr: 0 },
  { n: "Cerveza", a: ["birra", "porron", "pinta de cerveza"], g: 500, ml: true, kcal: 43, p: 0.5, c: 3.6, gr: 0 },
  { n: "Vino", a: ["vino tinto", "vino blanco", "copa de vino", "malbec"], g: 150, ml: true, kcal: 85, p: 0.1, c: 2.6, gr: 0 },
  { n: "Fernet con coca", a: ["fernet", "fernandito"], g: 350, ml: true, kcal: 83, p: 0, c: 7, gr: 0, est: true },
  { n: "Vermut con soda", a: ["vermut", "vermu", "vermouth", "cinzano"], g: 250, ml: true, kcal: 60, p: 0, c: 6, gr: 0, est: true },
  { n: "Gin tonic", a: ["gin", "gintonic"], g: 300, ml: true, kcal: 60, p: 0, c: 5.5, gr: 0, est: true },
  { n: "Aperol spritz", a: ["aperol", "spritz"], g: 250, ml: true, kcal: 65, p: 0, c: 8, gr: 0, est: true },
];
