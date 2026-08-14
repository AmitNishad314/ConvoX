import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/axios'
import { AuthContext } from '../context/AuthContext'

const Login = () => {

  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  const [formData, setFormData] = useState({
    userName: '',
    password: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    setError('')
    setLoading(true)

    try {

      const response = await api.post('/users/login', formData)

      login(response.data.user, response.data.token)

      navigate('/dashboard')

    } catch (err) {

      setError(
        err.response?.data?.message || 'Something went wrong'
      )

    } finally {

      setLoading(false)

    }

  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-slate-900 rounded-2xl shadow-xl p-8">

        <h1 className="text-4xl font-bold text-center text-white">
          ConvoX
        </h1>

        <p className="text-slate-400 text-center mt-2">
          Login to continue
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          <input
            type="text"
            name="userName"
            placeholder="Username"
            value={formData.userName}
            onChange={handleChange}
            required
            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-indigo-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-indigo-500"
          />

          {
            error && (
              <p className="text-red-500 text-sm">
                {error}
              </p>
            )
          }

          <button
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition rounded-lg py-3 text-white font-semibold cursor-pointer disabled:opacity-60"
          >
            {
              loading
                ? "Logging In..."
                : "Login"
            }
          </button>

        </form>

        <p className="text-slate-400 text-center mt-6">

          Don't have an account?

          <Link
            to="/register"
            className="text-indigo-500 ml-2 hover:underline"
          >
            Register
          </Link>

        </p>

      </div>

    </div>
  )
}

export default Login