import React, {useEffect, useRef, useState} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const locations = [
  {
    name: 'Longsaddle',
    x: 31.48,
    y: 32.69,
    link: '/docs/regions/longsaddle',
  },
  {
    name: 'Nersand',
    x: 72.51,
    y: 35.75,
    link: '/docs/regions/nersand/',
  },
  {
    name: 'Puerto Ballena',
    x: 56.33,
    y: 63.31,
    link: '/docs/regions/puerto-ballena',
  },

  // --- Northern region ---
  {
    name: 'Northell',
    x: 6.1,
    y: 3.88,
    link: '/docs/regions/northeaven/northell',
  },
  {
    name: 'Northeaven',
    x: 7.58,
    y: 12.51,
    link: '/docs/regions/northeaven/',
  },
  {
    name: 'Hyggelig',
    x: 84.82,
    y: 15.01,
    link: '/docs/regions/nersand/hyggelig',
  },
  {
    name: 'Inuta',
    x: 61.13,
    y: 9.03,
    link: '/docs/regions/inuta',
  },

  // --- Western / central region ---
  {
    name: 'Dunklelock',
    x: 50.58,
    y: 39.23,
    link: '/docs/regions/dunklelock/',
  },
  {
    name: 'Dunkle Peaks',
    x: 53.19,
    y: 41.46,
    link: '/docs/regions/dunklelock/dunkle-peaks',
  },
  {
    name: 'Wolfsruhe',
    x: 79.50,
    y: 24.48,
    link: '/docs/regions/nersand/wolfsruhe',
  },
  {
    name: 'Grail Lake',
    x: 6.74,
    y: 50.92,
    link: '/docs/regions/mauer-mountains/grail-lake',
  },
  {
    name: 'Prime Road',
    x: 23.13,
    y: 34.72,
    link: '/docs/regions/norberia/prime-road',
  },
  {
    name: 'Forgan River',
    x: 37.33,
    y: 41.87,
    link: '/docs/regions/norberia/forgan-river',
  },

  // --- Nevington Mountains ---
  {
    name: 'Nevington Mountains',
    x: 55.91,
    y: 18.63,
    link: '/docs/regions/nevington-mountains/',
  },
  {
    name: 'Kor Kuldir',
    x: 39.21,
    y: 18.07,
    link: '/docs/regions/nevington-mountains/kor-kuldir',
  },
  {
    name: 'Kor Thurim',
    x: 72.09,
    y: 17.80,
    link: '/docs/regions/nevington-mountains/kor-thurim',
  },

  // --- Eastern region ---
  {
    name: 'Mordian',
    x: 6.00,
    y: 41.46,
    link: '/docs/regions/mauer-mountains/mordian',
  },
  {
    name: 'Gardis',
    x: 30.65,
    y: 75.55,
    link: '/docs/regions/gardis/',
  },
  {
    name: 'Steinkeep',
    x: 20.21,
    y: 68.46,
    link: '/docs/regions/mauer-mountains/steinkeep',
  },
  {
    name: 'Mauer Mountains',
    x: 1.00,
    y: 52.59,
    link: '/docs/regions/mauer-mountains/',
  },

  // --- Central / southern region ---
  {
    name: 'Everlor',
    x: 19.69,
    y: 48.0,
    link: '/docs/regions/everlor',
  },
  {
    name: 'Dorelta',
    x: 18.12,
    y: 28.23,
    link: '/docs/regions/autumn-forest/dorelta',
  },
  {
    name: 'Orchiva',
    x: 42.13,
    y: 45.91,
    link: '/docs/regions/orchiva',
  },
  {
    name: 'Neu Samir',
    x: 21.04,
    y: 83.35,
    link: '/docs/regions/everchanging-dunes/neu-samir',
  },
  {
    name: 'Everchanging Dunes',
    x: 8.52,
    y: 82.79,
    link: '/docs/regions/everchanging-dunes/',
  },

  // --- Southern / island region ---
  {
    name: 'L’Taca',
    x: 94.53,
    y: 88.36,
    link: '/docs/regions/l-taca/',
  },
  {
    name: 'Crosscove',
    x: 7.16,
    y: 32.55,
    link: '/docs/regions/mauer-mountains/crosscove',
  },
  {
    name: 'Puerto Arena',
    x: 84.09,
    y: 78.76,
    link: '/docs/regions/l-taca/puerto-arena',
  },
  {
    name: 'Fin Island',
    x: 85.66,
    y: 57.60,
    link: '/docs/regions/fin-island',
  },
  {
    name: 'Emerald Mangroves',
    x: 59.56,
    y: 47.72,
    link: '/docs/regions/emerald-mangroves/',
  },
  {
    name: 'The Cursed Swamp',
    x: 42.76,
    y: 69.15,
    link: '/docs/regions/gardis/the-cursed-swamp',
  },
  {
    name: 'Cursed Islands',
    x: 53.09,
    y: 97.82,
    link: '/docs/regions/cursed-islands',
  },

  // --- Additional locations ---
  {
    name: 'Crispy Woods',
    x: 19.90,
    y: 10.56,
    link: '/docs/regions/northeaven/crispy-woods',
  },
  {
    name: 'Autumn Forest',
    x: 13.01,
    y: 24.48,
    link: '/docs/regions/autumn-forest/',
  },
  {
    name: 'Kurz Oktar',
    x: 63.95,
    y: 50.92,
    link: '/docs/regions/emerald-mangroves/kurz-o-ktar-the-city-of-monsters',
  },
  {
    name: 'Marsander Shadows',
    x: 61.34,
    y: 35.05,
    link: '/docs/regions/marsander-shadows',
  },
  {
    name: 'Marsander',
    x: 58.62,
    y: 22.95,
    link: '/docs/regions/Marsander',
  },
  {
    name: 'Emerald Hills',
    x: 47.87,
    y: 53.70,
    link: '/docs/regions/emerald-mangroves/Emerald-hills',
  },
];

