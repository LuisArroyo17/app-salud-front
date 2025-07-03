// src/components/Notifications/NotificationPanel.jsx
import styles from './NotificationPanel.module.css';

export default function NotificationPanel({ notifications, onAccept }) {
  return (
    <aside className={styles.panel}>
      <h3>Notificaciones</h3>
      {notifications.map(n => (
        <div key={n.id} className={styles.card}>
          <div className={styles.icon} />
          <div className={styles.content}>
            <strong className={styles.title}>{n.title}</strong>
            <p>{n.body}</p>
          </div>
          <button onClick={() => onAccept(n.id)}>Aceptar</button>
        </div>
      ))}
    </aside>
  );
}
