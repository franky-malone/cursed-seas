import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import norberiaMap from '@site/static/img/norberia-map.jpg';
import styles from './index.module.css';

export default function Home() {
  return (
    <Layout
      title="Cursed Seas"
      description="A D&D campaign set in the world of Norberia"
    >
      <main
        className={styles.hero}
        style={{backgroundImage: `url(${norberiaMap})`}}
      >
        <div className={styles.overlay} />

        <div className={styles.content}>
          <p className={styles.eyebrow}>A D&amp;D CAMPAIGN IN NORBERIA</p>

          <h1 className={styles.title}>CURSED SEAS</h1>

          <div className={styles.divider} />

          <p className={styles.description}>
            Norberia is a land of ancient kingdoms, forgotten secrets, and
            dangers lurking beneath the surface. From bustling cities and
            remote wilderness to cursed seas and realms beyond the mortal
            world, every journey has a story to tell.
          </p>

          <p className={styles.tagline}>
            This is the chronicle of those who dared to sail them.
          </p>

          <Link
            className={styles.enterButton}
            to="/docs/regions/norberia/"
          >
            ENTER THE WORLD
          </Link>
        </div>
      </main>
    </Layout>
  );
}