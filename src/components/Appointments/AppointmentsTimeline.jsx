// src/components/Appointments/AppointmentsTimeline.jsx
import styles from './AppointmentsTimeline.module.css';

export default function AppointmentsTimeline({ date, appointments }) {
  return (
    <section>
      <h3>Citas del {date.toLocaleDateString('es-ES', {weekday:'long', day:'2-digit', month:'long', year:'numeric'})}</h3>
      <ul className={styles.timeline}>
        {appointments.map(appt => (
          <li key={appt.id} className={styles.item}>
            <span className={styles.time}>{appt.time}</span>
            <span className={styles.dot} />
            <div className={styles.card}>
              <p className={styles.name}>{appt.patient}</p>
              <p className={styles.detail}>Detalles de la cita…</p>
              <span className={styles.badge}>Pendiente</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
