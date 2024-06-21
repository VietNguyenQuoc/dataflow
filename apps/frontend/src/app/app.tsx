import { createContext, useContext, useEffect, useState } from 'react';
import { isEqual } from 'lodash';
const AppContext = createContext<any>(null);

const routes: Record<string, any> = {
  name: NamePage,
  email: EmailPage,
};

export function App() {
  const [state, setState] = useState({
    name: {
      firstName: '',
      lastName: '',
      middleName: '',
      isMiddleNameSplit: false,
    },
    page: 'name',
  });
  const Route = routes[state.page];

  return (
    <div className="container p-4">
      <AppContext.Provider value={{ state, setState }}>
        <Route />
      </AppContext.Provider>
    </div>
  );
}

const buildRequestPayload = (state) => ({
  fullName: `${state.firstName} ${state.lastName} ${state.middleName}`,
});

function NamePage() {
  const { state, setState } = useContext(AppContext);
  const initValue = (() => {
    // if (!state.name.isMiddleNameSplit) return state.name;

    const [middleName1, middleName2] = state.name.middleName.split(' ');

    return { ...state.name, middleName1, middleName2 };
  })();
  const [values, setValues] = useState(initValue);

  const handleInputChange = (e, name) => {
    setValues((value) => ({ ...value, [name]: e.target.value }));
  };

  const handleNext = () => {
    let payload: any = {
      firstName: values.firstName,
      lastName: values.lastName,
      // isMiddleNameSplit: values.isMiddleNameSplit,
    };

    payload.middleName = values.isMiddleNameSplit
      ? values.middleName1.concat(' ', values.middleName2)
      : values.middleName;

    // This is not the request payload, it's global state payload
    const originalPayload = {
      firstName: state.name.firstName,
      lastName: state.name.lastName,
      middleName: state.name.middleName,
    };

    if (isEqual(payload, originalPayload)) {
      console.log('Equal');
    } else {
      console.log('Data changed');
      const body = buildRequestPayload(payload);

      fetch('http://localhost:4000/user', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => res.text().then(console.log));
    }

    payload.isMiddleNameSplit = values.isMiddleNameSplit;

    setState((state) => ({ ...state, name: payload }));
    setState((state) => ({ ...state, page: 'email' }));
  };

  return (
    <div>
      <div className="mb-4">
        <label>
          First name
          <input
            className="ring-2 mx-2 inline-block"
            value={values.firstName}
            onChange={(e) => handleInputChange(e, 'firstName')}
          ></input>
        </label>
        <label>
          Last name
          <input
            className="ring-2 mx-2 inline-block"
            value={values.lastName}
            onChange={(e) => handleInputChange(e, 'lastName')}
          ></input>
        </label>
        {!values.isMiddleNameSplit ? (
          <label>
            Middle name
            <input
              className="ring-2 mx-2 inline-block"
              value={values.middleName}
              onChange={(e) => handleInputChange(e, 'middleName')}
            ></input>
          </label>
        ) : (
          <>
            <label>
              Middle name 1
              <input
                className="ring-2 mx-2 inline-block"
                value={values.middleName1}
                onChange={(e) => handleInputChange(e, 'middleName1')}
              ></input>
            </label>
            <label>
              Middle name 2
              <input
                className="ring-2 mx-2 inline-block"
                value={values.middleName2}
                onChange={(e) => handleInputChange(e, 'middleName2')}
              ></input>
            </label>
          </>
        )}
      </div>

      <button
        className="px-6 py-3 text-white bg-green-700 rounded-sm mr-2"
        onClick={() =>
          setValues((v) => ({ ...v, isMiddleNameSplit: !v.isMiddleNameSplit }))
        }
      >
        {values.isMiddleNameSplit ? 'Unite' : 'Split'}
      </button>

      <button
        className="px-6 py-3 text-white bg-red-700 rounded-sm"
        onClick={handleNext}
      >
        Next
      </button>
    </div>
  );
}

function EmailPage() {
  const { setState } = useContext(AppContext);

  const handlePrev = () => {
    setState((s) => ({ ...s, page: 'name' }));
  };
  return (
    <div>
      <div>Email Page</div>
      <button
        className="px-6 py-3 text-white bg-red-700 rounded-sm"
        onClick={handlePrev}
      >
        Back
      </button>
    </div>
  );
}

export default App;
