import { iconCart, iconStar, iconTrash } from '@negaresh/icons';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardMedia,
  EmptyState,
  Heading,
  Icon,
  Image,
  Inline,
  LinkButton,
  Stack,
  ToggleButton,
} from '@negaresh/react';
import type { ReactNode, Ref } from 'react';
import { cx } from '../internal/cx.ts';
import { usePatternMessages } from '../messages/context.tsx';
import styles from './commerce.module.css';
import { Price } from './Price.tsx';

export interface ProductCardItem {
  id: string;
  title: string;
  summary?: string | undefined;
  category?: string | undefined;
  imageSrc: string;
  imageAlt: string;
  editionCount?: number | undefined;
  price: number;
  originalPrice?: number | undefined;
  href?: string | undefined;
  isWishlisted?: boolean | undefined;
}

export interface ProductCardProps {
  /** Product summary data. */
  product: ProductCardItem;
  /** Called when the user toggles the wishlist state. */
  onToggleWishlist?: ((id: string, selected: boolean) => void) | undefined;
  /** Called when the user presses the add-to-cart button. */
  onAddToCart?: ((id: string) => void) | undefined;
  /** Optional custom action node replacing the default CTA. */
  action?: ReactNode | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/**
 * Storefront product card composing NDS `Card`, `Image`, `Badge`, `Price` (Toman),
 * and an accessible ≥ 44×44 px wishlist toggle.
 */
export function ProductCard({
  product,
  onToggleWishlist,
  onAddToCart,
  action,
  className,
  ref,
}: ProductCardProps) {
  const { commerce } = usePatternMessages();

  return (
    <Card ref={ref} className={cx(styles.productCard, className)} data-nds="ProductCard">
      <CardMedia className={styles.productMediaWrap}>
        <Image src={product.imageSrc} alt={product.imageAlt} ratio="16/9" />
      </CardMedia>
      <div className={styles.productMediaTop}>
        <Inline gap="2">
          {product.category && (
            <Badge tone="neutral" size="sm">
              {product.category}
            </Badge>
          )}
          {product.editionCount !== undefined && product.editionCount > 1 && (
            <Badge tone="info" size="sm">
              {commerce.editionsCount(product.editionCount)}
            </Badge>
          )}
        </Inline>
        {onToggleWishlist !== undefined && (
          <ToggleButton
            size="sm"
            isSelected={Boolean(product.isWishlisted)}
            onChange={(selected) => onToggleWishlist(product.id, selected)}
            aria-label={
              product.isWishlisted
                ? `${commerce.removeFromWishlist}: ${product.title}`
                : `${commerce.addToWishlist}: ${product.title}`
            }
            className={styles.wishlistToggle}
          >
            <Icon icon={iconStar} size="sm" />
          </ToggleButton>
        )}
      </div>
      <CardBody>
        <Stack gap="2">
          <h3 className={styles.productTitle}>{product.title}</h3>
          {product.summary && <p className={styles.productSummary}>{product.summary}</p>}
        </Stack>
      </CardBody>
      <CardFooter tone="sunken">
        <div className={styles.productFooter}>
          <Price
            amount={product.price}
            {...(product.originalPrice !== undefined ? { originalAmount: product.originalPrice } : {})}
            size="md"
          />
          {action ??
            (onAddToCart !== undefined ? (
              <Button
                variant="primary"
                iconStart={iconCart}
                onPress={() => onAddToCart(product.id)}
              >
                {commerce.addToCart}
              </Button>
            ) : product.href !== undefined ? (
              <LinkButton variant="secondary" href={product.href}>
                {commerce.viewProduct}
              </LinkButton>
            ) : null)}
        </div>
      </CardFooter>
    </Card>
  );
}

export interface WishlistProps {
  /** Saved products. */
  items: readonly ProductCardItem[];
  /** Optional section title (defaults to `messages.commerce.wishlistTitle`). */
  title?: ReactNode | undefined;
  /** Optional unique accessible name when multiple wishlists appear on a page. */
  'aria-label'?: string | undefined;
  /** Called when moving a saved product to the cart. */
  onMoveToCart?: ((id: string) => void) | undefined;
  /** Called when removing a product from the wishlist. */
  onRemove?: ((id: string) => void) | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/** Customer saved wishlist grid with move-to-cart, remove actions, and empty state. */
export function Wishlist({
  items,
  title,
  'aria-label': ariaLabel,
  onMoveToCart,
  onRemove,
  className,
  ref,
}: WishlistProps) {
  const { commerce } = usePatternMessages();
  const headingText = title ?? commerce.wishlistTitle;

  return (
    <section
      ref={ref}
      data-nds="Wishlist"
      aria-label={ariaLabel ?? (typeof headingText === 'string' ? headingText : commerce.wishlistTitle)}
      className={className}
    >
      <Stack gap="4">
        <Heading level={2}>{headingText}</Heading>
        {items.length === 0 ? (
          <EmptyState
            icon={iconStar}
            title={commerce.wishlistEmptyTitle}
            description={commerce.wishlistEmptyDescription}
          />
        ) : (
          <div className={styles.cardGrid}>
            {items.map((item) => (
              <ProductCard
                key={item.id}
                product={{ ...item, isWishlisted: true }}
                action={
                  <Inline gap="2">
                    {onMoveToCart && (
                      <Button
                        variant="primary"
                        iconStart={iconCart}
                        onPress={() => onMoveToCart(item.id)}
                      >
                        {commerce.moveToCart}
                      </Button>
                    )}
                    {onRemove && (
                      <Button
                        variant="ghost"
                        iconStart={iconTrash}
                        aria-label={`${commerce.removeFromWishlist}: ${item.title}`}
                        onPress={() => onRemove(item.id)}
                      >
                        {commerce.removeFromWishlist}
                      </Button>
                    )}
                  </Inline>
                }
              />
            ))}
          </div>
        )}
      </Stack>
    </section>
  );
}
