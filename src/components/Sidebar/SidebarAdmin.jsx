import styles from './Sidebar.module.css';
import { FaTachometerAlt, FaUserInjured, FaSignOutAlt } from 'react-icons/fa';

export default function SidebarAdmin({ onLogout, onNavigate }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo} />
      <nav className={styles.menu}>
        <button className={styles.item} onClick={() => onNavigate("dashboard")}>
          <FaTachometerAlt /> Dashboard
        </button>
        <button className={styles.item} onClick={() => onNavigate("pacientes")}> 
          <FaUserInjured /> Citas Médicas
        </button>
      </nav>
      <button className={styles.logout} onClick={onLogout}>
        <FaSignOutAlt />C errar Sesión 
      </button>
    </aside>
  );
}