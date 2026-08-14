import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [meetingId, setMeetingId] = useState("");

  const createMeeting = () => {
    const roomId = crypto.randomUUID();
    navigate(`/meeting/${roomId}`);
  };

  const joinMeeting = () => {
    if (!meetingId.trim()) return;
    navigate(`/meeting/${meetingId}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 border-b border-slate-800">

        <h1 className="text-3xl font-bold text-indigo-500">
          ConvoX
        </h1>

        <div className="flex items-center gap-5">

          <span className="text-slate-300">
            Hi, {user?.name}
          </span>

          <button
            onClick={handleLogout}
            className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Logout
          </button>

        </div>

      </nav>

      {/* Main */}

      <div className="max-w-5xl mx-auto py-20">

        <h2 className="text-5xl font-bold">
          Welcome back 👋
        </h2>

        <p className="text-slate-400 mt-3">
          Start a new meeting or join an existing one.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mt-12">

          {/* Create */}

          <div className="bg-slate-900 rounded-2xl p-8">

            <h3 className="text-2xl font-semibold">
              Create Meeting
            </h3>

            <p className="text-slate-400 mt-2">
              Instantly create a new room.
            </p>

            <button
              onClick={createMeeting}
              className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl"
            >
              New Meeting
            </button>

          </div>

          {/* Join */}

          <div className="bg-slate-900 rounded-2xl p-8">

            <h3 className="text-2xl font-semibold">
              Join Meeting
            </h3>

            <p className="text-slate-400 mt-2">
              Enter a meeting ID.
            </p>

            <input
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              placeholder="Meeting ID"
              className="mt-6 w-full bg-slate-800 rounded-lg p-3 outline-none border border-slate-700"
            />

            <button
              onClick={joinMeeting}
              className="mt-5 w-full bg-green-600 hover:bg-green-700 py-3 rounded-xl"
            >
              Join Meeting
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;