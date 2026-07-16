import type { Metadata } from 'next';
import MultipleVideoUpload from '@/components/dashboard/multiple-video-upload';

export const metadata: Metadata = {
  title: 'Xynexi Admin - Upload',
  description: 'Upload video files to Xynexi help center.',
};

const UploadPage = () => {
  return (
    <MultipleVideoUpload />
  );
};

export default UploadPage;
