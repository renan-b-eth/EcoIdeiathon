"use client";

import Link from "next/link";
import { Brain } from "lucide-react";

interface NavbarProps {
  showBackLink?: boolean;
  showNavLinks?: boolean;
}

export default function Navbar({ showBackLink = false, showNavLinks = true }: NavbarProps) {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/85 backdrop-blur-xl border-b border-border">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-chart-5 to-accent">
            <Brain size={20} className="text-primary-foreground" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-foreground">
            NeuroVox
            <span className="bg-gradient-to-r from-primary via-chart-5 to-accent bg-clip-text text-transparent">
              {" "}AI
            </span>
          </span>
        </Link>

        {showNavLinks && (
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How it Works
            </a>
            <a href="#biomarkers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Biomarkers
            </a>
            <a href="#research" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Research
            </a>
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Start Analysis
            </Link>
          </div>
        )}

        {showBackLink && (
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors no-underline"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Back to Home
          </Link>
        )}
      </div>
    </nav>
  );
}
