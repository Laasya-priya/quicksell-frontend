import React, { useState, useEffect } from "react";
import GroupSelector from "./GroupSelector";
import SortSelector from "./SortSelector";
import TicketCard from "./TicketCard";
import "../styles/kanban.css";
import urgentIcon from "../assets/urgentc.svg";
import highIcon from "../assets/high.svg";
import mediumIcon from "../assets/medium.svg";
import lowIcon from "../assets/low.svg";
import noPriorityIcon from "../assets/nopriority.svg";
import todo from "../assets/To-do.svg";
import backlog from "../assets/Backlog.svg";
import inprog from "../assets/in-progress.svg";
import display from "../assets/Display.svg";


const priorityIcons = {
  "Urgent": urgentIcon,
  "High Priority": highIcon,
  "Medium Priority": mediumIcon,
  "Low Priority": lowIcon,
  "No Priority": noPriorityIcon,
  "Todo":todo,
  "Backlog":backlog,
  "In progress":inprog
};
const prior = {
    4: "Urgent",
    3: "High Priority",
    2: "Medium Priority",
    1: "Low Priority",
    0: "No Priority",
  }


const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [grouping, setGrouping] = useState(localStorage.getItem("grouping") || "status");
  const [sorting, setSorting] = useState(localStorage.getItem("sorting") || "priority");
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
   const toggleDropdown = () => setIsOpen((prev) => !prev);
  

  // Fetch tickets and users from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.quicksell.co/v1/internal/frontend-assignment");
        const data = await response.json();
        setTickets(data.tickets);
        setUsers(data.users);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again later.");
      }
    };

    fetchData();
  }, []);

  // Persist grouping and sorting preferences
  useEffect(() => {
    localStorage.setItem("grouping", grouping);
    localStorage.setItem("sorting", sorting);
  }, [grouping, sorting]);

  // Group tickets based on the selected criteria
  const groupTickets = () => {
    if (!Array.isArray(tickets)) return {};

    return tickets.reduce((acc, ticket) => {
      let key;
      if (grouping === "status") {
        key = ticket.status;
      } else if (grouping === "user") {
        const user = users.find((user) => user.id === ticket.userId);
        key = user ? user.name : "Unassigned";
      } else if (grouping === "priority") {
        key = prior[ticket.priority];
      } else {
        key = "Other";
      }

      acc[key] = acc[key] || [];
      acc[key].push(ticket);
      return acc;
    }, {});
  };

  // Sort tickets based on the selected sorting method
  const sortTickets = (tickets) => {
    return tickets.slice().sort((a, b) => {
      if (sorting === "priority") {
        return b.priority - a.priority;
      } else if (sorting === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  };

  // Group and sort tickets
  const groupedTickets = groupTickets();

  // Loading or error state
  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (tickets.length === 0 || users.length === 0) {
    return <p className="loading-message">Loading tickets...</p>;
  }
    
  return (
    <div className="kanban-board">
      <div className="display">
      <img src={display} className="priority-icon" alt={`$Display icon`} />
      <button className="display-button" onClick={toggleDropdown}>
        Display 
      </button>
        {(isOpen && <div className="onclick">
          <div className="group">
            <GroupSelector grouping={grouping} setGrouping={setGrouping} />
          </div>
          <div className="sort">
            <SortSelector sorting={sorting} setSorting={setSorting} />
          </div>
        </div>
        )}
        </div>
      <div className="kanban-columns">
      {Object.keys(groupedTickets)
          .sort((a, b) => {
            if (grouping === "priority") {
              return a.priority - b.priority;
            }
            return 0; 
          }).map((group) => {
          const user = users?.find((user) => user.name === group);
          const groupIcon = user
            ? `https://api.dicebear.com/6.x/initials/svg?seed=${user.name}` 
            : priorityIcons[group]; 

          return (
            <div key={group} className="kanban-column">
              <div className="kanban-column-header">
                <h3 className="kanban-column-title">{group}</h3>
                <img src={groupIcon} className="priority-icon" alt={`${group}`} />
              </div>
              {sortTickets(groupedTickets[group] || []).map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} users={users} group={group} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KanbanBoard;