export default function InteractiveMap() {
  const mapImage = useBaseUrl('/img/world-map.jpg');

  const viewportRef = useRef(null);

  const [coordinates, setCoordinates] = useState(null);
  const [coordinateMode, setCoordinateMode] = useState(false);

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({x: 0, y: 0});
  const [isDragging, setIsDragging] = useState(false);

  const scaleRef = useRef(1);
  const positionRef = useRef({x: 0, y: 0});

  const pointers = useRef(new Map());

  const gesture = useRef({
    type: null,
    startX: 0,
    startY: 0,
    startPositionX: 0,
    startPositionY: 0,
    startDistance: 0,
    startScale: 1,
  });

  const MIN_SCALE = 1;
  const MAX_SCALE = 4;
  const ZOOM_STEP = 0.25;

  const updateScale = (newScale) => {
    const clampedScale = Math.min(
      MAX_SCALE,
      Math.max(MIN_SCALE, newScale)
    );

    scaleRef.current = clampedScale;
    setScale(clampedScale);

    if (clampedScale === MIN_SCALE) {
      positionRef.current = {x: 0, y: 0};
      setPosition({x: 0, y: 0});
    }
  };

  const updatePosition = (newPosition) => {
    positionRef.current = newPosition;
    setPosition(newPosition);
  };

  const zoomIn = () => {
    updateScale(scaleRef.current + ZOOM_STEP);
  };

  const zoomOut = () => {
    updateScale(scaleRef.current - ZOOM_STEP);
  };

  const resetMap = () => {
    scaleRef.current = 1;
    positionRef.current = {x: 0, y: 0};

    setScale(1);
    setPosition({x: 0, y: 0});
  };

  const toggleCoordinateMode = () => {
    setCoordinateMode((current) => {
      const newValue = !current;

      if (!newValue) {
        setCoordinates(null);
      }

      return newValue;
    });
  };

  /*
   * Mouse wheel zoom.
   * Prevents the browser page from scrolling
   * while the cursor is over the map.
   */
  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) return;

    const handleWheel = (event) => {
      event.preventDefault();
      event.stopPropagation();

      const direction = event.deltaY < 0 ? 1 : -1;

      updateScale(
        scaleRef.current + direction * ZOOM_STEP
      );
    };

    viewport.addEventListener(
      'wheel',
      handleWheel,
      {passive: false}
    );

    return () => {
      viewport.removeEventListener(
        'wheel',
        handleWheel
      );
    };
  }, []);

  const getDistance = (pointerA, pointerB) => {
    return Math.hypot(
      pointerA.x - pointerB.x,
      pointerA.y - pointerB.y
    );
  };

  const handlePointerDown = (event) => {
    if (event.target.closest('a')) {
      return;
    }

    event.currentTarget.setPointerCapture(
      event.pointerId
    );

    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    if (pointers.current.size === 1) {
      if (scaleRef.current <= 1) {
        return;
      }

      gesture.current = {
        type: 'drag',
        startX: event.clientX,
        startY: event.clientY,
        startPositionX: positionRef.current.x,
        startPositionY: positionRef.current.y,
        startDistance: 0,
        startScale: scaleRef.current,
      };

      setIsDragging(true);
    }

    if (pointers.current.size === 2) {
      const [pointerA, pointerB] =
        Array.from(pointers.current.values());

      gesture.current = {
        type: 'pinch',
        startX: 0,
        startY: 0,
        startPositionX: positionRef.current.x,
        startPositionY: positionRef.current.y,
        startDistance: getDistance(
          pointerA,
          pointerB
        ),
        startScale: scaleRef.current,
      };

      setIsDragging(false);
    }
  };

  const handlePointerMove = (event) => {
    if (!pointers.current.has(event.pointerId)) {
      return;
    }

    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    /*
     * Pinch zoom
     */
    if (
      pointers.current.size === 2 &&
      gesture.current.type === 'pinch'
    ) {
      const [pointerA, pointerB] =
        Array.from(pointers.current.values());

      const currentDistance = getDistance(
        pointerA,
        pointerB
      );

      const ratio =
        currentDistance /
        gesture.current.startDistance;

      updateScale(
        gesture.current.startScale * ratio
      );

      return;
    }

    /*
     * Drag map
     */
    if (
      pointers.current.size === 1 &&
      gesture.current.type === 'drag' &&
      scaleRef.current > 1
    ) {
      const deltaX =
        event.clientX - gesture.current.startX;

      const deltaY =
        event.clientY - gesture.current.startY;

      updatePosition({
        x:
          gesture.current.startPositionX +
          deltaX,
        y:
          gesture.current.startPositionY +
          deltaY,
      });
    }
  };

  const handlePointerUp = (event) => {
    pointers.current.delete(event.pointerId);

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      );
    }

    if (
      pointers.current.size === 1 &&
      scaleRef.current > 1
    ) {
      const remainingPointer =
        Array.from(
          pointers.current.values()
        )[0];

      gesture.current = {
        type: 'drag',
        startX: remainingPointer.x,
        startY: remainingPointer.y,
        startPositionX: positionRef.current.x,
        startPositionY: positionRef.current.y,
        startDistance: 0,
        startScale: scaleRef.current,
      };

      setIsDragging(true);
    } else {
      gesture.current.type = null;
      setIsDragging(false);
    }
  };

  /*
   * Coordinate editor.
   */
  const handleMapClick = (event) => {
    if (!coordinateMode) {
      return;
    }

    if (event.target.closest('a')) {
      return;
    }

    const mapElement =
      event.currentTarget.querySelector(
        `.${styles.mapContent}`
      );

    if (!mapElement) {
      return;
    }

    const rect =
      mapElement.getBoundingClientRect();

    const x =
      ((event.clientX - rect.left) /
        rect.width) *
      100;

    const y =
      ((event.clientY - rect.top) /
        rect.height) *
      100;

    setCoordinates({
      x: x.toFixed(2),
      y: y.toFixed(2),
    });
  };

  return (
    <div className={styles.mapSection}>

      <div
        ref={viewportRef}
        className={`${styles.mapViewport} ${
          isDragging ? styles.dragging : ''
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={handleMapClick}
      >
        <div
          className={styles.mapContent}
          style={{
            transform:
              `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          }}
        >
          <img
            src={mapImage}
            alt="Map of the Cursed Seas"
            className={styles.mapImage}
            draggable="false"
          />

          {locations.map((location) => (
            <Link
              key={location.name}
              to={location.link}
              className={styles.marker}
              style={{
                left: `${location.x}%`,
                top: `${location.y}%`,
              }}
              aria-label={`Open ${location.name}`}
            >
              <span className={styles.dot} />

              <span className={styles.tooltip}>
                <strong>
                  {location.name}
                </strong>

                <small>
                  Open wiki page →
                </small>
              </span>
            </Link>
          ))}

          {coordinateMode && coordinates && (
            <div
              className={
                styles.coordinateMarker
              }
              style={{
                left: `${coordinates.x}%`,
                top: `${coordinates.y}%`,
              }}
            />
          )}
        </div>
      </div>

      <div className={styles.controlsRow}>
        <div className={styles.mapControls}>

          <button
            type="button"
            onClick={zoomIn}
            disabled={scale >= MAX_SCALE}
            aria-label="Zoom in"
            title="Zoom in"
          >
            +
          </button>

          <button
            type="button"
            onClick={zoomOut}
            disabled={scale <= MIN_SCALE}
            aria-label="Zoom out"
            title="Zoom out"
          >
            −
          </button>

          <button
            type="button"
            onClick={resetMap}
            aria-label="Reset map"
            title="Reset map"
          >
            ↺
          </button>

          <button
            type="button"
            onClick={toggleCoordinateMode}
            className={
              coordinateMode
                ? styles.activeControl
                : ''
            }
            aria-label="Toggle coordinate editor"
            title="Coordinate editor"
            aria-pressed={coordinateMode}
          >
            ⌖
          </button>

        </div>
      </div>

      {coordinateMode && (
        <div className={styles.coordinateBox}>
          {coordinates ? (
            <>
              <strong>Coordinates:</strong>{' '}
              x: {coordinates.x},
              {' '}
              y: {coordinates.y}
            </>
          ) : (
            <>
              Coordinate editor enabled.
              Click anywhere on the map.
            </>
          )}
        </div>
      )}

    </div>
  );
}