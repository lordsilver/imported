type Item = { id: number, value: string }

const items: Item[] = [
    {
        id: 1,
        value: "First"
    },
    {
        id: 2,
        value: "Second"
    },
    {
        id: 3,
        value: "Second"
    }
]

export function load({ url: { searchParams } }) {
    let query = 3
    const queryInput = searchParams.get("query")
    const enhanced = searchParams.get("enhanced") === "true"
    if (queryInput) {
        query = Number(queryInput)
    }
    console.log("Server load query", { enhanced, query })
    return {
        query,
        items: enhanced ? items : items.filter(it => it.id <= query)
    }
}