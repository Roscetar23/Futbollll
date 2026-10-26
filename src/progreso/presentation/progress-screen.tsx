import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { lessons } from "../../entrenamiento/domain/lesson-catalog";
import { Button, Card, styles } from "../../shared/presentation/ui";
import { currentStreak, totalXp } from "../domain/progress";
import { useProgress } from "./progress-provider";

export function ProgressScreen() {
  const { progress } = useProgress();
  const completed = lessons.filter((lesson) =>
    progress.completedLessons.includes(lesson.id),
  );
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>CADA TOQUE CUENTA</Text>
      <Text style={styles.title}>Mira cuánto has avanzado.</Text>
      <Text style={styles.body}>
        Tu constancia convierte las pequeñas prácticas en nuevas habilidades.
      </Text>
      <View style={[styles.row, { flexWrap: "wrap", alignItems: "stretch" }]}>
        {[
          { value: `${totalXp(progress)}`, label: "XP ganados", icon: "⚡" },
          {
            value: `${currentStreak(progress)}`,
            label: "Días de racha",
            icon: "🔥",
          },
          {
            value: `${completed.length}/${lessons.length}`,
            label: "Lecciones completadas",
            icon: "⚽",
          },
        ].map((stat) => (
          <Card key={stat.label} style={{ flexGrow: 1, flexBasis: 220 }}>
            <Text style={{ fontSize: 28 }}>{stat.icon}</Text>
            <Text style={styles.title}>{stat.value}</Text>
            <Text style={styles.body}>{stat.label}</Text>
          </Card>
        ))}
      </View>
      <Card>
        <Text style={styles.heading}>Tus habilidades</Text>
        {completed.length === 0 ? (
          <Text style={styles.body}>
            Tu historia empieza con el primer toque. Completa una lección para
            verla aquí.
          </Text>
        ) : (
          completed.map((lesson) => (
            <View key={lesson.id} style={styles.between}>
              <Text style={styles.body}>✓ {lesson.title}</Text>
              <Text style={styles.tag}>+{lesson.xp} XP</Text>
            </View>
          ))
        )}
      </Card>
      <Card>
        <Text style={styles.heading}>Así funciona tu progreso</Text>
        <Text style={styles.body}>
          Ganas XP la primera vez que completas cada lección. Puedes repasar
          tantas veces como quieras. Entrenar en días consecutivos mantiene tu
          racha; cuenta la fecha local de este dispositivo.
        </Text>
        <Text style={styles.body}>
          La práctica se registra con tu confirmación. Los datos se guardan en
          este navegador o dispositivo; todavía no se sincronizan entre equipos.
        </Text>
      </Card>
      <Button onPress={() => router.replace("/")}>Volver a entrenar →</Button>
    </ScrollView>
  );
}
