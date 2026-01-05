import Link from "next/link";
import styles from './Header.module.css'
import Image from "next/image";

export function Header() {
    return (
        <header className={styles.header}>
            <div>
                <Link href='/'>
                    <Image
                        src='/logo.svg'
                        alt="RentalCar"
                        width={104}
                        height={16}
                        />
                </Link>
            </div>

            <nav className={styles.nav}>
                <Link href="/">Home</Link>
                <Link href="/catalog">Catalog</Link>
            </nav>
        </header>
    )
}