import { useState, ChangeEvent, FormEvent, Dispatch, useEffect } from 'react';
import { categories } from '../data/categories';
import { Activity } from '../types';
import { ActivityActions, ActivityState } from '../reducers/activityReducer';

type FormProps = {
  dispatch: Dispatch<ActivityActions>;
  state: ActivityState;
};

const initialState: Activity = {
  id: crypto.randomUUID(),
  category: 1,
  name: '',
  calories: 0,
};

export const Form = ({ dispatch, state }: FormProps) => {
  const [activity, setActivity] = useState<Activity>(initialState);

  useEffect(() => {
    if (state.activeId) {
      const selectedActivity = state.activities.filter(
        (stateActivity) => stateActivity.id === state.activeId
      )[0];
      setActivity(selectedActivity);
    }
  }, [state.activities, state.activeId]);

  const handleChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    setActivity({
      ...activity,
      [e.target.id]: +e.target.value || e.target.value,
    });
  };

  const isValidActivity = () => {
    const { name, calories } = activity;

    return name.trim() !== '' && calories > 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch({
      type: 'save-activity',
      payload: {
        newActivity: activity,
      },
    });

    setActivity({ ...initialState, id: crypto.randomUUID() });
  };

  return (
    <form
      className="space-y-5 bg-white shadow p-10 rounded-lg"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-1 gap-3">
        <label className="font-bold" htmlFor="category">
          Categoria:
        </label>
        <select
          className="border border-slate-300 p-2 rounded-lg w-full bg-white"
          id="category"
          value={activity.category}
          onChange={handleChange}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <label className="font-bold" htmlFor="name">
          Actividad:
        </label>
        <input
          onChange={handleChange}
          value={activity.name}
          type="text"
          id="name"
          className="border border-slate-300 p-2 rounded-lg"
          placeholder="Ej. Comida, Jugo de Naranja, Ensalada, Ejercicio, Pesas, Bicicleta"
        />
      </div>

      <div className="grid grid-cols-1 gap-3">
        <label className="font-bold" htmlFor="calories">
          Calorias:
        </label>
        <input
          onChange={handleChange}
          value={activity.calories}
          type="number"
          id="calories"
          className="border border-slate-300 p-2 rounded-lg"
          placeholder="Calorias. ej. 300 o 500"
        />
      </div>

      <input
        disabled={!isValidActivity()}
        value={activity.category === 1 ? 'Guardar Comida' : 'Guardar Ejercicio'}
        type="submit"
        className="bg-gray-800 hover:bg-gray-800 w-full p-2 font-bold uppercase text-white cursor-pointer disabled:opacity-10"
      />
    </form>
  );
};
