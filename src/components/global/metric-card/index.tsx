import type { FC } from 'react';
import Image from 'next/image';
import { useMemo } from 'react';
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from 'react-icons/io';

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: string;
  background_color: string;
}

export const MetricCard: FC<MetricCardProps> = ({
  title,
  value,
  icon,
}) => {
  const numericValue = useMemo(() => Number(value) || 0, [value]);
  const isPositive = numericValue > 0;

  return (
    <div className="flex w-full min-w-100 flex-col px-2 py-2 xs:w-1/2 md:w-1/3 lg:w-1/4">
      <div className="group relative h-full">
        <div
          className="relative flex h-full flex-col justify-between space-y-5 rounded-2xl border-2 border-primary-200 bg-linear-to-br from-white to-primary-50/30 px-6 py-6 shadow-xl shadow-primary-500/10 transition-all duration-300 hover:scale-[1.03] hover:border-primary-300 hover:shadow-2xl hover:shadow-primary-500/20"
        >
          <div className="absolute top-0 right-0 left-0 h-1.5 rounded-t-2xl bg-linear-to-r from-primary-600 via-primary-500 to-primary-600" />

          <div className="relative">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/30">
              <Image
                width={100}
                height={100}
                className="relative z-10 h-7 w-7"
                src={icon}
                alt="icon"
                style={{
                  filter: 'brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)',
                }}
              />
            </div>
          </div>

          <div className="relative">
            <h4 className="font-rubik text-3xl font-bold text-primary-700 md:text-4xl">
              {value}
            </h4>
          </div>

          <div className="relative flex w-full items-end justify-between gap-3 border-t-2 border-primary-200 pt-3">
            <h1 className="flex-1 font-rubik text-sm leading-tight font-bold text-slate-700">
              {title}
            </h1>

            <div className="flex items-center gap-1 rounded-lg border-2 border-primary-300 bg-linear-to-br from-primary-100 to-primary-200 px-3 py-1.5">
              {isPositive
                ? (
                    <IoIosArrowRoundUp className="text-xl text-success" />
                  )
                : (
                    <IoIosArrowRoundDown className="text-xl text-error" />
                  )}
              <p
                className="text-sm font-bold"
                style={{ color: isPositive ? '#059669' : '#dc2626' }}
              >
                {Math.abs(numericValue)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
