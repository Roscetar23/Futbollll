import assert from "node:assert/strict";
import test from "node:test";
import {
  isLessonUnlocked,
  lessons,
} from "../src/entrenamiento/domain/lesson-catalog";
import { isCorrectAnswer } from "../src/entrenamiento/domain/lesson";
import {
  completeLesson,
  currentStreak,
  emptyProgress,
  localDateKey,
  parseProgress,
  totalXp,
} from "../src/progreso/domain/progress";

const first = lessons[0]!;
const second = lessons[1]!;
const input = {
  lessonId: first.id,
  answer: first.correctAnswer,
  practiced: true,
};
const monday = new Date(2026, 9, 26, 12);

test("solo la primera lección comienza desbloqueada; los enlaces desconocidos no se desbloquean", () => {
  assert.equal(isLessonUnlocked(first.id, []), true);
  assert.equal(isLessonUnlocked(second.id, []), false);
  assert.equal(isLessonUnlocked("no-existe", []), false);
});

test("una lección bloqueada no se puede completar aunque la respuesta sea correcta", () => {
  assert.throws(
    () =>
      completeLesson(emptyProgress, {
        ...input,
        lessonId: second.id,
        answer: second.correctAnswer,
      }),
    /disponible/,
  );
});

test("requiere respuesta correcta y confirmación de práctica", () => {
  assert.throws(
    () => completeLesson(emptyProgress, { ...input, answer: -1 }),
    /correctamente/,
  );
  assert.throws(
    () => completeLesson(emptyProgress, { ...input, practiced: false }),
    /práctica/,
  );
  assert.equal(isCorrectAnswer(first, 1.5), false);
  assert.equal(isCorrectAnswer(first, Number.NaN), false);
});

test("completar suma XP, desbloquea la siguiente lección y no modifica el estado anterior", () => {
  const result = completeLesson(emptyProgress, input, monday);
  assert.equal(totalXp(result), first.xp);
  assert.equal(isLessonUnlocked(second.id, result.completedLessons), true);
  assert.deepEqual(emptyProgress.completedLessons, []);
  assert.deepEqual(result.practiceDays, ["2026-10-26"]);
});

test("repetir una lección el mismo día no duplica puntos ni días", () => {
  const result = completeLesson(
    completeLesson(emptyProgress, input, monday),
    input,
    monday,
  );
  assert.equal(totalXp(result), first.xp);
  assert.equal(result.completedLessons.length, 1);
  assert.equal(result.practiceDays.length, 1);
});

test("repasar al día siguiente mantiene la racha sin sumar XP adicionales", () => {
  const tuesday = new Date(2026, 9, 27, 12);
  const result = completeLesson(
    completeLesson(emptyProgress, input, monday),
    input,
    tuesday,
  );
  assert.equal(currentStreak(result, tuesday), 2);
  assert.equal(totalXp(result), first.xp);
});

test("la racha permanece si entrenó ayer y se pierde después de un día sin práctica", () => {
  const result = completeLesson(emptyProgress, input, monday);
  assert.equal(currentStreak(result, new Date(2026, 9, 27)), 1);
  assert.equal(currentStreak(result, new Date(2026, 9, 28)), 0);
  assert.equal(currentStreak(emptyProgress, monday), 0);
});

test("la racha cruza correctamente meses y años", () => {
  const result = {
    completedLessons: [],
    practiceDays: ["2026-12-31", "2027-01-01"],
  };
  assert.equal(currentStreak(result, new Date(2027, 0, 1)), 2);
});

test("al completar la unidad entrega exactamente la suma de recompensas", () => {
  const result = lessons.reduce(
    (state, lesson) =>
      completeLesson(
        state,
        { lessonId: lesson.id, answer: lesson.correctAnswer, practiced: true },
        monday,
      ),
    emptyProgress,
  );
  assert.equal(totalXp(result), 120);
  assert.equal(result.completedLessons.length, lessons.length);
});

test("valida datos persistidos y elimina duplicados", () => {
  assert.deepEqual(
    parseProgress({
      completedLessons: [first.id, first.id],
      practiceDays: ["2026-10-26", "2026-10-26"],
    }),
    { completedLessons: [first.id], practiceDays: ["2026-10-26"] },
  );
  for (const invalid of [
    null,
    {},
    { completedLessons: ["invalida"], practiceDays: [] },
    { completedLessons: [], practiceDays: ["2026-02-31"] },
    { completedLessons: [], practiceDays: [1] },
  ]) {
    assert.throws(() => parseProgress(invalid), /válido/);
  }
});

test("la fecha de práctica usa el calendario local, no un corte UTC", () => {
  assert.equal(localDateKey(new Date(2026, 9, 26, 23, 59)), "2026-10-26");
});
