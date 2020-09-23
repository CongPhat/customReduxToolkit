import { produce } from 'immer'

export const createSliceP = (slide) => {
  let objectNew = {}
  if (slide.reducers) {
    Object.keys(slide.reducers).forEach((key) => {
      objectNew[key] = (payload) => ({
        type: slide.name + key,
        payload: payload,
        function: slide.reducers[key],
      })
    })
  }
  const Reducer = (state = slide.initialState, action) => {
    return produce(state, (draft) => {
      var functionFeature
      Object.keys(objectNew).forEach((key) => {
        functionFeature =
          action.type === objectNew[key]().type ? objectNew[key]().function : functionFeature
      })
      return functionFeature ? functionFeature(draft, action.payload) : state
    })
  }

  return {
    action: {
      ...objectNew,
    },
    reducer: Reducer,
  }
}
