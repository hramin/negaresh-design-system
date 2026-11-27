import { iconCart, iconStar } from '@negaresh/icons';
import {
  Accordion,
  AccordionItem,
  Badge,
  Button,
  ChoiceCard,
  Heading,
  Icon,
  Image,
  Inline,
  type KeyValueEntry,
  KeyValueList,
  RadioGroup,
  Section,
  Stack,
  Surface,
  Text,
  ToggleButton,
} from '@negaresh/react';
import { type Ref, useState } from 'react';
import { cx } from '../internal/cx.ts';
import { usePatternMessages } from '../messages/context.tsx';
import styles from './commerce.module.css';
import { Price } from './Price.tsx';
import { ProductCard, type ProductCardItem } from './ProductCard.tsx';

export interface ProductGalleryItem {
  id: string;
  src: string;
  alt: string;
}

export interface ProductEdition {
  id: string;
  title: string;
  description?: string | undefined;
  price: number;
  originalPrice?: number | undefined;
  badge?: string | undefined;
  isDisabled?: boolean | undefined;
}

export interface ProductFaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface ProductPageProps {
  title: string;
  summary: string;
  category?: string | undefined;
  gallery: readonly ProductGalleryItem[];
  editions: readonly ProductEdition[];
  selectedEditionId?: string | undefined;
  defaultEditionId?: string | undefined;
  onEditionChange?: ((editionId: string) => void) | undefined;
  isWishlisted?: boolean | undefined;
  onToggleWishlist?: ((selected: boolean) => void) | undefined;
  onAddToCart?: ((editionId: string) => void) | undefined;
  systemRequirements?: readonly KeyValueEntry[] | undefined;
  faqs?: readonly ProductFaqItem[] | undefined;
  relatedProducts?: readonly ProductCardItem[] | undefined;
  onAddRelatedToCart?: ((productId: string) => void) | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/**
 * Full product detail pattern: accessible gallery with thumbnails, `ChoiceCard` edition picker,
 * Toman `Price`, add-to-cart & wishlist controls, system requirements `KeyValueList`, FAQ `Accordion`,
 * and related products grid.
 */
export function ProductPage({
  title,
  summary,
  category,
  gallery,
  editions,
  selectedEditionId,
  defaultEditionId,
  onEditionChange,
  isWishlisted = false,
  onToggleWishlist,
  onAddToCart,
  systemRequirements,
  faqs,
  relatedProducts,
  onAddRelatedToCart,
  className,
  ref,
}: ProductPageProps) {
  const { commerce } = usePatternMessages();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [internalEditionId, setInternalEditionId] = useState(
    defaultEditionId ?? editions[0]?.id ?? '',
  );

  const currentEditionId = selectedEditionId ?? internalEditionId;
  const activeEdition = editions.find((e) => e.id === currentEditionId) ?? editions[0];
  const activeImage = gallery[activeImageIndex] ?? gallery[0];

  const handleEditionChange = (nextId: string) => {
    if (selectedEditionId === undefined) setInternalEditionId(nextId);
    onEditionChange?.(nextId);
  };

  return (
    <article ref={ref} data-nds="ProductPage" className={cx(className)}>
      <Stack gap="8">
        <div className={styles.productHero}>
          {activeImage && (
            <section className={styles.gallery} aria-label={commerce.galleryLabel}>
              <div className={styles.galleryMain}>
                <Image src={activeImage.src} alt={activeImage.alt} ratio="16/9" loading="eager" />
              </div>
              {gallery.length > 1 && (
                <div className={styles.galleryThumbs}>
                  {gallery.map((img, idx) => (
                    <button
                      key={img.id}
                      type="button"
                      className={styles.galleryThumb}
                      aria-pressed={idx === activeImageIndex}
                      aria-label={commerce.galleryThumbLabel(idx + 1, gallery.length)}
                      onClick={() => setActiveImageIndex(idx)}
                    >
                      <img src={img.src} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </section>
          )}

          <Surface>
            <Section>
              <Stack gap="4">
                <Stack gap="2">
                  {category && (
                    <Inline gap="2">
                      <Badge tone="neutral" size="sm">
                        {category}
                      </Badge>
                    </Inline>
                  )}
                  <Heading level={2}>{title}</Heading>
                  <Text as="p" tone="muted" leading="text">
                    {summary}
                  </Text>
                </Stack>

                {editions.length > 0 && (
                  <RadioGroup
                    label={commerce.editionsHeading}
                    value={currentEditionId}
                    onChange={handleEditionChange}
                  >
                    {editions.map((edition) => (
                      <ChoiceCard
                        key={edition.id}
                        value={edition.id}
                        title={edition.title}
                        {...(edition.description !== undefined
                          ? { description: edition.description }
                          : {})}
                        {...(edition.badge !== undefined
                          ? { badge: <Badge tone="accent" size="sm">{edition.badge}</Badge> }
                          : {})}
                        price={edition.price}
                        {...(edition.isDisabled !== undefined
                          ? { isDisabled: edition.isDisabled }
                          : {})}
                      />
                    ))}
                  </RadioGroup>
                )}

                {activeEdition && (
                  <Inline gap="4">
                    <Price
                      amount={activeEdition.price}
                      {...(activeEdition.originalPrice !== undefined
                        ? { originalAmount: activeEdition.originalPrice }
                        : {})}
                      size="lg"
                    />
                  </Inline>
                )}

                <Inline gap="3">
                  {activeEdition && onAddToCart && (
                    <Button
                      variant="primary"
                      size="lg"
                      iconStart={iconCart}
                      onPress={() => onAddToCart(activeEdition.id)}
                    >
                      {commerce.addToCart}
                    </Button>
                  )}
                  {onToggleWishlist && (
                    <ToggleButton
                      size="md"
                      isSelected={isWishlisted}
                      onChange={onToggleWishlist}
                      aria-label={
                        isWishlisted ? commerce.removeFromWishlist : commerce.addToWishlist
                      }
                    >
                      <Icon icon={iconStar} size="sm" />
                      {isWishlisted ? commerce.removeFromWishlist : commerce.addToWishlist}
                    </ToggleButton>
                  )}
                </Inline>
              </Stack>
            </Section>
          </Surface>
        </div>

        {systemRequirements && systemRequirements.length > 0 && (
          <Surface>
            <Section>
              <Stack gap="3">
                <Heading level={3}>{commerce.systemRequirementsHeading}</Heading>
                <KeyValueList items={systemRequirements} />
              </Stack>
            </Section>
          </Surface>
        )}

        {faqs && faqs.length > 0 && (
          <Stack gap="3">
            <Heading level={3}>{commerce.faqHeading}</Heading>
            <Accordion defaultExpandedKeys={[faqs[0]?.id ?? '']}>
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} id={faq.id} title={faq.question}>
                  <Text as="p" tone="muted" leading="text">
                    {faq.answer}
                  </Text>
                </AccordionItem>
              ))}
            </Accordion>
          </Stack>
        )}

        {relatedProducts && relatedProducts.length > 0 && (
          <Stack gap="3">
            <Heading level={3}>{commerce.relatedProductsHeading}</Heading>
            <div className={styles.cardGrid}>
              {relatedProducts.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  {...(onAddRelatedToCart !== undefined ? { onAddToCart: onAddRelatedToCart } : {})}
                />
              ))}
            </div>
          </Stack>
        )}
      </Stack>
    </article>
  );
}
