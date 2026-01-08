// 'use client';

// import{ useState, useRef, useEffect} from 'react'
// import styles from './CustomSelect.module.css'
// interface Option {
//     value: string | number;
//     label: string;
// }

// interface CustomSelectProps{
//     options: (string | number) [];
//     value: string | number | undefined;
//     onChange: (value: string) => void; 
//     placeholder: string;
//     label: string;
// }

// export function CustomSelect ({options, value, onChange, placeholder, label}: CustomSelectProps){
//     const [isOpen, setIsOpen]= useState(false);
//     const containerRef = useRef<HTMLDivElement>(null);

//     useEffect (()=> {
//         const handleClickOutside = (event: MouseEvent)=> {
//             if (containerRef.current && !containerRef.current.contains(event.target as Node)){
//                 setIsOpen(false);
//             }
//         };
//         document.addEventListener('mousedown', handleClickOutside);
//         return()=> document.removeEventListener('mousedown', handleClickOutside);
//     }, [])

//     const handleSelect = (optionValue: string | number) => {
//         onChange(String (optionValue));
//         setIsOpen(false);
//     };
//     return(
//         <div className={styles.container} ref={containerRef}>
//       <label className={styles.label}>{label}</label>
      
//       <div 
//         className={`${styles.trigger} ${isOpen ? styles.open : ''}`} 
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <span className={styles.value}>
//           {value ? value : placeholder}
//         </span>
        
//         {/* SVG Стрілочка */}
//         <svg 
//           className={`${styles.arrow} ${isOpen ? styles.rotated : ''}`} 
//           width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
//         >
//           <path d="M5 7.5L10 12.5L15 7.5" stroke="#121417" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//         </svg>
//       </div>

//       {isOpen && (
//         <div className={styles.dropdown}>
//           <ul className={styles.list}>
//             {/* Опція для скидання (якщо потрібно) */}
//             <li 
//                 className={styles.option} 
//                 onClick={() => handleSelect('')}
//                 style={{color: '#8a8a89'}}
//             >
//                 {placeholder}
//             </li>

//             {options.map((option) => (
//               <li 
//                 key={option} 
//                 className={`${styles.option} ${value === option ? styles.selected : ''}`}
//                 onClick={() => handleSelect(option)}
//               >
//                 {option}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//     );
// }

'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './CustomSelect.module.css';

interface CustomSelectProps {
  options: (string | number)[];
  value: string | number | undefined;
  onChange: (value: string) => void;
  placeholder: string; // Текст, коли нічого не вибрано (напр. "Choose a brand")
  label: string;       // Верхній підпис (напр. "Car brand")
  prefix?: string;     // Префікс для ціни (напр. "To $")
}

export function CustomSelect({ options, value, onChange, placeholder, label, prefix = '' }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string | number) => {
    onChange(String(optionValue));
    setIsOpen(false);
  };

  // Логіка тексту: якщо є значення -> показуємо "Prefix + Value", інакше -> Placeholder
  const displayValue = value ? `${prefix}${value}` : placeholder;

  return (
    <div className={styles.container} ref={containerRef}>
      <label className={styles.label}>{label}</label>
      
      <div 
        className={`${styles.trigger} ${isOpen ? styles.open : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.value}>
          {displayValue}
        </span>
        
        <svg 
          className={`${styles.arrow} ${isOpen ? styles.rotated : ''}`} 
          width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5 7.5L10 12.5L15 7.5" stroke="#121417" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          <ul className={styles.list}>
            {options.map((option) => (
              <li 
                key={option} 
                className={`${styles.option} ${String(value) === String(option) ? styles.selected : ''}`}
                onClick={() => handleSelect(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}