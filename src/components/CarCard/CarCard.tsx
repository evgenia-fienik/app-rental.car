import { useCarsStore } from '@/shared/store/carsStore';
import { Car } from '@/shared/api/cars';
import styles from './CarCard.module.css';
import { HeartIcon } from '../Icon/HeartIcon';
import Image from 'next/image';
import Link from 'next/link';

interface CarCardProps {
  car: Car;
  onReadMore?: (car: Car) => void; // на майбутнє якщо буде модалка
}

export function CarCard({ car, onReadMore }: CarCardProps) {
  const favorites = useCarsStore((state) => state.favorites);
  const toggleFavorite = useCarsStore((state) => state.toggleFavorite);

  const isFavorite = favorites.includes(car.id);

  const addressParts = car.address.split(',');
  const city = addressParts[addressParts.length - 2]?.trim();
  const country = addressParts[addressParts.length - 1]?.trim();

  const handleClick = () => {
    if (onReadMore) onReadMore(car);
  };

  // форматування пробігa: 5000 → 5 000
 const formattedMileage = car.mileage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={car.img}
          alt={`${car.brand} ${car.model}`}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={styles.image}
        />

        <button
          type="button"
          className={`${styles.favoriteButton} ${isFavorite ? styles.favoriteButtonActive : ''
            }`}
          onClick={() => toggleFavorite(car.id)}
        >
          <HeartIcon className={styles.favoriteIcon} />
        </button>
      </div>

      <div className={styles.header}>
        <h2 className={styles.title}>
          {car.brand}{' '}
          <span className={styles.model}>{car.model}</span>, {car.year}
        </h2>
        <span className={styles.price}>${car.rentalPrice}</span>
      </div>

      <div className={styles.tags}>
        <span>{city}</span>
        <span>{country}</span>
        <span>{car.rentalCompany}</span>
        <span></span>
      </div>        
       <div className={styles.tags}>
        <span>{car.type}</span>
        <span>{formattedMileage} km</span>  
      </div>
    
      <Link href={`/catalog/${car.id}`} className={styles.button}>Load more</Link>
       
    </article>
  );
}