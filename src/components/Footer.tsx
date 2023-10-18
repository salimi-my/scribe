const Footer = () => {
  return (
    <div className='w-full border-t border-gray-200 dark:border-gray-800 bg-transparent dark:bg-gray-900/30 backdrop-blur-lg transition-all'>
      <div className='mx-8 flex h-14 justify-center items-center'>
        <small className='text-muted-foreground'>
          Created by{' '}
          <a
            className='hover:underline hover:text-primary'
            href='https://www.salimi.my/'
            aria-label='Salimi'
            target='_blank'
            rel='noreferrer'
          >
            Salimi
          </a>{' '}
          &copy; {new Date().getFullYear()}. All right reserved.
        </small>
      </div>
    </div>
  );
};

export default Footer;
