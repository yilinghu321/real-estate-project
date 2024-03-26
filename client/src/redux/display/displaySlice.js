import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  deleteModal: false
}

const displaySlice = createSlice({
  name: 'display',
  initialState, 
  reducers: {
    openModal(state, action) {
      action.payload = true;
    },
    afterOpenModal() {
      // references are now sync'd and can be accessed.
      subtitle.style.color = '#f00';
    },
    closeModal(state, action) {
      action.payload = false;
    },
  }
});

export const { openModal, afterOpenModal, closeModal } = displaySlice.actions;

export default displaySlice.reducer;