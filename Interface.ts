interface Comico_API {
    header: {
        isSuccessful: boolean
    },
    data: Data
}

interface Data {
    list: List[],
    totalItemCount: number,
    startIndex: number,
    // count: number,
    // pageNo: number
}

interface List {
    titleName: string,
    /** Chapter name */
    name: string
    id: number
    salePolicy: SalePolicy
}

interface SalePolicy {
    isFree: boolean
}

// 
export { Comico_API, Data, List }