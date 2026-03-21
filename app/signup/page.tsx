"use client"

import { supabase } from "@/lib/supabase"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignupPage() {
  const router = useRouter()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [confirmEmail, setConfirmEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [age, setAge] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isAdultConfirmed, setIsAdultConfirmed] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const emailsMatch = email.trim() !== "" && email.trim() === confirmEmail.trim()
  const passwordsMatch = password.trim() !== "" && password === confirmPassword

  const ageNumber = Number(age)
  const isAgeValid = age !== "" && !Number.isNaN(ageNumber) && ageNumber >= 18

  const phoneIsValid = /^[+()\d\s-]{7,}$/.test(phone.trim())

  const isFormValid =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    emailsMatch &&
    phoneIsValid &&
    isAgeValid &&
    password.length >= 6 &&
    passwordsMatch &&
    isAdultConfirmed

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)

    if (!isFormValid) return

    setLoading(true)

    const { error } = await supabase.from("users").insert([
      {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        phone,
        age: Number(age),
      },
    ])

    setLoading(false)

    if (error) {
      alert(error.message)
      return
    }

    localStorage.setItem("isLoggedIn", "true")
    localStorage.setItem("userEmail", email)
    localStorage.setItem("userName", firstName)

    router.push("/")
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-12 text-white flex items-center justify-center">
      <div className="w-full max-w-lg">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <h1 className="text-3xl font-semibold tracking-tight">Create account</h1>

          <p className="mt-2 text-sm text-white/60">
            Join Eventra and start discovering student nightlife.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-white/40"
                />
                {submitted && firstName.trim() === "" && (
                  <p className="mt-2 text-xs text-red-400">First name is required.</p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-white/40"
                />
                {submitted && lastName.trim() === "" && (
                  <p className="mt-2 text-xs text-red-400">Last name is required.</p>
                )}
              </div>
            </div>

            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-white/40"
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="Confirm email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-white/40"
              />
              {submitted && !emailsMatch && (
                <p className="mt-2 text-xs text-red-400">Emails do not match.</p>
              )}
            </div>

            <div>
              <input
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-white/40"
              />
              {submitted && !phoneIsValid && (
                <p className="mt-2 text-xs text-red-400">
                  Enter a valid phone number.
                </p>
              )}
            </div>

            <div>
              <input
                type="number"
                placeholder="Age"
                min="18"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-white/40"
              />
              {submitted && !isAgeValid && (
                <p className="mt-2 text-xs text-red-400">
                  You must be at least 18 years old.
                </p>
              )}
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-white/40"
              />
              {submitted && password.length < 6 && (
                <p className="mt-2 text-xs text-red-400">
                  Password must be at least 6 characters.
                </p>
              )}
            </div>

            <div>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-white/40"
              />
              {submitted && !passwordsMatch && (
                <p className="mt-2 text-xs text-red-400">Passwords do not match.</p>
              )}
            </div>

            <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/75">
              <input
                type="checkbox"
                checked={isAdultConfirmed}
                onChange={(e) => setIsAdultConfirmed(e.target.checked)}
                className="mt-1"
              />
              <span>
                I confirm that I am 18+ and the information I entered is correct.
              </span>
            </label>

            {submitted && !isAdultConfirmed && (
              <p className="text-xs text-red-400">
                You must confirm that you are 18+.
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:scale-[1.01] disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Join Now"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/60">
            Already have an account?{" "}
            <Link href="/login" className="text-white underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}