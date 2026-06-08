export function JournalEntryHeading() {
  return (
    <thead className="bg-zinc-100 text-left text-xs uppercase text-zinc-600">
      <tr>
        {[
          "Category",
          "Technique",
          "Type",
          "Training partner",
          "Trained date",
        ].map((heading) => (
          <th key={heading} className="whitespace-nowrap px-3 py-3 font-bold">
            {heading}
          </th>
        ))}
        <th className="w-12 px-2 py-3">
          <span className="sr-only">Entry actions</span>
        </th>
      </tr>
    </thead>
  );
}
