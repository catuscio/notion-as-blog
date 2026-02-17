"use client";

import { brand } from "@/config/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterCTA() {
  if (!brand.newsletter.enabled) return null;

  return (
    <section className="max-w-[1024px] mx-auto px-6 mb-20" id="subscribe">
      <div className="bg-muted rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-xl mx-auto">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-background shadow-sm text-primary mb-6">
            <span className="material-symbols-outlined text-[24px]">mail</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Stay ahead of the curve
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Join developers receiving the best content on tech, design, and AI
            directly in their inbox every week.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-3"
            onSubmit={(e) => e.preventDefault()}
          >
            <Input
              type="email"
              placeholder="Enter your email address"
              required
              className="flex-1 px-5 py-3.5 rounded-xl h-auto"
            />
            <Button
              type="submit"
              className="px-8 py-3.5 rounded-xl font-bold h-auto shadow-md"
            >
              Subscribe
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-4">
            No spam, unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
