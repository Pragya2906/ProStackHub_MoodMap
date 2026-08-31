import { useState } from "react";

import { SiteHeader } from "@/components/SiteHeader";
import { DashboardPage } from "@/components/pages/DashboardPage";
import { JournalPage } from "@/components/pages/JournalPage";
import { InsightsPage } from "@/components/pages/InsightsPage";

export function App() {
  const [view, setView] = useState("dashboard");

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader view={view} onNavigate={setView} />
      <main className="flex-1">
        {view === "journal" ? <JournalPage /> : null}
        {view === "insights" ? <InsightsPage /> : null}
        {view === "dashboard" ? <DashboardPage onNavigate={setView} /> : null}
      </main>
      <footer className="border-t border-border py-6">
        <p className="mx-auto max-w-6xl px-4 text-xs text-muted-foreground sm:px-6">
          MoodMap keeps every entry in this browser only — nothing is uploaded.
        </p>
      </footer>
    </div>
  );
}
