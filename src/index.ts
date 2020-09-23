import { produce } from 'immer'
interface ISlice {
  name: string
  initialState: any
  reducers: object
}

export const createSliceP = (slide: any) => {
  let objectNew: any = {}
  if (slide.reducers) {
    Object.keys(slide.reducers).forEach((key) => {
      objectNew[key] = (payload?: any) => ({
        type: slide.name + key,
        payload: payload,
        function: slide.reducers[key],
      })
    })
  }
  const Reducer = (state: any = slide.initialState, action: any) => {
    return produce(state, (draft: any) => {
      var functionFeature: Function | undefined
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
