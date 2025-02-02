import "./TodoList.css";
import { useState } from "react";
import { useRef } from "react";
import Task from "../Task/Task";
import { useForm } from "react-hook-form";
import moment from "moment";

const TodoList = () => {
  const now = new Date();
  const date = now.getDate();
  const day = now.toLocaleDateString("en-US", { weekday: "long" });
  const month = now.toLocaleDateString("en-US", { month: "long" });

  const [allTasks, setAllTasks] = useState([]);
  const [closedTaskLength, setClosedTaskLenth] = useState(0);

  const [currWindow, setCurrWindow] = useState("all");
  const [activeImpact, setActiveImpact] = useState("Low");

  const { register, handleSubmit, reset } = useForm();

  const ref = useRef(null);
  const controlTasksRef = useRef(null);
  const newTaskRef = useRef(null);

  const hideOrShowTasks = () => {
    if (ref.current.style.display == "flex") {
      ref.current.style.display = "none";
      controlTasksRef.current.style.display = "none";
      newTaskRef.current.style.display = "flex";
    } else {
      ref.current.style.display = "flex";
      controlTasksRef.current.style.display = "flex";
      newTaskRef.current.style.display = "none";
    }
  };

  const toggleTask = (id) => {
    setAllTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, closed: !task.closed } : task
      )
    );
  };

  const handleTasks = (window) => {
    if (window == "all") {
      return allTasks
        .sort((x, y) => {
          return x.diffDays < y.diffDays ? -1 : 1;
        })
        .sort((x, y) => {
          return x.closed === y.closed ? 0 : x.closed ? 1 : -1;
        })
        .map((task) => (
          <Task
            title={task.title}
            group={task.group}
            closed={task.closed}
            toggleTask={toggleTask}
            closedLen={setClosedTaskLenth}
            dueDate={task.date}
            impact={task.impact}
            key={task.id}
            id={task.id}
          />
        ));
    } else if (window == "closed") {
      return allTasks
        .filter((task) => task.closed == true)
        .sort((x, y) => {
          return x.diffDays < y.diffDays ? -1 : 1;
        })
        .map((task) => (
          <Task
            title={task.title}
            group={task.group}
            closed={task.closed}
            toggleTask={toggleTask}
            closedLen={setClosedTaskLenth}
            dueDate={task.date}
            impact={task.impact}
            key={task.id}
            id={task.id}
          />
        ));
    } else {
      return allTasks
        .filter((task) => task.closed == false)
        .sort((x, y) => {
          return x.diffDays < y.diffDays ? -1 : 1;
        })
        .map((task) => (
          <Task
            title={task.title}
            group={task.group}
            closed={task.closed}
            toggleTask={toggleTask}
            closedLen={setClosedTaskLenth}
            dueDate={task.date}
            impact={task.impact}
            key={task.id}
            id={task.id}
          />
        ));
    }
  };

  const onSubmit = (data) => {
    const today = moment().startOf("day"); // Normalize to start of the day
    const targetDate = moment.utc(data.date, "YYYY-MM-DD"); // Parse as UTC
    const duration = moment.duration(targetDate.diff(today)); // Get precise duration
    const diffDays = Math.floor(duration.days()) + 1; // Exact remaining days

    const taskId = `task${allTasks.length}`;
    const currTask = {
      ...data,
      closed: false,
      impact: activeImpact,
      id: taskId,
      diffDays: diffDays,
    };

    setAllTasks((prevTasks) => [...prevTasks, currTask]);
    handleTasks(currWindow);

    setActiveImpact("Low");
    reset();
  };

  return (
    <div className="todoList">
      <div className="scroller">
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

        <div className="controlTasks" ref={controlTasksRef}>
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
            Open{" "}
            <span className="taskAmounts">
              {allTasks.length - closedTaskLength}
            </span>
          </div>
          <div
            className={currWindow == "closed" ? "active" : "inactive"}
            onClick={() => setCurrWindow("closed")}
          >
            Closed <span className="taskAmounts">{closedTaskLength}</span>
          </div>
        </div>

        <div className="tasklist" ref={ref} style={{ display: "flex" }}>
          {handleTasks(currWindow)}
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
    </div>
  );
};

export default TodoList;
