import {
  findLesson,
  isLessonUnlocked,
  lessons,
} from "../../entrenamiento/domain/lesson-catalog";
import { isCorrectAnswer } from "../../entrenamiento/domain/lesson";

export interface Progress {
  readonly completedLessons: readonly string[];
  readonly practiceDays: readonly string[];
}

export const emptyProgress: Progress = {
  completedLessons: [],
  practiceDays: [],
};

export function localDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function completeLesson(
  progress: Progress,
  input: { lessonId: string; answer: number; practiced: boolean },
  date = new Date(),
): Progress {
  const lesson = findLesson(input.lessonId);
  if (!lesson || !isLessonUnlocked(lesson.id, progress.completedLessons)) {
    throw new Error("Esta lección todavía no está disponible.");
  }
  if (!input.practiced || !isCorrectAnswer(lesson, input.answer)) {
    throw new Error(
      "Completa la práctica y responde correctamente para continuar.",
    );
  }
  const day = localDateKey(date);
  return {
    completedLessons: [...new Set([...progress.completedLessons, lesson.id])],
    practiceDays: [...new Set([...progress.practiceDays, day])].sort(),
  };
}

export function totalXp(progress: Progress): number {
  return lessons.reduce(
    (xp, lesson) =>
      xp + (progress.completedLessons.includes(lesson.id) ? lesson.xp : 0),
    0,
  );
}

export function currentStreak(progress: Progress, today = new Date()): number {
  const cursor = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    12,
  );
  if (!progress.practiceDays.includes(localDateKey(cursor)))
    cursor.setDate(cursor.getDate() - 1);
  let days = 0;
  while (progress.practiceDays.includes(localDateKey(cursor))) {
    days += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return days;
}

export function parseProgress(value: unknown): Progress {
  if (typeof value !== "object" || value === null)
    throw new Error("El progreso guardado no es válido.");
  const snapshot = value as Record<string, unknown>;
  if (
    !Array.isArray(snapshot.completedLessons) ||
    !Array.isArray(snapshot.practiceDays)
  ) {
    throw new Error("El progreso guardado no es válido.");
  }
  const ids = snapshot.completedLessons;
  const days = snapshot.practiceDays;
  if (
    !ids.every((id) => typeof id === "string" && findLesson(id)) ||
    !days.every(
      (day) =>
        typeof day === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(day) &&
        !Number.isNaN(Date.parse(day)) &&
        new Date(`${day}T12:00:00Z`).toISOString().slice(0, 10) === day,
    )
  ) {
    throw new Error("El progreso guardado no es válido.");
  }
  return {
    completedLessons: [...new Set(ids)],
    practiceDays: [...new Set(days)].sort(),
  };
}
