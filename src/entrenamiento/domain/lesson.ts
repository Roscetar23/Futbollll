export interface Lesson {
  readonly id: string;
  readonly title: string;
  readonly category: string;
  readonly summary: string;
  readonly minutes: number;
  readonly xp: number;
  readonly tip: string;
  readonly practice: string;
  readonly question: string;
  readonly answers: readonly string[];
  readonly correctAnswer: number;
  readonly explanation: string;
}

export function isCorrectAnswer(lesson: Lesson, answer: number): boolean {
  return (
    Number.isInteger(answer) &&
    answer >= 0 &&
    answer < lesson.answers.length &&
    answer === lesson.correctAnswer
  );
}
