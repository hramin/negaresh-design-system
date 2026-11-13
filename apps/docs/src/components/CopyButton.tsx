import { useEffect, useState } from 'react';
import styles from './CopyButton.module.css';

/**
 * Copies `value` to the clipboard. Progressive enhancement: renders nothing until
 * hydrated, because it cannot work without JavaScript.
 */
export function CopyButton({ value, label, done }: { value: string; label: string; done: string }) {
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => setReady(true), []);
  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(id);
  }, [copied]);
  if (!ready) return null;
  return (
    <>
      <button
        type="button"
        className={styles.button}
        aria-label={`${label} ${value}`}
        onClick={() => {
          void navigator.clipboard?.writeText(value).then(() => setCopied(true));
        }}
      >
        {copied ? done : label}
      </button>
      <span className={styles.status} role="status">
        {copied ? done : ''}
      </span>
    </>
  );
}
