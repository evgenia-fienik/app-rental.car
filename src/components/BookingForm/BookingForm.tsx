'use client';

import styles from './BookingForm.module.css';

export function BookingForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Booking request sent! (Demo)');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Book your car now</h3>
        <p className={styles.subtitle}>Stay connected! We are always ready to help you.</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input type="text" placeholder="Name*" required className={styles.input} />
        <input type="email" placeholder="Email*" required className={styles.input} />
        <input type="date" placeholder="Booking date" className={styles.input} />
        <textarea placeholder="Comment" className={styles.textarea} rows={4}></textarea>
        
        <button type="submit" className={styles.button}>Send</button>
      </form>
    </div>
  );
}