import Link from "next/link";
import { getNeeds, type Need } from "../lib/api";
import { Button } from "../components/ui/Button";
import { Logo } from "../components/brand/Logo";
import { NeedCard } from "../components/needs/NeedCard";

export const dynamic = "force-dynamic";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1777115213572-2097c1c9ebcc?auto=format&fit=crop&w=2200&q=88";

const PRAYER_IMAGE =
  "https://images.unsplash.com/photo-1759592702685-819b02c86332?auto=format&fit=crop&w=1800&q=86";

const STORY_IMAGE =
  "https://images.unsplash.com/photo-1761370981139-c1fe5402c709?auto=format&fit=crop&w=1400&q=86";

const GIVE_IMAGE =
  "https://images.unsplash.com/photo-1760907949894-b66d728e0a8e?auto=format&fit=crop&w=1600&q=86";

const waysToStand = [
  {
    number: "01",
    title: "Pray",
    description:
      "Stand with persecuted Christians through focused prayer for strength, protection, provision, and hope.",
    href: "#prayer",
    icon: HeartIcon,
  },
  {
    number: "02",
    title: "Give",
    description:
      "Support credible opportunities to provide practical, financial, and material assistance.",
    href: "#give",
    icon: HandIcon,
  },
  {
    number: "03",
    title: "Respond",
    description:
      "Discover verified needs and find practical ways to respond when communities need support.",
    href: "#needs",
    icon: ArrowUpRightIcon,
  },
  {
    number: "04",
    title: "Volunteer",
    description:
      "Offer your time, skills, experience, and practical assistance where they can make a difference.",
    href: "#ways-to-stand",
    icon: PeopleIcon,
  },
  {
    number: "05",
    title: "Partner",
    description:
      "Connect churches, ministries, organizations, and other stakeholders around meaningful action.",
    href: "#ways-to-stand",
    icon: LinkIcon,
  },
  {
    number: "06",
    title: "Share Hope",
    description:
      "Help communicate verified stories, encouragement, updates, and opportunities to stand together.",
    href: "#stories",
    icon: MessageIcon,
  },
];

const urgencyPriority: Record<string, number> = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

function sortNeeds(needs: Need[]) {
  return [...needs].sort((a, b) => {
    const urgencyDifference =
      (urgencyPriority[a.urgency] ?? 99) -
      (urgencyPriority[b.urgency] ?? 99);

    if (urgencyDifference !== 0) {
      return urgencyDifference;
    }

    return (
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
    );
  });
}

