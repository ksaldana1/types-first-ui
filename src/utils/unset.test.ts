/*
   Copyright Avero, LLC

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

import { unset } from './unset';

interface State {
  a: {
    b: {
      c: {
        string: string;
        number: number;
      };
    };
  };
  counter: number;
}

const state: State = {
  a: {
    b: {
      c: {
        string: '1',
        number: 2,
      },
    },
  },
  counter: 7,
};

describe('unset', () => {
  it('should unset the targetted nested value', () => {
    const unsetString = unset(['a', 'b', 'c', 'string']);
    const newState = {
      a: {
        b: {
          c: {
            string: undefined,
            number: 2,
          },
        },
      },
      counter: 7,
    };

    expect(unsetString(state)).toEqual(newState);
  });

  it('should unset the targetted value', () => {
    const unsetCounter = unset(['counter']);
    const newState = {
      a: {
        b: {
          c: {
            string: '1',
            number: 2,
          },
        },
      },
      counter: undefined,
    };

    expect(unsetCounter(state)).toEqual(newState);
  });
});
