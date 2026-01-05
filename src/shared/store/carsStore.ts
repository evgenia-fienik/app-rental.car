import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Car, CarResponse, CarFilters, getCars } from '../api/cars';

type CarsState = {
  cars: Car[];
  page: number;
  totalPages: number;
  totalCars: number;
  loading: boolean;
  error: string | null;

  filters: CarFilters;

  favorites: string[];        // зберігаємо тільки id
  toggleFavorite: (carId: string) => void;

  setFilters: (filters: CarFilters) => void;
  resetFilters: () => void;

  fetchFirstPage: () => Promise<void>;
  fetchNextPage: () => Promise<void>;
};

export const useCarsStore = create<CarsState>()(
  persist(
    (set, get) => ({
      cars: [],
      page: 1,
      totalPages: 1,
      totalCars: 0,
      loading: false,
      error: null,

      filters: {},

      favorites: [],
      toggleFavorite: (carId) =>
        set((state) => {
          const isFav = state.favorites.includes(carId);
          return {
            favorites: isFav
              ? state.favorites.filter((id) => id !== carId)
              : [...state.favorites, carId],
          };
        }),

      setFilters: (filters) =>
        set((state) => ({
          filters,
          // при зміні фільтрів скидаємо попередні результати (вимога з ТЗ)
          cars: [],
          page: 1,
          totalPages: 1,
          totalCars: 0,
        })),

      resetFilters: () =>
        set(() => ({
          filters: {},
          cars: [],
          page: 1,
          totalPages: 1,
          totalCars: 0,
        })),

      fetchFirstPage: async () => {
        const { filters } = get();
        set({ loading: true, error: null });

        try {
          const data = await getCars(1, filters);
          console.log(data);
          set({
            cars: data.cars,
            page: Number (data.page),
            totalPages: Number (data.totalPages),
            totalCars: data.totalCars,
          });
        } catch (err: any) {
          set({ error: err.message ?? 'Failed to fetch cars' });
        } finally {
          set({ loading: false });
        }
      },

      fetchNextPage: async () => {
        const { page, totalPages, filters, cars } = get();
        if (!totalPages || page >= totalPages) return;

        set({ loading: true, error: null });

        try {
          const nextPage = page + 1;
          const data = await getCars(nextPage, filters);
          set({
            cars: [...cars, ...data.cars],
            page: nextPage,
          });
        } catch (err: any) {
          set({ error: err.message ?? 'Failed to fetch more cars' });
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'cars-store', // для localStorage (favorites, стан)
      partialize: (state) => ({
        favorites: state.favorites,
      }),
    }
  )
);