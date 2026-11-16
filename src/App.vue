<template>
  <main class="page">
    <header class="page-header">
      <h1><RouterLink to="/tickets">Tickets de maintenance</RouterLink></h1>
      <p>Suivi des incidents déclarés par les utilisateurs.</p>
    </header>
    <RouterView />
  </main>
</template>

<style>
:root {
  --fond: #f5f7f6;
  --surface: #ffffff;
  --texte: #1c2b2a;
  --texte-doux: #4d5f5d;
  --bordure: #cfd9d7;
  --accent: #0f5c57;
  --danger: #b3261e;
  color-scheme: light;
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--fond); color: var(--texte);
  font-family: 'Segoe UI', system-ui, -apple-system, Roboto, sans-serif; line-height: 1.5; }
.page { max-width: 980px; margin: 0 auto; padding: 2rem 1rem 3rem; }
.page-header h1 { margin: 0; font-size: 1.75rem; }
.page-header h1 a { color: inherit; text-decoration: none; }
.page-header p { margin: .25rem 0 1.5rem; color: var(--texte-doux); }
a { color: var(--accent); }

input, select, textarea { font: inherit; padding: .5rem .65rem; border-radius: 6px;
  border: 1px solid #8a9c9a; background: #fff; color: var(--texte); }
textarea { width: 100%; resize: vertical; }
:focus-visible { outline: 3px solid #e0a100; outline-offset: 2px; }

.btn { display: inline-block; font: inherit; font-weight: 600; padding: .5rem .9rem; border-radius: 6px;
  border: 1px solid var(--accent); background: var(--accent); color: #fff; cursor: pointer; text-decoration: none; }
.btn.secondaire { background: #fff; color: var(--accent); }
.btn.danger { background: #fff; color: var(--danger); border-color: var(--danger); }
.btn.danger.plein { background: var(--danger); color: #fff; }
.btn.petit { padding: .2rem .55rem; font-size: .85rem; }
.btn:disabled { opacity: .55; cursor: not-allowed; }

.message { padding: 1rem 1.25rem; border-radius: 8px; background: var(--surface); border: 1px solid var(--bordure); margin: 0 0 1rem; }
.message p { margin: 0 0 .5rem; }
.message h2 { margin: 0 0 .25rem; font-size: 1.1rem; }
.erreur { background: #fdecea; border-color: var(--danger); color: #7a1712; }
.succes { background: #e3f1e5; border-color: #2e7d3f; color: #1d5a2a; }
.sr-only { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden;
  clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
</style>
