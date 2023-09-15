import { useGetNotesQuery } from './notesApiSlice';
import Note from './Note';

const NotesList = () => {
    const {
        data: notes,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetNotesQuery(undefined, {
        pollingInterval: 15000, // 15s the data will fetch again
        refertchOnFocus: true, // data will fetch when page on focus 
        refetchOnMountOrArgChange: true // it will refresh data when remount component 
    });

    let content;

    if (isLoading) content = <p>Loading...</p>
    if (isError) {
        content = <p className={isError ? "errmsg" : "offscreen"}>
            {error?.data?.message}
        </p>
    }

    if (isSuccess) {
        const { ids } = notes;
        const tableContent = ids?.length
            ? ids.map(noteId => <Note key={noteId} noteId={noteId} />)
            : null

        content = (
            <table className="table table--notes">
                <thead className="table___thead">
                    <tr>
                        <th scope="col" className="table__th note__roles">Username</th>
                        <th scope="col" className="table__th note__roles">Created</th>
                        <th scope="col" className="table__th note__roles">Updated</th>
                        <th scope="col" className="table__th note__roles">Titile</th>
                        <th scope="col" className="table__th note__roles">Owner</th>
                        <th scope="col" className="table__th note__roles">Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>
        )
    }

    return content;
}

export default NotesList; 