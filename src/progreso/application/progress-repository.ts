import type { Progress } from "../domain/progress";

export interface ProgressRepository {
  load(): Promise<Progress>;
  save(progress: Progress): Promise<void>;
}
