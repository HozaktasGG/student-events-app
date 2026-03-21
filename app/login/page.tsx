"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>

          <p className="mt-2 text-sm text-white/60">
            Welcome back to Eventra
          </p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault()

              // fake login
              localStorage.setItem("isLoggedIn", "true")
              localStorage.setItem("userEmail", email)
              localStorage.setItem(
                "userName",
                email.split("@")[0] || "Profile"
              )

              router.push("/")
            }}
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-white/40"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-white/40"
            />

            <button
              type="submit"
              className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:scale-[1.01]"
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/60">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-white underline">
              Join now
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}