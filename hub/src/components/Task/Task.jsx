/* eslint-disable react/prop-types */
import React, { useState } from "react";
import "./Task.css";

function timeFromToday(dateString) {
  const today = new Date();
  const targetDate = new Date(dateString);

  let years = targetDate.getFullYear() - today.getFullYear();
  let months = targetDate.getMonth() - today.getMonth();
  let days = targetDate.getDate() - today.getDate() + 1;

  if (years == 0 && months == 0){
    if (days == 0) {
      return "Today"
    } else if (days == 1) {
      return "Tomorrow"
    }
  }

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      0
    ); // Last day of the previous month
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  let parts = [];
  if (years > 0) parts.push(`${years} year${years === 1 ? "" : "s"}`);
  if (months > 0) parts.push(`${months} month${months === 1 ? "" : "s"}`);
  if (days > 0 || parts.length === 0)
    parts.push(`${days} day${days === 1 ? "" : "s"}`);


  return parts.join(", ");
}

const Task = (props) => {
  // <Task title={title} group={group} closed={closed} dueDate={dueDate}></Task>
  const [closed, setClosed] = useState(false);

  return (
    <div className="task">
      <div className="top">
        <div className="topHeading">
          <div className="title">{props.title}</div>
          <div className="description">{props.group}</div>
        </div>
        {closed ? (
          <button onClick={() => setClosed(false)}>x</button>
        ) : (
          <button onClick={() => setClosed(true)}>[]</button>
        )}
      </div>
      <div className="bottom">{timeFromToday(props.dueDate)}</div>
    </div>
  );
};

export default Task;
