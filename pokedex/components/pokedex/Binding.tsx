import styles from './pokedex.module.css';

export function Binding() {
  return (
    <div className={styles.binding}>
      <div className={styles.hinge}></div>
      <div className={`${styles.hinge} ${styles.hinge2}`}></div>
      <div className={`${styles.hinge} ${styles.hinge3}`}></div>
    </div>
  );
}
