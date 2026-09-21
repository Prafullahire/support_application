import { PageHeader } from '@/components/office-boy/portal/page-header';

export function PlaceholderPage({
  title,
  backHref = '/office-boy/dashboard',
}: {
  title: string;
  backHref?: string;
}) {
  return (
    <>
      <PageHeader eyebrow="Portal" title={title} backHref={backHref} />
      <main className="-mt-4 flex-1 rounded-t-3xl bg-white px-5 pb-8 pt-5 md:mx-6 md:mt-6 md:rounded-3xl md:px-8 md:pb-10 lg:mx-8">
        <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
          <p className="text-lg font-semibold text-brand-black">{title}</p>
          <p className="mt-2 text-sm text-text-muted">This section is coming soon.</p>
        </div>
      </main>
    </>
  );
}
