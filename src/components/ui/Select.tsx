'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { LuCheck, LuChevronsUpDown, LuSearch, LuX } from 'react-icons/lu';

type Option = { label: string; value: string };

type AsyncLoadResult = {
  options: Option[];
  hasMore?: boolean;
};

type LoadOptionsFn = (
  query: string,
  offset?: number,
  limit?: number,
) => Promise<AsyncLoadResult>;

type SelectProps = {
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChangeAction?: (value: string | string[] | null) => void;
  options?: Option[];
  loadOptionsAction?: LoadOptionsFn;
  multi?: boolean;
  searchable?: boolean;
  virtualized?: boolean;
  itemHeight?: number;
  maxHeight?: number;
  debounce?: number;
  pageSize?: number;
  placeholder?: string;
  name?: string;
  disabled?: boolean;
  className?: string;
};

type FormControlProps = {
  label?: string;
  hint?: string;
  error?: string;
  id?: string;
  children: React.ReactNode;
};

function useDebouncedValue<T>(value: T, ms: number) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return v;
}

const toStringArray = (v?: string | string[] | null) => {
  if (!v) {
    return [] as string[];
  }
  return Array.isArray(v) ? v : [String(v)];
};

export function FormControl({ label, hint, error, id, children }: FormControlProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      {children}
      {hint && <div className="text-xs text-slate-500">{hint}</div>}
      {error && <div className="text-xs text-red-600">{error}</div>}
    </div>
  );
}

function getWindowedSlice(
  items: Option[],
  scrollTop: number,
  itemHeight: number,
  containerHeight: number,
  overscan = 3,
) {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(containerHeight / itemHeight) + overscan * 2;
  const endIndex = Math.min(items.length, startIndex + visibleCount);
  const topPadding = startIndex * itemHeight;
  const bottomPadding = Math.max(0, (items.length - endIndex) * itemHeight);
  return { startIndex, endIndex, topPadding, bottomPadding, visible: items.slice(startIndex, endIndex) };
}

const emptyArray: [] = [];

