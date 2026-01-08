

// 'use client';

// import { useEffect, useState, FormEvent } from 'react';
// import { useCarsStore } from '@/shared/store/carsStore';
// import { CarCard } from '../CarCard/CarCard';
// import { CustomSelect } from '../CustomSelect/CustomSelect';
// import styles from './CarsList.module.css';

// const BRANDS = [
//   'Aston Martin', 'Audi', 'BMW', 'Bentley', 'Buick', 
//   'Chevrolet', 'Chrysler', 'GMC', 'HUMMER', 'Volvo'
// ];

// const PRICES = [30, 40, 50, 60, 70, 80, 90, 100];

// export default function CarList() {
//   const {
//     cars, page, totalPages, loading, filters,
//     setFilters, fetchFirstPage, fetchNextPage,
//   } = useCarsStore();

//   const [localBrand, setLocalBrand] = useState(filters.brand ?? '');
//   const [localPrice, setLocalPrice] = useState(filters.rentalPrice ? String(filters.rentalPrice) : '');
//   const [localMileageFrom, setLocalMileageFrom] = useState(filters.minMileage ? String(filters.minMileage) : '');
//   const [localMileageTo, setLocalMileageTo] = useState(filters.maxMileage ? String(filters.maxMileage) : '');

//   useEffect(() => {
//     fetchFirstPage();
//   }, [filters, fetchFirstPage]);

//   const handleSearch = (e: FormEvent) => {
//     e.preventDefault();

//     const minMileage = localMileageFrom.replace(/,/g, '');
//     const maxMileage = localMileageTo.replace(/,/g, '');

//     setFilters({
//       brand: localBrand === '' ? undefined : localBrand,
//       rentalPrice: localPrice ? Number(localPrice) : undefined,
//       minMileage: minMileage ? Number(minMileage) : undefined,
//       maxMileage: maxMileage ? Number(maxMileage) : undefined,
//     });
//   };

//   const handleMileageChange = (value: string, setter: (val: string) => void) => {
//     const rawValue = value.replace(/\D/g, '');
//     if (rawValue === '') {
//       setter('');
//       return;
//     }
//     const formattedValue = Number(rawValue).toLocaleString('en-US');
//     setter(formattedValue);
//   };

//   return (
//  <section className={styles.wrapper}>
//       <div className={styles.filters}>
        
//         {/* 1. BRAND (Ширина 224px) */}
//         <div className={styles.filterGroup} style={{ width: '224px' }}>
//             <CustomSelect 
//               label="Car brand"
//               placeholder="Choose a brand" 
//               options={BRANDS}
//               value={localBrand}
//               onChange={setLocalBrand}
//             />
//         </div>

//         {/* 2. PRICE (Ширина 125px) */}
//         <div className={styles.filterGroup} style={{ width: '200px' }}>
//             <CustomSelect 
//               label="Price / 1 hour"
//               placeholder="Choose a price" 
//               prefix="To $"
//               options={PRICES}
//               value={localPrice}
//               onChange={setLocalPrice}
//             />
//         </div>

//         {/* 3. MILEAGE (Група інпутів) */}
//         <div className={styles.filterGroup}>
//           <label className={styles.filterLabel}>Car mileage / km</label>
//           <div className={styles.mileageInputs}>
            
//             {/* FROM */}
//             <div className={styles.inputWrapper}>
//               <span className={styles.inputLabel}>From</span>
//               <input
//                 type="text"
//                 className={styles.input}
//                 value={localMileageFrom}
//                 onChange={(e) => handleMileageChange(e.target.value, setLocalMileageFrom)}
//               />
//             </div>

//             {/* TO */}
//             <div className={styles.inputWrapper}>
//               <span className={styles.inputLabel}>To</span>
//               <input
//                 type="text"
//                 className={styles.input}
//                 value={localMileageTo}
//                 onChange={(e) => handleMileageChange(e.target.value, setLocalMileageTo)}
//               />
//             </div>

//           </div>
//         </div>

//         {/* 4. BUTTON */}
//         <button type="submit" className={styles.searchButton} onClick={handleSearch}>
//           Search
//         </button>
//       </div>

//       {/* ... Grid і Load More ... */}
//       {/* (цей код не змінюємо) */}
//       {loading && cars.length === 0 ? (
//         <p className={styles.loading}>Loading...</p>
//       ) : cars.length === 0 ? (
//         <p className={styles.noResults}>No cars found</p>
//       ) : (
//         <>
//           <div className={styles.grid}>
//             {cars.map((car) => (
//               <CarCard key={car.id} car={car} />
//             ))}
//           </div>
//           {page < totalPages && (
//             <div className={styles.loadMoreWrapper}>
//               <button type="button" className={styles.loadMoreButton} onClick={fetchNextPage} disabled={loading}>
//                 {loading ? 'Loading...' : 'Load more'}
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </section>
//   );
// }

'use client';

