
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Public from './components/Public';
import Login from './features/auth/Login';
import DashLayout from './components/DashLayout';
import Welcome from './features/auth/Welcome';
import NotesList from './features/notes/NotesList';
import UsersList from './features/users/UsersList';
import EditUser from './features/users/EditUser';
import NewUser from './features/users/NewUser';
import EditNote from './features/notes/EditNote';
import NewNote from './features/notes/NewNote';
import Prefetch from './features/auth/Prefecth';
import PersistLogin from './features/auth/PersistLogin';
import RequireAuth from './features/auth/RequireAuth';
import { ROLES } from './config/roles';
import useTitle from './hooks/useTitle';

function App() {
  useTitle('Vien P Repairs')
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route index element={<Public />} />
          <Route path='login' element={<Login />} />

          {/* Dash */}
          <Route element={<PersistLogin />} >
            <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />} >
              <Route element={<Prefetch />} >
                <Route path='dash' element={<DashLayout />}>
                  <Route index element={<Welcome />} />

                  <Route element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.Manager]} />} >
                    <Route path='users'>
                      <Route index element={<UsersList />} />
                      <Route path=":id" element={<EditUser />} />
                      <Route path="new" element={<NewUser />} />
                    </Route>
                  </Route>

                  <Route path='notes'>
                    <Route index element={<NotesList />} />
                    <Route path=":id" element={<EditNote />} />
                    <Route path="new" element={<NewNote />} />
                  </Route>

                </Route>
              </Route>
            </Route>
          </Route>
          {/* End Dash */}

        </Route>
      </Routes>
    </>
  )
}

export default App
