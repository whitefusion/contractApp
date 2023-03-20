'use client';

import Content from './views/Content/index';
import { Provider } from 'react-redux';
import store from './redux/store';
import styles from './page.module.css';

export default function Home() {
  return (
    <Provider store={store}>
      <main className={styles.main}>
        <Content />
      </main>
    </Provider>
  )
}
