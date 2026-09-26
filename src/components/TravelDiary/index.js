import React, {
  createContext,
  useContext,
  useState,
} from 'react';

import styles from './styles.module.css';

const TravelDiaryContext = createContext(null);

export function TravelDiary({children, latestId = null}) {
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

    // Wait until React has expanded the entry before scrolling.
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

  return (
    <TravelDiaryContext.Provider
      value={{
        openEntries,
        activeId,
        latestId,
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
    latestId,
    openEntry,
    expandAll,
    collapseAll,
  } = useContext(TravelDiaryContext);

  return (
    <div className={styles.navWrapper}>
      <nav
        className={styles.dayNav}
        aria-label="Travel diary days"
      >
        <div className={styles.days}>
          {days.map((day) => {
            const isActive = activeId === day.id;
            const isLatest = latestId === day.id;

            const classes = [
              styles.dayButton,
              isActive ? styles.activeDay : '',
              isLatest ? styles.latestDay : '',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <button
                key={day.id}
                type="button"
                className={classes}
                onClick={() => openEntry(day.id)}
                title={
                  isLatest
                    ? `${day.date} — Day ${day.day} — Latest entry`
                    : `${day.date} — Day ${day.day}`
                }
                aria-current={isActive ? 'true' : undefined}
              >
                {day.number}

                {isLatest && (
                  <span
                    className={styles.latestDot}
                    aria-label="Latest entry"
                    title="Latest entry"
                  />
                )}
              </button>
            );
          })}
        </div>

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
    latestId,
    setActiveId,
    toggleEntry,
  } = useContext(TravelDiaryContext);

  const explicitlyControlled =
    openEntries.has(id);

  const open =
    explicitlyControlled || defaultOpen;

  const isActive = activeId === id;
  const isLatest = latestId === id;

  return (
    <article
      id={id}
      data-travel-diary-entry
      className={[
        styles.entry,
        isActive ? styles.activeEntry : '',
        isLatest ? styles.latestEntry : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={() => setActiveId(id)}
    >
      <header className={styles.entryHeader}>
        <div>
          <div className={styles.dateRow}>
            <h2 className={styles.date}>
              {date}
            </h2>

            {isLatest && (
              <span className={styles.latestBadge}>
                Latest
              </span>
            )}
          </div>

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