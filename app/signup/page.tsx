"use client";

import Link from "next/link";
import { type ChangeEvent, type FormEvent, useState } from "react";

type SignUpPath = "student" | "professional";

type StudentFormState = {
  fullName: string;
  institution: string;
  studentEmail: string;
  program: string;
  studentId: string;
  password: string;
  confirmPassword: string;
};

type ProfessionalFormState = {
  fullName: string;
  occupation: string;
  organizationName: string;
  organizationType: string;
  professionalEmail: string;
  phone: string;
  role: string;
  password: string;
  confirmPassword: string;
};

const studentDefaults: StudentFormState = {
  fullName: "",
  institution: "",
  studentEmail: "",
  program: "",
  studentId: "",
  password: "",
  confirmPassword: "",
};

const professionalDefaults: ProfessionalFormState = {
  fullName: "",
  occupation: "",
  organizationName: "",
  organizationType: "",
  professionalEmail: "",
  phone: "",
  role: "",
  password: "",
  confirmPassword: "",
};

export default function SignUpPage() {
  const [selectedPath, setSelectedPath] = useState<SignUpPath>("student");
  const [studentForm, setStudentForm] = useState<StudentFormState>(studentDefaults);
  const [professionalForm, setProfessionalForm] = useState<ProfessionalFormState>(professionalDefaults);

  const handleStudentChange = (field: keyof StudentFormState, value: string) => {
    setStudentForm((current) => ({ ...current, [field]: value }));
  };

  const handleProfessionalChange = (field: keyof ProfessionalFormState, value: string) => {
    setProfessionalForm((current) => ({ ...current, [field]: value }));
  };

  const handleStudentSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Student sign-up submitted", studentForm);
  };

  const handleProfessionalSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Professional sign-up submitted", professionalForm);
  };

  const inputClassName =
    "mt-1.5 h-11 w-full rounded-md border border-[#cbd5e1] bg-white px-3 text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:border-[#0284c7] focus:outline-none focus:ring-2 focus:ring-[#dbeefe]";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f3f6fa] text-[#0b1c30]">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-90"
        style={{
          backgroundImage: "url('/Gemini_Generated_Image_ymun4iymun4iymun.jfif')",
        }}
      />
      <div className="absolute inset-0 bg-[#f3f6fa]/35" />

      <header className="relative z-10 flex h-16 items-center justify-between border-b border-[#cbd5e1] bg-white/80 px-5 backdrop-blur-sm sm:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Sovereign Spatial home">
          <span className="flex h-9 w-9 items-center justify-center rounded bg-[#006194] text-[10px] font-bold tracking-wide text-white">KE</span>
          <span>
            <span className="block text-xs font-bold uppercase tracking-wide">Sovereign Spatial</span>
            <span className="hidden text-[11px] text-[#64748b] sm:block">Republic of Kenya National GIS Data Mesh</span>
          </span>
        </Link>
        <Link href="/login" className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#006194] hover:text-[#00527c]">
          Sign in
        </Link>
      </header>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 px-5 py-8 md:grid-cols-[0.9fr_1.1fr] md:px-8">
        <section className="max-w-xl rounded-2xl border border-white/60 bg-white/75 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] backdrop-blur-sm sm:p-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#006194]">Create account</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#0f172a] sm:text-4xl">
            Join the national geospatial data platform
          </h1>
          <p className="mt-4 text-sm leading-6 text-[#526174]">
            Choose the access path that matches your role and complete the registration steps required for secure onboarding.
          </p>

          <div className="mt-8 rounded-xl border border-[#dbe3eb] bg-[#f8fbff] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#006194]">
              {selectedPath === "student" ? "Student onboarding" : "Professional onboarding"}
            </p>
            <ul className="mt-3 space-y-3 text-sm text-[#334155]">
              {selectedPath === "student" ? (
                <>
                  <li>• Complete your personal and academic details.</li>
                  <li>• Upload a valid student ID, admission letter, or institutional proof.</li>
                  <li>• Await administrative review before platform access is approved.</li>
                </>
              ) : (
                <>
                  <li>• Confirm your occupation, office role, and organisation details.</li>
                  <li>• Provide a professional email and official contact information.</li>
                  <li>• Submit credentials for account validation and onboarding review.</li>
                </>
              )}
            </ul>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[#dbe3eb] bg-white/80 p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#006194]">Fast pathway</p>
              <p className="mt-2 text-sm font-semibold text-[#0f172a]">Students</p>
            </div>
            <div className="rounded-xl border border-[#dbe3eb] bg-white/80 p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#006194]">Verified access</p>
              <p className="mt-2 text-sm font-semibold text-[#0f172a]">Professionals & organisations</p>
            </div>
          </div>
        </section>

        <section className="w-full rounded-2xl border border-[#dbe3eb] bg-white/90 p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:p-7">
          <div className="grid gap-2 rounded-xl border border-[#dbe3eb] bg-[#f8fbff] p-1 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setSelectedPath("student")}
              className={`rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                selectedPath === "student"
                  ? "bg-[#006194] text-white shadow-sm"
                  : "text-[#334155] hover:bg-white"
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setSelectedPath("professional")}
              className={`rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                selectedPath === "professional"
                  ? "bg-[#006194] text-white shadow-sm"
                  : "text-[#334155] hover:bg-white"
              }`}
            >
              Professional & Organisation
            </button>
          </div>

          {selectedPath === "student" ? (
            <form onSubmit={handleStudentSubmit} className="mt-6">
              <div className="mb-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#006194]">Student registration</p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0f172a]">Create your student account</h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-semibold text-[#334155] sm:col-span-2">
                  Full name
                  <input
                    type="text"
                    value={studentForm.fullName}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleStudentChange("fullName", event.target.value)}
                    className={inputClassName}
                    placeholder="Jane Wanjiku"
                  />
                </label>

                <label className="block text-xs font-semibold text-[#334155] sm:col-span-2">
                  Institution / university
                  <input
                    type="text"
                    value={studentForm.institution}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleStudentChange("institution", event.target.value)}
                    className={inputClassName}
                    placeholder="University of Nairobi"
                  />
                </label>

                <label className="block text-xs font-semibold text-[#334155]">
                  Student email
                  <input
                    type="email"
                    value={studentForm.studentEmail}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleStudentChange("studentEmail", event.target.value)}
                    className={inputClassName}
                    placeholder="student@students.uonbi.ac.ke"
                  />
                </label>

                <label className="block text-xs font-semibold text-[#334155]">
                  Program / course
                  <input
                    type="text"
                    value={studentForm.program}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleStudentChange("program", event.target.value)}
                    className={inputClassName}
                    placeholder="Geospatial Engineering"
                  />
                </label>

                <label className="block text-xs font-semibold text-[#334155] sm:col-span-2">
                  Student identity / registration number
                  <input
                    type="text"
                    value={studentForm.studentId}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleStudentChange("studentId", event.target.value)}
                    className={inputClassName}
                    placeholder="UON/2024/12345"
                  />
                </label>

                <label className="block text-xs font-semibold text-[#334155]">
                  Password
                  <input
                    type="password"
                    value={studentForm.password}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleStudentChange("password", event.target.value)}
                    className={inputClassName}
                    placeholder="Create a password"
                  />
                </label>

                <label className="block text-xs font-semibold text-[#334155]">
                  Confirm password
                  <input
                    type="password"
                    value={studentForm.confirmPassword}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleStudentChange("confirmPassword", event.target.value)}
                    className={inputClassName}
                    placeholder="Repeat password"
                  />
                </label>

                <label className="block text-xs font-semibold text-[#334155] sm:col-span-2">
                  Identity verification document
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="mt-1.5 block w-full cursor-pointer rounded-md border border-dashed border-[#cbd5e1] bg-[#f8fbff] px-3 py-2 text-sm text-[#334155] file:mr-3 file:rounded file:border-0 file:bg-[#e0f2fe] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#006194]"
                  />
                  <span className="mt-1 block text-[11px] text-[#64748b]">Upload your student ID, admission letter, or institutional enrollment proof for review.</span>
                </label>
              </div>

              <button type="submit" className="mt-6 h-11 w-full rounded-md bg-[#006194] px-4 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#00527c]">
                Submit student registration
              </button>
            </form>
          ) : (
            <form onSubmit={handleProfessionalSubmit} className="mt-6">
              <div className="mb-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#006194]">Professional registration</p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0f172a]">Create your institutional account</h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-semibold text-[#334155] sm:col-span-2">
                  Full name
                  <input
                    type="text"
                    value={professionalForm.fullName}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleProfessionalChange("fullName", event.target.value)}
                    className={inputClassName}
                    placeholder="Dr. Grace Okoth"
                  />
                </label>

                <label className="block text-xs font-semibold text-[#334155]">
                  Occupation / job title
                  <input
                    type="text"
                    value={professionalForm.occupation}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleProfessionalChange("occupation", event.target.value)}
                    className={inputClassName}
                    placeholder="GIS Analyst"
                  />
                </label>

                <label className="block text-xs font-semibold text-[#334155]">
                  Role in organisation
                  <input
                    type="text"
                    value={professionalForm.role}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleProfessionalChange("role", event.target.value)}
                    className={inputClassName}
                    placeholder="Senior Data Manager"
                  />
                </label>

                <label className="block text-xs font-semibold text-[#334155] sm:col-span-2">
                  Organisation name
                  <input
                    type="text"
                    value={professionalForm.organizationName}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleProfessionalChange("organizationName", event.target.value)}
                    className={inputClassName}
                    placeholder="Kenya National Bureau of Statistics"
                  />
                </label>

                <label className="block text-xs font-semibold text-[#334155]">
                  Organisation type
                  <select
                    value={professionalForm.organizationType}
                    onChange={(event: ChangeEvent<HTMLSelectElement>) => handleProfessionalChange("organizationType", event.target.value)}
                    className={inputClassName}
                  >
                    <option value="">Select type</option>
                    <option value="Government agency">Government agency</option>
                    <option value="Academic institution">Academic institution</option>
                    <option value="Private company">Private company</option>
                    <option value="NGO / development partner">NGO / development partner</option>
                    <option value="Research institute">Research institute</option>
                  </select>
                </label>

                <label className="block text-xs font-semibold text-[#334155]">
                  Professional email
                  <input
                    type="email"
                    value={professionalForm.professionalEmail}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleProfessionalChange("professionalEmail", event.target.value)}
                    className={inputClassName}
                    placeholder="name@organization.go.ke"
                  />
                </label>

                <label className="block text-xs font-semibold text-[#334155]">
                  Primary contact number
                  <input
                    type="tel"
                    value={professionalForm.phone}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleProfessionalChange("phone", event.target.value)}
                    className={inputClassName}
                    placeholder="+254 712 345 678"
                  />
                </label>

                <label className="block text-xs font-semibold text-[#334155]">
                  Password
                  <input
                    type="password"
                    value={professionalForm.password}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleProfessionalChange("password", event.target.value)}
                    className={inputClassName}
                    placeholder="Create a password"
                  />
                </label>

                <label className="block text-xs font-semibold text-[#334155]">
                  Confirm password
                  <input
                    type="password"
                    value={professionalForm.confirmPassword}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleProfessionalChange("confirmPassword", event.target.value)}
                    className={inputClassName}
                    placeholder="Repeat password"
                  />
                </label>

                <label className="block text-xs font-semibold text-[#334155] sm:col-span-2">
                  Professional credentials / verification documents
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="mt-1.5 block w-full cursor-pointer rounded-md border border-dashed border-[#cbd5e1] bg-[#f8fbff] px-3 py-2 text-sm text-[#334155] file:mr-3 file:rounded file:border-0 file:bg-[#e0f2fe] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#006194]"
                  />
                  <span className="mt-1 block text-[11px] text-[#64748b]">Upload your official ID, professional licence, or organisation credential for validation.</span>
                </label>
              </div>

              <button type="submit" className="mt-6 h-11 w-full rounded-md bg-[#006194] px-4 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#00527c]">
                Submit institutional registration
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
