import { BarChart3, CalendarCheck, CheckCircle2, Gift, MapPin, ShieldCheck, Store } from "lucide-react";
import { CustomImage } from "@/components/ui/CustomImage";

const customerBenefits = [
    {
        icon: MapPin,
        title: "Find trusted businesses nearby",
        description: "Search verified spas, salons, massage centers and beauty parlours by city, area, service or business name."
    },
    {
        icon: CalendarCheck,
        title: "Book without account hassle",
        description: "Choose a service, compare prices, select a slot and confirm your appointment online in a few simple steps."
    },
    {
        icon: ShieldCheck,
        title: "Transparent prices and reviews",
        description: "Know the service, duration and price before booking, with verified reviews and clear business details."
    },
    {
        icon: Gift,
        title: "Offers, wallet points and support",
        description: "Get loyalty points on bookings, discover deals and reach support when you need help with an appointment."
    }
] as const;

const ownerBenefits = [
    "Multi-branch spa and salon management from one dashboard",
    "Custom business webpage with services, reviews, location, FAQs and online booking",
    "Manager, staff, attendance, document, payroll and commission management",
    "Customer CRM, loyalty tracking, enquiry management and lead retargeting",
    "Inventory alerts, internal requests and approval workflows for every center",
    "Revenue, billing, finance, campaign, WhatsApp/email reminder and AI analytics tools"
] as const;

const PlatformOverviewSection = () => {
    return (
        <section className="bg-white px-4 py-14 sm:px-6 sm:py-16 md:px-8">
            <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-12 lg:items-center">
                <div className="space-y-7 lg:col-span-5">
                    <div className="space-y-4">
                        <p className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-rose-800">
                            <Store className="h-3.5 w-3.5" aria-hidden="true" />
                            INDIA'S TOP SALON BOOKING APP & SPA DIRECTORY
                        </p>
                        <h2 className="text-balance text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
                            What is Bookby247 & How to Book Salons Online?
                        </h2>
                        <p className="text-sm leading-7 text-zinc-700 sm:text-base">
                            <b>Bookby247</b> is a premier <b>online salon appointment booking app</b> and <b>local beauty parlour finder</b> built for <b>local spas, hair salons, and beauty parlours in India.</b> Customers can instantly locate <b>verified local spa treatments and hair stylist services</b> with <b>upfront salon menu prices</b>, while business merchants use our advanced <b>spa & salon management software</b> to manage bookings, staff schedules, client billing, and inventory from one unified dashboard.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-5">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-white">
                                <BarChart3 className="h-5 w-5" aria-hidden="true" />
                            </div>
                            <div>
                                <h3 className="font-bold text-zinc-900">Advanced Salon Management Software For Business Growth</h3>
                                <p className="mt-1 text-sm leading-6 text-zinc-600">
                                    Salon & Spa owners get access to real-time salon billing software, automated customer appointment tracking, staff performance metrics, inventory alerts, and beauty clinic revenue analytics to scale operations efficiently.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-7">
                    <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-100 shadow-sm">
                        <CustomImage
                            src="/images/bookby247-platform-overview.png"
                            alt="Bookby247 customer booking and spa salon management dashboard overview"
                            width={1536}
                            height={864}
                            priority
                            className="h-auto w-full object-cover"
                            sizes="(max-width: 1024px) 100vw, 58vw"
                        />
                    </div>
                </div>
            </div>

            <div className="mx-auto mt-10 grid max-w-7xl gap-6 lg:grid-cols-2">
                <div className="rounded-3xl border border-zinc-200 bg-linear-to-br from-white via-white to-rose-50/70 p-6 sm:p-8">
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-zinc-900 sm:text-2xl">For Customers Booking Local Salons & Spa Treatments</h3>
                        <p className="text-sm leading-6 text-zinc-600">
                            Bookby247 simplifies self-care by offering instant online bookings, transparent salon price checks, verified salon customer reviews, and confirmation alerts. and fast appointment booking.
                        </p>
                    </div>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        {customerBenefits.map((item) => (
                            <div key={item.title} className="rounded-2xl border border-zinc-200 bg-white p-4">
                                <item.icon className="h-5 w-5 text-rose-700" aria-hidden="true" />
                                <h4 className="mt-3 text-sm font-bold text-zinc-900">{item.title}</h4>
                                <p className="mt-1 text-xs leading-5 text-zinc-600">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-3xl border border-zinc-200 bg-zinc-950 p-6 text-white sm:p-8">
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold sm:text-2xl">For Hair Salon, Spa & Beauty Parlour Owners</h3>
                        <p className="text-sm leading-6 text-zinc-300">
                            Effortlessly list your salon or spa business online, coordinate multiple branches, manage digital bookings, and reduce no-shows automatically. communication from one place.
                        </p>
                    </div>
                    <div className="mt-6 grid gap-3">
                        {ownerBenefits.map((item) => (
                            <div key={item} className="flex items-start gap-3">
                                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-rose-300" aria-hidden="true" />
                                <p className="text-sm leading-6 text-zinc-100">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mx-auto mt-6 max-w-7xl rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8">
                <div className="grid gap-6 md:grid-cols-3">
                    <div>
                        <h3 className="text-base font-bold text-zinc-900">No hidden charges for customers</h3>
                        <p className="mt-2 text-sm leading-6 text-zinc-600">
                            Customers pay for the service they select, with transparent service information and appointment details before confirmation.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-zinc-900">Lead and enquiry management</h3>
                        <p className="mt-2 text-sm leading-6 text-zinc-600">
                            Businesses can manage booking enquiries, service questions, leads from different platforms and future retargeting data.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-zinc-900">24/7 support mindset</h3>
                        <p className="mt-2 text-sm leading-6 text-zinc-600">
                            Bookby247 is designed to support customers and business teams with smoother appointment, communication and growth workflows.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PlatformOverviewSection;
