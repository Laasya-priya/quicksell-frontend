import React from "react";

const SortSelector = ({ sorting, setSorting }) => {
  return (
    <div className="sort-selector">
      <label>Ordering:</label>
      <select value={sorting} onChange={(e) => setSorting(e.target.value)}>
        <option value="priority">Priority</option>
        <option value="title">Title</option>
      </select>
    </div>
  );
};

export default SortSelector;
