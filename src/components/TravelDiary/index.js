import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import useBaseUrl from '@docusaurus/useBaseUrl';

import styles from './styles.module.css';

const TravelDiaryContext = createContext(null);

/*
 * CURRENT CAMPAIGN DAY
 *
 * Change ONLY these two values when the campaign advances.
 *
 * Examples:
 *
 * March 21:
 * url: '/docs/travel-s-diary/1500/march-current-month'
 * id: 'mar-21'
 *
 * April 1:
 * url: '/docs/travel-s-diary/1500/april'
 * id: 'apr-1'
 */
const CURRENT_DAY = {
  url: '/docs/travel-s-diary/1500/march-current-month',
  id: 'mar-20',
};

export function TravelDiary({children}) {
  const [openEntries, setOpenEntries] = useState(new Set());
  const [activeId, setActiveId] = useState(null);

  const setEntryOpen = (id, open) => {
    setOpenEntries((previous) => {
      const next = new Set(previous);

      if (open) {
        next.add(id);
      } else {
        next.delete(id);
      }

      return next;
    });
  };

  const toggleEntry = (id) => {
    setOpenEntries((previous) => {
      const next = new Set(previous);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  const openEntry = (id) => {
    setEntryOpen(id, true);
    setActiveId(id);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const element = document.getElementById(id);

        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      });
    });
  };

  const expandAll = () => {
    const entries = document.querySelectorAll(
      '[data-travel-diary-entry]'
    );

    setOpenEntries(
      new Set(
        Array.from(entries)
          .map((entry) => entry.id)
          .filter(Boolean)
      )
    );
  };

  const collapseAll = () => {
    setOpenEntries(new Set());
  };

  /*
   * If the page is opened with a hash such as:
   *
   * #mar-20
   *
   * automatically open that diary entry.
   */
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const hash = window.location.hash.replace('#', '');

    if (!hash) {
      return;
    }

    const element = document.getElementById(hash);

    if (!element) {
      return;
    }

    setEntryOpen(hash, true);
    setActiveId(hash);

    setTimeout(() => {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  }, []);

  return (
    <TravelDiaryContext.Provider
      value={{
        openEntries,
        activeId,
        setActiveId,
        toggleEntry,
        openEntry,
        expandAll,
        collapseAll,
      }}
    >
      <div className={styles.diary}>
        {children}
      </div>
    </TravelDiaryContext.Provider>
  );
}

export function DiaryNav({days}) {
  const {
    activeId,
    openEntry,
    expandAll,
    collapseAll,
  } = useContext(TravelDiaryContext);

  const currentDayUrl = useBaseUrl(CURRENT_DAY.url);

  return (
    <div className={styles.navWrapper}>
      <nav
        className={styles.dayNav}
        aria-label="Travel diary days"
      >
        <div className={styles.days}>
          {days.map((day) => {
            const isActive = activeId === day.id;

            const classes = [
              styles.dayButton,
              isActive ? styles.activeDay : '',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <button
                key={day.id}
                type="button"
                className={classes}
                onClick={() => openEntry(day.id)}
                title={`${day.date} — Day ${day.day}`}
                aria-current={isActive ? 'true' : undefined}
              >
                {day.number}
              </button>
            );
          })}
        </div>

        <div className={styles.navBottom}>
          <a
            className={styles.currentDayButton}
href={`${currentDayUrl}#${CURRENT_DAY.id}`}
          >
            Go to current day →
          </a>

          <div className={styles.navActions}>
            <button
              type="button"
              className={styles.actionButton}
              onClick={expandAll}
            >
              Expand all
            </button>

            <button
              type="button"
              className={styles.actionButton}
              onClick={collapseAll}
            >
              Collapse all
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export function DiaryEntry({
  id,
  date,
  day,
  title,
  preview,
  children,
  defaultOpen = false,
}) {
  const {
    openEntries,
    activeId,
    setActiveId,
    toggleEntry,
  } = useContext(TravelDiaryContext);

  const explicitlyControlled = openEntries.has(id);

  const open =
    explicitlyControlled || defaultOpen;

  const isActive = activeId === id;

  return (
    <article
      id={id}
      data-travel-diary-entry
      className={[
        styles.entry,
        isActive ? styles.activeEntry : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={() => setActiveId(id)}
    >
      <header className={styles.entryHeader}>
        <div>
          <h2 className={styles.date}>
            {date}
          </h2>

          {title && (
            <div className={styles.entryTitle}>
              {title}
            </div>
          )}
        </div>

        <span className={styles.dayLabel}>
          Day {day}
        </span>
      </header>

      {!open && preview && (
        <div className={styles.preview}>
          {preview}
        </div>
      )}

      <div
        className={
          open
            ? styles.content
            : styles.hidden
        }
      >
        {children}
      </div>

      <button
        type="button"
        className={styles.expandButton}
        onClick={(event) => {
          event.stopPropagation();
          setActiveId(id);
          toggleEntry(id);
        }}
        aria-expanded={open}
      >
        {open
          ? 'Hide entry ▲'
          : 'Read full entry ▼'}
      </button>
    </article>
  );
}
