import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

type PaginationProps = {
  page: number;
  totalPages: number;
  total?: number;
  itemLabel?: string;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, totalPages, total, itemLabel = 'item', onPageChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }
  const count = total?.toLocaleString() ?? '';
  const noun = total === 1 ? itemLabel : `${itemLabel}s`;
  return (
    <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3.5">
      {total !== undefined
        ? (
            <p className="text-sm text-slate-500">
              {count}
              {' '}
              {noun}
            </p>
          )
        : <span />}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 transition-all hover:bg-slate-50 disabled:opacity-40"
        >
          <FiChevronLeft className="h-4 w-4" />
        </button>
        <span className="px-2 text-sm text-slate-600">
          {page}
          {' '}
          /
          {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 transition-all hover:bg-slate-50 disabled:opacity-40"
        >
          <FiChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
