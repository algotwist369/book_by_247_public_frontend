import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Join Bookby247 Team - Careers",
    description:
        "Explore career opportunities at Bookby247. Join our team to build innovative booking and growth solutions for spas, salons, and wellness businesses.",
    keywords: [
        "Bookby247 careers",
        "jobs at Bookby247",
        "startup careers",
        "frontend developer jobs",
        "product and operations roles"
    ],
    alternates: {
        canonical: "/careers"
    },
    openGraph: {
        title: "Careers - Bookby247",
        description: "Join Bookby247 and help shape the future of spa and salon booking experiences.",
        url: "https://bookby247.com/careers",
        type: "website"
    }
};

const CareersPage = () => {
    return (
        <main className="min-h-screen bg-zinc-100 py-8 sm:py-10">
            <div className="max-w-5xl mx-auto px-4">
                <section className="bg-white border border-zinc-300 rounded-md p-6 sm:p-8 md:p-10">
                    <header className="pb-6 border-b border-zinc-200">
                        <p className="text-xs uppercase tracking-wide text-zinc-500">Bookby247 Careers</p>
                        <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-900 mt-2">Build the future of local wellness bookings</h1>
                        <p className="text-sm sm:text-base text-zinc-700 mt-3 max-w-3xl leading-7">
                            We are building a trusted discovery and booking platform for spas, salons, and beauty businesses.
                            If you care about product quality, customer trust, and measurable impact, we would love to hear from you.
                        </p>
                    </header>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border border-zinc-200 rounded-md p-4">
                            <p className="text-xs uppercase tracking-wide text-zinc-500">Work Culture</p>
                            <p className="text-sm text-zinc-700 mt-2">Fast execution, ownership mindset, and customer-first thinking.</p>
                        </div>
                        <div className="border border-zinc-200 rounded-md p-4">
                            <p className="text-xs uppercase tracking-wide text-zinc-500">Growth</p>
                            <p className="text-sm text-zinc-700 mt-2">Learn across product, business, and operations in a high-impact environment.</p>
                        </div>
                        <div className="border border-zinc-200 rounded-md p-4">
                            <p className="text-xs uppercase tracking-wide text-zinc-500">Benefits</p>
                            <p className="text-sm text-zinc-700 mt-2">Competitive compensation, flexible collaboration, and growth opportunities.</p>
                        </div>
                    </div>

                    <section className="mt-8">
                        <h2 className="text-lg sm:text-xl font-semibold text-zinc-900">Career Application Form</h2>
                        <p className="text-sm text-zinc-600 mt-1">
                            Submit your details and choose your preferred job category. Our team will review and reach out.
                        </p>

                        <form className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-1">
                                <label className="text-xs uppercase tracking-wide text-zinc-600">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    className="mt-1 w-full h-11 px-3 rounded-md border border-zinc-300 text-sm text-zinc-900 bg-white focus:outline-none"
                                />
                            </div>

                            <div className="sm:col-span-1">
                                <label className="text-xs uppercase tracking-wide text-zinc-600">Email</label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="mt-1 w-full h-11 px-3 rounded-md border border-zinc-300 text-sm text-zinc-900 bg-white focus:outline-none"
                                />
                            </div>

                            <div className="sm:col-span-1">
                                <label className="text-xs uppercase tracking-wide text-zinc-600">Phone Number</label>
                                <input
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    className="mt-1 w-full h-11 px-3 rounded-md border border-zinc-300 text-sm text-zinc-900 bg-white focus:outline-none"
                                />
                            </div>

                            <div className="sm:col-span-1">
                                <label className="text-xs uppercase tracking-wide text-zinc-600">Job Category</label>
                                <select className="mt-1 w-full h-11 px-3 rounded-md border border-zinc-300 text-sm text-zinc-900 bg-white focus:outline-none">
                                    <option value="">Select job category</option>
                                    <option value="engineering">Engineering / Development</option>
                                    <option value="design">Design / UI UX</option>
                                    <option value="product">Product / Strategy</option>
                                    <option value="operations">Operations / Support</option>
                                    <option value="marketing">Marketing / Growth</option>
                                    <option value="sales">Sales / Partnerships</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="sm:col-span-2">
                                <label className="text-xs uppercase tracking-wide text-zinc-600">Experience Summary</label>
                                <textarea
                                    rows={5}
                                    placeholder="Briefly describe your experience, skills, and role preference"
                                    className="mt-1 w-full px-3 py-2 rounded-md border border-zinc-300 text-sm text-zinc-900 bg-white focus:outline-none resize-none"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="text-xs uppercase tracking-wide text-zinc-600">Upload Resume</label>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    className="mt-1 w-full h-11 px-3 py-2 rounded-md border border-zinc-300 text-sm text-zinc-900 bg-white focus:outline-none file:mr-3 file:border-0 file:bg-zinc-100 file:px-3 file:py-1 file:rounded file:text-sm"
                                />
                                <p className="mt-1 text-xs text-zinc-500">Accepted formats: PDF, DOC, DOCX</p>
                            </div>

                            <div className="sm:col-span-2">
                                <label className="text-xs uppercase tracking-wide text-zinc-600">Resume / Portfolio Link (Optional)</label>
                                <input
                                    type="url"
                                    placeholder="https://your-portfolio-or-resume-link"
                                    className="mt-1 w-full h-11 px-3 rounded-md border border-zinc-300 text-sm text-zinc-900 bg-white focus:outline-none"
                                />
                            </div>

                            <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
                                <button
                                    type="button"
                                    className="h-11 px-5 rounded-md bg-zinc-900 text-white text-sm font-medium"
                                >
                                    Submit Application
                                </button>
                                <p className="text-xs text-zinc-500">
                                    Prefer email? Send your resume to careers@bookby247.com with subject "Career Application".
                                </p>
                            </div>
                        </form>
                    </section>

                    <footer className="mt-8 pt-6 border-t border-zinc-200">
                        <p className="text-sm text-zinc-700">
                            To apply, email your profile and brief introduction to{" "}
                            <a href="mailto:careers@bookby247.com" className="underline text-zinc-900">
                                careers@bookby247.com
                            </a>.
                        </p>
                        <div className="mt-4">
                            <Link href="/" className="text-sm text-zinc-900 underline">
                                Back to Home
                            </Link>
                        </div>
                    </footer>
                </section>
            </div>
        </main>
    );
};

export default CareersPage;

