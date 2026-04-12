import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ItemCard } from "@/components/public/ItemCard";
import { HeroOrderButton } from "@/components/public/HeroOrderButton";
import type { ItemWithTags } from "@/types";

async function getHomeData() {
  const [offerings, featuredItems] = await Promise.all([
    prisma.offering.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.item.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { tags: { include: { tag: true } } },
    }),
  ]);
  return { offerings, featuredItems };
}

export default async function HomePage() {
  const { offerings, featuredItems } = await getHomeData();

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden grid-texture leather-texture">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-bg via-bg to-surface-raised pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div className="flex flex-col gap-6">
              <span className="inline-flex items-center gap-2 text-leather font-body text-sm font-medium uppercase tracking-widest">
                <span className="w-8 h-px bg-leather inline-block" />
                Handcrafted in El Paso, TX
              </span>

              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold text-text leading-[1.05]">
                Every piece,{" "}
                <em className="text-leather-light not-italic italic">
                  engraved
                </em>{" "}
                with intention.
              </h1>

              <p className="text-text-muted font-body text-lg leading-relaxed max-w-md">
                Custom laser engravings on leather wallets, wood panels, keychains, and dog tags.
                One-of-a-kind pieces made to order.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-leather hover:bg-leather-light text-bg font-body font-semibold text-sm px-6 py-3 rounded transition-colors"
                >
                  Browse Shop
                </Link>
                <HeroOrderButton />
              </div>
            </div>

            {/* Right: Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
              {[
                { value: "Starting at $10", label: "Competitive pricing" },
                { value: "Same-Day", label: "Available at swap meet" },
                { value: "Unlimited", label: "Custom designs available" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-surface/80 backdrop-blur-sm border border-border rounded-xl p-4 flex flex-col gap-1"
                >
                  <span className="font-display text-leather-light text-xl font-semibold">{stat.value}</span>
                  <span className="text-text-muted font-body text-xs leading-snug">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Offerings strip */}
      {offerings.length > 0 && (
        <section className="py-16 bg-surface border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl font-semibold text-text">What We Make</h2>
              <Link href="/shop" className="text-sm text-leather font-body hover:text-leather-light transition-colors">
                Shop all →
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none">
              {offerings.map((o) => (
                <div
                  key={o.id}
                  className="shrink-0 snap-start w-48 sm:w-56 bg-surface-raised border border-border rounded-xl p-4 flex flex-col gap-2"
                >
                  <span className="font-display text-sm font-semibold text-text">{o.name}</span>
                  {o.description && (
                    <p className="text-xs text-text-muted font-body leading-relaxed line-clamp-3">
                      {o.description}
                    </p>
                  )}
                  <span className="text-leather-light font-body font-semibold text-sm mt-auto">
                    {Number(o.price) === 0 ? "Custom Quote" : `$${Number(o.price).toFixed(2)}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured gallery */}
      {featuredItems.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl font-semibold text-text">Recent Work</h2>
              <Link href="/gallery" className="text-sm text-leather font-body hover:text-leather-light transition-colors">
                Full gallery →
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none">
              {featuredItems.map((item) => (
                <div key={item.id} className="shrink-0 snap-start w-56 sm:w-64">
                  <ItemCard item={item as ItemWithTags} variant="gallery" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="py-16 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-2xl font-semibold text-text text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Choose Your Product",
                desc: "Wallet, keychain, dog tag, wood panel — pick your canvas from our lineup.",
              },
              {
                step: "02",
                title: "Share Your Idea",
                desc: "Tell us what to engrave — a name, logo, design, or anything you can imagine.",
              },
              {
                step: "03",
                title: "We Craft It",
                desc: "Your piece is laser-engraved by hand with care and precision.",
              },
              {
                step: "04",
                title: "Pick It Up",
                desc: "Find us at the El Paso Swap Meet or arrange delivery for your custom order.",
              },
            ].map((s) => (
              <div key={s.step} className="flex flex-col gap-3">
                <span className="font-display text-4xl font-bold text-leather/30">{s.step}</span>
                <h3 className="font-display text-base font-semibold text-text">{s.title}</h3>
                <p className="text-sm text-text-muted font-body leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 leather-texture bg-surface-raised">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center gap-6">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-text">
            Can&apos;t find what you want?
          </h2>
          <p className="text-text-muted font-body text-lg">
            Let&apos;s build it. Every design is custom — just tell us what you have in mind.
          </p>
          <HeroOrderButton size="lg" label="Start a Custom Order" />
        </div>
      </section>
    </>
  );
}
