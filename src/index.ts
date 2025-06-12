import puppeteer from 'puppeteer';
import { Product } from './interfaces/product';
import { PrismaClient } from '@prisma/client';
import { ProductSourceFactory } from './sources/factory';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function addLink(url: string) {
  await prisma.link.upsert({
    where: { url },
    update: {},
    create: { url },
  });
}

async function getUnvisitedLinks(): Promise<string[]> {
  const links = await prisma.link.findMany({ where: { visited: false } });
  return links.map((link: any) => link.url);
}

async function markLinkVisited(url: string) {
  await prisma.link.update({ where: { url }, data: { visited: true } });
}

async function saveProduct(product: Product) {
  await prisma.product.upsert({
    where: { url: product.url },
    update: {
      name: product.name,
      price: product.price,
      images: JSON.stringify(product.images),
    },
    create: {
      url: product.url,
      name: product.name,
      price: product.price,
      images: JSON.stringify(product.images),
    },
  });
}

async function main() {
  const factory = new ProductSourceFactory();

  // Add initial links if table is empty
  const initialLinks = [
    'https://www.emag.bg/k-sport-ksoz015-ramka-za-ljulka-na-shtyrkelovo-gnezdo-cherven-komplekt-ljulki-za-deca-maksimalno-teglo-200-kg-neryzhdaema-stomana-lesen-za-sglobjavane-206-x-164-x-247-cm-mnogocveten-ksoz015superfun/pd/DNG9473BM/?ref=profiled_categories_campaign_1_1&provider=rec&recid=rec_94_1b9fdb8c14a39058218e9d5af806f6b827b28cf704dc2a9a90e0270a2d599e13_1748372046&scenario_ID=94'
  ];
  for (const url of initialLinks) {
    await addLink(url);
  }

  const links = await getUnvisitedLinks();
  for (const url of links) {
    const source = factory.getSource(url);
    if (!source) {
      console.error(`No source handler for: ${url}`);
      await markLinkVisited(url);
      continue;
    }
    try {
      const product = await source.scrape(url);
      await saveProduct(product);
      await markLinkVisited(url);
      console.log(`Saved: ${product.name}`);
    } catch (e) {
      console.error(`Failed to scrape ${url}:`, e);
      await markLinkVisited(url);
    }
  }
  await prisma.$disconnect();
}

main();
