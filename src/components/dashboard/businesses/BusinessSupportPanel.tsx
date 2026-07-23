'use client';

import { Badge, EmptyState, FormField, Modal, SidePanel, Skeleton } from '@myairobotics/ui';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  FiAlertTriangle,
  FiBookOpen,
  FiClock,
  FiFileText,
  FiGlobe,
  FiHeadphones,
  FiHelpCircle,
  FiPlus,
  FiRefreshCw,
  FiShoppingBag,
  FiTag,
  FiTrash2,
  FiUsers,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import {
  useCreateBusinessDepartmentMutation,
  useCreateBusinessProductExpertMutation,
  useCreateBusinessProductMutation,
  useCreateBusinessSalesCampaignMutation,
  useCreateBusinessSupportInfoMutation,
  useCreateBusinessTextContentMutation,
  useDeleteBusinessDepartmentMutation,
  useDeleteBusinessFaqMutation,
  useDeleteBusinessFolderMutation,
  useDeleteBusinessKnowledgeBaseSourceMutation,
  useDeleteBusinessProductExpertMutation,
  useDeleteBusinessProductMutation,
  useDeleteBusinessSalesCampaignMutation,
  useDeleteBusinessSupportInfoMutation,
  useDeleteBusinessTextContentMutation,
  useGetBusinessAgentLanguageQuery,
  useGetBusinessDepartmentsQuery,
  useGetBusinessFaqsQuery,
  useGetBusinessFoldersQuery,
  useGetBusinessKnowledgeBaseQuery,
  useGetBusinessProductExpertsQuery,
  useGetBusinessProductsQuery,
  useGetBusinessSalesCampaignsQuery,
  useGetBusinessSupportInfosQuery,
  useGetBusinessSupportProfileQuery,
  useGetBusinessTextContentsQuery,
  useGetBusinessWorkingHoursQuery,
  useRescrapeBusinessKnowledgeBaseSourceMutation,
  useToggleBusinessWorkingHoursDayMutation,
  useUpdateBusinessAgentLanguageMutation,
} from '@/services';

type Tab = 'profile' | 'faqs' | 'support-info' | 'departments' | 'product-experts' | 'products' | 'sales-campaigns' | 'folders' | 'text-contents' | 'knowledge-base' | 'working-hours' | 'language';

const TABS: { value: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'profile', label: 'Profile', icon: FiFileText },
  { value: 'faqs', label: 'FAQs', icon: FiHelpCircle },
  { value: 'support-info', label: 'Support Info', icon: FiHeadphones },
  { value: 'departments', label: 'Departments', icon: FiUsers },
  { value: 'product-experts', label: 'Product Experts', icon: FiUsers },
  { value: 'products', label: 'Products', icon: FiShoppingBag },
  { value: 'sales-campaigns', label: 'Promotions', icon: FiTag },
  { value: 'folders', label: 'Folders', icon: FiBookOpen },
  { value: 'text-contents', label: 'Text Content', icon: FiFileText },
  { value: 'knowledge-base', label: 'Knowledge Base', icon: FiGlobe },
  { value: 'working-hours', label: 'Working Hours', icon: FiClock },
  { value: 'language', label: 'Agent Language', icon: FiGlobe },
];

/* ─── Shared: delete-with-reason ──────────────────────────────────────
 * Every DELETE on the business-support API is a "restricted action" that
 * requires a non-empty reason (confirmed against the live API). */