import { useEffect, useState, Suspense } from 'react'; // Додали Suspense
import { useRouter, useSearchParams } from 'next/navigation'; // 👈 Для роботи з URL
import { useCarsStore } from '@/shared/store/carsStore';
import { CarCard } from '../CarCard/CarCard';
import { CustomSelect } from '../CustomSelect/CustomSelect';
import styles from './CarsList.module.css';

const BRANDS = [
  'Aston Martin', 'Audi', 'BMW', 'Bentley', 'Buick', 
  'Chevrolet', 'Chrysler', 'GMC', 'HUMMER', 'Volvo'
];

const PRICES = [30, 40, 50, 60, 70, 80, 90, 100];

// Виносимо логіку в окремий компонент, щоб обгорнути в Suspense
function CarListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const {
    cars, page, totalPages, loading, filters,
    setFilters, fetchFirstPage, fetchNextPage,
  } = useCarsStore();

  // 1. Ініціалізація локального стейту з URL (якщо там щось є)
  const [localBrand, setLocalBrand] = useState(searchParams.get('brand') || '');
  const [localPrice, setLocalPrice] = useState(searchParams.get('rentalPrice') || '');
  const [localMileageFrom, setLocalMileageFrom] = useState(searchParams.get('minMileage') || '');
  const [localMileageTo, setLocalMileageTo] = useState(searchParams.get('maxMileage') || '');

  // 2. При першому завантаженні: синхронізуємо Store з URL
  useEffect(() => {
    const brand = searchParams.get('brand') || undefined;
    const rentalPrice = searchParams.get('rentalPrice') ? Number(searchParams.get('rentalPrice')) : undefined;
    const minMileage = searchParams.get('minMileage') ? Number(searchParams.get('minMileage')) : undefined;
    const maxMileage = searchParams.get('maxMileage') ? Number(searchParams.get('maxMileage')) : undefined;

    // Оновлюємо стор тільки якщо фільтри відрізняються
    setFilters({ brand, rentalPrice, minMileage, maxMileage });
    
    // Викликаємо завантаження
    fetchFirstPage();
  }, [searchParams, setFilters, fetchFirstPage]); // Залежність від searchParams

  // 3. При натисканні Search: оновлюємо URL
  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (localBrand) params.set('brand', localBrand);
    if (localPrice) params.set('rentalPrice', localPrice);
    
    const minM = localMileageFrom.replace(/,/g, '');
    if (minM) params.set('minMileage', minM);
    
    const maxM = localMileageTo.replace(/,/g, '');
    if (maxM) params.set('maxMileage', maxM);

    // Пушимо новий URL. Це викличе useEffect вище, який оновить стор і зробить запит
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleMileageChange = (value: string, setter: (val: string) => void) => {
    const rawValue = value.replace(/\D/g, '');
    if (rawValue === '') {
      setter('');
      return;
    }
    const formattedValue = Number(rawValue).toLocaleString('en-US');
    setter(formattedValue);
  };

  return (
    <section className={styles.wrapper}>
      <div className={styles.filters}>
        
        {/* BRAND */}
        <div className={styles.filterGroup} style={{ width: '224px' }}>
            <CustomSelect 
              label="Car brand"
              placeholder="Choose a brand" 
              options={BRANDS}
              value={localBrand}
              onChange={setLocalBrand}
            />
        </div>

        {/* PRICE */}
        <div className={styles.filterGroup} style={{ width: '200px' }}>
            <CustomSelect 
              label="Price / 1 hour"
              placeholder="Choose a price" 
              prefix="To $"
              options={PRICES}
              value={localPrice}
              onChange={setLocalPrice}
            />
        </div>

        {/* MILEAGE */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Car mileage / km</label>
          <div className={styles.mileageInputs}>
            <div className={styles.inputWrapper}>
              <span className={styles.inputLabel}>From</span>
              <input
                type="text"
                className={styles.input}
                value={localMileageFrom}
                onChange={(e) => handleMileageChange(e.target.value, setLocalMileageFrom)}
              />
            </div>
            <div className={styles.inputWrapper}>
              <span className={styles.inputLabel}>To</span>
              <input
                type="text"
                className={styles.input}
                value={localMileageTo}
                onChange={(e) => handleMileageChange(e.target.value, setLocalMileageTo)}
              />
            </div>
          </div>
        </div>

        <button type="button" className={styles.searchButton} onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Grid */}
      {loading && cars.length === 0 ? (
        <p className={styles.loading}>Loading...</p>
      ) : cars.length === 0 ? (
        <p className={styles.noResults}>No cars found</p>
      ) : (
        <>
          <div className={styles.grid}>
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
          {page < totalPages && (
            <div className={styles.loadMoreWrapper}>
              <button type="button" className={styles.loadMoreButton} onClick={fetchNextPage} disabled={loading}>
                {loading ? 'Loading...' : 'Load more'}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

// Головний експорт. Next.js вимагає Suspense для useSearchParams
export default function CarList() {
  return (
    <Suspense fallback={<div>Loading filters...</div>}>
      <CarListContent />
    </Suspense>
  );
}