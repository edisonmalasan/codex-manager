import { useEffect, useState } from 'react';

import type { AppInfo, HealthStatus } from '../shared/ipc/contracts';
import { serviceBoundaries } from '../shared/domain/service-boundaries';

export function App() {
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);

  useEffect(() => {
    void window.codexManager.app.getInfo().then(setAppInfo);
    void window.codexManager.health.ping().then(setHealth);
  }, []);

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="Primary">
        <div className="brand-block">
          <span className="brand-mark">CM</span>
          <div>
            <h1>Codex Manager</h1>
            <p>Account pool operations</p>
          </div>
        </div>

        <nav className="nav-list" aria-label="Manager sections">
          <a href="#dashboard">Dashboard</a>
          <a href="#accounts">Accounts</a>
          <a href="#quota">Quota</a>
          <a href="#proxy">Proxy</a>
          <a href="#backups">Backups</a>
          <a href="#settings">Settings</a>
        </nav>
      </aside>

      <section className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Foundation build</p>
            <h2>Operational dashboard shell</h2>
          </div>
          <div className="status-pill">
            <span className="status-dot" aria-hidden="true" />
            {health?.status ?? 'checking'}
          </div>
        </header>

        <section className="hero-panel" id="dashboard">
          <div>
            <p className="eyebrow">Next systems</p>
            <h3>Ready for account, quota, switching, backup, and proxy work</h3>
            <p>
              This shell proves the secure preload bridge and IPC foundation
              without implementing provider-specific Codex resource behavior.
            </p>
          </div>
          <dl className="app-facts">
            <div>
              <dt>App</dt>
              <dd>{appInfo?.name ?? 'Loading'}</dd>
            </div>
            <div>
              <dt>Version</dt>
              <dd>{appInfo?.version ?? 'Loading'}</dd>
            </div>
            <div>
              <dt>Platform</dt>
              <dd>{appInfo?.platform ?? 'Loading'}</dd>
            </div>
          </dl>
        </section>

        <section className="system-grid" aria-label="Planned service boundaries">
          {serviceBoundaries.map((boundary) => (
            <article className="system-card" key={boundary.id}>
              <div>
                <p className="eyebrow">{boundary.id}</p>
                <h3>{boundary.label}</h3>
              </div>
              <span>{boundary.status}</span>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
