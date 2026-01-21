'use client';

type SearchBarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
};

export function SearchBar({ query, onQueryChange, onSearch }: SearchBarProps) {
  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
      <input
        className="input input-bordered flex-1"
        placeholder="Mod名やキーワードを入力"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            onSearch();
          }
        }}
      />
      <button className="btn btn-primary" onClick={onSearch}>
        検索
      </button>
    </div>
  );
}
