import { useGetNotesQuery } from "./notesApiSlice";
import Note from "./Note";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import { PulseLoader } from "react-spinners";

const NotesList = () => {
  useTitle("techNotes: Notes List");

  const { username, isManager, isAdmin } = useAuth();

  // Query hook for fetching notes
  const {
    data: notes,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetNotesQuery("notesList", {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;

  // Loading state
  if (isLoading) {
    content = <PulseLoader className={"#FFF"} />;
  }

  // Error state
  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  // Success state
  if (isSuccess) {
    const { ids, entities } = notes;

    let filteredIds;

    // Check if the user has Manager or Admin role
    if (isManager || isAdmin) {
      // If true, include all note IDs
      filteredIds = [...ids];
    } else {
      // If false, filter note IDs based on the username
      filteredIds = ids.filter(
        (noteId) => entities[noteId].username === username
      );
    }

    // Render notes if available
    const tableContent =
      ids?.length &&
      filteredIds.map((noteId) => <Note key={noteId} noteId={noteId} />);

    // Render the table with notes
    content = (
      <table className="table table--notes">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th note__status">
              Username
            </th>
            <th scope="col" className="table__th note__created">
              Created
            </th>
            <th scope="col" className="table__th note__updated">
              Updated
            </th>
            <th scope="col" className="table__th note__title">
              Title
            </th>
            <th scope="col" className="table__th note__username">
              Owner
            </th>
            <th scope="col" className="table__th note__edit">
              Edit
            </th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    );
  }

  return content;
};

export default NotesList;
