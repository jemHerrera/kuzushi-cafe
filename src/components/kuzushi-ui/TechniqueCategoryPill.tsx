import { categoryStyles, cx, type Category } from "./shared";

export function TechniqueCategoryPill({ category }: { category: Category }) {
  return (
    <span
      className={cx(
        "inline-flex shrink-0 items-center whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold capitalize",
        categoryStyles[category],
      )}
    >
      {category}
    </span>
  );
}
