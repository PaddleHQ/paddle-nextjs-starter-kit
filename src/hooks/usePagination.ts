import { useState } from 'react';

export function usePagination() {
  const [nextCursor, setNextCursor] = useState<string>('');
  const [cursorHistory, setCursorHistory] = useState<string[]>([]);

  function goToNextPage(cursor: string) {
    setCursorHistory([...cursorHistory, nextCursor]);
    setNextCursor(cursor);
  }

  function goToPrevPage() {
    const lastCursor = cursorHistory[cursorHistory.length - 1] ?? '';
    setCursorHistory(cursorHistory.slice(0, -1));
    setNextCursor(lastCursor);
  }

  return {
    after: nextCursor,
    hasPrev: cursorHistory.length > 0 || !!nextCursor,
    goToNextPage,
    goToPrevPage,
  };
}
