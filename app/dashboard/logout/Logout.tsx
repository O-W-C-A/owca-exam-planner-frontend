'use client';

import styles from './Logout.module.css';

interface Props {
    showPopup: boolean;
    confirmLogout: () => void;
    cancelLogout: () => void;
}

const Logout: React.FC<Props> = ({ showPopup, confirmLogout, cancelLogout }) => {
    return (
        <div className={styles.logoutContainer}>
            {showPopup && (
                <div className={styles.popup}>
                <p>Are you sure you want to log out?</p>
                <div className={styles.buttonGroup}>
                    <button onClick={confirmLogout} className={styles.confirmButton}>
                    Yes
                    </button>
                    <button onClick={cancelLogout} className={styles.cancelButton}>
                    No
                    </button>
                </div>
                </div>
            )}
        </div>
    );
};

export default Logout;
