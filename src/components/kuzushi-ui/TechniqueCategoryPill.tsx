import { categoryStyles, cx, type Category } from "./shared";

export function TechniqueCategoryPill({ category }: { category: Category }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold capitalize",
        categoryStyles[category],
      )}
    >
      {category}
    </span>
  );
}
