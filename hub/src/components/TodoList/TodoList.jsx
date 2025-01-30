import "./TodoList.css";
import React, { useState } from "react";
import Task from "../Task/Task";

function handleTasks(window) {
  if (window == "all") {
    return "all";
  } else if (window == "open") {
    return "open";
  } else {
    return "closed";
  }
}

const TodoList = () => {
  const now = new Date();
  const date = now.getDate();
  const day = now.toLocaleDateString("en-US", { weekday: "long" });
  const month = now.toLocaleDateString("en-US", { month: "long" });

  const [allTasks, setAllTasks] = useState([]);
  const [openTasks, setOpenTasks] = useState([]);
  const [closedTasks, setClosedTasks] = useState([]);
  const [currWindow, setCurrWindow] = useState("all");

  const title = "Find a House";
  const group = "Crypto Wallet Redesign"
  const closed = false;
  const dueDate = "2025-01-30";

  return (
    <>
      <div>
        <div>
          <h3>
            <strong>Today&apos;s Tasks</strong>
          </h3>
          {`${day}, ${date} ${month}`}
        </div>
        <div>
          <button>+ New Task</button>
        </div>
      </div>

      <div>
        <div>All {allTasks.length}</div>
        <div>Open {openTasks.length}</div>
        <div>Closed {closedTasks.length}</div>
      </div>

      <div>{handleTasks(currWindow)}</div>
      <div>
        ----------------------------------------------------------------
      </div>
      {/* <input type="date" /> */}
      <Task title={title} group={group} closed={closed} dueDate={dueDate}></Task>
    </>
  );
};

export default TodoList;
