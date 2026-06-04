export function JournalEntryHeading() {
  return (
    <thead className="bg-zinc-100 text-left text-xs uppercase text-zinc-600">
      <tr>
        {["Category", "Technique", "Successful", "Training partner", "Trained date", "Actions"].map((heading) => (
          <th key={heading} className="whitespace-nowrap px-3 py-3 font-bold">
            {heading}
          </th>
        ))}
      </tr>
    </thead>
  );
}
