import styles from './Sidebar.module.css';
import { FaTachometerAlt, FaUserInjured, FaPrescription, FaSignOutAlt, FaCalendarAlt } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ onLogout }) {
  const location = useLocation();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo} />
      <nav className={styles.menu}>
        <Link 
          to="/dashboard" 
          className={`${styles.item} ${location.pathname === '/dashboard' ? styles.active : ''}`}
        >
          <FaTachometerAlt /> Dashboard
        </Link>
        <Link 
          to="/pacientes" 
          className={`${styles.item} ${location.pathname === '/pacientes' ? styles.active : ''}`}
        >
          <FaUserInjured /> Pacientes
        </Link>
        <Link 
          to="/citas" 
          className={`${styles.item} ${location.pathname === '/citas' ? styles.active : ''}`}
        >
          <FaCalendarAlt /> Citas
        </Link>
        <Link 
          to="/recetas" 
          className={`${styles.item} ${location.pathname === '/recetas' ? styles.active : ''}`}
        >
          <FaPrescription /> Recetas
        </Link>
      </nav>
      <button className={styles.logout} onClick={onLogout}>
        <FaSignOutAlt />Cerrar Sesión 
      </button>
    </aside>
  );
}