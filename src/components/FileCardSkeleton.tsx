import { Skeleton } from '@/components/ui/skeleton';

const FileCardSkeleton = () => {
  return (
    <li className='col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg'>
      <div className='flex flex-col gap-2'>
        <div className='pt-6 px-6 flex w-full items-center justify-between space-x-6'>
          <Skeleton className='h-10 w-10 flex-shrink-0 rounded-full bg-zinc-900/10' />
          <div className='flex-1 truncate'>
            <div className='flex items-center space-x-3'>
              <Skeleton className='w-full h-7 bg-zinc-900/10' />
            </div>
          </div>
        </div>
      </div>
      <div className='px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500'>
        <Skeleton className='w-full h-8 bg-zinc-900/10' />
        <Skeleton className='w-full h-8 bg-zinc-900/10' />
        <Skeleton className='w-full h-8 bg-zinc-900/10' />
      </div>
    </li>
  );
};

export default FileCardSkeleton;
