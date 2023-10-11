import { SendHorizonal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputProps {
  isDisabled?: boolean;
}

const ChatInput = ({ isDisabled }: ChatInputProps) => {
  return (
    <div className='absolute bottom-0 left-0 w-full'>
      <div className='mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl'>
        <div className='relative flex h-full flex-1 items-stretch md:flex-col'>
          <div className='relative flex flex-col w-full flex-grow p-4'>
            <div className='relative'>
              <Textarea
                rows={1}
                maxRows={4}
                autoFocus
                onKeyDown={(e) => {}}
                placeholder='Enter your question...'
                className='resize-none pr-12 text-base py-3 scrollbar-thumb-purple scrollbar-thumb-rounded scrollbar-track-purple-lighter scrollbar-w-2 scrolling-touch'
              />

              <Button
                disabled={false}
                className='absolute bottom-1.5 right-[8px]'
                aria-label='send message'
                onClick={() => {}}
              >
                <SendHorizonal className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;