import { writable } from "svelte/store"

export interface SearchStoreModel<T extends Record<PropertyKey, any>> {
    data: T[],
    filtered: T[],
    search: string
}

export const createSearchStore = <T extends Record<PropertyKey, any>>(data: T[]) => {
    const { subscribe, set, update } = writable({
        data: data,
        filtered: data,
        search: ''
    })

    return { subscribe, set, update }
}

// Returns the model with `filtered` recomputed from `data` and `search`, without mutating the input.
export const searchHandler = <T extends Record<PropertyKey, any>>(store: SearchStoreModel<T>): SearchStoreModel<T> => {
    const searchTerm = store.search.toLowerCase() || "";

    return {
        ...store,
        filtered: store.data.filter((item) => item.searchTerms.toLowerCase().includes(searchTerm))
    }
}
