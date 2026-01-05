import Image from "next/image"
import Link from "next/link"
import styles from './Hero.module.css'
import { strict } from "assert";

type HeroProps = {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
    imageSrc: string;
}

export function Hero({ title, subtitle, buttonText, buttonLink, imageSrc }: HeroProps) {
    return (
        <section className={styles.hero}>
            <Image src={imageSrc} alt='Hero background' fill priority className={styles.heroImage } />
            <div className={styles.overlay}>
                <div className={styles.content}>
                    <h1 className={styles.title}>{title}</h1>
                    <p className={styles.subtitle}>{subtitle}</p>
                    <Link href={buttonLink}>
                        <button className={styles.button}>{buttonText}</button>
                    </Link>
                </div>
            </div>
    </section>
    )
}