import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../../app/api/apiSlice";

const notesAdapter = createEntityAdapter({
    sortComparer: (a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1
});

const initState = notesAdapter.getInitialState();

export const notesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getNotes: builder.query({
            query: () => '/notes',
            validateStatus: (res, result) => res.status === 200 && !result.isError,
            keepUnusedDataFor: 5, // default 60s 
            transformResponse: resData => {
                const loadedNotes = resData.map(note => {
                    note.id = note._id;
                    return note;
                });
                return notesAdapter.setAll(initState, loadedNotes);
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Note', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Note', id }))
                    ]
                } else return [{ type: 'Note', id: 'LIST' }]
            }
        })
    })
});

export const {
    useGetNotesQuery
} = notesApiSlice;

// Return the query result object 
export const selectNotesResult = notesApiSlice.endpoints.getNotes.select();

// creates memoized selector 
const selectNotesData = createSelector(
    selectNotesResult,
    noteResult => noteResult.data // normalized state object with ids & entities 
);

// getSelectors creates these selectors and we rename them with aliases using destructuring 
export const {
    selectAll: selectAllNotes,
    selectById: selectNoteById,
    selectIds: selectNoteIds
    // Pass in a selector thet returns the notes slice of state 
} = notesAdapter.getSelectors(state => selectNotesData(state) ?? initState); 