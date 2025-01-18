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

const LoginForm: React.FC<Props> = ({
  formData,
  handleChange,
  handleSubmit,
  error,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg border-t-4 border-blue-500">
        <h1 className="text-2xl font-bold text-blue-800 text-center">
          Login to Your Account
        </h1>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-blue-600 font-medium mb-2"
            >
              Your Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-600"
              placeholder="name@flowbite.com"
              autoComplete="off"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-blue-600 font-medium mb-2"
            >
              Your Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-600"
              placeholder="Password"
              autoComplete="off"
              required
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm text-center mb-4">{error}</div>
          )}
          <button
            type="submit"
            className="w-full px-6 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md shadow-md transition-transform transform hover:scale-105"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
