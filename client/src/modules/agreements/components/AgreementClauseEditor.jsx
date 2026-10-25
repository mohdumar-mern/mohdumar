import { useState, useEffect } from "react";
import TipTapEditor from "../../../components/Editor/TipTapEditor";
import "./AgreementClauseEditor.css";

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
  const [openClauseId, setOpenClauseId] = useState(null);

  useEffect(() => {
    setItems(clauses);
  }, [clauses]);

  useEffect(() => {
    if (
      openClauseId !== null &&
      !items.some((clause) => clause.id === openClauseId)
    ) {
      setOpenClauseId(null);
    }
  }, [items, openClauseId]);

  const updateItems = (updatedItems) => {
    setItems(updatedItems);
    onChange?.(updatedItems);
  };

  const updateClause = (id, field, value) => {
    const updatedItems = items.map((clause) =>
      clause.id === id ? { ...clause, [field]: value } : clause
    );

    updateItems(updatedItems);
  };

  const addClause = () => {
    updateItems([...items, createClause()]);
    setOpenClauseId(null);
  };

  const deleteClause = (id) => {
    if (!window.confirm("Are you sure you want to delete this clause?")) {
      return;
    }

    updateItems(items.filter((clause) => clause.id !== id));

    if (openClauseId === id) {
      setOpenClauseId(null);
    }
  };

  const moveClause = (index, direction) => {
    const nextIndex = index + direction;

    if (nextIndex < 0 || nextIndex >= items.length) {
      return;
    }

    const updatedItems = [...items];

    [updatedItems[index], updatedItems[nextIndex]] = [
      updatedItems[nextIndex],
      updatedItems[index],
    ];

    updateItems(updatedItems);
  };

  const toggleClause = (id) => {
    setOpenClauseId((currentId) => (currentId === id ? null : id));
  };

  return (
    <div className="agreement-clause-editor">
      <div className="agreement-clause-editor__header">
        <div>
          <h2>Agreement Clauses</h2>
          <p>Edit, add, remove, or reorder agreement terms.</p>
        </div>

        <button
          type="button"
          onClick={addClause}
          disabled={disabled}
          className="agreement-clause-editor__add"
        >
          + Add Clause
        </button>
      </div>

      {items.length === 0 && (
        <p className="agreement-clause-editor__empty">
          No clauses added yet. Click “Add Clause” to begin.
        </p>
      )}

      <div className="agreement-clause-editor__list">
        {items.map((clause, index) => {
          const isOpen = openClauseId === clause.id;
          const titleId = `clause-title-${clause.id}`;
          const contentId = `clause-content-${clause.id}`;

          return (
            <section
              key={clause.id}
              className={`agreement-clause-card ${
                isOpen ? "is-open" : ""
              }`}
            >
              <div className="agreement-clause-card__header">
                <button
                  type="button"
                  className="agreement-clause-card__toggle"
                  onClick={() => toggleClause(clause.id)}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                >
                  <span className="agreement-clause-card__number">
                    {index + 1}
                  </span>

                  <span className="agreement-clause-card__heading">
                    <span className="agreement-clause-card__title">
                      {clause.title?.trim() || `Clause ${index + 1}`}
                    </span>

                    <span className="agreement-clause-card__hint">
                      {isOpen ? "Click to collapse" : "Click to expand"}
                    </span>
                  </span>

                  <span
                    className="agreement-clause-card__chevron"
                    aria-hidden="true"
                  >
                    ▼
                  </span>
                </button>

                <div className="agreement-clause-card__actions">
                  <button
                    type="button"
                    onClick={() => moveClause(index, -1)}
                    disabled={disabled || index === 0}
                    className="agreement-clause-card__action"
                    title="Move up"
                    aria-label={`Move clause ${index + 1} up`}
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    onClick={() => moveClause(index, 1)}
                    disabled={disabled || index === items.length - 1}
                    className="agreement-clause-card__action"
                    title="Move down"
                    aria-label={`Move clause ${index + 1} down`}
                  >
                    ↓
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteClause(clause.id)}
                    disabled={disabled}
                    className="agreement-clause-card__action agreement-clause-card__action--delete"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {isOpen && (
                <div
                  id={contentId}
                  className="agreement-clause-card__content"
                >
                  <label htmlFor={titleId}>Clause Title</label>

                  <input
                    id={titleId}
                    type="text"
                    value={clause.title ?? ""}
                    onChange={(event) =>
                      updateClause(
                        clause.id,
                        "title",
                        event.target.value
                      )
                    }
                    disabled={disabled}
                    placeholder="Enter clause title"
                  />

                  <label>Clause Content</label>

                  <TipTapEditor
                    content={clause.content ?? ""}
                    onChange={(html) =>
                      updateClause(clause.id, "content", html)
                    }
                    editable={!disabled}
                  />
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default AgreementClauseEditor;