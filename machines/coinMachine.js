import { assign, createMachine } from "xstate";


const setData = (context, event) => {
  return event.value
}


export const coinMachine = createMachine({
  initial: "active",
  context: {
    coin: [],
    types: []
  },
  states: {
    active: {
      on: {
        TYPE: { actions: assign({ types: setData }) },
        DATA: { actions: assign({ coin: setData }) },
      }
    }
  }
})