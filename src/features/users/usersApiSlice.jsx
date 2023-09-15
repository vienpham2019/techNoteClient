import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../../app/api/apiSlice";

const usersAdapter = createEntityAdapter({});

const initState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({
            query: () => '/users',
            validateStatus: (res, result) => res.status === 200 && !result.isError,
            keepUnusedDataFor: 5, // default 60s 
            transformResponse: resData => {
                const loadedUsers = resData.map(user => {
                    user.id = user._id;
                    return user;
                });
                return usersAdapter.setAll(initState, loadedUsers);
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'User', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'User', id }))
                    ]
                } else return [{ type: 'User', id: 'LIST' }]
            }
        })
    })
});

export const {
    useGetUsersQuery
} = usersApiSlice;

// Return the query result object 
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

// creates memoized selector 
const selectUsersData = createSelector(
    selectUsersResult,
    userResult => userResult.data // normalized state object with ids & entities 
);

// getSelectors creates these selectors and we rename them with aliases using destructuring 
export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds
    // Pass in a selector thet returns the users slice of state 
} = usersAdapter.getSelectors(state => selectUsersData(state) ?? initState); 