import Image from "next/image";
import { FC } from "react";
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: string;
  background_color: string;
}

export const MetricCard: FC<MetricCardProps> = ({
  title,
  value,
  icon,
  background_color,
}) => {
  return (
    <div className='flex flex-col w-full xs:w-1/2 md:w-1/3 lg:w-1/4 px-2 py-2'>
      <div
        className='py-6 px-4 space-y-4 rounded-xl flex flex-col justify-between shadow-md transition-transform hover:scale-100'
        style={{ backgroundColor: background_color }}
      >
        {/* Icon */}
        <Image
          width={100}
          height={100}
          className='w-6 h-6 xl:w-8 xl:h-8'
          src={icon}
          alt='icon'
        />

        {/* Value */}
        <h4 className='text-base sm:text-lg font-semibold font-rubik text-left px-1'>
          {value}
        </h4>

        {/* Title and Growth */}
        <div className='flex flex-row w-full justify-between mt-4'>
          <h1 className='text-secondary font-medium font-rubik text-sm sm:text-base'>
            {title}
          </h1>
          <div className='flex items-center sm:justify-end text-sm font-rubik sm:mt-0'>
            {Number(value || 0) > 0 ? (
              <IoIosArrowRoundUp className='text-green-500 text-lg sm:text-xl' />
            ) : (
              <IoIosArrowRoundDown className='text-red-500 text-lg sm:text-xl' />
            )}
            <p
              className='ml-1'
              style={{ color: Number(value || 0) > 0 ? "green" : "red" }}
            >
              {Number(value || 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
