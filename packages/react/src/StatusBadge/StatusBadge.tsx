import {
  iconCalendar,
  iconCard,
  iconClock,
  iconClose,
  iconEdit,
  iconError,
  iconEyeOff,
  iconFile,
  iconKey,
  iconLock,
  iconRefresh,
  iconSend,
  iconSuccess,
  iconTrash,
  iconUndo,
  iconWarning,
  type IconDefinition,
} from '@negaresh/icons';
import type { ReactNode, Ref } from 'react';
import { Badge, type BadgeSize, type BadgeTone } from '../Badge/Badge.tsx';
import type { NdsMessages } from '../messages/types.ts';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';

export type OrderStatus = keyof NdsMessages['statusLabels']['order'];
export type PaymentStatus = keyof NdsMessages['statusLabels']['payment'];
export type SerialStatus = keyof NdsMessages['statusLabels']['serial'];
export type ReviewStatus = keyof NdsMessages['statusLabels']['review'];
export type ReportStatus = keyof NdsMessages['statusLabels']['report'];
export type CampaignStatus = keyof NdsMessages['statusLabels']['campaign'];

export type StatusDomain = keyof NdsMessages['statusLabels'];

interface StatusMeta {
  tone: BadgeTone;
  icon: IconDefinition;
}

const ORDER_META: Record<OrderStatus, StatusMeta> = {
  awaiting_payment: { tone: 'warning', icon: iconClock },
  paid: { tone: 'info', icon: iconCard },
  processing: { tone: 'info', icon: iconRefresh },
  shipped: { tone: 'accent', icon: iconSend },
  completed: { tone: 'success', icon: iconSuccess },
  cancelled: { tone: 'neutral', icon: iconClose },
  refunded: { tone: 'neutral', icon: iconUndo },
};

const PAYMENT_META: Record<PaymentStatus, StatusMeta> = {
  pending: { tone: 'warning', icon: iconClock },
  paid: { tone: 'success', icon: iconSuccess },
  failed: { tone: 'danger', icon: iconError },
  cancelled: { tone: 'neutral', icon: iconClose },
  refunded: { tone: 'info', icon: iconUndo },
};

const SERIAL_META: Record<SerialStatus, StatusMeta> = {
  active: { tone: 'success', icon: iconSuccess },
  unused: { tone: 'neutral', icon: iconKey },
  limit_reached: { tone: 'warning', icon: iconWarning },
  revoked: { tone: 'danger', icon: iconError },
  expired: { tone: 'neutral', icon: iconClock },
};

const REVIEW_META: Record<ReviewStatus, StatusMeta> = {
  draft: { tone: 'neutral', icon: iconEdit },
  submitted: { tone: 'info', icon: iconSend },
  changes_requested: { tone: 'warning', icon: iconWarning },
  scheduled: { tone: 'accent', icon: iconCalendar },
  published: { tone: 'success', icon: iconSuccess },
  unpublished: { tone: 'neutral', icon: iconEyeOff },
};

const REPORT_META: Record<ReportStatus, StatusMeta> = {
  none: { tone: 'neutral', icon: iconFile },
  pending: { tone: 'info', icon: iconClock },
  ready: { tone: 'success', icon: iconSuccess },
  failed: { tone: 'danger', icon: iconError },
  purged: { tone: 'neutral', icon: iconTrash },
};

const CAMPAIGN_META: Record<CampaignStatus, StatusMeta> = {
  draft: { tone: 'neutral', icon: iconEdit },
  active: { tone: 'success', icon: iconSuccess },
  full: { tone: 'warning', icon: iconWarning },
  closed: { tone: 'neutral', icon: iconLock },
  expired: { tone: 'neutral', icon: iconClock },
};

type DomainStatusPair =
  | { domain: 'order'; status: OrderStatus }
  | { domain: 'payment'; status: PaymentStatus }
  | { domain: 'serial'; status: SerialStatus }
  | { domain: 'review'; status: ReviewStatus }
  | { domain: 'report'; status: ReportStatus }
  | { domain: 'campaign'; status: CampaignStatus };

export type StatusBadgeProps = DomainStatusPair & {
  /** Override the default localised Persian label from `NdsMessages`. */
  label?: ReactNode;
  /** Badge size. Default `'md'`. */
  size?: BadgeSize | undefined;
  /** Show the mapped semantic icon alongside the word. Default `true`. */
  showIcon?: boolean | undefined;
  /** Optional leading dot when `showIcon` is `false`. */
  dot?: boolean | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLSpanElement> | undefined;
};

function resolveStatus(
  props: DomainStatusPair,
  labels: NdsMessages['statusLabels'],
): { meta: StatusMeta; label: string } {
  switch (props.domain) {
    case 'order':
      return { meta: ORDER_META[props.status], label: labels.order[props.status] };
    case 'payment':
      return { meta: PAYMENT_META[props.status], label: labels.payment[props.status] };
    case 'serial':
      return { meta: SERIAL_META[props.status], label: labels.serial[props.status] };
    case 'review':
      return { meta: REVIEW_META[props.status], label: labels.review[props.status] };
    case 'report':
      return { meta: REPORT_META[props.status], label: labels.report[props.status] };
    case 'campaign':
      return { meta: CAMPAIGN_META[props.status], label: labels.campaign[props.status] };
  }
}

/**
 * Domain-typed status pill composed on `<Badge>` covering order, payment, serial,
 * content review, report, and campaign states. Always renders a Persian word plus icon.
 */
export function StatusBadge(props: StatusBadgeProps) {
  const { label, size = 'md', showIcon = true, dot = false, className, ref } = props;
  const messages = useNdsMessages();
  const resolved = resolveStatus(props, messages.statusLabels);

  return (
    <Badge
      ref={ref}
      tone={resolved.meta.tone}
      size={size}
      {...(showIcon ? { icon: resolved.meta.icon } : {})}
      dot={dot}
      className={className}
    >
      {label ?? resolved.label}
    </Badge>
  );
}
