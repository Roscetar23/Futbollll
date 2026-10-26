import { useState } from "react";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { findLesson, isLessonUnlocked } from "../domain/lesson-catalog";
import { isCorrectAnswer } from "../domain/lesson";
import { useProgress } from "../../progreso/presentation/progress-provider";
import { Button, Card, colors, styles } from "../../shared/presentation/ui";

export function LessonScreen({ id }: { id: string }) {
  const { progress, finish, saving } = useProgress();
  const lesson = findLesson(id);
  const [answer, setAnswer] = useState<number | null>(null);
  const [practiced, setPracticed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [error, setError] = useState<string | null>(null);

  if (!lesson || !isLessonUnlocked(id, progress.completedLessons))
    return (
      <View style={styles.content}>
        <Text style={styles.title}>Esta lección no está disponible</Text>
        <Text style={styles.body}>
          Sigue el orden de tu ruta para construir tus habilidades.
        </Text>
        <Button onPress={() => router.replace("/")}>Volver a mi ruta</Button>
      </View>
    );

  if (saved)
    return (
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { maxWidth: 740, paddingTop: 60 },
        ]}
      >
        <Card>
          <Text style={{ fontSize: 60, textAlign: "center" }}>🏆</Text>
          <Text style={[styles.title, { textAlign: "center" }]}>
            ¡Buena jugada!
          </Text>
          <Text style={[styles.body, { textAlign: "center" }]}>
            {earnedXp > 0
              ? `Has sumado ${earnedXp} XP y completado “${lesson.title}”.`
              : "Repaso completado. Cada toque cuenta; los XP se entregan una vez por lección."}
          </Text>
          <Button onPress={() => router.replace("/")}>
            Continuar mi ruta →
          </Button>
          <Button secondary onPress={() => router.replace("/progreso")}>
            Ver mi progreso
          </Button>
        </Card>
      </ScrollView>
    );

  const correct = answer !== null && isCorrectAnswer(lesson, answer);
  async function save() {
    if (!lesson || answer === null) return;
    setError(null);
    const reward = progress.completedLessons.includes(lesson.id)
      ? 0
      : lesson.xp;
    try {
      await finish(lesson.id, answer, practiced);
      setEarnedXp(reward);
      setSaved(true);
    } catch {
      setError(
        "No pudimos guardar la lección. Tu respuesta sigue aquí; intenta guardarla de nuevo.",
      );
    }
  }

  return (
    <ScrollView contentContainerStyle={[styles.content, { maxWidth: 800 }]}>
      <Pressable accessibilityRole="link" onPress={() => router.replace("/")}>
        <Text style={{ color: colors.green, fontWeight: "700" }}>
          ← Volver a mi ruta
        </Text>
      </Pressable>
      <View style={{ gap: 10 }}>
        <Text style={styles.eyebrow}>
          {lesson.category} · {lesson.minutes} MIN · +{lesson.xp} XP
        </Text>
        <Text style={styles.title}>{lesson.title}</Text>
        <Text style={styles.body}>{lesson.summary}</Text>
      </View>
      <Card>
        <Text style={styles.eyebrow}>01 / APRENDE LA TÉCNICA</Text>
        <Text style={styles.heading}>La clave de la jugada</Text>
        <Text style={styles.body}>{lesson.tip}</Text>
      </Card>
      <Card style={{ backgroundColor: "#EFF5DE" }}>
        <Text style={styles.eyebrow}>02 / LLÉVALA AL CAMPO</Text>
        <Text style={styles.heading}>Ahora te toca a ti ⚽</Text>
        <Text style={styles.body}>{lesson.practice}</Text>
        <Text style={{ fontSize: 13, color: colors.muted }}>
          Prepara el espacio y empieza con movimientos suaves.
        </Text>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: practiced, disabled: saving }}
          disabled={saving}
          onPress={() => setPracticed(!practiced)}
          style={[styles.row, { paddingVertical: 12 }]}
        >
          <View
            style={{
              width: 26,
              height: 26,
              borderRadius: 7,
              borderWidth: 2,
              borderColor: colors.green,
              backgroundColor: practiced ? colors.green : "transparent",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "800" }}>
              {practiced ? "✓" : ""}
            </Text>
          </View>
          <Text
            style={{
              flex: 1,
              color: colors.ink,
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Ya realicé el ejercicio práctico
          </Text>
        </Pressable>
      </Card>
      <Card>
        <Text style={styles.eyebrow}>03 / COMPRUEBA LO APRENDIDO</Text>
        <Text style={styles.heading}>{lesson.question}</Text>
        {lesson.answers.map((option, index) => (
          <Pressable
            key={option}
            accessibilityRole="radio"
            accessibilityState={{ checked: answer === index, disabled: saving }}
            disabled={saving}
            onPress={() => {
              setAnswer(index);
              setChecked(false);
              setError(null);
            }}
            style={{
              padding: 18,
              borderWidth: 2,
              borderColor: answer === index ? colors.green : colors.line,
              borderRadius: 14,
              backgroundColor: answer === index ? "#EAF3E6" : "white",
            }}
          >
            <Text style={{ color: colors.ink, fontSize: 16, lineHeight: 24 }}>
              {String.fromCharCode(65 + index)}. {option}
            </Text>
          </Pressable>
        ))}
        {checked && (
          <Text
            accessibilityRole="alert"
            style={correct ? styles.body : styles.error}
          >
            {correct
              ? `¡Correcto! ${lesson.explanation}`
              : "Todavía no. Revisa la técnica y vuelve a intentarlo."}
          </Text>
        )}
        {error && (
          <Text accessibilityRole="alert" style={styles.error}>
            {error}
          </Text>
        )}
        {!checked || !correct ? (
          <Button disabled={answer === null} onPress={() => setChecked(true)}>
            Comprobar respuesta
          </Button>
        ) : (
          <Button
            disabled={!practiced || saving}
            onPress={() => {
              void save();
            }}
          >
            {saving ? "Guardando…" : "Completar entrenamiento →"}
          </Button>
        )}
        {checked && correct && !practiced && (
          <Text style={styles.body}>
            Completa el ejercicio práctico y marca la casilla para terminar.
          </Text>
        )}
      </Card>
    </ScrollView>
  );
}
