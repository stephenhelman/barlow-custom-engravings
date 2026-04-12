import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("╔════════════════════════════════════════╗");
  console.log("║   Barlow Custom Engravings — DB Seed   ║");
  console.log("╚════════════════════════════════════════╝\n");

  // ── Admin user ────────────────────────────────────────────────────────────
  console.log("── Admin user ─────────────────────────────");

  const rawPassword = process.env.ADMIN_PASSWORD?.trim();
  const adminEmail = (process.env.ADMIN_EMAIL?.trim()) ?? "michelle.barlow@barlowcustomengravings.com";

  if (!rawPassword) {
    console.error("❌  ADMIN_PASSWORD is not set in your .env file.");
    console.error("   Add it and re-run: npm run db:seed\n");
    process.exit(1);
  }

  if (rawPassword.length < 8) {
    console.error("❌  ADMIN_PASSWORD must be at least 8 characters.\n");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(rawPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: { email: adminEmail, passwordHash, name: "Michelle Barlow" },
  });

  console.log(`✓ Admin user upserted: ${adminEmail}`);

  // ── Tags ──────────────────────────────────────────────────────────────────
  console.log("\n── Tags ───────────────────────────────────");
  const typeTags = ["Wallet", "Trifold Wallet", "Bifold Wallet", "Wood Panel", "Keychain", "Dog Tag"];
  const themeTags = ["NFL", "NBA", "NCAA", "Anime", "Dragon", "Skull", "Western", "Military", "Custom Name", "Pop Culture"];

  for (const name of typeTags) {
    await prisma.tag.upsert({ where: { name }, update: {}, create: { name, category: "TYPE" } });
  }
  for (const name of themeTags) {
    await prisma.tag.upsert({ where: { name }, update: {}, create: { name, category: "THEME" } });
  }
  console.log(`✓ ${typeTags.length} type tags, ${themeTags.length} theme tags`);

  // ── Offerings ─────────────────────────────────────────────────────────────
  console.log("\n── Offerings ──────────────────────────────");
  const offerings = [
    { name: "Bifold Leather Wallet", description: "Classic two-fold wallet with custom engraving.", price: 20, unit: "each", sortOrder: 0 },
    { name: "Trifold Leather Wallet", description: "Three-fold wallet with multiple card slots.", price: 30, unit: "each", sortOrder: 1 },
    { name: "Wood Art Panel", description: "Custom laser-engraved wood panel. Price based on size and complexity.", price: 0, unit: "each", sortOrder: 2 },
    { name: "Dog Tag", description: "Stainless steel or aluminum dog tag with custom engraving.", price: 10, unit: "each", sortOrder: 3 },
    { name: "Keychain", description: "Leather or metal keychain with custom engraving.", price: 10, unit: "each", sortOrder: 4 },
  ];

  for (const o of offerings) {
    await prisma.offering.upsert({
      where: { id: `seed-${o.name.toLowerCase().replace(/\s+/g, "-")}` },
      update: {},
      create: { id: `seed-${o.name.toLowerCase().replace(/\s+/g, "-")}`, ...o, active: true },
    });
  }
  console.log(`✓ ${offerings.length} offerings`);

  console.log("\n✅  Seed complete.\n");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
