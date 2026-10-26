import type { ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native";

export const colors = {
  ink: "#152C25",
  muted: "#60766A",
  green: "#187445",
  lime: "#D5F779",
  background: "#F7F9F2",
  line: "#DDE5D8",
  white: "#FFFFFF",
};

export function Button({
  children,
  onPress,
  disabled = false,
  secondary = false,
}: {
  children: ReactNode;
  onPress: () => void;
  disabled?: boolean;
  secondary?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        secondary && styles.secondary,
        disabled && { opacity: 0.45 },
        pressed && { opacity: 0.75 },
      ]}
    >
      <Text style={[styles.buttonText, secondary && { color: colors.green }]}>
        {children}
      </Text>
    </Pressable>
  );
}

export function Card({
  children,
  style,
}: {
  children: ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  content: {
    width: "100%",
    maxWidth: 1100,
    alignSelf: "center",
    padding: 24,
    gap: 24,
    paddingBottom: 48,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  between: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
  title: {
    color: colors.ink,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "800",
    letterSpacing: -1,
  },
  heading: { color: colors.ink, fontSize: 22, fontWeight: "700" },
  body: { color: colors.muted, fontSize: 16, lineHeight: 25 },
  eyebrow: {
    color: colors.green,
    fontWeight: "800",
    fontSize: 11,
    letterSpacing: 2,
  },
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 22,
    padding: 24,
    gap: 14,
  },
  button: {
    backgroundColor: colors.green,
    minHeight: 50,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: "700" },
  secondary: { backgroundColor: "#EAF3E6" },
  error: { color: "#9F2E22", fontSize: 15, lineHeight: 23 },
  tag: {
    color: colors.green,
    backgroundColor: "#EAF3E6",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: "700",
    overflow: "hidden",
  },
});
