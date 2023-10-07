import { notFound, redirect } from 'next/navigation';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

import { db } from '@/db';

interface FilePageProps {
  params: {
    fileId: string;
  };
}

const FilePage = async ({ params }: FilePageProps) => {
  const { fileId } = params;

  const { getUser } = getKindeServerSession();
  const user = getUser();

  if (!user || !user.id) {
    redirect(`/auth-callback?origin=dashboard/${fileId}`);
  }

  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId: user.id
    }
  });

  if (!file) {
    notFound();
  }

  return <div>{fileId}</div>;
};

export default FilePage;
