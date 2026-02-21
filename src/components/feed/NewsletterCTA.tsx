"use client";

import { Mail } from "lucide-react";
import { brand } from "@/config/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterCTA() {
  if (!brand.newsletter.enabled) return null;

  return (
    <section className="max-w-[1024px] mx-auto px-6 mb-20" id="subscribe">
      <div className="bg-muted rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-xl mx-auto">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-background shadow-sm text-primary mb-6">
            <Mail size={24} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            {brand.newsletter.headline}
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            {brand.newsletter.description}
          </p>
          <form
            className="flex flex-col sm:flex-row gap-3"
            onSubmit={(e) => e.preventDefault()}
          >
            <Input
              type="email"
              placeholder={brand.newsletter.placeholder}
              required
              className="flex-1 px-5 py-3.5 rounded-xl h-auto"
            />
            <Button
              type="submit"
              className="px-8 py-3.5 rounded-xl font-bold h-auto shadow-md"
            >
              {brand.newsletter.cta}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-4">
            {brand.newsletter.disclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}
