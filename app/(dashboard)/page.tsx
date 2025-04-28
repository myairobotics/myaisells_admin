import ChartPage from "@/components/ui/ChartPage";

export default function Home() {
  return (
    <div className='w-full h-full flex flex-col overflow-x-hidden overflow-y-auto'>
      <div className='py-3 mx-2 md:mx-4 border-b-[1px] border-b-gray-200 flex flex-col lg:flex-row lg:items-center justify-between space-y-2 lg:space-y-0'>
        <div className='flex flex-col'>
          <h1 className='font-semibold text-xl'>Hello, Admin!</h1>
          <p className='text-gray-600 font-light text-sm'>
            Here’s an overview of MyaiSells performance in the last 7 days
          </p>
        </div>
      </div>
      <ChartPage />
    </div>
  );
}
