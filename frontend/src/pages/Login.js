import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Mail, Lock } from 'lucide-react';

const Login = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {

    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    if (user && email === user.email && password === user.password) {

      navigate("/home");

    } else {

      alert("Invalid credentials. Please register first.");

    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">

        <div className="bg-white rounded-2xl shadow-2xl p-8">

          <div className="text-center mb-8">

            <div className="flex justify-center mb-4">
              <div className="bg-teal-100 p-4 rounded-full">
                <Brain className="w-12 h-12 text-teal-600" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              PsyCounAssist
            </h1>

            <p className="text-gray-600">
              AI-Powered Psychological Counseling
            </p>

          </div>

          <form onSubmit={handleLogin} className="space-y-6">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>

              <div className="relative">

                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                  placeholder="Enter your email"
                />

              </div>
            </div>

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">

                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                  placeholder="Enter your password"
                />

              </div>

            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-600 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-teal-700 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
            >
              Sign In
            </button>

          </form>

          <div className="mt-6 text-center">

            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-teal-600 cursor-pointer font-semibold"
              >
                Register
              </span>
            </p>

          </div>

        </div>

        <div className="text-center mt-6 text-sm text-gray-600">
          <p>© 2025 PsyCounAssist - AI Mental Wellness Platform</p>
        </div>

      </div>
    </div>
  );
};

export default Login;