export default async function HomePage() {
  let needs: Need[] = [];

  try {
    needs = sortNeeds(await getNeeds());
  } catch {
    needs = [];
  }

  const featuredNeeds = needs.slice(0, 6);

  return (
    <main className="overflow-hidden bg-stand-cream">
      {/* NAVIGATION */}
      <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-stand-cream/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <Logo />

          <nav className="hidden items-center gap-7 text-sm font-semibold text-stand-earth md:flex">
            <Link
              className="hover:text-stand-ink"
              href="#why-we-stand"
            >
              Why We Stand
            </Link>

            <Link
              className="hover:text-stand-ink"
              href="#needs"
            >
              Needs
            </Link>

            <Link
              className="hover:text-stand-ink"
              href="#stories"
            >
              Stories
            </Link>

            <Link
              className="hover:text-stand-ink"
              href="#prayer"
            >
              Prayer
            </Link>

            <Link
              className="hover:text-stand-ink"
              href="#ways-to-stand"
            >
              Ways to Stand
            </Link>
          </nav>

          <Button href="#needs" className="px-5">
            Stand With Them <ArrowIcon />
          </Button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative isolate min-h-[680px] overflow-hidden bg-stand-ink text-white sm:min-h-[720px]">
        <div
          aria-label="African community gathering"
          className="absolute inset-0 -z-20 bg-cover bg-center"
          role="img"
          style={{
            backgroundImage: `url(${HERO_IMAGE})`,
          }}
        />

        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(23,21,18,.92)_0%,rgba(23,21,18,.72)_38%,rgba(23,21,18,.12)_75%,rgba(23,21,18,.28)_100%)]" />

        <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(23,21,18,.45),transparent_55%)]" />

        <div className="mx-auto flex min-h-[680px] max-w-7xl items-end px-5 pb-16 pt-24 sm:min-h-[720px] sm:px-8 sm:pb-20 lg:px-10">
          <div className="grid w-full items-end gap-10 lg:grid-cols-[1.15fr_.85fr]">
            <div className="max-w-3xl">
              <div className="stand-eyebrow mb-6 flex items-center gap-3 text-stand-gold-light">
                <span className="h-px w-8 bg-stand-gold-light" />
                Standing with the persecuted Church
              </div>

              <h1 className="stand-display max-w-3xl text-5xl leading-[.95] sm:text-7xl lg:text-[6.4rem]">
                You are not
                <br />
                standing alone.
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-7 text-white/78 sm:text-lg sm:leading-8">
                STAND Network connects people, churches, ministries, and
                organizations to support Christians facing persecution and
                faith-based violence — beginning in Nigeria and reaching
                beyond.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="#needs" variant="gold">
                  Find Your Way to Stand <ArrowIcon />
                </Button>

                <Button
                  href="#prayer"
                  variant="ghost"
                  className="border border-white/35 text-white hover:bg-white/10"
                >
                  Pray With Us
                </Button>
              </div>
            </div>

            <div className="hidden justify-end lg:flex">
              <div className="stand-glass max-w-[230px] rounded-[24px] p-5 text-sm leading-6 text-white/90">
                <span className="mb-4 block h-10 w-px bg-stand-gold" />

                <strong className="block text-white">
                  Real people.
                </strong>

                <strong className="block text-white">
                  Real communities.
                </strong>

                <strong className="block text-white">
                  Real hope.
                </strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ONE NETWORK */}
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:px-10 lg:py-14">
          <div>
            <p className="stand-eyebrow text-stand-gold">
              One network
            </p>

            <h2 className="stand-display mt-3 max-w-xl text-4xl leading-tight sm:text-5xl">
              From seeing the need to standing with the people.
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["01", "Discover credible needs"],
              ["02", "Pray and respond"],
              ["03", "Build lasting support"],
            ].map(([number, text]) => (
              <div
                key={number}
                className="rounded-2xl border border-stone-200 bg-stand-cream px-5 py-5"
              >
                <span className="text-xs font-bold tracking-[.18em] text-stand-gold">
                  {number}
                </span>

                <p className="mt-7 font-semibold text-stand-ink">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY WE STAND */}
      <section id="why-we-stand" className="stand-gradient">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:px-10 lg:py-28">
          <div>
            <p className="stand-eyebrow text-stand-gold">
              Why We Stand
            </p>

            <h2 className="stand-display mt-4 text-4xl leading-tight sm:text-6xl">
              Faith should never have to face suffering alone.
            </h2>
          </div>

          <div className="max-w-2xl">
            <p className="text-lg leading-8 text-stand-earth">
              Across Nigeria and other places affected by persecution and
              faith-based violence, Christian communities can face
              displacement, insecurity, loss of livelihoods, and urgent
              humanitarian needs.
            </p>

            <p className="mt-6 text-lg leading-8 text-stand-earth">
              At the same time, there are people who want to pray, give,
              volunteer, respond, partner, and share hope. The challenge is
              connecting that willingness to credible opportunities to act.
            </p>

            <div className="mt-10 rounded-[28px] border border-stand-gold/25 bg-white p-7 shadow-stand-soft sm:p-9">
              <p className="stand-eyebrow text-stand-gold">
                The STAND idea
              </p>

              <p className="stand-display mt-4 text-3xl leading-tight text-stand-ink sm:text-4xl">
                See the need. Care about the people. Pray. Act. Help bring
                hope.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NEEDS */}
      <section id="needs" className="bg-stand-cream">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:items-end">
            <div>
              <p className="stand-eyebrow text-stand-gold">
                Live from the STAND Network
              </p>

              <h2 className="stand-display mt-4 text-4xl leading-tight sm:text-6xl">
                Needs We Can Stand With
              </h2>
            </div>

            <div className="max-w-2xl text-base leading-7 text-stand-earth">
              <p>
                Discover verified needs from communities and organizations
                seeking support. Every opportunity begins with a need that has
                been reviewed through the STAND Network.
              </p>

              <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-stone-200 bg-white px-5 py-3 shadow-stand-soft">
                <span className="flex h-3 w-3 rounded-full bg-stand-green" />

                <strong className="text-2xl text-stand-ink">
                  {needs.length}
                </strong>

                <span className="text-xs font-bold uppercase tracking-[.14em] text-stand-earth">
                  Active verified needs
                </span>
              </div>
            </div>
          </div>

          {featuredNeeds.length > 0 ? (
            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {featuredNeeds.map((need) => (
                <NeedCard key={need.id} need={need} />
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded-[28px] border border-dashed border-stone-300 bg-white p-12 text-center text-stand-earth">
              Verified needs will appear here as they become available.
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <Link
              href="#needs"
              className="stand-interactive inline-flex items-center gap-2 text-sm font-bold text-stand-ink hover:text-stand-gold"
            >
              View all active needs <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* WAYS TO STAND */}
      <section
        id="ways-to-stand"
        className="bg-stand-green-light/55"
      >
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[.65fr_1.35fr] lg:px-10 lg:py-28">
          <div>
            <p className="stand-eyebrow text-stand-green">
              Ways to Stand
            </p>

            <h2 className="stand-display mt-4 text-4xl leading-tight sm:text-6xl">
              Everyone can stand in a different way.
            </h2>

            <p className="mt-6 max-w-lg text-base leading-7 text-stand-earth">
              Whether you have time, resources, skills, influence, or simply a
              heart willing to pray, there is a place for you in the network.
            </p>

            <Button href="#needs" className="mt-7">
              Explore All Ways <ArrowIcon />
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {waysToStand.map((way) => {
              const Icon = way.icon;

              return (
                <Link
                  key={way.number}
                  href={way.href}
                  className="group rounded-[24px] border border-white bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-stand-card"
                >
                  <div className="flex items-start justify-between gap-4">
                    <Icon />

                    <span className="text-xs font-bold tracking-[.18em] text-stand-gold">
                      {way.number}
                    </span>
                  </div>

                  <h3 className="mt-8 text-lg font-bold text-stand-ink">
                    {way.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-stand-earth">
                    {way.description}
                  </p>

                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-stand-ink">
                    Learn more <ArrowIcon />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRAYER */}
      <section
        id="prayer"
        className="relative isolate overflow-hidden bg-stand-ink text-white"
      >
        <div
          aria-label="Prayer gathering"
          className="absolute inset-0 -z-20 bg-cover bg-center"
          role="img"
          style={{
            backgroundImage: `url(${PRAYER_IMAGE})`,
          }}
        />

        <div className="absolute inset-0 -z-10 bg-stand-ink/75" />

        <div className="mx-auto flex min-h-[420px] max-w-7xl items-end px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
          <div className="grid w-full gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-2xl">
              <p className="stand-eyebrow text-stand-gold-light">
                Prayer
              </p>

              <h2 className="stand-display mt-3 text-4xl leading-tight sm:text-5xl">
                Prayer is one of the ways we stand together.
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-white/75">
                Behind every need is a person, a family, a church, and a
                community. We believe they deserve more than our attention —
                they deserve our prayers.
              </p>
            </div>

            <Button href="#needs" variant="secondary">
              Pray for a Need <ArrowIcon />
            </Button>
          </div>
        </div>
      </section>

      {/* STORIES + GIVE */}
      <section id="stories" className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_1fr] lg:px-10 lg:py-24">
          <article className="grid overflow-hidden rounded-[28px] border border-stone-200 bg-stand-cream sm:grid-cols-[.75fr_1.25fr]">
            <div
              className="min-h-[300px] bg-cover bg-center"
              role="img"
              aria-label="Community portrait in Nigeria"
              style={{
                backgroundImage: `url(${STORY_IMAGE})`,
              }}
            />

            <div className="p-7 sm:p-9">
              <p className="stand-eyebrow text-stand-gold">
                Stories
              </p>

              <h2 className="stand-display mt-4 text-3xl leading-tight sm:text-4xl">
                Share hope. Tell the truth. Remember the people.
              </h2>

              <p className="mt-4 text-sm leading-6 text-stand-earth">
                Stories help us see beyond statistics. As STAND Network grows,
                verified stories and updates will help communities share what
                they are experiencing and help supporters understand where
                their prayers and actions matter.
              </p>

              <div className="mt-6 rounded-2xl bg-white p-4 text-xs leading-5 text-stand-earth shadow-sm">
                <strong className="block text-stand-ink">
                  Coming through the network
                </strong>

                Verified stories, updates, encouragement, and opportunities to
                participate.
              </div>
            </div>
          </article>

          <article
            id="give"
            className="relative isolate overflow-hidden rounded-[28px] bg-stand-ink text-white"
          >
            <div
              className="absolute inset-0 -z-10 bg-cover bg-center opacity-55"
              role="img"
              aria-label="Nigerian community and daily life"
              style={{
                backgroundImage: `url(${GIVE_IMAGE})`,
              }}
            />

            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-stand-ink/95 via-stand-ink/80 to-stand-ink/25" />

            <div className="flex min-h-[390px] flex-col justify-end p-7 sm:p-9">
              <p className="stand-eyebrow text-stand-gold-light">
                Give
              </p>

              <h2 className="stand-display mt-4 max-w-xl text-3xl leading-tight sm:text-4xl">
                Your generosity can become practical help.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-white/72">
                STAND Network is being designed to connect supporters with
                appropriate opportunities to provide financial and material
                support to communities facing hardship.
              </p>

              <p className="mt-5 border-l border-stand-gold pl-4 text-xs leading-5 text-white/65">
                Giving pathways will be introduced as verified partner and
                response workflows are established.
              </p>

              <div className="mt-6">
                <Button href="#needs" variant="gold">
                  See Where You Can Stand <ArrowIcon />
                </Button>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden bg-stand-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_.9fr] lg:px-10 lg:py-24">
          <div>
            <p className="stand-eyebrow text-stand-gold">
              STAND Network
            </p>

            <h2 className="stand-display mt-4 text-5xl leading-none sm:text-7xl">
              We stand together.
            </h2>
          </div>

          <div>
            <p className="max-w-xl text-base leading-7 text-stand-earth">
              Because no community should face persecution and faith-based
              violence believing that no one sees them, remembers them, or
              cares enough to stand with them.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="#needs">
                Stand With Them <ArrowIcon />
              </Button>

              <Button href="#prayer" variant="secondary">
                Pray With Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-stand-ink text-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-16">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_.6fr_.6fr]">
            <div>
              <Logo light />

              <p className="mt-6 max-w-md text-sm leading-6 text-white/55">
                Connecting people, churches, ministries, and organizations to
                stand with Christians facing persecution and faith-based
                violence.
              </p>

              <p className="mt-7 text-xs font-bold tracking-[.18em] text-stand-gold-light">
                TRUTH · COMPASSION · WISDOM · HOPE
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold">Explore</h3>

              <div className="mt-5 grid gap-3 text-sm text-white/55">
                <Link
                  href="#why-we-stand"
                  className="hover:text-white"
                >
                  Why We Stand
                </Link>

                <Link href="#needs" className="hover:text-white">
                  Needs
                </Link>

                <Link href="#stories" className="hover:text-white">
                  Stories
                </Link>

                <Link
                  href="#ways-to-stand"
                  className="hover:text-white"
                >
                  Ways to Stand
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold">Stand</h3>

              <div className="mt-5 grid gap-3 text-sm text-white/55">
                <Link href="#prayer" className="hover:text-white">
                  Pray
                </Link>

                <Link href="#give" className="hover:text-white">
                  Give
                </Link>

                <Link href="#needs" className="hover:text-white">
                  Respond
                </Link>

                <Link
                  href="#ways-to-stand"
                  className="hover:text-white"
                >
                  Partner
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 STAND Network.</span>

            <span>
              Built to serve with truth, compassion, wisdom, and hope.
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M5 12h13" strokeLinecap="round" />
      <path
        d="m13 6 6 6-6 6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6 text-stand-ink"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HandIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6 text-stand-ink"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="M8 12V5.5a1.5 1.5 0 0 1 3 0V11"
        strokeLinecap="round"
      />
      <path
        d="M11 11V4.5a1.5 1.5 0 0 1 3 0V11"
        strokeLinecap="round"
      />
      <path
        d="M14 11V6a1.5 1.5 0 0 1 3 0v7"
        strokeLinecap="round"
      />
      <path
        d="M17 12V9a1.5 1.5 0 0 1 3 0v5.5c0 3.59-2.91 6.5-6.5 6.5h-1.2A6.3 6.3 0 0 1 7 18.3L4.3 15.6a1.85 1.85 0 0 1 2.62-2.62L8 14.06"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6 text-stand-ink"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M7 17 17 7" strokeLinecap="round" />
      <path d="M7 7h10v10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6 text-stand-ink"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="7" r="4" />
      <path
        d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6 text-stand-ink"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6 text-stand-ink"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}