'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowRight, Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';

const MobileNav = ({ isAuth }: { isAuth: boolean }) => {
  const [isOpen, setOpen] = useState<boolean>(false);

  const toggleOpen = () => setOpen((prev) => !prev);

  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      toggleOpen();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const closeOnCurrent = (href: string) => {
    if (pathname === href) {
      toggleOpen();
    }
  };

  return (
    <div className='sm:hidden'>
      <Button onClick={toggleOpen} variant='ghost' size='icon'>
        <Menu className='relative z-50 h-5 w-5 text-zinc-700' />
      </Button>

      {isOpen && (
        <div className='fixed animate-in slide-in-from-top-5 fade-in-20 inset-0 z-0 w-full'>
          <ul className='absolute bg-white border-b border-zinc-200 shadow-xl grid w-full gap-1 px-10 pt-20 pb-8'>
            {!isAuth ? (
              <>
                <li className='py-1 px-2 rounded-md hover:bg-gray-100'>
                  <Link
                    onClick={() => closeOnCurrent('/sign-up')}
                    className='flex items-center w-full font-semibold text-primary'
                    href='/sign-up'
                  >
                    Get started
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Link>
                </li>
                <li className='my-1 h-px w-full bg-gray-300' />
                <li className='py-1 px-2 rounded-md hover:bg-gray-100'>
                  <Link
                    onClick={() => closeOnCurrent('/sign-in')}
                    className='flex items-center w-full font-semibold'
                    href='/sign-in'
                  >
                    Sign in
                  </Link>
                </li>
                <li className='my-1 h-px w-full bg-gray-300' />
                <li className='py-1 px-2 rounded-md hover:bg-gray-100'>
                  <Link
                    onClick={() => closeOnCurrent('/pricing')}
                    className='flex items-center w-full font-semibold'
                    href='/pricing'
                  >
                    Pricing
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className='py-1 px-2 rounded-md hover:bg-gray-100'>
                  <Link
                    onClick={() => closeOnCurrent('/dashboard')}
                    className='flex items-center w-full font-semibold'
                    href='/dashboard'
                  >
                    Dashboard
                  </Link>
                </li>
                <li className='my-1 h-px w-full bg-gray-300' />
                <li className='py-1 px-2 rounded-md hover:bg-gray-100'>
                  <Link
                    className='flex items-center w-full font-semibold'
                    href='/sign-out'
                  >
                    Sign out
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MobileNav;
