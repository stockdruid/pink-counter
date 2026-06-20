import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

interface ShortcutMap {
  [pattern: string]: () => void;
}

const BUFFER_TIMEOUT = 800; // ms — 이 시간 안에 연속 입력해야 패턴 인식

export function useKeyboardShortcuts(shortcuts: ShortcutMap) {
  const bufferRef = useRef('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const patterns = Object.keys(shortcuts);
    const maxLen = Math.max(...patterns.map((p) => p.length));

    const handleKeyDown = (e: KeyboardEvent) => {
      // 입력창에 포커스 있으면 무시 (이름 수정 중)
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      // 물리 키 코드 → 단축 문자 매핑
      const code = e.code;
      const keyMap: Record<string, string> = {
        KeyD: 'D', // ㅇ
        KeyF: 'F', // ㄹ
        KeyQ: 'Q', // ㅂ
        KeyW: 'W', // ㅈ
        KeyA: 'A', // ㅁ
      };

      const mapped = keyMap[code];
      if (!mapped) {
        bufferRef.current = '';
        return;
      }

      // 타이머 리셋
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        bufferRef.current = '';
      }, BUFFER_TIMEOUT);

      bufferRef.current += mapped;

      // 버퍼가 너무 길면 앞에서 자르기
      if (bufferRef.current.length > maxLen) {
        bufferRef.current = bufferRef.current.slice(-maxLen);
      }

      // 패턴 매칭
      for (const pattern of patterns) {
        if (bufferRef.current.endsWith(pattern)) {
          e.preventDefault();
          shortcuts[pattern]();
          bufferRef.current = '';
          break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}
