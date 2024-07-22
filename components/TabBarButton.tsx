import { GestureResponderEvent, Pressable, StyleSheet, Text } from "react-native";
import React, { useEffect } from "react";
import { icon } from "@/constants/icon";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

export default function TabBarButton({
  onPress,
  onLongPress,
  isFocused,
  routeName,
  color,
  label,
}: {
  onPress: ((event: GestureResponderEvent) => void) | null | undefined;
  onLongPress: ((event: GestureResponderEvent) => void) | null | undefined;
  isFocused: boolean;
  routeName: string;
  color: string;
  label: string;
}) {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(
      typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused,
      { duration: 350 }
    );
  }, [scale, isFocused]);

  const animatedTextStyle = useAnimatedStyle( () => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0]);
    return {opacity}
  });

  const animatedIconStyle = useAnimatedStyle( () => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
    const top  = interpolate(scale.value, [0, 1], [1, 11]);
    return {
      transform: [{
        scale: scaleValue
      }],
      top: top
    }
  });


  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabBarItem}
    >
      <Animated.View style={animatedIconStyle}>
        {icon[routeName]({
          color: isFocused ? "#fff" : "#222",
        })}
      </Animated.View>
      <Animated.Text style={[{ color: isFocused ? "#673ab7" : "#222" }, animatedTextStyle]}>{label}</Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tabBarItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
});
