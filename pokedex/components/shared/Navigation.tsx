'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './navigation.module.css';

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          <Image src="/icons/pokeball.svg" alt="" width={24} height={24} className={styles.logoIcon} />
          <span className={styles.logoText}>Pokédex</span>
        </Link>
        
        <div className={styles.navLinks}>
          <Link 
            href="/" 
            className={`${styles.navLink} ${pathname === '/' ? styles.active : ''}`}
          >
            <Image src="/icons/pokeball.svg" alt="" width={16} height={16} className={styles.navIcon} /> Pokédex
          </Link>
          <Link 
            href="/combate" 
            className={`${styles.navLink} ${pathname === '/combate' ? styles.active : ''}`}
          >
            <Image src="/icons/swords.svg" alt="" width={16} height={16} className={styles.navIcon} /> Combate
          </Link>
          <Link 
            href="/quiz" 
            className={`${styles.navLink} ${pathname === '/quiz' ? styles.active : ''}`}
          >
            <Image src="/icons/question.svg" alt="" width={16} height={16} className={styles.navIcon} /> Quiz
          </Link>
        </div>
      </div>
    </nav>
  );
}
