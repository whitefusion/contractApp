'use client';

import styles from './page.module.css';
import Content from './views/Content/index';

export default function Home() {
  return (
    <main className={styles.main}>
      <Content />
    </main>
  )
}
