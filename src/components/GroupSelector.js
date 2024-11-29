import React from "react";

const GroupSelector = ({ grouping, setGrouping }) => {
  return (
    <div className="group-selector">
      <label>Grouping:</label>
      <select value={grouping} onChange={(e) => setGrouping(e.target.value)}>
        <option value="status">Status</option>
        <option value="user">User</option>
        <option value="priority">Priority</option>
      </select>
    </div>
  );
};

export default GroupSelector;
