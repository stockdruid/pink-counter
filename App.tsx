import React from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCounters } from './src/useCounters';
import { CounterCard } from './src/CounterCard';
import { SwipeableRow } from './src/SwipeableRow';
import { useKeyboardShortcuts } from './src/useKeyboardShortcuts';

function HeartPattern() {
  const hearts: string[] = [];
  for (let i = 0; i < 60; i++) {
    hearts.push('♡');
  }
  return (
    <View style={styles.patternContainer} pointerEvents="none">
      <Text style={styles.patternText}>
        {hearts.join('  ')}
      </Text>
    </View>
  );
}

export default function App() {
  const { counters, loaded, increment, decrement, reset, rename, changeColor, add, remove } = useCounters();

  // 키보드 단축키: ㅇㄹ(DF) → 총건수+실건수 +1, ㅂㅈㅁㅂ(QWAQ) → 실건수 -1
  const shortcuts = React.useMemo(() => {
    const findByName = (name: string) => counters.find((c) => c.name === name);
    return {
      'DF': () => {
        const total = findByName('총건수');
        const real = findByName('실건수');
        if (total) increment(total.id);
        if (real) increment(real.id);
      },
      'QWAQ': () => {
        const real = findByName('실건수');
        if (real) decrement(real.id);
      },
    };
  }, [counters, increment, decrement]);

  useKeyboardShortcuts(shortcuts);

  if (!loaded) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingHeart}>♡</Text>
        <Text style={styles.loadingText}>로딩 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFF0F5', '#FFD6E8', '#E8C8FF', '#FFD6E8', '#FFF0F5']}
        locations={[0, 0.25, 0.5, 0.75, 1]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF0F5" />
      <HeartPattern />

      {/* 글라스 앱바 */}
      <View style={styles.appBar}>
        <View style={styles.appBarGlass}>
          <View style={styles.appBarHighlight} />
          <Text style={styles.appBarTitle}>♡ 핑크 계수기 ♡</Text>
          <Text style={styles.appBarSub}>꾹 눌러서 리셋 · 삭제  |  ㅇㄹ = +1  ㅂㅈㅁㅂ = 실건수 -1</Text>
        </View>
      </View>

      {/* 카운터 리스트 */}
      <FlatList
        data={counters}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SwipeableRow name={item.name} onDelete={() => remove(item.id)}>
            <CounterCard
              counter={item}
              onIncrement={() => increment(item.id)}
              onDecrement={() => decrement(item.id)}
              onReset={() => reset(item.id)}
              onRename={(name) => rename(item.id, name)}
              onChangeColor={(colorKey) => changeColor(item.id, colorKey)}
              onRemove={() => remove(item.id)}
            />
          </SwipeableRow>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>카운터가 없어요</Text>
            <Text style={styles.emptyHint}>＋ 버튼을 눌러 추가하세요</Text>
          </View>
        }
      />

      {/* 글라스 FAB */}
      <Pressable style={styles.fab} onPress={add}>
        <View style={styles.fabGlass}>
          <View style={styles.fabHighlight} />
          <Text style={styles.fabText}>＋</Text>
        </View>
      </Pressable>
    </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  patternContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    opacity: 0.06,
  },
  patternText: {
    fontSize: 20,
    color: '#FF69B4',
    lineHeight: 36,
    letterSpacing: 8,
  },
  loading: {
    flex: 1,
    backgroundColor: '#FFF0F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingHeart: {
    fontSize: 64,
    color: '#FF69B4',
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#C71585',
  },
  appBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  appBarGlass: {
    backgroundColor: 'rgba(255,105,180,0.08)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    paddingVertical: 14,
    paddingHorizontal: 20,
    overflow: 'hidden',
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  appBarHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  appBarTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#C71585',
    textAlign: 'center',
    letterSpacing: 1,
  },
  appBarSub: {
    fontSize: 11,
    color: '#D4458E',
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.7,
  },
  list: {
    paddingVertical: 8,
    paddingBottom: 100,
  },
  empty: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    fontSize: 18,
    color: '#C71585',
    fontWeight: '600',
  },
  emptyHint: {
    fontSize: 14,
    color: '#D4458E',
    marginTop: 8,
    opacity: 0.6,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
  },
  fabGlass: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,105,180,0.22)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  fabHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 26,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  fabText: {
    fontSize: 30,
    color: '#C71585',
    fontWeight: '700',
  },
});
