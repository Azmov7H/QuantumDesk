export const metadata = {
  title: {
    default: 'Auth | QuantumLeap',
    template: '%s | QuantumLeap'
  },
  description: 'Authenticate to access your QuantumLeap account.',
  robots: { index: false, follow: true },
};

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {children}
    </div>
  );
}


