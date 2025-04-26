import { all, fork } from "redux-saga/effects";
import { authSaga } from "./authSaga";
import categorySaga from "./categorySaga";


export default function* rootSaga() {
    yield all([
        fork(authSaga),
        fork(categorySaga),
    ]);
}
