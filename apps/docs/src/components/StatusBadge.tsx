import styles from './Page.module.css';

/** Pass/fail word plus icon (status is never colour alone). Replaced by the Badge component in P4. */
export function StatusBadge({
  pass,
  passLabel,
  failLabel,
}: {
  pass: boolean;
  passLabel: string;
  failLabel: string;
}) {
  return (
    <span className={`${styles.status} ${pass ? styles.statusPass : styles.statusFail}`}>
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        {pass ? <path d="M5 12.5l4.5 4.5L19 7.5" /> : <path d="M7 7l10 10M17 7L7 17" />}
      </svg>
      {pass ? passLabel : failLabel}
    </span>
  );
}
