
import Image from 'next/image';
import { getCarById } from '@/shared/api/cars';
import { BookingForm } from '@/components/BookingForm/BookingForm';
import styles from './page.module.css';

// --- ІКОНКИ ---
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.3334 4L6.00008 11.3333L2.66675 8" stroke="#3470FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const CalendarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121417" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);
const CarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121417" strokeWidth="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path><circle cx="7" cy="17" r="2"></circle><circle cx="17" cy="17" r="2"></circle></svg>
);
const FuelIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121417" strokeWidth="2"><path d="M3 22v-8a2 2 0 0 1 2-2h2.5a2 2 0 0 1 2 2v8"></path><path d="M15 22v-8a2 2 0 0 1 2-2h2.5a2 2 0 0 1 2 2v8"></path><path d="M5 12V7a2 2 0 0 1 2-2h1"></path><path d="M17 12V7a2 2 0 0 1 2-2h1"></path></svg>
);
const GearIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121417" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
);

export default async function CarDetailsPage(
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Чекаємо params (для Next.js 15)
  const { id } = await params;

  let car;
  try {
    car = await getCarById(id);
  } catch (error) {
    console.error(error);
    return <div className={styles.container}>Car not found</div>;
  }

  if (!car) return <div className={styles.container}>Car not found</div>;

  // 2. Безпечна обробка даних
  // Якщо rentalConditions це рядок - робимо split. Якщо раптом масив - залишаємо як є.
  const rentalConditions = typeof car.rentalConditions === 'string' 
    ? car.rentalConditions.split('\n') 
    : (Array.isArray(car.rentalConditions) ? car.rentalConditions : []);

  // Об'єднуємо аксесуари та функціонал (з перевіркою на undefined)
  const accessories = car.accessories || [];
  const functionalities = car.functionalities || [];
  const combinedFeatures = [...accessories, ...functionalities];

  // Форматуємо пробіг
  const mileage = car.mileage ? car.mileage.toLocaleString('en-US') : '';

  return (
    <main className={styles.section}>
      <div className={styles.container}>
        
        {/* ЛІВА КОЛОНКА */}
        <div className={styles.leftColumn}>
          <div className={styles.imageWrapper}>
            <Image 
              src={car.img} 
              alt={car.model} 
              fill 
              className={styles.image}
              priority
            />
          </div>
          <BookingForm />
        </div>

        {/* ПРАВА КОЛОНКА */}
        <div className={styles.rightColumn}>
          
          <div className={styles.header}>
            <h1 className={styles.title}>
              {car.brand} {car.model}, {car.year}
            </h1>
            <span className={styles.id}>Id: {car.id}</span>
          </div>

          <div className={styles.meta}>
            <span className={styles.metaItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121417" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                {car.address}
            </span>
            <span className={styles.metaItem}>Mileage: {mileage} km</span>
          </div>

          <div className={styles.price}>${car.rentalPrice}</div>

          <p className={styles.description}>{car.description}</p>

          {/* Умови оренди */}
          <div className={styles.block}>
            <h3 className={styles.blockTitle}>Rental Conditions:</h3>
            <ul className={styles.conditionsList}>
              {rentalConditions.map((condition, index) => (
                <li key={index} className={styles.conditionItem}>
                  <CheckIcon />
                  {condition}
                </li>
              ))}
            </ul>
          </div>

          {/* Характеристики */}
          <div className={styles.block}>
            <h3 className={styles.blockTitle}>Car Specifications:</h3>
            <ul className={styles.specsList}>
              <li className={styles.specItem}><CalendarIcon /> Year: {car.year}</li>
              <li className={styles.specItem}><CarIcon /> Type: {car.type}</li>
              <li className={styles.specItem}><FuelIcon /> Fuel Consumption: {car.fuelConsumption}</li>
              <li className={styles.specItem}><GearIcon /> Engine Size: {car.engineSize}</li>
            </ul>
          </div>

          {/* Аксесуари */}
          <div className={styles.block}>
            <h3 className={styles.blockTitle}>Accessories and functionalities:</h3>
            <ul className={styles.conditionsList}>
              {combinedFeatures.map((item, index) => (
                <li key={index} className={styles.conditionItem}>
                  <CheckIcon />
                  {item}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </main>
  );
}