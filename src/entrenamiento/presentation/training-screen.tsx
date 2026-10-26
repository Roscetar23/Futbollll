import { router } from "expo-router";
import {
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { isLessonUnlocked, lessons } from "../domain/lesson-catalog";
import { useProgress } from "../../progreso/presentation/progress-provider";
import { currentStreak, totalXp } from "../../progreso/domain/progress";
import { Button, Card, colors, styles } from "../../shared/presentation/ui";

export function TrainingScreen() {
  const { progress } = useProgress();
  const { width } = useWindowDimensions();
  const next = lessons.find(
    (lesson) => !progress.completedLessons.includes(lesson.id),
  );
  const destination = next ?? lessons[0]!;
  const go = (id: string) =>
    router.push({ pathname: "/leccion/[id]", params: { id } });
  const completed = progress.completedLessons.length;

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <View style={styles.between}>
        <View style={{ gap: 6 }}>
          <Text style={styles.eyebrow}>UN POCO MEJOR, CADA DÍA</Text>
          <Text style={styles.title}>Tu próxima jugada empieza aquí.</Text>
        </View>
        <Text style={styles.tag}>
          ⚡ {totalXp(progress)} XP · 🔥 {currentStreak(progress)}{" "}
          {currentStreak(progress) === 1 ? "día" : "días"}
        </Text>
      </View>
      <View
        style={{
          backgroundColor: "#153F31",
          borderRadius: 28,
          padding: width > 700 ? 36 : 24,
          gap: 20,
          overflow: "hidden",
        }}
      >
        <View style={styles.between}>
          <View style={{ flex: 1, minWidth: 200, gap: 14 }}>
            <Text style={[styles.eyebrow, { color: colors.lime }]}>
              TU CANCHA. TU RITMO.
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: width > 700 ? 42 : 32,
                lineHeight: width > 700 ? 48 : 38,
                fontWeight: "800",
                maxWidth: 560,
              }}
            >
              Aprende la jugada.{"\n"}Llévala al campo.
            </Text>
            <Text style={[styles.body, { color: "#C9DDD0", maxWidth: 440 }]}>
              Pequeñas lecciones, retos con balón y una nueva razón para salir a
              jugar.
            </Text>
            <View style={{ alignSelf: "flex-start", marginTop: 6 }}>
              <Button onPress={() => go(destination.id)}>
                {next ? "Empezar entrenamiento  →" : "Volver a practicar  →"}
              </Button>
            </View>
          </View>
          {width > 700 && (
            <View
              accessibilityElementsHidden
              style={{
                width: 190,
                height: 220,
                borderWidth: 2,
                borderColor: "#5B8267",
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                transform: [{ rotate: "9deg" }],
              }}
            >
              <View
                style={{
                  position: "absolute",
                  width: "100%",
                  height: 2,
                  backgroundColor: "#5B8267",
                }}
              />
              <View
                style={{
                  width: 85,
                  height: 85,
                  borderWidth: 2,
                  borderColor: "#5B8267",
                  borderRadius: 50,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 62 }}>⚽</Text>
              </View>
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  width: 85,
                  height: 35,
                  borderWidth: 2,
                  borderTopWidth: 0,
                  borderColor: "#5B8267",
                }}
              />
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  width: 85,
                  height: 35,
                  borderWidth: 2,
                  borderBottomWidth: 0,
                  borderColor: "#5B8267",
                }}
              />
            </View>
          )}
        </View>
      </View>
      <View
        style={{
          flexDirection: width > 850 ? "row" : "column",
          gap: 24,
          alignItems: "flex-start",
        }}
      >
        <View style={{ flex: 1, gap: 18, width: "100%" }}>
          <View style={styles.between}>
            <View style={{ gap: 6 }}>
              <Text style={styles.eyebrow}>UNIDAD 01 · NIVEL INICIAL</Text>
              <Text style={styles.heading}>Domina los fundamentos</Text>
            </View>
            <Text style={styles.body}>
              {completed}/{lessons.length}
            </Text>
          </View>
          <View
            accessibilityRole="progressbar"
            accessibilityLabel="Progreso de la unidad"
            accessibilityValue={{ min: 0, max: lessons.length, now: completed }}
            style={{ height: 7, backgroundColor: "#E2E9DA", borderRadius: 4 }}
          >
            <View
              style={{
                height: 7,
                width: `${(completed / lessons.length) * 100}%`,
                backgroundColor: colors.green,
                borderRadius: 4,
              }}
            />
          </View>
          {lessons.map((lesson, index) => {
            const done = progress.completedLessons.includes(lesson.id);
            const unlocked = isLessonUnlocked(
              lesson.id,
              progress.completedLessons,
            );
            return (
              <Pressable
                key={lesson.id}
                accessibilityRole="button"
                accessibilityLabel={`${lesson.title}. ${done ? "Completada, repasar" : unlocked ? "Disponible" : "Bloqueada"}`}
                accessibilityState={{ disabled: !unlocked }}
                disabled={!unlocked}
                onPress={() => go(lesson.id)}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <Card
                  style={{
                    borderColor: unlocked && !done ? colors.green : colors.line,
                    backgroundColor: unlocked ? "white" : "#F0F3EC",
                  }}
                >
                  <View style={styles.row}>
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 16,
                        backgroundColor: done ? colors.green : "#EAF3E6",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 22,
                          fontWeight: "800",
                          color: done ? "white" : colors.green,
                        }}
                      >
                        {done ? "✓" : unlocked ? `0${index + 1}` : "🔒"}
                      </Text>
                    </View>
                    <View style={{ flex: 1, gap: 5 }}>
                      <Text style={styles.eyebrow}>{lesson.category}</Text>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "700",
                          color: colors.ink,
                        }}
                      >
                        {lesson.title}
                      </Text>
                    </View>
                    <Text style={{ color: colors.green, fontSize: 22 }}>
                      {unlocked ? "→" : ""}
                    </Text>
                  </View>
                  <Text style={styles.body}>{lesson.summary}</Text>
                  <View style={styles.between}>
                    <Text style={{ color: colors.muted, fontSize: 13 }}>
                      {lesson.minutes} min · +{lesson.xp} XP
                    </Text>
                    <Text
                      style={{
                        color: colors.green,
                        fontSize: 12,
                        fontWeight: "700",
                      }}
                    >
                      {done
                        ? "COMPLETADA · REPASAR"
                        : unlocked
                          ? "VAMOS A JUGAR"
                          : "COMPLETA LA ANTERIOR"}
                    </Text>
                  </View>
                </Card>
              </Pressable>
            );
          })}
        </View>
        <View style={{ width: width > 850 ? 290 : "100%", gap: 20 }}>
          <Card style={{ backgroundColor: "#EFF5DE" }}>
            <Text style={{ fontSize: 32 }}>🎯</Text>
            <Text style={styles.heading}>Una lección hoy.</Text>
            <Text style={styles.body}>
              No necesitas una cancha profesional. Un balón, un poco de espacio
              y ganas de aprender.
            </Text>
            <Text style={styles.tag}>
              {next
                ? "Tu objetivo: completar la próxima lección"
                : "¡Unidad completada! Repasa tus habilidades."}
            </Text>
          </Card>
          <Card>
            <Text style={styles.eyebrow}>EL CONSEJO DEL MÍSTER</Text>
            <Text style={styles.heading}>
              Primero el control.{"\n"}Después, la velocidad.
            </Text>
            <Text style={styles.body}>
              Practica a tu ritmo. La confianza se construye toque a toque.
            </Text>
          </Card>
        </View>
      </View>
      <Text style={{ color: colors.muted, fontSize: 12, textAlign: "center" }}>
        Hecho para aprender jugando · Tu progreso se guarda en este dispositivo.
      </Text>
    </ScrollView>
  );
}
