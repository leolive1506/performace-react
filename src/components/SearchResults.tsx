import { useMemo } from "react"
import { ProductItem } from "./ProductItem"

interface SearchResultsProps {
    totalPrice: number
    results: Array<{
        id: number
        price: string
        priceFormatted: string
        title: string
    }>
    onAddToWishlist: (id: number) => void
}
export function SearchResults({ totalPrice, results, onAddToWishlist }: SearchResultsProps) {
    // const totalPrice = useMemo(() => {
    //     return results.reduce((total, product) => {
    //         return total + Number(product.price)
    //     }, 0)
    // }, [results])

    return (
        <div>
            <h2>{totalPrice}</h2>
            {results.map(product => {
                return (
                    <ProductItem 
                        key={product.id} 
                        product={product} 
                        onAddToWishlist={onAddToWishlist}
                    />
                )
            })}
        </div>
    )
}