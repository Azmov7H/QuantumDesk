export default function WelcomeBanner({ username }) {
  return (
    <div className="bg-purple-700 text-white p-6 rounded-lg shadow-lg mb-8">
      <h1 className="text-3xl font-bold mb-2">
        Welcome to QuantumLeap, {username ?? "Guest"}!
      </h1>
      <p>Explore the latest scientific posts and updates.</p>
    </div>
  )
}
