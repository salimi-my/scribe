import { Skeleton } from '@/components/ui/skeleton';

const FileCardSkeleton = () => {
  return (
    <li className='col-span-1 divide-y divide-gray-200 dark:divide-gray-600 rounded-lg bg-white dark:bg-gray-900 shadow transition hover:shadow-lg'>
      <div className='flex flex-col gap-2'>
        <div className='pt-6 px-6 flex w-full items-center justify-between space-x-6'>
          <Skeleton className='h-10 w-10 flex-shrink-0 rounded-full' />
          <div className='flex-1 truncate'>
            <div className='flex items-center space-x-3'>
              <Skeleton className='w-full h-7' />
            </div>
          </div>
        </div>
      </div>
      <div className='px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500 dark:text-zinc-300'>
        <Skeleton className='w-full h-8' />
        <Skeleton className='w-full h-8' />
        <Skeleton className='w-full h-8' />
      </div>
    </li>
  );
};

export default FileCardSkeleton;
