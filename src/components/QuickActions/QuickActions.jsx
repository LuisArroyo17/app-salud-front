// src/components/QuickActions/QuickActions.jsx
import styles from './QuickActions.module.css';
import { FaFilePrescription } from 'react-icons/fa';

export default function QuickActions({ onCreatePrescription }) {
  return (
    <div>
      <h3>Accesos rápidos</h3>
      <button className={styles.card} onClick={onCreatePrescription}>
        <FaFilePrescription size={36} />
        <span>Crear receta</span>
      </button>
    </div>
  );
}
