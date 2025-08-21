export interface Monument<MonumentData> {
    message: string,
    data: MonumentData
}

export interface MonumentData {
    id: number,
    name: string,
    country: string,
    city: string,
    description: string,
    buildYear?: number,
    picture: string,
    created: Date
}