function DeleteReasonModal({ open, itemLabel, onClose, onConfirm, isLoading }: {
  open: boolean;
  itemLabel: string;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading: boolean;
}) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<{ reason: string }>();

  const submit = (values: { reason: string }) => {
    onConfirm(values.reason);
    reset();
  };

  return (
    <Modal open={open} onOpenChange={o => !o && onClose()} title={`Delete ${itemLabel}`} className="max-w-sm">
      <form onSubmit={handleSubmit(submit)} className="mt-1 space-y-4">
        <p className="text-sm text-slate-600">This action is audit-logged and cannot be undone.</p>
        <FormField
          label="Reason"
          id="delete_reason"
          placeholder="Why is this being deleted?"
          error={errors.reason ? 'Required' : undefined}
          {...register('reason', { required: true })}
        />
        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
          <button type="submit" disabled={isLoading} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
            {isLoading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

type DeleteMutationTrigger = (args: { businessId: string; id: string; reason: string }) => { unwrap: () => Promise<unknown> };

function useDeleteWithReason(deleteFn: DeleteMutationTrigger) {
  const [target, setTarget] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const confirm = async (businessId: string, reason: string) => {
    if (!target) {
      return;
    }
    setIsLoading(true);
    try {
      await deleteFn({ businessId, id: target, reason }).unwrap();
      toast.success('Deleted');
    } catch {
      toast.error('Failed to delete');
    } finally {
      setIsLoading(false);
      setTarget(null);
    }
  };

  return { target, setTarget, isLoading, confirm };
}

/* ─── Profile ──────────────────────────────────────────────────────── */

function ProfileTab({ businessId }: { businessId: string }) {
  const { data, isLoading } = useGetBusinessSupportProfileQuery(businessId);
  if (isLoading) {
    return <Skeleton width="100%" height={200} borderRadius={12} />;
  }
  const profile = data;
  if (!profile) {
    return <EmptyState icon={<FiFileText />} message="Profile not available" />;
  }
  const rows: { label: string; value: string }[] = [
    { label: 'Business Name', value: profile.name },
    { label: 'Business Email', value: profile.business_email },
    { label: 'Phone', value: profile.phone || 'N/A' },
    { label: 'Website', value: profile.website || 'N/A' },
    { label: 'Address', value: profile.address || 'N/A' },
    { label: 'Country', value: profile.country || 'N/A' },
    { label: 'Offering', value: profile.offering || 'N/A' },
    { label: 'Description', value: profile.description || 'N/A' },
    { label: 'Year Founded', value: profile.year_founded ? String(profile.year_founded) : 'N/A' },
    { label: 'Tag', value: profile.tag },
  ];
  return (
    <div className="space-y-2">
      {rows.map(r => (
        <div key={r.label} className="flex items-start justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2.5 text-sm">
          <span className="shrink-0 text-slate-500">{r.label}</span>
          <span className="text-right font-medium text-slate-800">{r.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── FAQs ─────────────────────────────────────────────────────────── */

function FaqsTab({ businessId }: { businessId: string }) {
  const { data, isLoading } = useGetBusinessFaqsQuery(businessId);
  const [deleteFaq, { isLoading: isDeleting }] = useDeleteBusinessFaqMutation();
  const { target, setTarget, confirm } = useDeleteWithReason(deleteFaq);
  const faqs = data ?? [];

  if (isLoading) {
    return <Skeleton width="100%" height={200} borderRadius={12} />;
  }
  if (faqs.length === 0) {
    return <EmptyState icon={<FiHelpCircle />} message="No FAQs on file" />;
  }

  return (
    <div className="space-y-2">
      {faqs.map(f => (
        <div key={f.id} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-slate-800">{f.question}</p>
            <button type="button" onClick={() => setTarget(f.id)} className="shrink-0 rounded p-1 text-red-500 hover:bg-red-50">
              <FiTrash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="mt-1 text-xs text-slate-500">{f.answer}</p>
        </div>
      ))}
      <DeleteReasonModal open={target !== null} itemLabel="FAQ" isLoading={isDeleting} onClose={() => setTarget(null)} onConfirm={reason => confirm(businessId, reason)} />
    </div>
  );
}

/* ─── Support Info ─────────────────────────────────────────────────── */

function CreateSupportInfoForm({ businessId, onClose }: { businessId: string; onClose: () => void }) {
  const [create, { isLoading }] = useCreateBusinessSupportInfoMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<{ phone: string; email: string; live_chat?: boolean; ticket_system?: boolean }>();

  const onSubmit = async (values: { phone: string; email: string; live_chat?: boolean; ticket_system?: boolean }) => {
    try {
      await create({ businessId, body: values }).unwrap();
      toast.success('Support info added');
      onClose();
    } catch {
      toast.error('Failed to add support info');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-1 space-y-4">
      <FormField label="Phone" id="si_phone" error={errors.phone ? 'Required' : undefined} {...register('phone', { required: true })} />
      <FormField label="Email" id="si_email" type="email" error={errors.email ? 'Required' : undefined} {...register('email', { required: true })} />
      <label className="flex items-center gap-2 text-sm text-slate-600">
        <input type="checkbox" {...register('live_chat')} />
        Live chat enabled
      </label>
      <label className="flex items-center gap-2 text-sm text-slate-600">
        <input type="checkbox" {...register('ticket_system')} />
        Ticketing system enabled
      </label>
      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
        <button type="submit" disabled={isLoading} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60">
          {isLoading ? 'Saving…' : 'Add'}
        </button>
      </div>
    </form>
  );
}

function SupportInfoTab({ businessId }: { businessId: string }) {
  const { data, isLoading } = useGetBusinessSupportInfosQuery(businessId);
  const [deleteInfo, { isLoading: isDeleting }] = useDeleteBusinessSupportInfoMutation();
  const { target, setTarget, confirm } = useDeleteWithReason(deleteInfo);
  const [showCreate, setShowCreate] = useState(false);
  const infos = data ?? [];

  if (isLoading) {
    return <Skeleton width="100%" height={200} borderRadius={12} />;
  }

  return (
    <div className="space-y-2">
      <button type="button" onClick={() => setShowCreate(true)} className="mb-1 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50">
        <FiPlus className="h-3.5 w-3.5" />
        Add Support Contact
      </button>
      {infos.length === 0
        ? <EmptyState icon={<FiHeadphones />} message="No support contact info on file" />
        : infos.map(s => (
            <div key={s.id} className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2.5">
              <div>
                <p className="text-sm font-semibold text-slate-800">{s.phone}</p>
                <p className="text-xs text-slate-500">{s.email}</p>
                <div className="mt-1 flex gap-1">
                  {s.live_chat && <Badge variant="rounded" className="bg-sky-100 text-sky-700">Live Chat</Badge>}
                  {s.ticket_system && <Badge variant="rounded" className="bg-violet-100 text-violet-700">Ticketing</Badge>}
                </div>
              </div>
              <button type="button" onClick={() => setTarget(s.id)} className="rounded p-1 text-red-500 hover:bg-red-50">
                <FiTrash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
      <Modal open={showCreate} onOpenChange={o => !o && setShowCreate(false)} title="Add Support Contact" className="max-w-sm">
        <CreateSupportInfoForm businessId={businessId} onClose={() => setShowCreate(false)} />
      </Modal>
      <DeleteReasonModal open={target !== null} itemLabel="support contact" isLoading={isDeleting} onClose={() => setTarget(null)} onConfirm={reason => confirm(businessId, reason)} />
    </div>
  );
}

/* ─── Departments ──────────────────────────────────────────────────── */

function CreateDepartmentForm({ businessId, onClose }: { businessId: string; onClose: () => void }) {
  const [create, { isLoading }] = useCreateBusinessDepartmentMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<{ name: string; description: string }>();

  const onSubmit = async (values: { name: string; description: string }) => {
    try {
      await create({ businessId, body: values }).unwrap();
      toast.success('Department created');
      onClose();
    } catch {
      toast.error('Failed to create department');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-1 space-y-4">
      <FormField label="Name" id="dept_name" error={errors.name ? 'Required' : undefined} {...register('name', { required: true })} />
      <FormField label="Description" id="dept_description" error={errors.description ? 'Required' : undefined} {...register('description', { required: true })} />
      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
        <button type="submit" disabled={isLoading} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60">
          {isLoading ? 'Saving…' : 'Create'}
        </button>
      </div>
    </form>
  );
}

function DepartmentsTab({ businessId }: { businessId: string }) {
  const { data, isLoading } = useGetBusinessDepartmentsQuery(businessId);
  const [deleteDept, { isLoading: isDeleting }] = useDeleteBusinessDepartmentMutation();
  const { target, setTarget, confirm } = useDeleteWithReason(deleteDept);
  const [showCreate, setShowCreate] = useState(false);
  const departments = data ?? [];

  if (isLoading) {
    return <Skeleton width="100%" height={200} borderRadius={12} />;
  }

  return (
    <div className="space-y-2">
      <button type="button" onClick={() => setShowCreate(true)} className="mb-1 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50">
        <FiPlus className="h-3.5 w-3.5" />
        Add Department
      </button>
      {departments.length === 0
        ? <EmptyState icon={<FiUsers />} message="No departments configured" />
        : departments.map(d => (
            <div key={d.id} className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2.5">
              <div>
                <p className="text-sm font-semibold text-slate-800">{d.name}</p>
                <p className="text-xs text-slate-500">{d.description}</p>
              </div>
              <button type="button" onClick={() => setTarget(d.id)} className="rounded p-1 text-red-500 hover:bg-red-50">
                <FiTrash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
      <Modal open={showCreate} onOpenChange={o => !o && setShowCreate(false)} title="Add Department" className="max-w-sm">
        <CreateDepartmentForm businessId={businessId} onClose={() => setShowCreate(false)} />
      </Modal>
      <DeleteReasonModal open={target !== null} itemLabel="department" isLoading={isDeleting} onClose={() => setTarget(null)} onConfirm={reason => confirm(businessId, reason)} />
    </div>
  );
}

/* ─── Product Experts ──────────────────────────────────────────────── */

function CreateProductExpertForm({ businessId, onClose }: { businessId: string; onClose: () => void }) {
  const { data: deptData } = useGetBusinessDepartmentsQuery(businessId);
  const departments = deptData ?? [];
  const [create, { isLoading }] = useCreateBusinessProductExpertMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<{ fullname: string; email: string; position: string; department_id: string }>();

  const onSubmit = async (values: { fullname: string; email: string; position: string; department_id: string }) => {
    try {
      await create({ businessId, body: values }).unwrap();
      toast.success('Product expert added');
      onClose();
    } catch {
      toast.error('Failed to add product expert');
    }
  };

  if (departments.length === 0) {
    return <p className="text-sm text-slate-500">Add a department first. Product experts must belong to one.</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-1 space-y-4">
      <FormField label="Full Name" id="pe_fullname" error={errors.fullname ? 'Required' : undefined} {...register('fullname', { required: true })} />
      <FormField label="Email" id="pe_email" type="email" error={errors.email ? 'Required' : undefined} {...register('email', { required: true })} />
      <FormField label="Position" id="pe_position" error={errors.position ? 'Required' : undefined} {...register('position', { required: true })} />
      <FormField label="Department" id="pe_department_id">
        <select id="pe_department_id" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-500/20" {...register('department_id', { required: true })}>
          {departments.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </FormField>
      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
        <button type="submit" disabled={isLoading} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60">
          {isLoading ? 'Saving…' : 'Add'}
        </button>
      </div>
    </form>
  );
}

function ProductExpertsTab({ businessId }: { businessId: string }) {
  const { data, isLoading } = useGetBusinessProductExpertsQuery(businessId);
  const [deleteExpert, { isLoading: isDeleting }] = useDeleteBusinessProductExpertMutation();
  const { target, setTarget, confirm } = useDeleteWithReason(deleteExpert);
  const [showCreate, setShowCreate] = useState(false);
  const experts = data ?? [];

  if (isLoading) {
    return <Skeleton width="100%" height={200} borderRadius={12} />;
  }

  return (
    <div className="space-y-2">
      <button type="button" onClick={() => setShowCreate(true)} className="mb-1 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50">
        <FiPlus className="h-3.5 w-3.5" />
        Add Product Expert
      </button>
      {experts.length === 0
        ? <EmptyState icon={<FiUsers />} message="No product experts on file" />
        : experts.map(e => (
            <div key={e.id} className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2.5">
              <div>
                <p className="text-sm font-semibold text-slate-800">{e.fullname}</p>
                <p className="text-xs text-slate-500">
                  {e.position}
                  {' · '}
                  {e.email}
                </p>
              </div>
              <button type="button" onClick={() => setTarget(e.id)} className="rounded p-1 text-red-500 hover:bg-red-50">
                <FiTrash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
      <Modal open={showCreate} onOpenChange={o => !o && setShowCreate(false)} title="Add Product Expert" className="max-w-sm">
        <CreateProductExpertForm businessId={businessId} onClose={() => setShowCreate(false)} />
      </Modal>
      <DeleteReasonModal open={target !== null} itemLabel="product expert" isLoading={isDeleting} onClose={() => setTarget(null)} onConfirm={reason => confirm(businessId, reason)} />
    </div>
  );
}

/* ─── Products & Services ──────────────────────────────────────────── */

function CreateProductForm({ businessId, onClose }: { businessId: string; onClose: () => void }) {
  const [create, { isLoading }] = useCreateBusinessProductMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<{ name: string; description: string; price?: number }>();

  const onSubmit = async (values: { name: string; description: string; price?: number }) => {
    try {
      await create({ businessId, body: values }).unwrap();
      toast.success('Product created');
      onClose();
    } catch {
      toast.error('Failed to create product. This endpoint is currently returning a server error in this environment');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-1 space-y-4">
      <div className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-xs text-amber-700">
        <FiAlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>This endpoint currently returns a server error on creation regardless of input, verified 2026-07-20. The form is left in place for when that's fixed backend-side.</span>
      </div>
      <FormField label="Name" id="prod_name" error={errors.name ? 'Required' : undefined} {...register('name', { required: true })} />
      <FormField label="Description" id="prod_description" error={errors.description ? 'Required' : undefined} {...register('description', { required: true })} />
      <FormField label="Price" id="prod_price" type="number" step="0.01" {...register('price', { valueAsNumber: true })} />
      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
        <button type="submit" disabled={isLoading} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60">
          {isLoading ? 'Saving…' : 'Create'}
        </button>
      </div>
    </form>
  );
}

function ProductsTab({ businessId }: { businessId: string }) {
  const { data, isLoading } = useGetBusinessProductsQuery(businessId);
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteBusinessProductMutation();
  const { target, setTarget, confirm } = useDeleteWithReason(deleteProduct);
  const [showCreate, setShowCreate] = useState(false);
  const products = data ?? [];

  if (isLoading) {
    return <Skeleton width="100%" height={200} borderRadius={12} />;
  }

  return (
    <div className="space-y-2">
      <button type="button" onClick={() => setShowCreate(true)} className="mb-1 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50">
        <FiPlus className="h-3.5 w-3.5" />
        Add Product
      </button>
      {products.length === 0
        ? <EmptyState icon={<FiShoppingBag />} message="No products or services on file" />
        : products.map(p => (
            <div key={p.id} className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2.5">
              <div>
                <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                <p className="text-xs text-slate-500">{p.description}</p>
              </div>
              <button type="button" onClick={() => setTarget(p.id)} className="rounded p-1 text-red-500 hover:bg-red-50">
                <FiTrash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
      <Modal open={showCreate} onOpenChange={o => !o && setShowCreate(false)} title="Add Product" className="max-w-sm">
        <CreateProductForm businessId={businessId} onClose={() => setShowCreate(false)} />
      </Modal>
      <DeleteReasonModal open={target !== null} itemLabel="product" isLoading={isDeleting} onClose={() => setTarget(null)} onConfirm={reason => confirm(businessId, reason)} />
    </div>
  );
}

/* ─── Sales Campaigns ("Promotions") ───────────────────────────────── */

function CreateSalesCampaignForm({ businessId, onClose }: { businessId: string; onClose: () => void }) {
  const [create, { isLoading }] = useCreateBusinessSalesCampaignMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<{ name: string; discount_type: string; discount_value: number; start_date: string; end_date: string }>();

  const onSubmit = async (values: { name: string; discount_type: string; discount_value: number; start_date: string; end_date: string }) => {
    try {
      await create({ businessId, body: { ...values, discount_value: Number(values.discount_value) } }).unwrap();
      toast.success('Promotion created');
      onClose();
    } catch {
      toast.error('Failed to create promotion');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-1 space-y-4">
      <FormField label="Name" id="camp_name" error={errors.name ? 'Required' : undefined} {...register('name', { required: true })} />
      <FormField label="Discount Type" id="camp_discount_type">
        <select id="camp_discount_type" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-500/20" {...register('discount_type', { required: true })}>
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed Amount</option>
        </select>
      </FormField>
      <FormField label="Discount Value" id="camp_discount_value" type="number" step="0.01" error={errors.discount_value ? 'Required' : undefined} {...register('discount_value', { required: true })} />
      <FormField label="Start Date" id="camp_start_date" type="date" error={errors.start_date ? 'Required' : undefined} {...register('start_date', { required: true })} />
      <FormField label="End Date" id="camp_end_date" type="date" error={errors.end_date ? 'Required' : undefined} {...register('end_date', { required: true })} />
      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
        <button type="submit" disabled={isLoading} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60">
          {isLoading ? 'Saving…' : 'Create'}
        </button>
      </div>
    </form>
  );
}

function SalesCampaignsTab({ businessId }: { businessId: string }) {
  const { data, isLoading } = useGetBusinessSalesCampaignsQuery(businessId);
  const [deleteCampaign, { isLoading: isDeleting }] = useDeleteBusinessSalesCampaignMutation();
  const { target, setTarget, confirm } = useDeleteWithReason(deleteCampaign);
  const [showCreate, setShowCreate] = useState(false);
  const campaigns = data ?? [];

  if (isLoading) {
    return <Skeleton width="100%" height={200} borderRadius={12} />;
  }

  return (
    <div className="space-y-2">
      <button type="button" onClick={() => setShowCreate(true)} className="mb-1 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50">
        <FiPlus className="h-3.5 w-3.5" />
        Add Promotion
      </button>
      {campaigns.length === 0
        ? <EmptyState icon={<FiTag />} message="No promotions on file" />
        : campaigns.map(c => (
            <div key={c.id} className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2.5">
              <div>
                <p className="text-sm font-semibold text-slate-800">{c.name}</p>
                <p className="text-xs text-slate-500">
                  {c.discount_value}
                  {c.discount_type === 'percentage' ? '%' : ''}
                  {' off · '}
                  {c.start_date}
                  {' – '}
                  {c.end_date}
                </p>
              </div>
              <button type="button" onClick={() => setTarget(c.id)} className="rounded p-1 text-red-500 hover:bg-red-50">
                <FiTrash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
      <Modal open={showCreate} onOpenChange={o => !o && setShowCreate(false)} title="Add Promotion" className="max-w-sm">
        <CreateSalesCampaignForm businessId={businessId} onClose={() => setShowCreate(false)} />
      </Modal>
      <DeleteReasonModal open={target !== null} itemLabel="promotion" isLoading={isDeleting} onClose={() => setTarget(null)} onConfirm={reason => confirm(businessId, reason)} />
    </div>
  );
}

/* ─── Folders ──────────────────────────────────────────────────────── */

function FoldersTab({ businessId }: { businessId: string }) {
  const { data, isLoading } = useGetBusinessFoldersQuery(businessId);
  const [deleteFolder, { isLoading: isDeleting }] = useDeleteBusinessFolderMutation();
  const { target, setTarget, confirm } = useDeleteWithReason(deleteFolder);
  const folders = data ?? [];

  if (isLoading) {
    return <Skeleton width="100%" height={200} borderRadius={12} />;
  }
  if (folders.length === 0) {
    return <EmptyState icon={<FiBookOpen />} message="No learning bucket folders" />;
  }

  return (
    <div className="space-y-2">
      {folders.map(f => (
        <div key={f.id} className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2.5">
          <div>
            <p className="text-sm font-semibold text-slate-800">{f.name}</p>
            <Badge variant="rounded" className="mt-1 bg-slate-100 text-slate-500">{f.section}</Badge>
          </div>
          <button type="button" onClick={() => setTarget(f.id)} className="rounded p-1 text-red-500 hover:bg-red-50">
            <FiTrash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <DeleteReasonModal open={target !== null} itemLabel="folder" isLoading={isDeleting} onClose={() => setTarget(null)} onConfirm={reason => confirm(businessId, reason)} />
    </div>
  );
}

/* ─── Text Contents ────────────────────────────────────────────────── */

function CreateTextContentForm({ businessId, onClose }: { businessId: string; onClose: () => void }) {
  const { data: folderData } = useGetBusinessFoldersQuery(businessId);
  const folders = folderData ?? [];
  const [create, { isLoading }] = useCreateBusinessTextContentMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<{ header: string; content: string; folder_id?: string }>();

  const onSubmit = async (values: { header: string; content: string; folder_id?: string }) => {
    try {
      await create({ businessId, body: values }).unwrap();
      toast.success('Text content added');
      onClose();
    } catch {
      toast.error('Failed to add text content');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-1 space-y-4">
      <FormField label="Header" id="tc_header" error={errors.header ? 'Required' : undefined} {...register('header', { required: true })} />
      <FormField label="Content" id="tc_content" error={errors.content ? 'Required' : undefined} {...register('content', { required: true })} />
      {folders.length > 0 && (
        <FormField label="Folder" id="tc_folder_id">
          <select id="tc_folder_id" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-500/20" {...register('folder_id')}>
            <option value="">None</option>
            {folders.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </FormField>
      )}
      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
        <button type="submit" disabled={isLoading} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60">
          {isLoading ? 'Saving…' : 'Add'}
        </button>
      </div>
    </form>
  );
}

function TextContentsTab({ businessId }: { businessId: string }) {
  const { data, isLoading } = useGetBusinessTextContentsQuery(businessId);
  const [deleteContent, { isLoading: isDeleting }] = useDeleteBusinessTextContentMutation();
  const { target, setTarget, confirm } = useDeleteWithReason(deleteContent);
  const [showCreate, setShowCreate] = useState(false);
  const contents = data ?? [];

  if (isLoading) {
    return <Skeleton width="100%" height={200} borderRadius={12} />;
  }

  return (
    <div className="space-y-2">
      <button type="button" onClick={() => setShowCreate(true)} className="mb-1 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50">
        <FiPlus className="h-3.5 w-3.5" />
        Add Text Content
      </button>
      {contents.length === 0
        ? <EmptyState icon={<FiFileText />} message="No text content on file" />
        : contents.map(c => (
            <div key={c.id} className="rounded-lg bg-slate-50 px-3 py-2.5">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-slate-800">{c.header}</p>
                <button type="button" onClick={() => setTarget(c.id)} className="shrink-0 rounded p-1 text-red-500 hover:bg-red-50">
                  <FiTrash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="mt-1 line-clamp-2 text-xs text-slate-500">{c.content}</p>
            </div>
          ))}
      <Modal open={showCreate} onOpenChange={o => !o && setShowCreate(false)} title="Add Text Content" className="max-w-sm">
        <CreateTextContentForm businessId={businessId} onClose={() => setShowCreate(false)} />
      </Modal>
      <DeleteReasonModal open={target !== null} itemLabel="text content" isLoading={isDeleting} onClose={() => setTarget(null)} onConfirm={reason => confirm(businessId, reason)} />
    </div>
  );
}

/* ─── Knowledge Base ───────────────────────────────────────────────── */

function KnowledgeBaseTab({ businessId }: { businessId: string }) {
  const { data, isLoading } = useGetBusinessKnowledgeBaseQuery(businessId);
  const [deleteSource, { isLoading: isDeleting }] = useDeleteBusinessKnowledgeBaseSourceMutation();
  const { target, setTarget, confirm } = useDeleteWithReason(deleteSource);
  const [rescrape, { isLoading: isRescraping }] = useRescrapeBusinessKnowledgeBaseSourceMutation();
  const sources = data ?? [];

  if (isLoading) {
    return <Skeleton width="100%" height={200} borderRadius={12} />;
  }
  if (sources.length === 0) {
    return <EmptyState icon={<FiGlobe />} message="No knowledge base sources" />;
  }

  const handleRescrape = async (id: string) => {
    try {
      await rescrape({ businessId, id }).unwrap();
      toast.success('Rescrape triggered');
    } catch {
      toast.error('Failed to trigger rescrape');
    }
  };

  return (
    <div className="space-y-2">
      {sources.map(s => (
        <div key={s.id} className="rounded-lg bg-slate-50 px-3 py-2.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">{s.name}</p>
              <p className="truncate text-xs text-slate-500">{s.path}</p>
            </div>
            <div className="flex shrink-0 gap-1">
              <button type="button" onClick={() => handleRescrape(s.id)} disabled={isRescraping} className="rounded p-1 text-sky-600 hover:bg-sky-50 disabled:opacity-50">
                <FiRefreshCw className="h-3.5 w-3.5" />
              </button>
              <button type="button" onClick={() => setTarget(s.id)} className="rounded p-1 text-red-500 hover:bg-red-50">
                <FiTrash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <Badge variant="rounded" className={`mt-1.5 ${s.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{s.status}</Badge>
        </div>
      ))}
      <DeleteReasonModal open={target !== null} itemLabel="knowledge base source" isLoading={isDeleting} onClose={() => setTarget(null)} onConfirm={reason => confirm(businessId, reason)} />
    </div>
  );
}

/* ─── Working Hours ────────────────────────────────────────────────── */

const DAY_LABELS: Record<string, string> = { MON: 'Monday', TUE: 'Tuesday', WED: 'Wednesday', THU: 'Thursday', FRI: 'Friday', SAT: 'Saturday', SUN: 'Sunday' };

function WorkingHoursTab({ businessId }: { businessId: string }) {
  const { data, isLoading } = useGetBusinessWorkingHoursQuery(businessId);
  const [toggle] = useToggleBusinessWorkingHoursDayMutation();
  const hours = data ?? [];

  if (isLoading) {
    return <Skeleton width="100%" height={200} borderRadius={12} />;
  }
  if (hours.length === 0) {
    return <EmptyState icon={<FiClock />} message="No working hours configured" />;
  }

  const handleToggle = async (dow: string, disabled: boolean) => {
    try {
      await toggle({ businessId, dow, disabled: !disabled }).unwrap();
      toast.success('Working hours updated');
    } catch {
      toast.error('Failed to update working hours');
    }
  };

  return (
    <div className="space-y-2">
      {hours.map(h => (
        <div key={h.id} className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-sm">
          <span className="font-medium text-slate-700">{DAY_LABELS[h.day_of_week] ?? h.day_of_week}</span>
          <span className="text-slate-500">
            {h.disabled ? 'Closed' : `${h.start_time} – ${h.end_time}`}
          </span>
          <button
            type="button"
            onClick={() => handleToggle(h.day_of_week, h.disabled)}
            className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors ${
              h.disabled ? 'border-emerald-200 text-emerald-600 hover:bg-emerald-50' : 'border-slate-200 text-slate-500 hover:bg-slate-100'
            }`}
          >
            {h.disabled ? 'Enable' : 'Disable'}
          </button>
        </div>
      ))}
    </div>
  );
}

/* ─── Agent Language ───────────────────────────────────────────────── */

function LanguageTab({ businessId }: { businessId: string }) {
  const { data, isLoading } = useGetBusinessAgentLanguageQuery(businessId);
  const [update, { isLoading: isSaving }] = useUpdateBusinessAgentLanguageMutation();
  const [value, setValue] = useState('');

  if (isLoading) {
    return <Skeleton width="100%" height={80} borderRadius={12} />;
  }

  const current = value || data?.language_code || 'EN';

  const handleSave = async () => {
    try {
      await update({ businessId, body: { language_code: current } }).unwrap();
      toast.success('Agent language updated');
    } catch {
      toast.error('Failed to update language');
    }
  };

  return (
    <div className="space-y-3">
      <select
        value={current}
        onChange={e => setValue(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-500/20"
      >
        <option value="EN">English</option>
        <option value="FR">French</option>
        <option value="ES">Spanish</option>
        <option value="PT">Portuguese</option>
      </select>
      <button type="button" onClick={handleSave} disabled={isSaving} className="w-full rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60">
        {isSaving ? 'Saving…' : 'Save Language'}
      </button>
    </div>
  );
}

/* ─── Main ─────────────────────────────────────────────────────────── */

type BusinessSupportPanelProps = {
  businessId: string;
  businessName: string;
  open: boolean;
  onClose: () => void;
};

export default function BusinessSupportPanel({ businessId, businessName, open, onClose }: BusinessSupportPanelProps) {
  const [tab, setTab] = useState<Tab>('profile');

  return (
    <SidePanel open={open} onClose={onClose} title="Support Mode" subtitle={businessName}>
      <div className="flex flex-wrap gap-1 border-b border-slate-100 pb-3">
        {TABS.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              tab === value ? 'bg-primary-50 text-primary-700' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>
      <div className="pt-4">
        {tab === 'profile' && <ProfileTab businessId={businessId} />}
        {tab === 'faqs' && <FaqsTab businessId={businessId} />}
        {tab === 'support-info' && <SupportInfoTab businessId={businessId} />}
        {tab === 'departments' && <DepartmentsTab businessId={businessId} />}
        {tab === 'product-experts' && <ProductExpertsTab businessId={businessId} />}
        {tab === 'products' && <ProductsTab businessId={businessId} />}
        {tab === 'sales-campaigns' && <SalesCampaignsTab businessId={businessId} />}
        {tab === 'folders' && <FoldersTab businessId={businessId} />}
        {tab === 'text-contents' && <TextContentsTab businessId={businessId} />}
        {tab === 'knowledge-base' && <KnowledgeBaseTab businessId={businessId} />}
        {tab === 'working-hours' && <WorkingHoursTab businessId={businessId} />}
        {tab === 'language' && <LanguageTab businessId={businessId} />}
      </div>
    </SidePanel>
  );
}
