'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { PublicEvidence } from '@/lib/api';

type EvidenceViewerProps = {
  evidence: PublicEvidence[];
  evidenceUnavailable: boolean;
};

function isHttpUrl(value?: string | null): value is string {
  if (!value) {
    return false;
  }

  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export default function EvidenceViewer({
  evidence,
  evidenceUnavailable,
}: EvidenceViewerProps) {
  const [isViewing, setIsViewing] = useState(false);

  return (
    <section aria-labelledby="evidence-heading" className="space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
          Documentary record
        </p>

        <h2
          id="evidence-heading"
          className="mt-2 text-2xl font-bold text-slate-900"
        >
          Evidence and sources
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          This section presents supporting material approved for public
          viewing. Source and usage information is provided with each item.
          Graphic evidence is not displayed.
        </p>
      </div>

      {evidenceUnavailable ? (
        <div
          role="status"
          className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900"
        >
          Supporting evidence could not be loaded at this time. Please check
          back later.
        </div>
      ) : evidence.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-600">
          No supporting evidence has been approved for public viewing for this
          incident.
        </div>
      ) : !isViewing ? (
        <div
          className="rounded-2xl border border-amber-200 bg-amber-50 p-6"
          aria-labelledby="viewer-discretion-heading"
        >
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-800">
            Viewer discretion advised
          </p>

          <h3
            id="viewer-discretion-heading"
            className="mt-2 text-lg font-semibold text-slate-950"
          >
            Documentary material may be distressing
          </h3>

          <p className="mt-3 text-sm leading-7 text-slate-700">
            The supporting material relates to reported incidents of violence
            and persecution. Even though graphic evidence is excluded, some
            photographs, descriptions or documents may be emotionally
            difficult to view. Please continue only if you feel comfortable
            doing so.
          </p>

          <p className="mt-3 text-sm leading-7 text-slate-700">
            You can read the incident report without opening this material.
            Only evidence approved for public viewing is shown here.
          </p>

          <button
            type="button"
            onClick={() => setIsViewing(true)}
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950"
          >
            Continue to view supporting material
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <p className="text-sm leading-6 text-emerald-900">
              You are viewing approved, non-graphic documentary material.
            </p>

            <button
              type="button"
              onClick={() => setIsViewing(false)}
              className="text-sm font-semibold text-emerald-800 underline underline-offset-4 hover:text-emerald-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
            >
              Hide supporting material
            </button>
          </div>

          <div className="grid gap-6">
            {evidence.map((item) => {
              const isImage =
                Boolean(item.mimeType?.toLowerCase().startsWith('image/')) &&
                isHttpUrl(item.url);

              return (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                >
                  {isImage ? (
                    <div className="relative aspect-[16/10] w-full bg-slate-100">
                      <Image
                        src={item.url}
                        alt={
                          item.caption ||
                          item.title ||
                          'Documentary evidence'
                        }
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 768px"
                        className="object-contain"
                      />
                    </div>
                  ) : null}

                  <div className="space-y-3 p-5">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <span>{item.type.replaceAll('_', ' ')}</span>
                      {item.contentRating !== 'STANDARD' &&
                      item.contentRating !== 'GENERAL' ? (
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-800">
                          Sensitive documentary material
                        </span>
                      ) : null}
                    </div>

                    {item.title ? (
                      <h3 className="text-lg font-semibold text-slate-900">
                        {item.title}
                      </h3>
                    ) : null}

                    {item.caption ? (
                      <p className="text-sm leading-7 text-slate-700">
                        {item.caption}
                      </p>
                    ) : null}

                    {item.description ? (
                      <p className="text-sm leading-7 text-slate-600">
                        {item.description}
                      </p>
                    ) : null}

                    {!isImage && isHttpUrl(item.url) ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex text-sm font-semibold text-emerald-700 underline underline-offset-4"
                      >
                        View supporting material
                      </a>
                    ) : null}

                    <div className="border-t border-slate-100 pt-4 text-xs leading-6 text-slate-500">
                      <p>
                        <span className="font-semibold text-slate-700">
                          Credit:
                        </span>{' '}
                        {item.credit}
                      </p>

                      <p>
                        <span className="font-semibold text-slate-700">
                          License:
                        </span>{' '}
                        {item.license}
                      </p>

                      {item.source ? (
                        <div className="mt-3">
                          <p className="font-semibold text-slate-700">
                            Original source
                          </p>
                          {item.source.name ? <p>{item.source.name}</p> : null}
                          {item.source.title ? (
                            <p>{item.source.title}</p>
                          ) : null}
                          {item.source.publisher ? (
                            <p>Publisher: {item.source.publisher}</p>
                          ) : null}
                          {item.source.author ? (
                            <p>Author: {item.source.author}</p>
                          ) : null}
                          {isHttpUrl(item.source.url) ? (
                            <a
                              href={item.source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1 inline-flex font-semibold text-emerald-700 underline underline-offset-4"
                            >
                              Visit original source
                            </a>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
