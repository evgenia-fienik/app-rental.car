'use client';

import { useEffect, useState } from 'react';
import { useCarsStore } from '@/shared/store/carsStore';
import { CarCard } from '../CarCard/CarCard';
import styles from './CarsList.module.css';

const BRANDS = [
  'Aston Martin',
  'Audi',
  'BMW',
  'Bentley',
  'Buick',
  'Chevrolet',
  'Chrysler',
  'GMC',
  'HUMMER',
  'Volvo'
];

const PRICES = [30, 40, 50, 60, 70, 80, 90, 100];

export default function CarList() {
  const {
    cars,
    page,
    totalPages,
    loading,
    filters,
    setFilters,
    fetchFirstPage,
    fetchNextPage,
  } = useCarsStore();

  // Локальний стан для форми фільтрів (щоб не застосовувати одразу)
  const [localBrand, setLocalBrand] = useState(filters.brand ?? 'All');
  const [localPrice, setLocalPrice] = useState(filters.rentalPrice ?? '');
  const [localMileageFrom, setLocalMileageFrom] = useState(
    filters.minMileage ?? ''
  );
  const [localMileageTo, setLocalMileageTo] = useState(filters.maxMileage ?? '');

  // Завантаження при зміні фільтрів у сторі
  useEffect(() => {
    fetchFirstPage();
  }, [filters, fetchFirstPage]);

  const handleSearch = () => {
    setFilters({
      brand: localBrand === 'All' ? undefined : localBrand,
      rentalPrice: localPrice ? Number(localPrice) : undefined,
      minMileage: localMileageFrom ? Number(localMileageFrom) : undefined,
      maxMileage: localMileageTo ? Number(localMileageTo) : undefined,
    });
  };

  return (
    <section className={styles.wrapper}>
      {/* ФІЛЬТРИ */}
      <div className={styles.filters}>
        {/* Brand */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Car brand</label>
          <select
            className={styles.select}
            value={localBrand}
            onChange={(e) => setLocalBrand(e.target.value)}
          >
            <option value="All">Choose a brand</option>
            {BRANDS.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Price / 1 hour</label>
          <select
            className={styles.select}
            value={localPrice}
            onChange={(e) => setLocalPrice(e.target.value)}
          >
            <option value="">Choose a price</option>
            {PRICES.map((price) => (
              <option key={price} value={price}>
                To ${price}
              </option>
            ))}
          </select>
        </div>

        {/* Mileage */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Car mileage / km</label>
          <div className={styles.mileageInputs}>
            <input
              type="number"
              placeholder="From"
              className={styles.input}
              value={localMileageFrom}
              onChange={(e) => setLocalMileageFrom(e.target.value)}
            />
            <input
              type="number"
              placeholder="To"
              className={styles.input}
              value={localMileageTo}
              onChange={(e) => setLocalMileageTo(e.target.value)}
            />
          </div>
        </div>

        {/* Search Button */}
        <button
          type="button"
          className={styles.searchButton}
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {/* СПИСОК */}
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

          {/* LOAD MORE */}
          {page < totalPages && (
            <div className={styles.loadMoreWrapper}>
              <button
                type="button"
                className={styles.loadMoreButton}
                onClick={fetchNextPage}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load more'}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}