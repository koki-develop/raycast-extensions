import { BrowserExtension, open, showHUD } from "@raycast/api";

const isAmazonUrl = (url: string) => {
  const { hostname } = new URL(url);

  const amazonDomains = [
    "www.amazon.com.au",
    "www.amazon.com.be",
    "www.amazon.com.br",
    "www.amazon.ca",
    "www.amazon.cn",
    "www.amazon.eg",
    "www.amazon.fr",
    "www.amazon.de",
    "www.amazon.in",
    "www.amazon.it",
    "www.amazon.co.jp",
    "www.amazon.com.mx",
    "www.amazon.nl",
    "www.amazon.pl",
    "www.amazon.sa",
    "www.amazon.sg",
    "www.amazon.es",
    "www.amazon.se",
    "www.amazon.com.tr",
    "www.amazon.ae",
    "www.amazon.co.uk",
    "www.amazon.com",
  ];

  return amazonDomains.some((domain) => {
    return hostname.endsWith(domain);
  });
};

const extractAsin = (url: string): string | null => {
  const asinPattern = /\/(dp|gp\/product)\/([A-Z0-9]{10})/;
  const matches = url.match(asinPattern);
  if (!matches) return null;
  return matches[2];
};

export default async function main() {
  const tabs = await BrowserExtension.getTabs();
  const activeTabs = tabs.filter((tab) => tab.active);
  const asins = activeTabs
    .filter((tab) => isAmazonUrl(tab.url))
    .map((tab) => extractAsin(tab.url));
  if (asins.length === 0) {
    await showHUD("No Amazon product tabs found");
    return;
  }

  for (const asin of asins) {
    const sakuraUrl = `https://sakura-checker.jp/search/${asin}`;
    await open(sakuraUrl);
  }
}
