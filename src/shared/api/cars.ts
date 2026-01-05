import {api} from './clients'

export type Car = {
    id: string,
    model: string,
    brand: string,
    year: number,
    img: string,
    description: string,
    rentalPrice: string,
    address: string,
    rentalCompany: string,
    type: string;
    fuelConsumption: string;
    engineSize: string;
    accessories: string[];
    functionalities?: string[];
    rentalConditions: string[];
    mileage: number;
    
}

export type CarResponse = {
    cars: Car[];
    totalCars: number;
    page: number;
    totalPages: number,
}

export type CarFilters = {
    brand?: string;
    rentalPrice?: number;
    minMileage?: number;
    maxMileage?: number;
}

export async function getCars(
    page = 1,
    filters: CarFilters = {}
): Promise<CarResponse> {
    const params: Record<string, string> = {
        page: String(page),
        limit: '12',
     };

    if (filters.brand && filters.brand !== 'All') {
        params.brand = filters.brand;
    }
    
    if (filters.rentalPrice) {
        params.rentalPrice = String(filters.rentalPrice);
    }

    if (filters.minMileage) {
        params.minMileage = String(filters.minMileage);
    }

    if (filters.maxMileage) {
        params.maxMileage = String(filters.maxMileage);
    }

    console.log('📤 Request params:', params); // для дебагу

    const { data } = await api.get<CarResponse>('/cars', { params });

    console.log('📥 Response data:', data); // для дебагу
    
    return data;
}


export async function getCarById(id: string): Promise<Car> {
    const { data } = await api.get<Car>(`/cars/${id}`);
    return data;
}