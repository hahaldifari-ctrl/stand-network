const waysToStand = [
  {
    title: "Pray",
    description:
      "Stand with Christians and communities facing persecution through prayer and faithful intercession.",
    href: "#prayer",
  },
  {
    title: "Give",
    description:
      "Help provide practical support, relief, recovery, and rebuilding for affected communities.",
    href: "#give",
  },
  {
    title: "Respond",
    description:
      "Help us connect verified needs with trusted people and organizations ready to respond.",
    href: "#respond",
  },
  {
    title: "Volunteer",
    description:
      "Use your skills, time, profession, or resources to strengthen the work of the network.",
    href: "#volunteer",
  },
  {
    title: "Partner",
    description:
      "Churches, ministries, organizations, and communities can work together through STAND.",
    href: "#partners",
  },
  {
    title: "Share Hope",
    description:
      "Help tell stories with dignity, truth, and hope so that suffering communities are not forgotten.",
    href: "#stories",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      {/* Navigation */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <a href="#" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-700 text-lg font-black text-white">
              S
            </div>
            <div>
              <div className="text-lg font-black tracking-tight">STAND</div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                Network
              </div>
            </div>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-700 md:flex">
            <a href="#why" className="transition hover:text-emerald-700">
              Why We Stand
            </a>
            <a href="#stories" className="transition hover:text-emerald-700">
              Stories
            </a>
            <a href="#prayer" className="transition hover:text-emerald-700">
              Prayer
            </a>
            <a href="#ways" className="transition hover:text-emerald-700">
              Ways to Stand
            </a>
          </nav>

          <a
            href="#give"
            className="rounded-full bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
          >
            Stand With Them
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.22),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="max-w-4xl">
            <p className="mb-6 text-sm font-bold uppercase tracking-[0.3em] text-emerald-400">
              Standing with the persecuted Church
            </p>

            <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-8xl">
              You are not
              <span className="block text-emerald-400">standing alone.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              STAND Network connects people, churches, ministries, and
              organizations to support Christians facing persecution and
              faith-based violence—beginning in Nigeria and reaching beyond.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#ways"
                className="rounded-full bg-emerald-500 px-7 py-4 text-center text-sm font-extrabold text-slate-950 transition hover:bg-emerald-400"
              >
                Find Your Way to Stand
              </a>

              <a
                href="#prayer"
                className="rounded-full border border-slate-700 px-7 py-4 text-center text-sm font-extrabold text-white transition hover:border-slate-500 hover:bg-slate-900"
              >
                Pray With Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why we stand */}
      <section id="why" className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-700">
              Why we stand
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              When one part of the Church suffers, the whole Church should
              care.
            </h2>
          </div>

          <div className="space-y-6 text-lg leading-8 text-slate-600">
            <p>
              Across Nigeria and other regions facing faith-based persecution,
              Christian families and communities can find themselves displaced,
              grieving, rebuilding, and struggling to meet basic needs.
            </p>

            <p>
              STAND Network exists to help connect those communities with
              people who are willing to pray, give, serve, respond, advocate,
              and walk alongside them.
            </p>

            <p className="font-semibold text-slate-900">
              We do not want suffering communities to feel forgotten.
              We want them to know that the wider Church is standing with
              them.
            </p>
          </div>
        </div>
      </section>

      {/* Response */}
      <section id="respond" className="bg-emerald-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-700">
              From awareness to action
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              See a need. Verify it. Respond with compassion.
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              STAND will connect verified needs with trusted partners and
              resources, helping move from information to practical support
              and long-term recovery.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              ["01", "Listen", "Hear communities and understand their needs."],
              [
                "02",
                "Verify",
                "Protect credibility by carefully reviewing reports.",
              ],
              [
                "03",
                "Respond",
                "Connect trusted people and resources to the need.",
              ],
            ].map(([number, title, description]) => (
              <div
                key={number}
                className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm"
              >
                <div className="text-sm font-black text-emerald-700">
                  {number}
                </div>
                <h3 className="mt-8 text-2xl font-black text-slate-950">
                  {title}
                </h3>
                <p className="mt-3 leading-7 text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ways to stand */}
      <section id="ways" className="bg-slate-950 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-400">
              Everyone can stand
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
              There is more than one way to make a difference.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {waysToStand.map((way) => (
              <a
                key={way.title}
                href={way.href}
                className="group rounded-3xl border border-slate-800 bg-slate-900 p-7 transition hover:-translate-y-1 hover:border-emerald-500"
              >
                <h3 className="text-2xl font-black text-white group-hover:text-emerald-400">
                  {way.title}
                </h3>
                <p className="mt-3 leading-7 text-slate-400">
                  {way.description}
                </p>
                <div className="mt-6 text-sm font-bold text-emerald-400">
                  Learn more ?
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Prayer */}
      <section id="prayer" className="bg-white py-24">
        <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-700">
            The prayer network
          </p>

          <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
            Stand with them in prayer.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Receive carefully prepared prayer needs and join believers around
            the world in praying for persecuted Christians, families,
            communities, churches, and those responding on the ground.
          </p>

          <a
            href="#"
            className="mt-9 inline-flex rounded-full bg-slate-950 px-7 py-4 text-sm font-extrabold text-white transition hover:bg-slate-800"
          >
            Join the Prayer Network
          </a>
        </div>
      </section>

      {/* Stories */}
      <section id="stories" className="border-y border-slate-200 bg-slate-50 py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1fr_1.3fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-700">
              Stories of hope
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              We tell stories to remember people, not to exploit their pain.
            </h2>
          </div>

          <div className="rounded-[2rem] bg-slate-950 p-8 sm:p-12">
            <p className="text-xl leading-9 text-slate-300">
              Future stories will share verified experiences of courage,
              survival, recovery, faith, and hope while protecting the
              identities and safety of vulnerable people.
            </p>

            <div className="mt-8 h-px bg-slate-800" />

            <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">
              Dignity • Truth • Hope
            </p>
          </div>
        </div>
      </section>

      {/* Give */}
      <section id="give" className="bg-emerald-700 py-24">
        <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
          <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
            Your generosity can become someone's next step toward hope.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-emerald-50">
            Support emergency relief, recovery, rebuilding, education,
            livelihoods, and other carefully verified needs as the STAND
            response network grows.
          </p>

          <button
            type="button"
            className="mt-9 rounded-full bg-white px-8 py-4 text-sm font-extrabold text-emerald-800 transition hover:bg-emerald-50"
          >
            Give Through STAND
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <div className="text-2xl font-black">STAND Network</div>
              <p className="mt-4 max-w-md leading-7 text-slate-400">
                Standing with Christians facing persecution through prayer,
                practical support, trusted partnerships, and hope.
              </p>
            </div>

            <div>
              <h3 className="font-bold">Explore</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-400">
                <a className="block hover:text-white" href="#why">
                  Why We Stand
                </a>
                <a className="block hover:text-white" href="#stories">
                  Stories
                </a>
                <a className="block hover:text-white" href="#prayer">
                  Prayer
                </a>
                <a className="block hover:text-white" href="#ways">
                  Ways to Stand
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-bold">Get involved</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-400">
                <a className="block hover:text-white" href="#give">
                  Give
                </a>
                <a className="block hover:text-white" href="#volunteer">
                  Volunteer
                </a>
                <a className="block hover:text-white" href="#partners">
                  Partner
                </a>
              </div>
            </div>
          </div>

          <div className="mt-16 border-t border-slate-800 pt-8 text-sm text-slate-500">
            © {new Date().getFullYear()} STAND Network. Built to serve with
            truth, compassion, wisdom, and hope.
          </div>
        </div>
      </footer>
    </main>
  );
}

