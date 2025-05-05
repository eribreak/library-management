import { all, fork } from "redux-saga/effects";
import { authSaga } from "./authSaga";
import categorySaga from "./categorySaga";
import publisherSaga from "./publisherSaga";
import authorSaga from "./authorSaga";
import employeeSaga from "./employeeSaga";
import orderSaga from "./orderSaga";
import userSaga from "./userSaga";
import reviewSaga from "./reviewSaga";
import bookSaga from "./bookSaga";

export default function* rootSaga() {
    yield all([
        fork(authSaga),
        fork(categorySaga),
        fork(publisherSaga),
        fork(authorSaga),
        fork(employeeSaga),
        fork(orderSaga),
        fork(userSaga),
        fork(reviewSaga),
        fork(bookSaga),
    ]);
}
