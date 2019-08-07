import { BehaviorSubject, Observable } from "rxjs";

export function toBehaviorSubject<T>(
  observable: Observable<T>,
  initValue?: T
): BehaviorSubject<T> {
  const subject = new BehaviorSubject(initValue);

  observable.subscribe(
    x => {
      subject.next(x);
    },
    err => {
      subject.error(err);
    },
    () => {
      subject.complete();
    }
  );

  return subject;
}
