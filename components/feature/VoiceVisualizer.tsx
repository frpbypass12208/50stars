// Powered by OnSpace.AI
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Colors } from '@/constants/theme';

interface VoiceVisualizerProps {
  isActive: boolean;
  barCount?: number;
}

export function VoiceVisualizer({ isActive, barCount = 9 }: VoiceVisualizerProps) {
  const anims = useRef(
    Array.from({ length: barCount }, () => new Animated.Value(0.2))
  ).current;

  useEffect(() => {
    if (isActive) {
      const animations = anims.map((anim, i) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(i * 80),
            Animated.timing(anim, {
              toValue: 0.3 + Math.random() * 0.7,
              duration: 300 + Math.random() * 200,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0.1 + Math.random() * 0.3,
              duration: 300 + Math.random() * 200,
              useNativeDriver: true,
            }),
          ])
        );
      });
      animations.forEach(a => a.start());
      return () => animations.forEach(a => a.stop());
    } else {
      anims.forEach(anim =>
        Animated.timing(anim, {
          toValue: 0.2,
          duration: 300,
          useNativeDriver: true,
        }).start()
      );
    }
  }, [isActive]);

  return (
    <View style={styles.container}>
      {anims.map((anim, i) => (
        <Animated.View
          key={i}
          style={[
            styles.bar,
            { transform: [{ scaleY: anim }] },
            { backgroundColor: i % 2 === 0 ? Colors.primaryLight : Colors.accentLight },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    gap: 5,
  },
  bar: {
    width: 5,
    height: 60,
    borderRadius: 3,
  },
});
