import { all, fork } from "redux-saga/effects";
import { watchLoginRequest } from "./authSaga";
import categorySaga from "./categorySaga";


export default function* rootSaga() {
    yield all([
        fork(watchLoginRequest),
        fork(categorySaga),
    ]);
}
