import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function EducationalFAQ() {
  const faqs = [
    {
      question: "What is the current world population?",
      answer:
        "As of 2026, the global human population is estimated to have surpassed 8.18 billion. It continues to grow at a rate of approximately 0.91% per year, which adds roughly 74 million people to the planet annually, or about 2.4 people every second.",
    },
    {
      question: "Which country has the largest population?",
      answer:
        "India holds the largest population in the world, estimated at approximately 1.45 billion in 2026. China is the second-most populous country with about 1.408 billion people. Together, India and China account for over 35% of the total global population.",
    },
    {
      question: "What is population density and how is it calculated?",
      answer:
        "Population density is a measurement of population per unit area. It is calculated by dividing the total population of a country or territory by its total land area (usually expressed in square kilometers or square miles). High-density areas like Singapore or Monaco represent concentrated urban clusters, whereas low-density nations like Australia or Canada feature vast, uninhabited landmasses.",
    },
    {
      question: "What factors influence population growth rate?",
      answer:
        "Population growth rate is primarily driven by three factors: birth rates (fertility), death rates (mortality), and net migration. In developing regions, high birth rates contribute to rapid growth, whereas developed regions often face declining birth rates and aging populations, where growth is stagnant or negative and migration plays a larger role in stabilizing headcounts.",
    },
    {
      question: "Why do population projections matter?",
      answer:
        "Demographic projections help governments, urban planners, and companies prepare for future resource demands. Knowing whether a population is growing, aging, or shrinking allows for better planning in healthcare, education, housing, pension systems, infrastructure, and resource distribution.",
    },
  ]

  return (
    <section className="container mx-auto border-border/40 border-t px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h2 className="font-bold text-2xl text-foreground tracking-tight">
            Demographic FAQ & Insights
          </h2>
          <p className="mt-1 text-muted-foreground text-sm">
            Learn about global population metrics, density concepts, and growth
            projections.
          </p>
        </div>

        <Accordion className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={faq.question}
              value={`item-${index}`}
              className="border-border/40"
            >
              <AccordionTrigger className="py-4 text-left font-semibold text-sm hover:text-primary hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground text-xs leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
