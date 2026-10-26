import { router, usePathname } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { colors, styles } from "./ui";

export function AppHeader() {
  const pathname = usePathname();
  return (
    <View
      style={{
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.line,
      }}
    >
      <View
        style={[
          styles.between,
          { width: "100%", maxWidth: 1100, alignSelf: "center", padding: 24 },
        ]}
      >
        <Pressable
          accessibilityRole="link"
          accessibilityLabel="Cancha, ir al inicio"
          onPress={() => router.navigate("/")}
          style={styles.row}
        >
          <View
            style={{
              backgroundColor: colors.green,
              borderRadius: 13,
              padding: 8,
            }}
          >
            <Text style={{ fontSize: 23 }}>⚽</Text>
          </View>
          <Text
            style={{
              fontSize: 27,
              fontWeight: "900",
              color: colors.ink,
              letterSpacing: -1,
            }}
          >
            cancha<Text style={{ color: colors.green }}>.</Text>
          </Text>
        </Pressable>
        <View style={styles.row}>
          {(
            [
              { path: "/", label: "Entrenar" },
              { path: "/progreso", label: "Mi progreso" },
            ] as const
          ).map((item) => (
            <Pressable
              key={item.path}
              accessibilityRole="link"
              accessibilityState={{ selected: pathname === item.path }}
              onPress={() => router.navigate(item.path)}
              style={{
                padding: 10,
                borderRadius: 10,
                backgroundColor:
                  pathname === item.path ? "#EAF3E6" : "transparent",
              }}
            >
              <Text
                style={{
                  color: pathname === item.path ? colors.green : colors.muted,
                  fontWeight: "700",
                }}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}
