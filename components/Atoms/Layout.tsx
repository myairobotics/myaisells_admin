"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Input from "./Input";
import Logo from "./Logo";
import { LuChevronsUpDown, LuSearch } from "react-icons/lu";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { FaBell } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import { MdLogout } from "react-icons/md";
import { usePathname } from "next/navigation";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [BusinessDropDownOptions, setBusinessDropDownOptions] = useState<any[]>(
    []
  );

  // Add the type for the ref here
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropDownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const Tab = ({
    name,
    link,
    isSubTab,
    relatedLinks = [],
    activeIcon,
    inactiveIcon,
  }: {
    name: string;
    link: string;
    isSubTab?: boolean;
    relatedLinks?: string[];
    activeIcon?: string;
    inactiveIcon?: string;
  }) => {
    const isActive =
      link === "/"
        ? pathname === "/"
        : pathname?.startsWith(link) ||
          relatedLinks?.some((relatedLink) =>
            pathname?.startsWith(relatedLink)
          );

    const tabClass = isActive
      ? `bg-[#D9E5FF] text-[#1B1D2D] rounded-full px-4 py-4`
      : `bg-transparent text-[#8182A1] rounded-xl px-4 py-4`;

    return (
      <Link
        href={link}
        className={`w-full cursor-pointer font-semibold shrink-0 my-1 flex items-center gap-4 ${tabClass}`}
      >
        {activeIcon && inactiveIcon && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "transparent",
            }}
          >
            <img
              src={`/assets/${inactiveIcon}`}
              alt={`${name} icon`}
              style={{
                width: "24px",
                height: "24px",
                filter: isActive
                  ? "brightness(0) saturate(100%) invert(55%) sepia(70%) saturate(400%) hue-rotate(180deg) brightness(95%) contrast(85%)"
                  : "brightness(0) saturate(100%) invert(63%) sepia(0%) saturate(3%) hue-rotate(208deg) brightness(90%) contrast(89%)",
              }}
            />
          </div>
        )}
        <h1>{name}</h1>
      </Link>
    );
  };

  const {
    register,
    control,
    formState: { errors },
  } = useForm();

  return (
    <div className='bg-[#F9FBFF] transition-all ease-in-out scroll-smooth container mx-auto'>
      {/* Top Navigation Menu */}
      <div className='flex items-center justify-between py-2 px-3.5 md:px-7 border-b w-full h-[70px] bg-[#F9FBFF] z-[90] fixed top-0 container mx-auto'>
        <Logo />
        <div className='w-[40%] hidden md:block'>
          <Controller
            name='search_text'
            control={control}
            render={({ field }) => (
              <div>
                <div className='p-2 mt-0 flex flex-row items-center form-input w-full rounded-xl py-3 text-lightblack bg-skygray border-[2px]'>
                  <LuSearch className='text-xl text-gray-500' />
                  <input
                    id='search_text'
                    placeholder='Search anything that comes to mind'
                    required
                    type='search'
                    className='w-full outline-none bg-transparent text-gray-600 mx-2 placeholder:text-gray-400'
                  />
                </div>
              </div>
            )}
          />
        </div>
        <div className='h-[40px] w-[40px] cursor-pointer rounded-xl bg-lightBlue shrink-0 flex items-center justify-center md:hidden'>
          <HiOutlineMenuAlt1 className='text-2xl text-white' />
        </div>
        <div
          onClick={() => setIsDropDownOpen(!isDropDownOpen)}
          className='flex-row items-center gap-[16px] hidden md:flex'
        >
          <FaBell className='text-xl' />
          <div className='flex flex-row items-center gap-[30px] cursor-pointer'>
            <div className='flex flex-row items-center'>
              <img
                className='rounded-full w-[30px] h-[30px] object-cover'
                src={"/assets/placeholder.jpg"}
                alt='logo'
              />
              <div className='relative inline-block text-left'>
                <button
                  type='button'
                  className='inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-medium text-gray-900 ring-gray-300'
                >
                  Myai Sells
                </button>
                {isDropDownOpen && (
                  <div ref={dropdownRef} className='flex justify-center'>
                    <div
                      className='absolute z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
                      role='menu'
                      aria-orientation='vertical'
                      aria-labelledby='menu-button'
                      tabIndex={-1}
                    >
                      {BusinessDropDownOptions?.map((option, index) => (
                        <div
                          key={index}
                          className='flex items-center justify-start space-x-2 py-2 mx-4'
                        >
                          <img
                            className='rounded-full w-[30px] h-[30px] object-cover'
                            src={option?.logo || "/assets/placeholder.jpg"}
                            alt='logo'
                          />
                          <span
                            id={option.id}
                            className='text-gray-700 block py-2 text-sm whitespace-nowrap'
                            role='menuitem'
                            tabIndex={-1}
                            onClick={() => {
                              setIsDropDownOpen(false);
                            }}
                          >
                            {option.name}
                          </span>
                        </div>
                      ))}
                      <div className='flex justify-start items-center space-x-2 py-2 mx-4'>
                        <MdLogout size={22} color='gray' />
                        <button
                          onClick={() => {}}
                          type='button'
                          className='text-gray-700 flex items-center justify-center py-2 text-sm'
                          role='menuitem'
                          tabIndex={-1}
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <span
              id='menu-button'
              aria-expanded={isDropDownOpen}
              aria-haspopup='true'
            >
              <LuChevronsUpDown className='text-gray-500 text-lg cursor-pointer' />
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Content */}
      <div className='flex justify-between mt-[70px] w-full bg-[#F9FBFF]'>
        {/* Side Navigation */}
        <div className='h-[calc(100vh-70px)] w-[300px] overflow-y-auto hidden md:flex border-r-[1px] border-r-gray-200 duration-300 flex-col shrink-0 px-3 pt-10 pb-2 fixed top-[70px] bg-[#F9FBFF] z-[90]'>
          <Tab
            name='Dashboard'
            link='/'
            inactiveIcon='dashboard.svg'
            activeIcon='dashboard_active.png'
          />
        </div>

        <div className='flex-1 w-full md:w-[calc(100vw-300px)] h-[calc(100vh-70px)] md:ml-[300px] overflow-hidden'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
