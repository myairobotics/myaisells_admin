import PartnerDetail from '@/components/dashboard/partners/PartnerDetail';

type PartnerDetailPageProps = {
  params: Promise<{ id: string }>;
};

const PartnerDetailPage = async ({ params }: PartnerDetailPageProps) => {
  const { id } = await params;

  return (
    <PartnerDetail partnerId={id} />
  );
};

export default PartnerDetailPage;
