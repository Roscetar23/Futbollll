import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, Text, View } from "react-native";
import {
  ProgressProvider,
  useProgress,
} from "../progreso/presentation/progress-provider";
import { LocalProgressRepository } from "../progreso/infrastructure/local-progress-repository";
import { AppHeader } from "../shared/presentation/app-header";
import { Button, colors, styles } from "../shared/presentation/ui";

const repository = new LocalProgressRepository();

function AppContent() {
  const { ready, error, retry } = useProgress();
  return (
    <SafeAreaView style={styles.page}>
      <StatusBar style="dark" />
      <AppHeader />
      {ready ? (
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        />
      ) : (
        <View style={[styles.content, { paddingTop: 60 }]}>
          {error ? (
            <>
              <Text accessibilityRole="alert" style={styles.error}>
                {error}
              </Text>
              <Button onPress={retry}>Reintentar</Button>
            </>
          ) : (
            <>
              <ActivityIndicator color={colors.green} />
              <Text style={[styles.body, { textAlign: "center" }]}>
                Preparando tu entrenamiento…
              </Text>
            </>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ProgressProvider repository={repository}>
        <AppContent />
      </ProgressProvider>
    </SafeAreaProvider>
  );
}
