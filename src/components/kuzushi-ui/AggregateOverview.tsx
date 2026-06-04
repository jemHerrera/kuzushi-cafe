import { AggregateView } from "./AggregateView";
import { TechniqueCategoryPill } from "./TechniqueCategoryPill";
import { categories } from "./shared";

export function AggregateOverview() {
  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button key={category}>
            <TechniqueCategoryPill category={category} />
          </button>
        ))}
      </div>
      <AggregateView />
    </section>
  );
}
