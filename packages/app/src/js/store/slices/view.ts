import { createSlice } from "@reduxjs/toolkit";

type ViewState = {
  current: string | null;
};

export default createSlice({
  name: 'view',
  initialState: {current: null} as ViewState,
  reducers: {
    set: (state, action) => {
      const view = action.payload;
      if (state.current === view) {
        return {current: null};
      }
      return {current: view};
    },
  },
});

