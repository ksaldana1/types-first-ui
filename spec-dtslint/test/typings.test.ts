import { createTypesafeRedux } from '../../src';
import { map, mergeMapTo } from 'rxjs/operators';
import { empty } from 'rxjs';

interface CounterState {
  counter: number;
}

enum ActionTypes {
  COUNTER_ADD = 'COUNTER::ADD',
  COUNTER_SUBTRACT = 'COUNTER::SUBTRACT',
}

interface Add {
  type: ActionTypes.COUNTER_ADD;
  payload: { addBy: number };
}

interface Subtract {
  type: ActionTypes.COUNTER_SUBTRACT;
  payload: { subtractBy: number };
}

export type AppActions = Add | Subtract;

export const { path, selector, action, createApp } = createTypesafeRedux<
  CounterState,
  AppActions
>();

const Paths = {
  COUNTER: path(['counter']), // $ExpectType Path<CombinedState<CounterState, null>, number>
  BAD_PATH: path(['somewhere']), // $ExpectError
};

// prettier-ignore
const doubleCounter = selector(Paths.COUNTER, count => { // $ExpectType Observable<number>
  const currentCount = count; // $ExpectType number
  return currentCount * 2;
});

const addImpl = action(ActionTypes.COUNTER_ADD, {
  reducer: (state, action) => {
    const s = state; // $ExpectType CombinedState<CounterState, null>
    const a = action; // $ExpectType Add
    return state;
  },
  epic: action$ => {
    return action$.pipe(
      map(x => {
        const b = x; // $ExpectType Add
        return x;
      }),
      mergeMapTo(empty())
    );
  },
});

const subtractImpl = action(ActionTypes.COUNTER_SUBTRACT);

const addInstanceErr = addImpl.creator({ addBy: '2' }); // $ExpectError
const addInstanceNoErr = addImpl.creator({ addBy: 2 }); // $ExpectType Add

const app = createApp({
  actions: {
    [ActionTypes.COUNTER_ADD]: addImpl,
    [ActionTypes.COUNTER_SUBTRACT]: subtractImpl,
  },
  initialState: { counter: 0 },
});

const appActionCreatorAdd = app.actionCreator(ActionTypes.COUNTER_ADD); // $ExpectType ActionCreator<Add>
