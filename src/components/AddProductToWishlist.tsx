export interface AddProductToWishlistProps {
    onAddToWishlist: () => void
    onRequestClose: () => void
}
export function AddProductToWishlist({ onAddToWishlist, onRequestClose }: AddProductToWishlistProps) {
    return (
        <span>
            Desaja adicionar aos favoritos?
            <button onClick={onAddToWishlist}>Sim</button>
            <button onClick={onRequestClose}>Não</button>
        </span>
    )
}