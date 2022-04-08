import type { NextPage } from 'next'
import { FormEvent, useCallback, useState } from 'react'
import { SearchResults } from '../components/SearchResults'
import styles from '../styles/Home.module.css'

type Results = {
  totalPrice: number
  data: any[]
}

interface ProductItemProps {
  id: number
  price: string
  priceFormatted: string
  title: string
}

const Home: NextPage = () => {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<Results>({
    totalPrice: 0,
    data: []
  })

  async function handleSearch(e: FormEvent) {
    e.preventDefault()
    if(!search.trim()) {
      return
    }    

    const response = await fetch(`http://localhost:3333/products?q=${search}`)
    const data = await response.json()

    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })

    const products = data.map((product: ProductItemProps) => {
      return {
        ...product,
        priceFormatted: formatter.format(Number(product.price))
      }
    })

    const totalPrice = data.reduce((total: number, product: ProductItemProps) => {
          return total + Number(product.price)
      }, 0)

    setResults({ totalPrice, data: products })
  }

  const addToWishlist = useCallback(async (id: number) => {
    console.log(id)
  }, [])

  return (
    <div className={styles.container}>
      <h1>Search</h1>      
      <form onSubmit={handleSearch}>
        <input 
          type="text" 
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>

      <SearchResults 
        results={results.data} 
        totalPrice={results.totalPrice}
        onAddToWishlist={addToWishlist}
      />
    </div>
  )
}

export default Home
