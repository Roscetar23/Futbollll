import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ProgressRepository } from "../application/progress-repository";
import {
  emptyProgress,
  parseProgress,
  type Progress,
} from "../domain/progress";

const STORAGE_KEY = "cancha:progress:v1";

export class LocalProgressRepository implements ProgressRepository {
  async load(): Promise<Progress> {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    return stored === null ? emptyProgress : parseProgress(JSON.parse(stored));
  }

  async save(progress: Progress): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }
}
