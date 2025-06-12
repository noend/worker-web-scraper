export interface Product {
  url: string;
  name: string;
  price: string;
  images: string[];
}

export interface ProductSource {
  canHandle(url: string): boolean;
  scrape(url: string): Promise<Product>;
}
