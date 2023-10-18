import { useIntersection } from '@mantine/hooks';
import { useContext, useEffect, useRef } from 'react';
import { Loader2, MessageSquare } from 'lucide-react';

import { trpc } from '@/app/_trpc/client';
import Message from '@/components/chat/Message';
import { Skeleton } from '@/components/ui/skeleton';
import { ChatContext } from '@/app/context/chat-context';
import { INFINITE_QUERY_LIMIT } from '@/config/infinite-query';

interface MessagesProps {
  fileId: string;
}

const Messages = ({ fileId }: MessagesProps) => {
  const { isLoading: isAiThinking } = useContext(ChatContext);

  const { data, isLoading, fetchNextPage } =
    trpc.getFileMessages.useInfiniteQuery(
      {
        fileId,
        limit: INFINITE_QUERY_LIMIT
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        keepPreviousData: true
      }
    );

  const messages = data?.pages.flatMap((page) => page.messages);

  const loadingMessage = {
    createdAt: new Date().toISOString(),
    id: 'loading-message',
    isUserMessage: false,
    text: (
      <span className='flex h-full items-center justify-center'>
        <Loader2 className='h-4 w-4 animate-spin' />
      </span>
    )
  };

  const combinedMessages = [
    ...(isAiThinking ? [loadingMessage] : []),
    ...(messages ?? [])
  ];

  const lastMessageRef = useRef<HTMLDivElement>(null);

  const { ref, entry } = useIntersection({
    root: lastMessageRef.current,
    threshold: 1
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  return (
    <div className='w-full flex max-h-[calc(100vh-3.5rem-7rem)] border-zinc-200 flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-purple scrollbar-thumb-rounded scrollbar-track-purple-lighter scrollbar-w-2 scrolling-touch'>
      {combinedMessages &&
        combinedMessages.length > 0 &&
        combinedMessages.map((message, i) => {
          const isNextMessageSamePerson =
            combinedMessages[i - 1]?.isUserMessage ===
            combinedMessages[i]?.isUserMessage;

          if (i === combinedMessages.length - 1) {
            return (
              <Message
                ref={ref}
                key={message.id}
                message={message}
                isNextMessageSamePerson={isNextMessageSamePerson}
              />
            );
          } else {
            return (
              <Message
                key={message.id}
                message={message}
                isNextMessageSamePerson={isNextMessageSamePerson}
              />
            );
          }
        })}

      {!(combinedMessages && combinedMessages.length > 0) &&
        isLoading &&
        [...Array(8)].map((_, index) => (
          <div key={index}>
            <div className='flex items-end justify-end mb-4'>
              <Skeleton className='relative flex h-6 w-6 aspect-square items-center justify-center order-2 rounded-sm' />
              <Skeleton className='flex flex-col space-y-2 min-w-[300px] mx-2 order-1 items-end h-24 rounded-br-none' />
            </div>
            <div className='flex items-end'>
              <Skeleton className='relative flex h-6 w-6 aspect-square items-center justify-center order-1 rounded-sm' />
              <Skeleton className='flex flex-col space-y-2 min-w-[300px] mx-2 order-1 items-end h-24 rounded-bl-none' />
            </div>
          </div>
        ))}

      {!(combinedMessages && combinedMessages.length > 0) && !isLoading && (
        <div className='flex-1 flex flex-col items-center justify-center gap-2'>
          <MessageSquare className='h-8 w-8 text-primary' />
          <h3 className='font-semibold text-xl'>You&apos;re all set!</h3>
          <p className='text-zinc-500 dark:text-gray-400 text-sm'>
            Ask your first question to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default Messages;
