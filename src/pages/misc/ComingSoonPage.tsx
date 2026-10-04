import type {
  LucideIcon,
} from "lucide-react";

type ComingSoonPageProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export default function ComingSoonPage({
  title,
  description,
  icon: Icon,
}: ComingSoonPageProps) {
  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
            <Icon size={27} />
          </span>

          <h1 className="mt-5 text-3xl font-bold text-slate-900">
            {title}
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            {description}
          </p>

          <span className="mt-6 inline-block rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">
            Coming soon
          </span>
        </section>
      </div>
    </main>
  );
}