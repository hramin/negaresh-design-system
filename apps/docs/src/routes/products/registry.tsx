import { createFileRoute } from '@tanstack/react-router';
import { findProductDoc } from '../../docs/products/catalog.ts';
import { ProductPageView } from '../../docs/products/ProductPageView.tsx';

export const Route = createFileRoute('/products/registry')({
  head: () => ({ meta: [{ title: 'رجیستری · محصولات · دیزاین سیستم نگرش' }] }),
  component: () => <ProductPageView product={findProductDoc('registry')} />,
});
