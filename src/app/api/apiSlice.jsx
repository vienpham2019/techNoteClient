import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { setCredentials } from "../../features/auth/authSlice"

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:3500",
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token
        if (token) {
            headers.set('authorization', `Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    // console.log(args) // request url, method and body for fecth api 
    // console.log(api) // signal, dispatch, getState() 
    // console.log(extraOptions) // custom like {shout: true}

    let result = await baseQuery(args, api, extraOptions);

    // if the access token expired then send the quest for new access token
    if (result?.error?.status === 403) {
        console.log('sending refresh token');

        // send refresh token to get new access token 
        const refreshToken = await baseQuery('/auth/refresh', api, extraOptions)

        // set refresh token to cookie if token have data 
        if (refreshToken?.data) {
            // store the new token 
            api.dispatch(setCredentials({ ...refreshToken.data }))

            // retry original query with new access token 
            result = await baseQuery(args, api, extraOptions)
        } else {
            // if 
            if (refreshToken?.error?.status === 403) {
                refreshToken.error.data.message = 'Your login has expired. ';
            }
            return refreshToken
        }
    }
    return result;
}

export const apiSlice = createApi({
    reducerPath: 'api', // option default path is 'api' folder
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Note', 'User'],
    endpoints: builder => ({})
})