import { ProductSource } from '../interfaces/product';
import { EmagSource } from './emag';
import { TechnopolisSource } from './technopolis';

export class ProductSourceFactory {
  private sources: ProductSource[] = [new EmagSource(), new TechnopolisSource()];
  getSource(url: string): ProductSource | undefined {
    return this.sources.find(source => source.canHandle(url));
  }
}
