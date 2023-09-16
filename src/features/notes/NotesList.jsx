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
        content = ids?.length
            ? ids.map(noteId => <Note key={noteId} noteId={noteId} />)
            : null
    }

    return (
        <div className='note__lists'>
            {content}
        </div>);
}

export default NotesList; 