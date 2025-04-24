import { takeLatest, put, call } from "redux-saga/effects";
import { setUsers, User } from "../slices/userSlice";

// Fake CallAPI
function fetchUsersApi() {
    return Promise.resolve([
        { id: "1", name: "Alice", email: "alice@example.com" },
        { id: "2", name: "Bob", email: "bob@example.com" },
    ]);
}

// Worker Saga
function* handleFetchUsers() {
    try {
        const users: User[] = yield call(fetchUsersApi);
        yield put(setUsers(users));
    } catch (error) {
        console.error("Failed to fetch users:", error);
    }
}

// Watcher Saga
export default function* userSaga() {
    yield takeLatest("user/fetchUsers", handleFetchUsers);
}
