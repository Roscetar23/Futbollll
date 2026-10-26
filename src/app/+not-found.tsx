import { router } from "expo-router";
import { Text, View } from "react-native";
import { Button, styles } from "../shared/presentation/ui";

export default function NotFound() {
  return (
    <View style={styles.content}>
      <Text style={styles.title}>Esta jugada no existe</Text>
      <Text style={styles.body}>Vuelve a tu ruta para seguir aprendiendo.</Text>
      <Button onPress={() => router.replace("/")}>Ir al entrenamiento</Button>
    </View>
  );
}
