import { useGetNotesQuery } from './notesApiSlice';
import Note from './Note';
import useAuth from '../../hooks/useAuth';

const NotesList = () => {
    const { username, isManager, isAdmin } = useAuth()

    const {
        data: notes,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetNotesQuery('notesList', {
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
        const { ids, entities } = notes;

        let filteredIds
        if (isManager || isAdmin) {
            filteredIds = [...ids]
        } else {
            filteredIds = ids.filter(noteId => entities[noteId].username === username)
        }

        content = ids?.length && filteredIds.map(noteId => <Note key={noteId} noteId={noteId} />)
    }

    return (
        <div className='note__lists'>
            {content}
        </div>);
}

export default NotesList; 