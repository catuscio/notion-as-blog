import Image from "next/image";
import Link from "next/link";
import { Github, Twitter, Linkedin, Globe, Mail } from "lucide-react";
import type { TAuthor } from "@/types";
import type { LucideIcon } from "lucide-react";

const socialOrder = ["email", "github", "x", "linkedin", "website"] as const;

const socialIcons: Record<string, { Icon: LucideIcon; label: string }> = {
  email: { Icon: Mail, label: "Email" },
  github: { Icon: Github, label: "GitHub" },
  x: { Icon: Twitter, label: "X" },
  linkedin: { Icon: Linkedin, label: "LinkedIn" },
  website: { Icon: Globe, label: "Website" },
};

export function AuthorCard({
  author,
  authorName,
}: {
  author: TAuthor | null;
  authorName: string;
}) {
  const displayName = author?.name || authorName || "Author";
  const bio = author?.bio || "";
  const role = author?.role || "";
  const avatar = author?.avatar || "";
  const socials = author?.socials || {};

  const activeSocials = socialOrder
    .filter((key) => socials[key])
    .map((key) => [key, socials[key]!] as [string, string]);

  return (
    <div className="bg-muted rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
      <div className="w-20 h-20 rounded-full bg-muted-foreground/10 flex items-center justify-center shrink-0 overflow-hidden">
        {avatar ? (
          <Image
            src={avatar}
            alt={displayName}
            width={80}
            height={80}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="material-symbols-outlined text-[40px] text-muted-foreground">
            person
          </span>
        )}
      </div>
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 mb-2">
          <h3 className="text-lg font-bold">{displayName}</h3>
          {role && (
            <span className="text-sm text-muted-foreground">{role}</span>
          )}
        </div>
        {bio && (
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            {bio}
          </p>
        )}
        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4">
          <Link
            href={`/?author=${encodeURIComponent(displayName)}`}
            className="text-sm font-semibold text-primary hover:underline"
          >
            View all posts &rarr;
          </Link>
          {activeSocials.length > 0 && (
            <span className="w-px h-4 bg-border" />
          )}
        {activeSocials.length > 0 && (
          <div className="flex gap-4">
            {activeSocials.map(([key, url]) => {
              const config = socialIcons[key];
              if (!config) return null;
              const { Icon } = config;
              const href = key === "email" && !url.startsWith("mailto:") ? `mailto:${url}` : url;
              return (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={config.label}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Icon size={20} />
                </a>
              );
            })}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
