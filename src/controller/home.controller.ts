/*
 * SmartREST - Hono Edition
 * Copyright (c) Alessio Saltarin, 2026
 * This software is licensed under ISC License
 * See LICENSE
 */

import { Hono } from 'hono'
import { html } from 'hono/html'

export const homeController = () => {
  const app = new Hono()

  app.get('/', (c) => {
    const pageHtml = html`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SmartREST - Hono Edition</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-primary: #0a0d14;
      --bg-secondary: #121824;
      --bg-card: rgba(22, 30, 46, 0.7);
      --border-color: rgba(255, 255, 255, 0.08);
      --border-hover: rgba(99, 102, 241, 0.4);
      --text-primary: #f8fafc;
      --text-secondary: #94a3b8;
      --text-muted: #64748b;
      --accent-primary: #6366f1;
      --accent-gradient: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
      --accent-glow: rgba(99, 102, 241, 0.25);
      --btn-secondary-bg: rgba(255, 255, 255, 0.06);
      --btn-secondary-hover: rgba(255, 255, 255, 0.12);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: var(--bg-primary);
      color: var(--text-primary);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      line-height: 1.6;
      overflow-x: hidden;
    }

    .background-decorations {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
    }

    .glow-sphere-1 {
      position: absolute;
      top: -150px;
      left: 50%;
      transform: translateX(-50%);
      width: 700px;
      height: 450px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, rgba(168, 85, 247, 0.08) 40%, transparent 70%);
      filter: blur(60px);
    }

    .glow-sphere-2 {
      position: absolute;
      bottom: -100px;
      right: -100px;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, transparent 70%);
      filter: blur(80px);
    }

    .container {
      max-width: 1140px;
      margin: 0 auto;
      padding: 0 2rem;
      width: 100%;
      position: relative;
      z-index: 1;
    }

    header {
      padding: 2rem 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border-color);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: var(--text-primary);
      font-weight: 700;
      font-size: 1.25rem;
      letter-spacing: -0.02em;
    }

    .brand-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: var(--accent-gradient);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px var(--accent-glow);
    }

    .brand-badge {
      font-size: 0.75rem;
      font-weight: 600;
      background: rgba(99, 102, 241, 0.15);
      color: #818cf8;
      padding: 0.2rem 0.6rem;
      border-radius: 9999px;
      border: 1px solid rgba(99, 102, 241, 0.3);
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }

    .nav-link {
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.925rem;
      font-weight: 500;
      transition: color 0.2s;
    }

    .nav-link:hover {
      color: var(--text-primary);
    }

    .nav-github-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
      padding: 0.45rem 0.9rem;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      font-size: 0.875rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .nav-github-btn:hover {
      background: rgba(255, 255, 255, 0.16);
      border-color: rgba(255, 255, 255, 0.3);
      color: #ffffff;
      transform: translateY(-1px);
    }

    /* Hero Section */
    .hero {
      padding: 6rem 0 4rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .pill-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 1rem;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-color);
      border-radius: 9999px;
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin-bottom: 2rem;
      backdrop-filter: blur(8px);
    }

    .pill-badge .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 8px #10b981;
    }

    .hero-title {
      font-size: clamp(2.5rem, 5vw, 4rem);
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.15;
      margin-bottom: 1.5rem;
      max-width: 850px;
    }

    .gradient-text {
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-subtitle {
      font-size: clamp(1.1rem, 2vw, 1.25rem);
      color: var(--text-secondary);
      max-width: 680px;
      margin-bottom: 3rem;
      font-weight: 400;
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      gap: 1.25rem;
      margin-bottom: 4rem;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.6rem;
      padding: 0.9rem 1.8rem;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      border: 1px solid transparent;
    }

    .btn-primary {
      background: var(--accent-gradient);
      color: #ffffff;
      box-shadow: 0 6px 20px var(--accent-glow);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 26px rgba(99, 102, 241, 0.4);
    }

    .btn-secondary {
      background: var(--btn-secondary-bg);
      color: var(--text-primary);
      border-color: var(--border-color);
      backdrop-filter: blur(8px);
    }

    .btn-secondary:hover {
      background: var(--btn-secondary-hover);
      border-color: var(--border-hover);
      transform: translateY(-2px);
    }

    .btn-github {
      background: #24292e;
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.18);
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
    }

    .btn-github:hover {
      background: #2f363d;
      border-color: rgba(255, 255, 255, 0.35);
      color: #ffffff;
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    }

    .btn-icon {
      display: inline-block;
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }

    /* Feature Grid */
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
      margin: 2rem 0 5rem;
    }

    .feature-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 1.75rem;
      backdrop-filter: blur(12px);
      transition: border-color 0.2s, transform 0.2s;
    }

    .feature-card:hover {
      border-color: var(--border-hover);
      transform: translateY(-3px);
    }

    .feature-icon-wrapper {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: rgba(99, 102, 241, 0.1);
      border: 1px solid rgba(99, 102, 241, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.25rem;
      color: #818cf8;
    }

    .feature-title {
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
    }

    .feature-desc {
      font-size: 0.9rem;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    footer {
      margin-top: auto;
      border-top: 1px solid var(--border-color);
      padding: 2.5rem 0;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.875rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
    }

    .footer-links {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .footer-link {
      color: var(--text-secondary);
      text-decoration: none;
      transition: color 0.2s;
    }

    .footer-link:hover {
      color: var(--accent-primary);
    }

    @media (max-width: 640px) {
      .hero {
        padding: 4rem 0 3rem;
      }
      .hero-actions {
        flex-direction: column;
        width: 100%;
      }
      .btn {
        width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="background-decorations">
    <div class="glow-sphere-1"></div>
    <div class="glow-sphere-2"></div>
  </div>

  <div class="container">
    <header>
      <a href="/" class="brand">
        <div class="brand-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
        </div>
        <span>SmartREST</span>
        <span class="brand-badge">Hono Edition</span>
      </a>
      <nav class="nav-links">
        <a href="/swagger" class="nav-link">Swagger UI</a>
        <a href="/doc" class="nav-link">OpenAPI Spec</a>
        <a href="https://github.com/guildenstern70/smartrest-hono" target="_blank" rel="noopener noreferrer" class="nav-github-btn" id="header-github-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
          </svg>
          <span>GitHub</span>
        </a>
      </nav>
    </header>

    <main>
      <section class="hero">
        <div class="pill-badge">
          <span class="dot"></span>
          <span>High Performance TypeScript REST Template</span>
        </div>

        <h1 class="hero-title">
          Build modern microservices with <span class="gradient-text">Hono &amp; Drizzle</span>
        </h1>

        <p class="hero-subtitle">
          SmartREST Hono provides a lightweight, clean, and production-ready architecture powered by Bun, Hono, Drizzle ORM, Zod validation, and embedded SQLite.
        </p>

        <div class="hero-actions">
          <a href="/swagger" class="btn btn-primary" id="btn-swagger">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            <span>Swagger UI Documentation</span>
          </a>

          <a href="/doc/download" class="btn btn-secondary" id="btn-download-openapi" download="openapi.json">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>Download OpenAPI JSON</span>
          </a>

          <a href="https://github.com/guildenstern70/smartrest-hono" target="_blank" rel="noopener noreferrer" class="btn btn-github" id="btn-github">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
            </svg>
            <span>View on GitHub</span>
          </a>
        </div>
      </section>

      <section class="features-grid">
        <div class="feature-card">
          <div class="feature-icon-wrapper">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
              <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
              <line x1="6" y1="6" x2="6.01" y2="6"></line>
              <line x1="6" y1="18" x2="6.01" y2="18"></line>
            </svg>
          </div>
          <h3 class="feature-title">Embedded SQLite</h3>
          <p class="feature-desc">Zero-setup relational storage with native Bun and serverless speed and full foreign key support.</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon-wrapper">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </div>
          <h3 class="feature-title">Drizzle ORM</h3>
          <p class="feature-desc">Type-safe SQL dialect with zero overhead and full relation querying capabilities.</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon-wrapper">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <h3 class="feature-title">Zod Validation</h3>
          <p class="feature-desc">Runtime type validation and strict schema enforcement for inputs, DTOs, and API contracts.</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon-wrapper">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
          </div>
          <h3 class="feature-title">Swagger &amp; OpenAPI</h3>
          <p class="feature-desc">Self-documenting APIs with interactive SwaggerUI and downloadable OpenAPI definitions.</p>
        </div>
      </section>
    </main>

    <footer>
      <div class="footer-links">
        <a href="/swagger" class="footer-link">Swagger UI</a>
        <a href="/doc" class="footer-link">OpenAPI Spec</a>
        <a href="https://github.com/guildenstern70/smartrest-hono" target="_blank" rel="noopener noreferrer" class="footer-link">GitHub Repository</a>
      </div>
      <p>SmartREST - Hono Edition &copy; 2026 Alessio Saltarin. Licensed under ISC License.</p>
    </footer>
  </div>
</body>
</html>`
    return c.html(pageHtml)
  })

  return app
}
