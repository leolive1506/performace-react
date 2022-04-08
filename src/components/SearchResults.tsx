import { List, AutoSizer, ListRowRenderer } from 'react-virtualized'
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
    // cria e remove com base no scroll
    const rowRenderer: ListRowRenderer = ({ index, key, style }) => {
        return (
            // sempre ter uma div por volta do item qeu qeur mostrar
            <div key={key} style={style}>
                <ProductItem 
                    product={results[index]} 
                    onAddToWishlist={onAddToWishlist}
                />
            </div>
        )
    }
    // const totalPrice = useMemo(() => {
    //     return results.reduce((total, product) => {
    //         return total + Number(product.price)
    //     }, 0)
    // }, [results])

    return (
        <div>
            <h2>{totalPrice}</h2>
            <List 
                // definir tamanho da lista, ocupar todo espaço possível -> AutoSizer
                height={500}
                rowHeight={30} // linha
                width={500}
                // quantos items deixar pre carregados, tento pra cima e pra baixo
                overscanRowCount={5}
                rowCount={results.length} // quantos items tem na lista
                rowRenderer={rowRenderer}
            />
            {/* {results.map(product => {
                return (
                    <ProductItem 
                        key={product.id} 
                        product={product} 
                        onAddToWishlist={onAddToWishlist}
                    />
                )
            })} */}
        </div>
    )
}