export function Select({
  value,
  defaultValue,
  onValueChangeAction,
  options = emptyArray,
  loadOptionsAction,
  multi = false,
  searchable = true,
  virtualized = true,
  itemHeight = 44,
  maxHeight = 320,
  debounce = 250,
  pageSize = 50,
  placeholder = 'Select...',
  name,
  disabled = false,
  className,
}: SelectProps) {
  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = useState<string[]>(
    () => toStringArray(defaultValue),
  );

  const normalizedValue: string[] = useMemo(() => {
    if (isControlled) {
      return toStringArray(value);
    }
    return internalValue;
  }, [isControlled, value, internalValue]);

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, debounce);

  const [localOptions, setLocalOptions] = useState<Option[]>(options || []);
  const [loading, setLoading] = useState(false);
  const [asyncHasMore, setAsyncHasMore] = useState<boolean>(false);
  const [asyncOffset, setAsyncOffset] = useState(0);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [dropdownPos, setDropdownPos] = useState({
    top: 0,
    left: 0,
    width: 0,
    direction: 'down' as 'down' | 'up',
  });

  const [focusIndex, setFocusIndex] = useState<number>(-1);

  const resetAndLoad = useCallback(async () => {
    if (!loadOptionsAction) {
      const q = debouncedSearch.trim().toLowerCase();
      const filtered = (options || []).filter(o => o.label.toLowerCase().includes(q));
      setLocalOptions(filtered);
      setAsyncHasMore(false);
      setAsyncOffset(0);
      return;
    }

    setLoading(true);
    try {
      const page = await loadOptionsAction(debouncedSearch.trim(), 0, pageSize);
      setLocalOptions(page.options ?? []);
      setAsyncHasMore(Boolean(page.hasMore));
      setAsyncOffset((page.options?.length ?? 0));
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, loadOptionsAction, options, pageSize]);

  useEffect(() => {
    resetAndLoad();
  }, [debouncedSearch, resetAndLoad]);

  const loadMore = useCallback(async () => {
    if (!loadOptionsAction || !asyncHasMore || loading) {
      return;
    }
    setLoading(true);
    try {
      const page = await loadOptionsAction(debouncedSearch.trim(), asyncOffset, pageSize);
      setLocalOptions(prev => [...prev, ...(page.options ?? [])]);
      setAsyncHasMore(Boolean(page.hasMore));
      setAsyncOffset(prev => prev + (page.options?.length ?? 0));
    } finally {
      setLoading(false);
    }
  }, [loadOptionsAction, asyncHasMore, asyncOffset, pageSize, debouncedSearch, loading]);

  const isSelected = useCallback((opt: Option) => normalizedValue.includes(opt.value), [normalizedValue]);

  const updateValue = useCallback(
    (next: string[] | null) => {
      if (!isControlled) {
        setInternalValue(next ?? []);
      }
      if (onValueChangeAction) {
        if (multi) {
          onValueChangeAction(next && next.length > 0 ? next : null);
        } else {
          onValueChangeAction(next && next.length > 0 ? (next[0] as string) : null);
        }
      }
    },
    [isControlled, onValueChangeAction, multi],
  );

  const selectOne = useCallback((val: string) => {
    if (multi) {
      const next = normalizedValue.includes(val)
        ? normalizedValue.filter(v => v !== val)
        : [...normalizedValue, val];
      updateValue(next.length ? next : null);
    } else {
      updateValue([val]);
      setIsOpen(false);
    }
  }, [multi, normalizedValue, updateValue]);

  const clearSelection = useCallback(() => updateValue(null), [updateValue]);

  const calculatePosition = useCallback(() => {
    const btn = buttonRef.current;
    if (!btn) {
      return;
    }
    const rect = btn.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const heightNeeded = maxHeight;
    const openUp = spaceBelow < heightNeeded && spaceAbove > spaceBelow;
    setDropdownPos({
      top: openUp ? rect.top + window.scrollY - heightNeeded - 6 : rect.bottom + window.scrollY + 6,
      left: rect.left + window.scrollX,
      width: rect.width,
      direction: openUp ? 'up' : 'down',
    });
  }, [maxHeight]);

  const openWithPosition = useCallback(() => {
    calculatePosition();
    setIsOpen(true);
    setTimeout(() => {
      const el = wrapperRef.current?.querySelector<HTMLInputElement>('input[data-select-search]');
      if (el) {
        el.focus();
      }
    }, 0);
  }, [calculatePosition]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        wrapperRef.current
        && !wrapperRef.current.contains(target)
        && dropdownRef.current
        && !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusIndex(i => Math.min(i + 1, Math.max(0, localOptions.length - 1)));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusIndex(i => Math.max(0, i - 1));
      } else if (e.key === 'Home') {
        e.preventDefault();
        setFocusIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setFocusIndex(localOptions.length - 1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const opt = localOptions[focusIndex];
        if (opt) {
          selectOne(opt.value);
        }
      } else if (e.key === 'Backspace' && multi && !search && normalizedValue.length) {
        const next = normalizedValue.slice(0, -1);
        updateValue(next.length ? next : null);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, localOptions, focusIndex, multi, normalizedValue, selectOne, updateValue, search]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const fn = () => calculatePosition();
    window.addEventListener('resize', fn);
    window.addEventListener('scroll', fn, true);
    return () => {
      window.removeEventListener('resize', fn);
      window.removeEventListener('scroll', fn, true);
    };
  }, [isOpen, calculatePosition]);

  const resetAndLoadOnOpen = useCallback(async () => {
    if (!loadOptionsAction) {
      setAsyncHasMore(false);
      return;
    }
    setLoading(true);
    try {
      const page = await loadOptionsAction('', 0, pageSize);
      setLocalOptions(page.options ?? []);
      setAsyncHasMore(Boolean(page.hasMore));
      setAsyncOffset((page.options?.length ?? 0));
      setFocusIndex(-1);
    } finally {
      setLoading(false);
    }
  }, [loadOptionsAction, pageSize]);

  useEffect(() => {
    if (isOpen) {
      resetAndLoadOnOpen();
    }
  }, [isOpen, resetAndLoadOnOpen]);

  const onListScroll = useCallback(
    (e: React.UIEvent) => {
      const el = e.target as HTMLElement;
      if (!el) {
        return;
      }
      const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 100;
      if (virtualized) {
        if (loadOptionsAction && asyncHasMore && nearBottom) {
          loadMore();
        }
      } else if (loadOptionsAction && asyncHasMore && nearBottom) {
        loadMore();
      }
    },
    [virtualized, loadOptionsAction, asyncHasMore, loadMore],
  );

  const [scrollTop, setScrollTop] = useState(0);
  useEffect(() => {
    const node = listRef.current;
    if (!node) {
      return;
    }
    const onScroll = () => setScrollTop(node.scrollTop);
    node.addEventListener('scroll', onScroll);
    return () => node.removeEventListener('scroll', onScroll);
  }, []);

  const containerHeight = Math.min(maxHeight, (localOptions.length * itemHeight) || maxHeight);

  const windowed = virtualized
    ? getWindowedSlice(localOptions, scrollTop, itemHeight, containerHeight)
    : { startIndex: 0, endIndex: localOptions.length, topPadding: 0, bottomPadding: 0, visible: localOptions };

  useEffect(() => {
    if (focusIndex < 0 || !listRef.current) {
      return;
    }
    const idx = focusIndex;
    const node = listRef.current;
    const top = idx * itemHeight;
    const bottom = top + itemHeight;
    if (top < node.scrollTop) {
      node.scrollTop = top;
    } else if (bottom > node.scrollTop + node.clientHeight) {
      node.scrollTop = bottom - node.clientHeight;
    }
  }, [focusIndex, itemHeight]);

  const getOptionByValue = useCallback((val: string) => localOptions.find(o => o.value === val), [localOptions]);

  const singleLabel = useMemo(() => {
    if (normalizedValue.length === 0) {
      return '';
    }
    const opt = getOptionByValue(normalizedValue[0] ?? '') || options.find(o => o.value === normalizedValue[0]);
    return opt?.label ?? normalizedValue[0];
  }, [normalizedValue, options, getOptionByValue]);

  return (
    <div className={`relative ${className || ''}`} ref={wrapperRef}>
      {name && !multi && normalizedValue[0] && (
        <input type="hidden" name={name} value={normalizedValue[0]} />
      )}
      {name && multi && normalizedValue.map(v => <input key={v} type="hidden" name={name} value={v} />)}

      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => {
          if (disabled) {
            return;
          }
          if (!isOpen) {
            openWithPosition();
          } else {
            setIsOpen(false);
          }
        }}
        className={`group relative w-full rounded-xl border-2 border-primary-200 bg-white px-4 py-2 text-left text-slate-700 shadow-sm transition-all duration-150 hover:border-primary-300 hover:shadow-md focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 focus:outline-none ${disabled ? 'pointer-events-none opacity-60' : ''
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            {multi
              ? (
                  <div className="flex max-w-[calc(100%-2rem)] flex-wrap items-center gap-2">
                    {normalizedValue.length === 0
                      ? (
                          <span className="text-sm text-slate-400">{placeholder}</span>
                        )
                      : (
                          normalizedValue.map((val) => {
                            const opt = getOptionByValue(val) || options.find(o => o.value === val);
                            return (
                              <span
                                key={val}
                                className="flex items-center gap-1 rounded-md bg-primary-50 px-2 py-0.5 text-xs text-primary-700"
                              >
                                <span className="max-w-40 truncate">{opt?.label ?? val}</span>
                                <button
                                  type="button"
                                  aria-label={`Remove ${opt?.label ?? val}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    selectOne(val);
                                  }}
                                  className="rounded-sm p-0.5 hover:bg-primary-100"
                                >
                                  <LuX className="h-3 w-3" />
                                </button>
                              </span>
                            );
                          })
                        )}
                  </div>
                )
              : (
                  <div className="min-w-0">
                    <span className={`text-sm ${singleLabel ? 'font-semibold text-slate-700' : 'text-slate-400'}`}>
                      {singleLabel || placeholder}
                    </span>
                  </div>
                )}
          </div>

          <div className="flex items-center gap-2">
            {/* Clear */}
            {(normalizedValue.length > 0) && (
              <button
                type="button"
                aria-label="Clear selection"
                onClick={(e) => {
                  e.stopPropagation();
                  clearSelection();
                }}
                className="rounded-md p-1 hover:bg-slate-100"
              >
                <LuX className="h-4 w-4" />
              </button>
            )}

            <LuChevronsUpDown
              className={`h-5 w-5 text-primary-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-xl bg-linear-to-r from-primary-500/0 via-primary-500/5 to-primary-500/0 opacity-0 transition-opacity group-hover:opacity-100" />
      </button>

      {/* Dropdown portal */}
      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          className="z-99999"
          style={{
            position: 'absolute',
            top: dropdownPos.top,
            left: dropdownPos.left,
            width: dropdownPos.width,
          }}
        >
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-br from-primary-500/10 to-primary-600/10 blur-xl" />

          <div
            className="overflow-hidden rounded-2xl border-2 border-primary-200 bg-white shadow-2xl shadow-primary-500/20"
          >
            {/* Search */}
            {searchable && (
              <div className="flex items-center gap-2 border-b border-primary-100 px-3 py-2">
                <LuSearch className="h-4 w-4 text-slate-400" />
                <input
                  data-select-search
                  value={search}
                  placeholder={loadOptionsAction ? 'Search...' : 'Filter...'}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setFocusIndex(0);
                    }
                  }}
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="rounded-md p-1 hover:bg-slate-100"
                    aria-label="Clear search"
                  >
                    <LuX className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}

            <div style={{ maxHeight, overflow: 'hidden' }}>
              <ul
                ref={listRef}
                role="listbox"
                aria-multiselectable={multi}
                className="relative overflow-y-auto"
                style={{ maxHeight, height: containerHeight }}
                onScroll={(e) => {
                  onListScroll(e);
                  setScrollTop((e.target as HTMLElement).scrollTop);
                }}
              >
                {virtualized && <li style={{ height: windowed.topPadding }} aria-hidden />}

                {windowed.visible.map((opt, idx) => {
                  const globalIndex = windowed.startIndex + idx;
                  const selected = isSelected(opt);
                  const focused = globalIndex === focusIndex;
                  return (
                    <li
                      key={opt.value}
                      role="option"
                      aria-selected={selected}
                      tabIndex={0}
                      onClick={() => selectOne(opt.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          selectOne(opt.value);
                        } else if (e.key === 'ArrowDown') {
                          e.preventDefault();
                          setFocusIndex(i => Math.min(i + 1, Math.max(0, localOptions.length - 1)));
                        } else if (e.key === 'ArrowUp') {
                          e.preventDefault();
                          setFocusIndex(i => Math.max(0, i - 1));
                        }
                      }}
                      onMouseEnter={() => setFocusIndex(globalIndex)}
                      className={`flex cursor-pointer items-center justify-between gap-3 px-4 py-2 text-sm ${selected ? 'bg-linear-to-r from-primary-600 via-primary-500 to-primary-600 text-white shadow-md' : 'text-slate-700 hover:bg-primary-50 hover:text-primary-700'
                      } ${focused ? 'ring-2 ring-primary-300' : ''}`}
                      style={{ height: itemHeight }}
                    >
                      <span className="truncate">{opt.label}</span>
                      {selected && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                          <LuCheck className="h-4 w-4" />
                        </span>
                      )}
                    </li>
                  );
                })}

                {virtualized && <li style={{ height: windowed.bottomPadding }} aria-hidden />}

                {loading && <li className="px-4 py-3 text-sm text-slate-500">Loading…</li>}
                {!loading && localOptions.length === 0 && <li className="px-4 py-3 text-sm text-slate-500">No options</li>}
              </ul>
            </div>

            {loadOptionsAction && asyncHasMore && <div className="px-3 py-2 text-xs text-slate-500">Scroll to load more</div>}
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}

export default Select;
