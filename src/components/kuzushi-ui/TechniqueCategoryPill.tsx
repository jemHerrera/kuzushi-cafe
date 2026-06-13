import {
  categoryStyles,
  cx,
  formatCategoryLabel,
  type Category,
} from "./shared";

export function TechniqueCategoryPill({
  category,
  variant = "default",
}: {
  category: Category;
  variant?: "default" | "small";
}) {
  return (
    <span
      className={cx(
        "inline-flex shrink-0 items-center whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold capitalize",
        categoryStyles[category],
        variant === "small" && "px-1.5 py-0.5 text-[10px]",
      )}
    >
      {formatCategoryLabel(category)}
    </span>
  );
}
