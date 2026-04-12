import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Tags
  const typeTags = [
    "Wallet",
    "Trifold Wallet",
    "Bifold Wallet",
    "Wood Panel",
    "Keychain",
    "Dog Tag",
  ];
  const themeTags = [
    "NFL",
    "NBA",
    "NCAA",
    "Anime",
    "Dragon",
    "Skull",
    "Western",
    "Military",
    "Custom Name",
    "Pop Culture",
  ];

  console.log("Creating tags...");
  for (const name of typeTags) {
    await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name, category: "TYPE" },
    });
  }
  for (const name of themeTags) {
    await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name, category: "THEME" },
    });
  }

  // Offerings
  console.log("Creating offerings...");
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
      create: {
        id: `seed-${o.name.toLowerCase().replace(/\s+/g, "-")}`,
        ...o,
        active: true,
      },
    });
  }

  // Admin user note
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminHash = process.env.ADMIN_PASSWORD_HASH;

  if (adminEmail && adminHash) {
    console.log(`Admin configured: ${adminEmail}`);
  } else {
    console.log("\n⚠️  Admin credentials not set in .env");
    console.log("   Generate a password hash with:");
    console.log("   node -e \"require('bcryptjs').hash('yourpassword', 12).then(h => console.log(h))\"");
    console.log("   Then set ADMIN_EMAIL and ADMIN_PASSWORD_HASH in .env.local\n");
  }

  console.log("✅ Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
