import { format } from 'date-fns';
import { forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';

import { cn } from '@/lib/utils';
import { Icons } from '@/components/Icons';
import { ExtendedMessage } from '@/types/message';

interface MessageProps {
  message: ExtendedMessage;
  isNextMessageSamePerson: boolean;
}

const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ message, isNextMessageSamePerson }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-end', {
          'justify-end': message.isUserMessage
        })}
      >
        <div
          className={cn(
            'relative flex h-6 w-6 aspect-square items-center justify-center',
            {
              'order-2 bg-primary rounded-sm': message.isUserMessage,
              'order-1 bg-zinc-800 dark:bg-gray-700 rounded-sm':
                !message.isUserMessage,
              invisible: isNextMessageSamePerson
            }
          )}
        >
          {message.isUserMessage && (
            <Icons.user className='text-zinc-200 h-4 w-4' />
          )}
          {!message.isUserMessage && (
            <Icons.logo className='text-zinc-200 h-4 w-4' />
          )}
        </div>

        <div
          className={cn('flex flex-col space-y-2 text-base max-w-md mx-2', {
            'order-1 items-end': message.isUserMessage,
            'order-2 items-start': !message.isUserMessage
          })}
        >
          <div
            className={cn('px-4 py-2 rounded-lg inline-block', {
              'bg-primary text-white': message.isUserMessage,
              'bg-gray-200 text-gray-900': !message.isUserMessage,
              'rounded-br-none':
                !isNextMessageSamePerson && message.isUserMessage,
              'rounded-bl-none':
                !isNextMessageSamePerson && !message.isUserMessage
            })}
          >
            {typeof message.text === 'string' && (
              <ReactMarkdown
                className={cn('prose', {
                  'text-zinc-50': message.isUserMessage
                })}
              >
                {message.text}
              </ReactMarkdown>
            )}
            {typeof message.text !== 'string' && message.text}
            {message.id !== 'loading-message' && (
              <div
                className={cn('text-xs select-none mt-2 w-full text-right', {
                  'text-zinc-500': !message.isUserMessage,
                  'text-white/50': message.isUserMessage
                })}
              >
                {format(new Date(message.createdAt), 'dd MMM yy hh:mm aaa')}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

Message.displayName = 'Message';

export default Message;
