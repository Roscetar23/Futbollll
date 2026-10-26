import type { Lesson } from "./lesson";

export const lessons: readonly Lesson[] = [
  {
    id: "primer-toque",
    title: "Tu primer toque",
    category: "CONTROL",
    summary: "El balón empieza a jugar a tu favor.",
    minutes: 5,
    xp: 30,
    tip: "Recibe con el interior del pie y acompaña el balón suavemente. Mantén las rodillas ligeramente flexionadas y mira a tu alrededor antes de recibir.",
    practice:
      "En un espacio libre, pasa el balón suavemente contra una pared. Recíbelo con el interior y déjalo cerca de ti. Haz 10 recepciones alternando los pies, a tu ritmo.",
    question: "¿Cómo consigues que el balón quede cerca al recibirlo?",
    answers: [
      "Con el pie rígido y un golpe fuerte",
      "Amortiguando con el interior del pie",
      "Mirando solo al suelo todo el tiempo",
    ],
    correctAnswer: 1,
    explanation:
      "Acompañar el balón con el interior reduce su velocidad y te prepara para la siguiente jugada.",
  },
  {
    id: "pase-corto",
    title: "Conecta con tu equipo",
    category: "PASE",
    summary: "Un buen pase hace mejor a todo el equipo.",
    minutes: 6,
    xp: 40,
    tip: "Coloca el pie de apoyo al lado del balón, orientado hacia tu objetivo. Golpea con el interior del otro pie y acompaña el movimiento.",
    practice:
      "Marca un objetivo ancho en una pared o practica con alguien a 3 metros. Realiza 10 pases suaves por el suelo. Prioriza la dirección antes que la potencia.",
    question: "¿Hacia dónde debe apuntar tu pie de apoyo?",
    answers: [
      "Hacia tu objetivo",
      "En dirección contraria al pase",
      "Da igual si golpeas fuerte",
    ],
    correctAnswer: 0,
    explanation:
      "Orientar el pie de apoyo hacia el objetivo ayuda a dirigir el cuerpo y el pase.",
  },
  {
    id: "conduccion",
    title: "Lleva el balón contigo",
    category: "CONDUCCIÓN",
    summary: "Pequeños toques. Grandes avances.",
    minutes: 7,
    xp: 50,
    tip: "Avanza con toques cortos, manteniendo el balón a una distancia de un paso. Alterna los pies y levanta la mirada entre toques.",
    practice:
      "Coloca 4 marcas separadas por un metro en una superficie segura. Recorre el camino caminando con el balón cerca. Repite 3 veces sin buscar velocidad.",
    question: "¿Qué te permite cambiar de dirección con más control?",
    answers: [
      "Empujar el balón lo más lejos posible",
      "Correr sin levantar la mirada",
      "Dar toques cortos y mantenerlo cerca",
    ],
    correctAnswer: 2,
    explanation:
      "Con el balón cerca puedes frenar, girar o pasar sin tener que perseguirlo.",
  },
];

export function findLesson(id: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === id);
}

export function isLessonUnlocked(
  id: string,
  completed: readonly string[],
): boolean {
  const index = lessons.findIndex((lesson) => lesson.id === id);
  if (index < 0) return false;
  return (
    index === 0 ||
    lessons.slice(0, index).every((lesson) => completed.includes(lesson.id))
  );
}
