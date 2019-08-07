import React from "react";
import { App, FeatureActions } from "../createApp";
import { BehaviorSubject } from "rxjs";

type ActionTypeToDispatchMapper<
  TApp extends App<any, any, any, any, any, any>,
  TActions extends Array<FeatureActions<TApp>["type"]>
> = {
  [K in keyof TActions]: (
    payload: Extract<FeatureActions<TApp>, { type: TActions[K] }>["payload"]
  ) => void
};

export const useDispatchFactory = <T extends App<any, any, any, any, any, any>>(
  app: T
) => {
  const useDispatch = <R extends Array<FeatureActions<T>["type"]>>(
    ...actionTypes: R
  ): ActionTypeToDispatchMapper<T, R> => {
    // @ts-ignore
    return React.useMemo(
      () =>
        actionTypes.map(type => {
          return payload => {
            // @ts-ignore
            app.dispatch({
              type,
              payload
            });
          };
        }),
      []
    );
  };
  return useDispatch;
};

type ExtractObsValue<T> = T extends BehaviorSubject<infer R> ? R : never;
export const usePath = <T extends BehaviorSubject<any>>(
  p: T
): ExtractObsValue<T> => {
  const [state, setState] = React.useState(p.getValue());
  React.useEffect(() => {
    const sub = p.subscribe(v => {
      setState(v);
    });
    return () => sub.unsubscribe();
  }, []);
  return state;
};
