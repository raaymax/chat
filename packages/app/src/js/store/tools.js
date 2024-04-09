 
export const createModule = (def) => {
  def.reducers = { ...def.reducers, reset: () => def.initialState };
  return ({
    actions: Object.keys(def.reducers).reduce((acc, key) => {
      acc[key] = (data) => ({ type: `${def.name}/${key}`, payload: data });
      return acc;
    }, {}),
    methods: def.methods || {},
    reducer: (state = def.initialState, action) => {
      if (!action.type.startsWith(def.name)) return state;
      const reducer = def.reducers[action.type.split('/').slice(-1)[0]];
      return reducer ? reducer(state, action) : state;
    },
  });
}
