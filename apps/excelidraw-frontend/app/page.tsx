export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-8 text-center">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-200/80">
            Excelidraw
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Draw, collaborate, and share ideas instantly.
          </h1>
          <p className="mx-auto max-w-2xl text-base text-white/70 sm:text-lg">
            Sign in to access your workspace, or create an account to start
            sketching with your team.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="/signin"
            className="inline-flex items-center justify-center rounded-lg bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            aria-label="Go to sign in"
            tabIndex={0}
          >
            Sign in
          </a>
          <a
            href="/signup"
            className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-label="Go to sign up"
            tabIndex={0}
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}

