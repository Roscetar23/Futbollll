import { useLocalSearchParams } from "expo-router";
import { LessonScreen } from "../../entrenamiento/presentation/lesson-screen";

export default function LessonRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <LessonScreen key={id} id={id} />;
}
