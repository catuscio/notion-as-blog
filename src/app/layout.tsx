import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ThemeProvider } from "next-themes";
import { brand } from "@/config/brand";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WebSiteJsonLd, OrganizationJsonLd } from "@/components/seo/JsonLd";
import "./globals.css";

export const revalidate = 1800;

function buildThemeCSS() {
  const toVars = (colors: Record<string, string>) =>
    Object.entries(colors)
      .map(([k, v]) => `--${k}: hsl(${v});`)
      .join("\n  ");
  const fontVars = `--brand-font-sans: ${brand.fonts.sans.stack};\n  --font-mono-code: "${brand.fonts.mono.family}", monospace;`;
  return `:root {\n  ${fontVars}\n  ${toVars(brand.colors.light)}\n}\n.dark {\n  ${toVars(brand.colors.dark)}\n}`;
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: `hsl(${brand.colors.light.background})` },
    { media: "(prefers-color-scheme: dark)", color: `hsl(${brand.colors.dark.background})` },
  ],
};

export const metadata: Metadata = {
  title: {
    default: `${brand.name} — ${brand.title}`,
    template: `%s | ${brand.name}`,
  },
  description: brand.description,
  keywords: brand.keywords.length > 0 ? brand.keywords : undefined,
  metadataBase: new URL(brand.url),
  openGraph: {
    title: brand.name,
    description: brand.description,
    url: brand.url,
    siteName: brand.name,
    locale: brand.lang,
    type: "website",
    images: [{ url: brand.assets.ogImage, width: brand.assets.ogWidth, height: brand.assets.ogHeight }],
  },
  twitter: {
    card: "summary_large_image",
    title: brand.name,
    description: brand.description,
    images: [brand.assets.ogImage],
  },
  alternates: {
    canonical: brand.url,
  },
  verification: {
    google: brand.verification.google || undefined,
    other: Object.fromEntries(
      (
        [
          brand.verification.naver ? ["naver-site-verification", brand.verification.naver] : null,
          brand.verification.microsoft ? ["msvalidate.01", brand.verification.microsoft] : null,
        ] as const
      ).filter((e): e is [string, string] => e !== null),
    ),
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={brand.lang} suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: buildThemeCSS() }} />
        {brand.fonts.mono.preconnect.map((url) => (
          <link key={url} rel="preconnect" href={url} crossOrigin="anonymous" />
        ))}
        <link
          rel="preload"
          as="style"
          crossOrigin="anonymous"
          href={brand.fonts.mono.cdn}
        />
        <link
          rel="stylesheet"
          crossOrigin="anonymous"
          href={brand.fonts.mono.cdn}
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title={brand.title}
          href={`${brand.url}/feed.xml`}
        />
        <WebSiteJsonLd />
        <OrganizationJsonLd />
      </head>
      <body
        className="font-sans antialiased overflow-x-clip selection:bg-primary/20 selection:text-primary"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
        {brand.analytics.gaId && <GoogleAnalytics gaId={brand.analytics.gaId} />}
      </body>
    </html>
  );
}
