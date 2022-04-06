import { useMemo } from "react"
import { ProductItem } from "./ProductItem"

interface SearchResultsProps {
    results: Array<{
        id: number
        price: string
        title: string
    }>
}
export function SearchResults({ results }: SearchResultsProps) {
    const totalPrice = useMemo(() => {
        return results.reduce((total, product) => {
            return total + Number(product.price)
        }, 0)
    }, [results]) 
    return (
        <div>
            <h2>{totalPrice}</h2>
            {results.map(product => {
                return (
                    <ProductItem key={product.id} product={product} />
                )
            })}
        </div>
    )
}