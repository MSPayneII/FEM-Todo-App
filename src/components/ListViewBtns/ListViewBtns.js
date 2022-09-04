import React from "react";
import "./ListViewBtns.css";

const ListViewBtns = ({
  className,
  showAllItems,
  showAll,
  showActiveItems,
  showActive,
  showCompletedItems,
  showCompleted,
}) => {
  return (
    <div className={className}>
      <button
        className={showAllItems ? "list-view-btn selected" : "list-view-btn"}
        onClick={showAll}
      >
        All
      </button>
      <button
        className={showActiveItems ? "list-view-btn selected" : "list-view-btn"}
        onClick={showActive}
      >
        Active
      </button>
      <button
        className={
          showCompletedItems ? "list-view-btn selected" : "list-view-btn"
        }
        onClick={showCompleted}
      >
        Completed
      </button>
    </div>
  );
};

export default ListViewBtns;
