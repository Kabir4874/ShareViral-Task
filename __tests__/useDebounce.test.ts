jest.useFakeTimers();

describe('useDebounce Logic', () => {
  it('delays updating search query until 300ms timer elapses', () => {
    let debouncedValue = 'initial';
    const setDebounced = (val: string) => {
      debouncedValue = val;
    };

    let timer: ReturnType<typeof setTimeout> | null = null;
    const updateSearch = (newValue: string, delayMs = 300) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        setDebounced(newValue);
      }, delayMs);
    };

    updateSearch('search term');
    expect(debouncedValue).toBe('initial');

    jest.advanceTimersByTime(300);
    expect(debouncedValue).toBe('search term');
  });
});
