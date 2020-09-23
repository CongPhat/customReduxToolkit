export declare const createSliceP: (slide: any) => {
    action: any;
    reducer: (state: any, action: any) => <Base extends (draft: any) => any>(base?: Base | undefined, ...rest: unknown[]) => any;
};
