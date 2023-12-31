'use client';

import { useState } from 'react';
import Dropzone from 'react-dropzone';
import { useRouter } from 'next/navigation';
import { File, Loader2, UploadCloud } from 'lucide-react';

import { trpc } from '@/app/_trpc/client';
import { useUploadThing } from '@/lib/uploadThing';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

const UploadDropzone = ({ isSubscribed }: { isSubscribed: boolean }) => {
  const router = useRouter();

  const [isUploading, setIsUploading] = useState<boolean>(true);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const { toast } = useToast();

  const { startUpload } = useUploadThing(
    isSubscribed ? 'proPlanUploader' : 'freePlanUploader'
  );

  const { mutate: startPolling } = trpc.getFile.useMutation({
    onSuccess: (file) => {
      router.push(`/dashboard/${file.id}`);
    },
    retry: true,
    retryDelay: 500
  });

  const startSimulatedProgress = () => {
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(interval);
          return prevProgress;
        }
        return prevProgress + 5;
      });
    }, 500);

    return interval;
  };

  return (
    <Dropzone
      multiple={false}
      onDrop={async (acceptedFile) => {
        if (acceptedFile[0].type !== 'application/pdf') {
          return toast({
            title: 'File type error',
            description: 'Please upload only document in pdf format',
            variant: 'destructive'
          });
        }

        setIsUploading(true);

        const progressInterval = startSimulatedProgress();

        // Handle file uploading
        const res = await startUpload(acceptedFile);

        if (!res) {
          return toast({
            title: 'Something went wrong',
            description: 'Please try again later',
            variant: 'destructive'
          });
        }

        const [fileResponse] = res;
        const key = fileResponse?.key;

        if (!key) {
          return toast({
            title: 'Something went wrong',
            description: 'Please try again later',
            variant: 'destructive'
          });
        }

        clearInterval(progressInterval);
        setUploadProgress(100);

        startPolling({ key });
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className='border h-64 m-4 border-dashed border-gray-300 dark:border-gray-600 rounded-lg'
        >
          <div className='flex items-center justify-center h-full w-full'>
            <div className='flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800'>
              <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                <UploadCloud className='h-6 w-6 text-zinc-500 dark:text-gray-300 mb-2' />
                <p className='mb-2 text-sm text-zinc-700 dark:text-gray-400'>
                  <span className='font-semibold'>Click to upload</span> or drag
                  and drop
                </p>
                <p className='text-xs text-zinc-500 dark:text-gray-400'>
                  PDF (up to {isSubscribed ? '16' : '4'}MB)
                </p>
              </div>

              {acceptedFiles && acceptedFiles[0] && (
                <div className='max-w-xs bg-white dark:bg-gray-900 flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 dark:outline-gray-600 divide-x divide-zinc-200 dark:divide-gray-600'>
                  <div className='px-3 py-2 h-full grid place-items-center'>
                    <File className='h-4 w-4 text-primary' />
                  </div>
                  <div className='px-3 py-2 h-full text-sm truncate'>
                    {acceptedFiles[0].name}
                  </div>
                </div>
              )}

              {isUploading && (
                <div className='w-full mt-4 max-w-xs mx-auto'>
                  <Progress
                    indicatorColor={
                      uploadProgress === 100 ? 'bg-green-500' : ''
                    }
                    value={uploadProgress}
                    className='h-1 w-full bg-zinc-200 dark:bg-gray-600'
                  />
                  {uploadProgress === 100 && (
                    <div className='flex gap-1 items-center justify-center text-sm text-zinc-700 dark:text-gray-300 text-center pt-2'>
                      <Loader2 className='h-3 w-3 animate-spin' />
                      Redirecting...
                    </div>
                  )}
                </div>
              )}

              <input {...getInputProps()} type='file' className='hidden' />
            </div>
          </div>
        </div>
      )}
    </Dropzone>
  );
};

export default UploadDropzone;
