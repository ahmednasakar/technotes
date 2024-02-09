import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useGetNotesQuery } from "./notesApiSlice";
import { memo } from "react";

const Note = ({ noteId }) => {
  // Destructure the 'note' from the result of the 'useGetNotesQuery' hook
  const { note } = useGetNotesQuery("notesList", {
    // Customize the data selection from the query result
    selectFromResult: ({ data }) => ({
      note: data?.entities[noteId],
    }),
  });

  // Use React Router's navigation hook
  const navigate = useNavigate();

  // Check if the note data is available
  if (note) {
    // Format date strings for created and updated dates
    const created = new Date(note.createdAt).toLocaleString("en-US", {
      day: "numeric",
      month: "long",
    });

    const updated = new Date(note.updatedAt).toLocaleString("en-US", {
      day: "numeric",
      month: "long",
    });

    // Navigate to edit note route when the edit button is clicked
    const handleEdit = () => navigate(`/dash/notes/${noteId}`);

    // JSX for rendering the note in a table row
    return (
      <tr className="table__row">
        <td className="table__cell note__status">
          {note.completed ? (
            <span className="note__status--completed">Completed</span>
          ) : (
            <span className="note__status--open">Open</span>
          )}
        </td>
        <td className="table__cell note__created">{created}</td>
        <td className="table__cell note__updated">{updated}</td>
        <td className="table__cell note__title">{note.title}</td>
        <td className="table__cell note__username">{note.username}</td>

        {/* Edit button with FontAwesome icon */}
        <td className="table__cell">
          <button className="icon-button table__button" onClick={handleEdit}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>
      </tr>
    );
  } else {
    // Return null if note data is not available
    return null;
  }
};

// Memoize the 'Note' component
const memoizedNote = memo(Note);

export default memoizedNote;
