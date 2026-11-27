import { createFileRoute } from '@tanstack/react-router';
import { findProductDoc } from '../../docs/products/catalog.ts';
import { ProductPageView } from '../../docs/products/ProductPageView.tsx';

export const Route = createFileRoute('/products/negaresh')({
  head: () => ({ meta: [{ title: 'سایت اصلی نگرش · محصولات · دیزاین سیستم نگرش' }] }),
  component: () => <ProductPageView product={findProductDoc('negaresh')} />,
});
