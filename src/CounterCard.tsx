import React, { useRef } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Counter, PINK_PALETTE, PINK_COLOR_KEYS, PinkColor } from './types';

interface Props {
  counter: Counter;
  onIncrement: () => void;
  onDecrement: () => void;
  onReset: () => void;
  onRename: (name: string) => void;
  onChangeColor: (colorKey: PinkColor) => void;
  onRemove: () => void;
}

export function CounterCard({
  counter, onIncrement, onDecrement, onReset, onRename, onChangeColor, onRemove,
}: Props) {
  const palette = PINK_PALETTE[counter.colorKey];
  const scaleInc = useRef(new Animated.Value(1)).current;
  const scaleDec = useRef(new Animated.Value(1)).current;
  const numberScale = useRef(new Animated.Value(1)).current;
  const [showColors, setShowColors] = React.useState(false);

  const bounce = (anim: Animated.Value) => {
    Animated.sequence([
      Animated.timing(anim, { toValue: 0.88, duration: 60, useNativeDriver: true }),
      Animated.spring(anim, { toValue: 1, friction: 3, tension: 200, useNativeDriver: true }),
    ]).start();
  };

  const pulseNumber = () => {
    Animated.sequence([
      Animated.timing(numberScale, { toValue: 1.18, duration: 80, useNativeDriver: true }),
      Animated.spring(numberScale, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
  };

  const handleIncrement = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    bounce(scaleInc);
    pulseNumber();
    onIncrement();
  };

  const handleDecrement = () => {
    if (counter.value <= 0) return;
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    bounce(scaleDec);
    pulseNumber();
    onDecrement();
  };

  const handleLongPress = () => {
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(counter.name, '어떤 작업을 할까요?', [
      { text: '리셋', onPress: onReset },
      { text: '삭제', style: 'destructive', onPress: onRemove },
      { text: '취소', style: 'cancel' },
    ]);
  };

  const cardContent = (
    <>
      {/* 글라스 상단 하이라이트 */}
      <View style={styles.glassHighlightTop} />

      {/* 헤더 */}
      <View style={styles.header}>
        <TextInput
          style={[styles.nameInput, { color: palette.dark }]}
          value={counter.name}
          onChangeText={onRename}
          maxLength={20}
          placeholderTextColor={palette.main + '80'}
          placeholder="이름 입력"
        />
        <Pressable onPress={() => setShowColors(!showColors)} style={styles.colorBtn}>
          <View style={[styles.colorDot, { backgroundColor: palette.main }]} />
          <Text style={[styles.menuDots, { color: palette.dark }]}>⋯</Text>
        </Pressable>
      </View>

      {/* 색상 선택 */}
      {showColors && (
        <View style={styles.colorPicker}>
          {PINK_COLOR_KEYS.map((key) => (
            <Pressable
              key={key}
              onPress={() => { onChangeColor(key); setShowColors(false); }}
              style={[
                styles.colorOption,
                {
                  backgroundColor: PINK_PALETTE[key].main,
                  borderWidth: key === counter.colorKey ? 2 : 0,
                  borderColor: '#fff',
                },
              ]}
            />
          ))}
        </View>
      )}

      {/* 숫자 */}
      <Animated.Text
        style={[
          styles.number,
          { color: palette.dark, transform: [{ scale: numberScale }] },
        ]}
      >
        {counter.value}
      </Animated.Text>

      {/* 버튼 */}
      <View style={styles.buttons}>
        <Animated.View style={{ transform: [{ scale: scaleDec }] }}>
          <Pressable
            style={[styles.btn, {
              backgroundColor: palette.main + '25',
              borderColor: 'rgba(255,255,255,0.4)',
            }]}
            onPress={handleDecrement}
          >
            <Text style={[styles.btnText, { color: palette.dark, opacity: counter.value <= 0 ? 0.3 : 1 }]}>−</Text>
          </Pressable>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: scaleInc }] }}>
          <Pressable
            style={[styles.btn, {
              backgroundColor: palette.main + '35',
              borderColor: 'rgba(255,255,255,0.5)',
            }]}
            onPress={handleIncrement}
          >
            <Text style={[styles.btnText, { color: palette.dark }]}>＋</Text>
          </Pressable>
        </Animated.View>
      </View>

      {/* 하단 글라스 반사 */}
      <View style={styles.glassHighlightBottom} />
    </>
  );

  return (
    <Pressable onLongPress={handleLongPress}>
      <View style={[styles.cardOuter, {
        shadowColor: palette.main,
      }]}>
        {Platform.OS !== 'web' ? (
          <BlurView intensity={40} tint="light" style={[styles.card, { borderColor: 'rgba(255,255,255,0.45)' }]}>
            <View style={[styles.cardOverlay, { backgroundColor: palette.main + '10' }]}>
              {cardContent}
            </View>
          </BlurView>
        ) : (
          <View style={[styles.card, styles.cardWeb, {
            backgroundColor: palette.main + '12',
            borderColor: 'rgba(255,255,255,0.55)',
          }]}>
            {cardContent}
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardOuter: {
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 24,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  cardWeb: {
    backdropFilter: 'blur(20px)',
    padding: 20,
  } as any,
  cardOverlay: {
    padding: 20,
  },
  glassHighlightTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  glassHighlightBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    zIndex: 1,
  },
  nameInput: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    padding: 4,
  },
  colorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 4,
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  menuDots: {
    fontSize: 16,
    fontWeight: '700',
  },
  colorPicker: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 10,
    zIndex: 2,
  },
  colorOption: {
    width: 28,
    height: 28,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  number: {
    fontSize: 60,
    fontWeight: '800',
    textAlign: 'center',
    marginVertical: 16,
    letterSpacing: -2,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 28,
    zIndex: 1,
  },
  btn: {
    width: 72,
    height: 52,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 26,
    fontWeight: '700',
  },
});
