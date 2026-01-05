import {Hero} from '@/components/Hero/Hero'

export default function HomePage() {
  return (

    <main>
      <Hero
        title='Find your perfect rental car'
        subtitle='Reliable and budget-friendly rentals for any journey'
        buttonText='View Catalog'
        buttonLink='/catalog'
        imageSrc='/home-page.jpg'
      />
   </main>
  );
}
