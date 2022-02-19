import { createStore } from 'redux';

export type HeightArrStateType = number[];

export enum HeightArrAction {
    INIT = 'INIT',
    SET = 'SET',
}

export type HeightArrActionInitType = {
    type: HeightArrAction.INIT;
    payload: number;
}
export type HeightArrActionSetType = {
    type: HeightArrAction.SET;
    payload: number[];
}
export type HeightArrActionType = HeightArrActionInitType | HeightArrActionSetType;

// 记录每列高度
const heightArrReducer = (state: HeightArrStateType | undefined, action: HeightArrActionType): HeightArrStateType => {
    switch (action.type) {
        case HeightArrAction.INIT:
            return Array(action.payload).fill(0);
        case HeightArrAction.SET:
            console.log('imgs-set', action.payload)
            return [...action.payload];
        default:
            return state ?? [];
    }
}

export type RootState = ReturnType<typeof heightArrReducer>;
const store = createStore(heightArrReducer);

export default store;