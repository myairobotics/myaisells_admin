'use client';

import type { HowToItem } from '@/types';
import { useState } from 'react';
import {
  FiBookOpen,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiFilm,
  FiPlay,
  FiRefreshCw,
  FiSearch,
  FiX,
} from 'react-icons/fi';
import { PageHeader } from '@/components/global/page-header';
import { useGetAllHowTosQuery } from '@/services';

/* ─── Video card ──────────────────────────────────────────────────── */

function VideoCard({ item, onClick }: { item: HowToItem; onClick: () => void }) {
  const thumb = item.thumbnailFileAsset?.path;
  return (
    <button
      type="button"
      onClick={onClick}
      className="group overflow-hidden rounded-xl border border-slate-200/60 bg-white text-left shadow-sm transition-all hover:border-primary-300 hover:shadow-md"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-slate-900">
        {thumb
          ? (
              <img
                src={thumb}
                alt={item.title}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            )
          : (
              <div className="flex h-full w-full items-center justify-center">
                <FiFilm className="h-10 w-10 text-slate-600" />
              </div>
            )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg">
            <FiPlay className="ml-1 h-5 w-5 text-slate-800" />
          </div>
        </div>
        {!item.status && (
          <div className="absolute top-2 left-2 rounded-full bg-slate-800/80 px-2 py-0.5 text-xs font-semibold text-white">
            Draft
          </div>
        )}
        <div className="absolute right-2 bottom-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-0.5 text-xs font-medium text-white">
          <FiClock className="h-3 w-3" />
          {item.duration}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="line-clamp-2 font-semibold text-slate-800 group-hover:text-primary-700">{item.title}</h3>
        {item.description && (
          <p className="mt-1 line-clamp-2 text-xs text-slate-500">{item.description}</p>
        )}
        <p className="mt-2 text-xs text-slate-400">
          Added
          {' '}
          {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </div>
    </button>
  );
}

/* ─── Video modal ─────────────────────────────────────────────────── */

function VideoModal({ item, onClose }: { item: HowToItem; onClose: () => void }) {
  const videoSrc = item.mainFileAsset?.path;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-black shadow-2xl"
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          <FiX className="h-4 w-4" />
        </button>

        {/* Video */}
        {videoSrc
          ? (
              <video
                src={videoSrc}
                controls
                autoPlay
                className="w-full aspect-video"
              />
            )
          : (
              <div className="flex aspect-video items-center justify-center bg-slate-900 text-slate-500">
                <FiFilm className="h-12 w-12" />
              </div>
            )}

        {/* Info bar */}
        <div className="border-t border-white/10 bg-slate-900 p-4">
          <h3 className="font-semibold text-white">{item.title}</h3>
          {item.description && <p className="mt-1 text-sm text-slate-400">{item.description}</p>}
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <FiClock className="h-3.5 w-3.5" />
            {item.duration}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Skeleton card ───────────────────────────────────────────────── */

function VideoCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="aspect-video bg-slate-200" />
      <div className="p-4 space-y-2">
        <div className="h-4 w-3/4 rounded bg-slate-200" />
        <div className="h-3 w-full rounded bg-slate-100" />
        <div className="h-3 w-1/3 rounded bg-slate-100" />
      </div>
    </div>
  );
}

/* ─── Main ────────────────────────────────────────────────────────── */

export default function HelpCenter() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [playingItem, setPlayingItem] = useState<HowToItem | null>(null);

  const { data, isLoading, isFetching, refetch } = useGetAllHowTosQuery({ page, pageSize: 12 });

  const items: HowToItem[] = data?.data?.data ?? [];
  const meta = data?.data?.meta;
  const totalPages = meta?.lastPage ?? 1;

  const filtered = search.trim()
    ? items.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase())
        || item.description?.toLowerCase().includes(search.toLowerCase()),
      )
    : items;

  return (
    <div className="flex h-full w-full flex-col space-y-5 overflow-x-hidden overflow-y-auto">
      <PageHeader
        title="Help Center"
        subtitle="Video tutorials and how-to guides for platform users"
        icon={<FiBookOpen />}
        actions={(
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/15 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/25 disabled:opacity-60"
          >
            <FiRefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        )}
      />

      {/* Stat + search row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200/60 bg-white px-4 py-3 shadow-sm">
          <FiFilm className="h-5 w-5 text-rose-500" />
          <span className="text-sm font-semibold text-slate-700">
            {meta?.total?.toLocaleString() ?? items.length}
            {' '}
            video
            {(meta?.total ?? items.length) !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="relative min-w-48 flex-1">
          <FiSearch className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search tutorials…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200/60 bg-white py-3 pr-4 pl-9 text-sm text-slate-700 shadow-sm outline-none transition-all focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20"
          />
        </div>
      </div>

      {/* Grid */}
      {isLoading
        ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }, (_, i) => `skel-${i}`).map(key => <VideoCardSkeleton key={key} />)}
            </div>
          )
        : filtered.length === 0
          ? (
              <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-slate-200/60 bg-white">
                <FiFilm className="h-12 w-12 text-slate-300" />
                <p className="text-slate-500">{search ? 'No videos match your search' : 'No tutorials yet'}</p>
                {search && (
                  <button type="button" onClick={() => setSearch('')} className="text-sm font-medium text-rose-600 hover:underline">
                    Clear search
                  </button>
                )}
              </div>
            )
          : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map(item => (
                  <VideoCard key={item.id} item={item} onClick={() => setPlayingItem(item)} />
                ))}
              </div>
            )}

      {/* Pagination */}
      {totalPages > 1 && !search && (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50 disabled:opacity-40"
          >
            <FiChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-slate-600">Page {page} of {totalPages}</span>
          <button
            type="button"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50 disabled:opacity-40"
          >
            <FiChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Video player modal */}
      {playingItem && <VideoModal item={playingItem} onClose={() => setPlayingItem(null)} />}
    </div>
  );
}
