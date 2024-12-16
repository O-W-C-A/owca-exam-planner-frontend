import styles from './LoginForm.module.css';

interface FormData {
    email: string;
    password: string;
}

interface Props {
    formData: FormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    error: string | null;
}

const LoginForm: React.FC<Props> = ({ formData, handleChange, handleSubmit, error }) => {
    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Your email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="name@flowbite.com"
                        autoComplete="off"
                        required
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Your password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="Password"
                        autoComplete="off"
                        required
                    />
                </div>
                {error && <div className={styles.error}>{error}</div>}
                <button type="submit" className={styles.submitButton}>
                    Submit
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
