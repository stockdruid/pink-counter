import React, { useRef } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';

interface Props {
  children: React.ReactNode;
  onDelete: () => void;
  name: string;
}

const SWIPE_THRESHOLD = -80;

export function SwipeableRow({ children, onDelete, name }: Props) {
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > 10 && Math.abs(gesture.dy) < 20,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dx < 0) {
          translateX.setValue(gesture.dx);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx < SWIPE_THRESHOLD) {
          Alert.alert(
            '삭제',
            `"${name}" 카운터를 삭제할까요?`,
            [
              {
                text: '삭제',
                style: 'destructive',
                onPress: () => {
                  Animated.timing(translateX, {
                    toValue: -400,
                    duration: 200,
                    useNativeDriver: true,
                  }).start(onDelete);
                },
              },
              {
                text: '취소',
                style: 'cancel',
                onPress: () => {
                  Animated.spring(translateX, {
                    toValue: 0,
                    useNativeDriver: true,
                  }).start();
                },
              },
            ],
          );
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  return (
    <View style={styles.container}>
      {/* 뒤에 삭제 표시 */}
      <View style={styles.deleteBackground}>
        <Text style={styles.deleteText}>삭제</Text>
      </View>

      {/* 스와이프 가능한 콘텐츠 */}
      <Animated.View
        style={{ transform: [{ translateX }] }}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  deleteBackground: {
    position: 'absolute',
    right: 20,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 24,
  },
  deleteText: {
    color: '#E040A0',
    fontSize: 16,
    fontWeight: '700',
  },
});
