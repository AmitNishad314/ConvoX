import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-6"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1616531770192-6eaea74c2456?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }}
    >
      <div className="text-center">
        <h1 className="text-6xl font-extrabold text-indigo-500">
          ConvoX
        </h1>

        <p className="mt-6 text-xl text-slate-500 max-w-xl mx-auto">
          Secure, fast and seamless video meetings with real-time chat powered
          by WebRTC.
        </p>

        <div className="mt-12 flex justify-center gap-6">
          <Link to="/register">
            <button className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold transition">
              Register
            </button>
          </Link>

          <Link to="/login">
            <button className="px-8 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-lg font-semibold transition">
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;