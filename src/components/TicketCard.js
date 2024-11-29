import React from "react";

const TicketCard = ({ ticket, users, group }) => {
  // Find the user associated with the ticket
  const assignedUser = users.find((user) => user.id === ticket.userId);

  return (
    <div className="ticket-card">
      <div className="content">
        <div className="id">{ticket.id}</div>
        <div className="title">{ticket.title}</div>
        <div className="tags">
          {ticket.tag.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
      {group !== assignedUser?.name && (
        <img
          className="avatar"
          src={`https://api.dicebear.com/6.x/initials/svg?seed=${assignedUser?.name || "User"}`}
          alt="User Avatar"
        />
      )}
    </div>
  );
};

export default TicketCard;
