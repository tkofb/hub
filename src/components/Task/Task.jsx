/* eslint-disable react/prop-types */
import uncheckedIcon from "../../assets/unchecked.svg";
import checkedIcon from "../../assets/checked.svg";
import moment from "moment";
import "./Task.css";

function timeFromToday(dateString) {
  const today = moment().startOf("day"); // Normalize to start of the day
  const targetDate = moment.utc(dateString, "YYYY-MM-DD"); // Parse as UTC

  const duration = moment.duration(targetDate.diff(today)); // Get precise duration

  const diffYears = duration.years();
  const diffMonths = duration.months();
  const diffDays = Math.floor(duration.days()) + 1; // Exact remaining days

  if (diffDays < 0) {
    return "Date Passed";
  }

  if (diffYears === 0 && diffMonths === 0) {
    if (duration.hours() > -23 && duration.hours() <= 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
  }

  if (today.isAfter(targetDate)) {
    return "Date Passed";
  }

  let parts = [];
  if (diffYears > 0)
    parts.push(`${diffYears} year${diffYears === 1 ? "" : "s"}`);
  if (diffMonths > 0)
    parts.push(`${diffMonths} month${diffMonths === 1 ? "" : "s"}`);
  if (diffDays > 0 || parts.length === 0)
    parts.push(`${diffDays} day${diffDays === 1 ? "" : "s"}`);

  return parts.join(", ");
}

const Task = (props) => {
  // <Task title={title} group={group} closed={closed} dueDate={dueDate}></Task>
  const closed = props.closed;

  return (
    <div className={`task ${closed ? "closed" : ""}`}>
      <div className="top">
        <div className="topHeading">
          <div className="title">{props.title}</div>
          <div className="description">{props.group}</div>
        </div>
        {!closed ? (
          <div className="unchecked" onClick={() => {
            props.toggleTask(props.id)
            props.closedLen((prevLen) => prevLen + 1)}}
          >
            <img
              className="checkIcons"
              src={uncheckedIcon}
              alt="unchecked Icon"
            />
          </div>
        ) : (
          <div
            className="checked"
            onClick={() => {
              props.toggleTask(props.id);
              props.closedLen((prevLen) => prevLen - 1);
            }}
          >
            <img
              className="checkIcons"
              src={checkedIcon}
              alt="unchecked Icon"
            />
          </div>
        )}
      </div>
      <hr />

      <div className="bottom">
        <div className="dayInWords">{timeFromToday(props.dueDate)}</div>
        <div className={`impact ${props.impact.toLowerCase()}`}>
          {props.impact}
        </div>
      </div>
    </div>
  );
};

export default Task;
