
import { useState, useEffect } from "react";
import TipTapEditor from "../../../components/Editor/TipTapEditor";

const createClause = () => ({
  id: crypto.randomUUID(),
  title: "New Clause",
  content: "<p>Enter your agreement terms here...</p>",
});

const AgreementClauseEditor = ({
  clauses = [],
  onChange,
  disabled = false,
}) => {
  const [items, setItems] = useState(clauses);

  useEffect(() => {
    setItems(clauses);
  }, [clauses]);

  const updateItems = (updatedItems) => {
    setItems(updatedItems);
    onChange?.(updatedItems);
  };

  const updateClause = (id, field, value) => {
    updateItems(
      items.map((clause) =>
        clause.id === id ? { ...clause, [field]: value } : clause
      )
    );
  };

  const addClause = () => {
    updateItems([...items, createClause()]);
  };

  const deleteClause = (id) => {
    if (!window.confirm("Are you sure you want to delete this clause?")) {
      return;
    }

    updateItems(items.filter((clause) => clause.id !== id));
  };

  const moveClause = (index, direction) => {
    const nextIndex = index + direction;

    if (nextIndex < 0 || nextIndex >= items.length) return;

    const updatedItems = [...items];
    [updatedItems[index], updatedItems[nextIndex]] = [
      updatedItems[nextIndex],
      updatedItems[index],
    ];

    updateItems(updatedItems);
  };

  return (
    <div className="agreement-clause-editor">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl font-semibold">Agreement Clauses</h2>
          <p className="text-sm text-gray-500">
            Edit, add, remove, or reorder agreement terms.
          </p>
        </div>

        <button
          type="button"
          onClick={addClause}
          disabled={disabled}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          + Add Clause
        </button>
      </div>

      {items.length === 0 && (
        <p className="rounded-lg border border-dashed p-6 text-center text-gray-500">
          No clauses added yet. Click “Add Clause” to begin.
        </p>
      )}

      <div className="space-y-5">
        {items.map((clause, index) => (
          <section
            key={clause.id}
            className="rounded-xl border border-gray-200 p-4"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm font-medium text-gray-500">
                Clause {index + 1}
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => moveClause(index, -1)}
                  disabled={disabled || index === 0}
                  className="rounded border px-3 py-1 disabled:opacity-40"
                  title="Move up"
                >
                  ↑
                </button>

                <button
                  type="button"
                  onClick={() => moveClause(index, 1)}
                  disabled={disabled || index === items.length - 1}
                  className="rounded border px-3 py-1 disabled:opacity-40"
                  title="Move down"
                >
                  ↓
                </button>

                <button
                  type="button"
                  onClick={() => deleteClause(clause.id)}
                  disabled={disabled}
                  className="rounded border border-red-200 px-3 py-1 text-red-600 disabled:opacity-40"
                >
                  Delete
                </button>
              </div>
            </div>

            <label className="mb-2 block text-sm font-medium">
              Clause Title
            </label>

            <input
              type="text"
              value={clause.title}
              onChange={(event) =>
                updateClause(clause.id, "title", event.target.value)
              }
              disabled={disabled}
              placeholder="Enter clause title"
              className="mb-4 w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
            />

            <label className="mb-2 block text-sm font-medium">
              Clause Content
            </label>

            <TipTapEditor
              content={clause.content}
              onChange={(html) =>
                updateClause(clause.id, "content", html)
              }
            />
          </section>
        ))}
      </div>
    </div>
  );
};

export default AgreementClauseEditor;
