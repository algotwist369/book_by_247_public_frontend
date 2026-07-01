import React from "react";

interface Section {
    title: string;
    content: string[];
}

interface LegalDocumentProps {
    title: string;
    effectiveDate: string;
    intro: string;
    sections: Section[];
}

const LegalDocument = ({ title, effectiveDate, intro, sections }: LegalDocumentProps) => {
    return (
        <main className="min-h-screen bg-zinc-100 py-8 sm:py-10">
            <div className="max-w-4xl mx-auto px-4">
                <article className="bg-white border border-zinc-300 rounded-md p-6 sm:p-8 md:p-10">
                    <header className="pb-5 border-b border-zinc-200">
                        <p className="text-xs uppercase tracking-wide text-zinc-500">BookBy247 Legal</p>
                        <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-900 mt-2">{title}</h1>
                        <p className="text-sm text-zinc-600 mt-2">Effective Date: {effectiveDate}</p>
                    </header>

                    <section className="pt-5">
                        <p className="text-sm sm:text-base text-zinc-700 leading-7">{intro}</p>
                    </section>

                    <section className="mt-6 space-y-6">
                        {sections.map((section) => (
                            <div key={section.title} className="space-y-2">
                                <h2 className="text-base sm:text-lg font-semibold text-zinc-900">{section.title}</h2>
                                <div className="space-y-2">
                                    {section.content.map((line, idx) => (
                                        <p key={idx} className="text-sm sm:text-base text-zinc-700 leading-7">
                                            {line}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </section>

                    <footer className="mt-8 pt-5 border-t border-zinc-200">
                        <p className="text-sm text-zinc-700">For any legal questions, contact us at - info@bookby247.com.</p>
                    </footer>
                </article>
            </div>
        </main>
    );
};

export default LegalDocument;

