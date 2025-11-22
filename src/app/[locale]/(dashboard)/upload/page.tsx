import type { Metadata } from 'next';
import MultipleVideoUpload from '@/components/dashboard/multiple-video-upload';

export const metadata: Metadata = {
  title: 'MyaiSells Admin - Upload',
  description: 'Upload video files to MyaiSells help center.',
};

const UploadPage = () => {
  return (
    <MultipleVideoUpload />
  );
};

export default UploadPage;
