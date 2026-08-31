export function SiteHeader({ currentPage, onNavigate }) {
  const LINKS = [
    { id: "dashboard", label: "Dashboard" },
    { id: "journal", label: "Journal" },
    { id: "insights", label: "Insights" },
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-2.5">
          <span className="grid grid-cols-2 gap-[2px]" aria-hidden="true">
            <span className="size-2 rounded-[2px] mood-cell-2" />
            <span className="size-2 rounded-[2px] mood-cell-4" />
            <span className="size-2 rounded-[2px] mood-cell-5" />
            <span className="size-2 rounded-[2px] mood-cell-3" />
          </span>
          <span className="font-serif text-lg tracking-tight text-foreground">MoodMap</span>
        </button>
        <nav aria-label="Main">
          <ul className="flex items-center gap-1">
            {LINKS.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => onNavigate(link.id)}
                  className={`inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors ${
                    currentPage === link.id
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}