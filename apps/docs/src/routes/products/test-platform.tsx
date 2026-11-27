import { createFileRoute } from '@tanstack/react-router';
import { findProductDoc } from '../../docs/products/catalog.ts';
import { ProductPageView } from '../../docs/products/ProductPageView.tsx';

export const Route = createFileRoute('/products/test-platform')({
  head: () => ({ meta: [{ title: 'پلتفرم آزمون · محصولات · دیزاین سیستم نگرش' }] }),
  component: () => <ProductPageView product={findProductDoc('test-platform')} />,
});
