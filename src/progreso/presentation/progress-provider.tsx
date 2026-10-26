import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { ProgressRepository } from "../application/progress-repository";
import {
  completeLesson,
  emptyProgress,
  type Progress,
} from "../domain/progress";

interface ProgressContextValue {
  progress: Progress;
  ready: boolean;
  saving: boolean;
  error: string | null;
  retry: () => void;
  finish: (
    lessonId: string,
    answer: number,
    practiced: boolean,
  ) => Promise<void>;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({
  children,
  repository,
}: {
  children: ReactNode;
  repository: ProgressRepository;
}) {
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const busy = useRef(false);

  useEffect(() => {
    let active = true;
    repository
      .load()
      .then((snapshot) => {
        if (active) {
          setProgress(snapshot);
          setReady(true);
          setError(null);
        }
      })
      .catch(() => {
        if (active)
          setError(
            "No pudimos leer tu progreso. Reintenta para continuar sin sobrescribir tus datos.",
          );
      });
    return () => {
      active = false;
    };
  }, [repository, attempt]);

  async function finish(lessonId: string, answer: number, practiced: boolean) {
    if (!ready || busy.current)
      throw new Error("Espera un momento e inténtalo de nuevo.");
    busy.current = true;
    setSaving(true);
    try {
      const next = completeLesson(progress, { lessonId, answer, practiced });
      await repository.save(next);
      setProgress(next);
    } finally {
      busy.current = false;
      setSaving(false);
    }
  }

  return (
    <ProgressContext.Provider
      value={{
        progress,
        ready,
        saving,
        error,
        retry: () => setAttempt((value) => value + 1),
        finish,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error("Falta ProgressProvider.");
  return context;
}
