import styles from './TopBar.module.css';

export default function TopBar({ user, onNavigate }) {
  return (
    <header className={styles.topbar}>
      <div className={styles.avatar} />
      <h2>{user.fullName}</h2>
      <nav style={{ marginLeft: "auto", display: "flex", gap: "1rem" }}>
        {/* <button onClick={() => onNavigate("dashboard")}>Dashboard</button>
        <button onClick={() => onNavigate("pacientes")}>Pacientes</button> */}
      </nav>
    </header>
  );
}