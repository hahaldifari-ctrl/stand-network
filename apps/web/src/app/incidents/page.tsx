import Link from 'next/link';
import { getIncidents } from '@/lib/api';
import IncidentCard from '@/components/incidents/IncidentCard';

export default async function IncidentsPage() {
  const incidents = await getIncidents();

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link
            href="/"
            className="text-sm font-bold tracking-[0.18em] text-slate-950"
          >
            STAND NETWORK
          </Link>

          <Link
            href="/"
            className="text-sm font-semibold text-slate-600 transition hover:text-slate-950"
          >
            ← Back home
          </Link>
        </div>
      </header>

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
              Standing with the persecuted Church
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Verified incidents
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              A public record of incidents reviewed through the STAND Network
              verification process. We share responsibly, protect dignity, and
              distinguish verified information from claims that still require
              confirmation.
            </p>

            <div className="mt-8 inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
              {incidents.length}{' '}
              {incidents.length === 1 ? 'verified incident' : 'verified incidents'}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
        {incidents.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {incidents.map((incident) => (
              <IncidentCard key={incident.id} incident={incident} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
              No verified incidents yet
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
              Verified reports will appear here
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600">
              STAND does not publish every report as a verified incident.
              Reports must go through review before they are included in this
              public record.
            </p>
          </div>
        )}
      </section>

      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
              Why verification matters
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Truth deserves care.
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-300">
              Reports of violence can affect real people, families, and
              communities. Verification helps STAND communicate what is known
              responsibly without turning suffering into spectacle.
            </p>

            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4 text-sm font-semibold text-slate-200">
              <span>Review before publication</span>
              <span>Corroborating information</span>
              <span>Responsible public reporting</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}