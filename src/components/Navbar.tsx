import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import {
  RegisterLink,
  LoginLink,
  getKindeServerSession
} from '@kinde-oss/kinde-auth-nextjs/server';

import MobileNav from '@/components/MobileNav';
import { ModeToggle } from '@/components/ModeToggle';
import { buttonVariants } from '@/components/ui/button';
import UserAccountNav from '@/components/UserAccountNav';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';

const Navbar = () => {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  return (
    <nav className='sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 dark:border-gray-800 bg-white/75 dark:bg-gray-900 backdrop-blur-lg transition-all'>
      <MaxWidthWrapper>
        <div className='flex h-14 items-center justify-between border-b border-gray-200 dark:border-gray-800'>
          <Link href='/' className='flex items-center z-40 font-semibold'>
            <Image
              src='/scribe-logo.png'
              alt='scribe logo'
              width={32}
              height={32}
              className='mr-3'
            />
            <span>Scribe</span>
          </Link>

          <MobileNav isAuth={!!user} />

          <div className='hidden items-center space-x-4 sm:flex'>
            {user && (
              <>
                <Link
                  href='/dashboard'
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm'
                  })}
                >
                  Dashboard
                </Link>
                <ModeToggle />
                <UserAccountNav
                  name={
                    !user.given_name || !user.family_name
                      ? 'Your Account'
                      : `${user.given_name} ${user.family_name}`
                  }
                  email={user.email ?? ''}
                  imageUrl={user.picture ?? ''}
                />
              </>
            )}
            {!user && (
              <>
                <Link
                  href='/pricing'
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm'
                  })}
                >
                  Pricing
                </Link>
                <LoginLink
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm'
                  })}
                >
                  Sign in
                </LoginLink>
                <ModeToggle />
                <RegisterLink
                  className={buttonVariants({
                    size: 'sm'
                  })}
                >
                  Get started <ArrowRight className='ml-1.5 h-5 w-5' />
                </RegisterLink>
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
