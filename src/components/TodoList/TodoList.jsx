import "./TodoList.css";
import React, { useState } from "react";
import { useRef } from "react";
import Task from "../Task/Task";
import { useForm } from "react-hook-form";

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
  const [activeImpact, setActiveImpact] = useState("Low");

  const { register, handleSubmit, reset} = useForm();

  const title = "Find a House";
  const group = "Crypto Wallet Redesign";
  const closed = false;
  const dueDate = "2025-01-30";
  const impact = "High"; // High-Medium-Low

  const ref = useRef(null);
  const newTaskRef = useRef(null);

  const hideOrShowTasks = () => {
    if (ref.current.style.display == "flex") {
      ref.current.style.display = "none";
      newTaskRef.current.style.display = "flex";
    } else {
      ref.current.style.display = "flex";
      newTaskRef.current.style.display = "none";
    }
  };

  const onSubmit = (data) => {
    const currTask = (
      <Task
        title={data.title}
        group={data.group}
        closed={false}
        dueDate={data.date}
        impact={activeImpact}
      ></Task>
    );

    setAllTasks([...allTasks, currTask])

    console.log("Form Data: ", data);
  };

  return (
    <div className="todoList">
      <div className="titleHeading">
        <div>
          <h3 className="todoListTitle">
            <strong>Today&apos;s Tasks</strong>
          </h3>
          {`${day}, ${date} ${month}`}
        </div>
        <button className="newTaskButton" onClick={hideOrShowTasks}>
          + New Task
        </button>
      </div>

      <div className="controlTasks">
        <div
          className={currWindow == "all" ? "active" : "inactive"}
          onClick={() => setCurrWindow("all")}
        >
          All <span className="taskAmounts">{allTasks.length}</span>
        </div>
        <span className="inactive">|</span>
        <div
          className={currWindow == "open" ? "active" : "inactive"}
          onClick={() => setCurrWindow("open")}
        >
          Open <span className="taskAmounts">{openTasks.length}</span>
        </div>
        <div
          className={currWindow == "closed" ? "active" : "inactive"}
          onClick={() => setCurrWindow("closed")}
        >
          Closed <span className="taskAmounts">{closedTasks.length}</span>
        </div>
      </div>

      <div className="tasklist" ref={ref} style={{ display: "flex" }}>
        <Task
          title={title}
          group={group}
          closed={closed}
          dueDate={dueDate}
          impact={impact}
        ></Task>
        <Task
          title={title}
          group={group}
          closed={closed}
          dueDate={dueDate}
          impact={impact}
        ></Task>
        <Task
          title={title}
          group={group}
          closed={closed}
          dueDate={dueDate}
          impact={impact}
        ></Task>
      </div>
      <form
        className="newTask"
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "none" }}
        ref={newTaskRef}
      >
        <div className="titleHolder">
          <label htmlFor="title">Title:</label>
          <input {...register("title")} type="text" />
          <br />
        </div>
        <div className="groupHolder">
          <label htmlFor="title">Group:</label>
          <input {...register("group")} type="text" />
          <br />
        </div>
        <div className="dueDateHolder">
          <label htmlFor="dueDate">Date:</label>
          <input {...register("date")} type="date" />
          <br />
        </div>
        <div className="impactHolder">
          <label htmlFor="impactLevel">Impact:</label>
          <div className="impactGroupings">
            <div
              className={`impactLevel ${
                activeImpact == "Low" ? "activeImpact" : ""
              }`}
              onClick={() => setActiveImpact("Low")}
            >
              Low
            </div>
            <div
              className={`impactLevel ${
                activeImpact == "Medium" ? "activeImpact" : ""
              }`}
              onClick={() => setActiveImpact("Medium")}
            >
              Medium
            </div>
            <div
              className={`impactLevel ${
                activeImpact == "High" ? "activeImpact" : ""
              }`}
              onClick={() => setActiveImpact("High")}
            >
              High
            </div>
          </div>
          <br />
        </div>
        <div className="submitOrCancelButtons">
          <input
            type="reset"
            value={"RESET"}
            onClick={() => setActiveImpact("Low")}
          />
          <input
            type="submit"
            value={"SUBMIT"}
            onClick={() => hideOrShowTasks()}
          />
        </div>
      </form>
    </div>
  );
};

export default TodoList;
