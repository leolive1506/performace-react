# Momentos em qeu react renderiza algo na tela
        - Compara versão anterior com nova versão p exibir nova versão em tela
        - Recalcular nova versão de um componente

## 3 principais renderizações
- Pai para filho
        - App pai tem varios components
        - Sempre que tiver uma mudança, atualiza os filhos automaticamente

- Propriedade
        - Propriedade de um componente mudar, renderiza ele de novo

- Hooks
        - Quando tem alguma atualização nos hooks
        - state, context, reducer

# Fluxo renderização
- Quando react percebe qeu precisa renderizar um componente
        1. Gera uma nova versão do componente que precisa ser renderizado
                - Guardade em memória
        2.  Compara com a versão anterior ja salva na pag
        3. Se houver mudança, renderiza a nova versão em tela
                - Percebe onde teve alteraçãoes e muda somente oq precisa
                - Usa algortimo **Reconcilitation**
                        - Calcula a diferença entre duas estruturas (**diffing**)
                        - Usa diffing pois:
                                - Compara as duas arvores (velhas e novas)
                                - Se fosse algoritmo de diff simples, via que mudava e renderizava **TUDO** de novo
                                - Com algoritmo Reconcilitian, altera somente oq mudou ou foi removido e altera so a propriedade que mudou
                                        - Dom não é recriado do zero
# Usar react dev tools
## Para testar performace, pode usar em settings -> general ->highlight updates when components render
    - Mostra os components que são renderizados quando algo mudar

## Em settings -> profilter -> Record why each component rendered while profiling.
    - Fala o pq o componente renderizou

## Aba components
    - Arvore html em estrutura React
## Aba Profile
    - Ajuda entender quais componentes renderizaram a partir de alguma ação e quanto tempo levou pra renderizar
# quando um componente pai muda o state, todos os filhos são renderizados
    - Renderizado -> não são criados novamente do zero, mas o react ta comparando a arvore pra ver se mudou
        - Leva um custo de processamento, pode ser baixo ou alto


# Funçãoes para melhorar performace
- Se utilizar de forma desnecessária, isso pode tornar app mais lento

- Passos p renderização padrão react
    1. Criar uma nova vresão do componente
    2. Compara com a versão anterior
    3. Se houverem alterações, vai atualizar oq alterou
## Funcionalidade pra evitar recalculação em principalmente components filho. Quando sabemos que o conteudo dos filhos não vão mudar pq o conteúdo do filho mudou
    - Ex: Uma busca em um componente pai que tem como filho o resultado das buscas
## Memo

## Quando usar Memo
1. Componentes puros (Pure Functional Componets)
    - Apenas pra abstrair algo visual, componentes que so dividem a interface (sem responsabilidade)
    - Pure Functional Componets
        - Funçoes que dados os mesmo params, sempre retornam o mesmo resultado
            - Ex: se passar um produto, com mesmo id, mesmo nome e mesmo preço, sempre vai devolver o mesmo html
            - Ex de quando não é: mostrar a quanto tempo um evento foi criado, informação depende do horário do usuário
                - Algo não é pruo quando não ta conectado com algo externo do app que pode devolver um valor dirente

2. Componentes que renderizam demais
    - Devtools mostra com bordinha mais escura os componentes estão renderizando muitas vezes
3. Componente renderiza novamente(Re-renders) com as mesmas props
4. Componente de um tamanho médio - grande
## Memo consegue evitar que o passo 1 aconteça caso nenhuma propriedade do componente seja alterada
    - Antes do 1 passo compara as props p ver se mudou algo, se não mudou, não cria uma nova versão do componente

## Faz uma comparação **shallow compare** (comparação rasa)
- Verifica a igualdade das informações
- No js
    - Quando compara dois objetos ou dois arrays {} === {} retorna false
        - Pois é feita uma **igualdade referencial**
            - Não compara o conteúdo, compara se estão ocupanod mesma posição na memória
    - Quando usa o memo
        - Compara os dois objetos e retorna false, acaba renderizando novamente
        - Quando não são coisas que conseguem comparar usando somente ==
            - Mandar uma função como segundo parametro para dizer se o componente é igual ou não

## Usa por volta de uma exportação de um componente
```tsx
function ProductItemComponent({ product }: ProductItemProps) {
    return (
        <div>
            {product.title} - <strong>{product.price}</strong>
        </div>
    )
}
// como recebe um objeto como props, passar como segundo argumento uma função para dizer se deve ou não renderizar componente 
export const ProductItem = memo(ProductItemComponent, (prevProps, nextProps) => {
    // poderia comparar so alguma propriedade, ex prevProps.product.id === nextProps.product.id
    // Object.is compara as propriedade dos objetos, faz uma comparação procunda, cusaa um pouco mais de processamento, tomar cuidado ao usar com objetos grandes
    // quando for objeto simples pode usar tranquilo
    return Object.is(prevProps.product, nextProps.product)
})
```

# useMemo
## Quando utilizar
- Evitar qeu algo que exige muito processamento seja refeito toda vez o componente renderizar
- useMemo pode memorizar algo entre as renderizações do componente para que não precise ser refeito a ação do zero
    - Ex: calculos pesados
        - Memo memoriza pra não ter que fazer de novo a cada nova renderização
    - Em calculos simples pode deixar mais lento

- Outra ocasião de uso -> igualdade referencial
    - Evitar que uma variavel ocupe um novo local na memória quando esta utilizando a variavel p ser repassada p um componente filho
    - Repassa a informação a um componente filho
        - Evita que a informação seja recriada do zero e evita algortimo de renderização comparar a mesma coisa pois vão estar ocupando mesma posição na memória
- Sintaxe
```ts
const item = useMemo(() => {
    return resultado 
}, [array_de_depencias])
```

- Exemplo com calculo
```ts
const totalPrice = useMemo(() => {
    return results.reduce((total, product) => {
        return total + Number(product.price)
    }, 0)
}, [results]) 
```

# useCallback
- Muito parecido com useMemo, mas usadso somente em uma situação
    - Quando queremos memorizar uma função e não um valor
    - Toda vez que um componenete é renderizado, todas as funções dentro dele são renderizadas de novo
        - Vão ocupar um novo espaço na memória
        - Não é pq uma função tem muito codigo que ela é pesada p js
        - **É usada pela igualdade referencial, e não PELO PESO DA FUNÇÃO ou QUANTIDADE DE CÓDIGO**

    - Se tem um pai com uma função passada p os filhos
        - toda vez que o pai renderizar novamente, os filhos que dependem dessa função vão rendezeridos novamente pois o local na memória da função vai ser outro (igualdade referencial)
    - Quando a casos assim, é importante usar useCallback
        - O mesmo vale para context, importante escrever em formato useCallback
- Sintaxe
```ts
// de
async function addToWishlist(id: number) {
console.log(id)
}
// para
const addToWishlist = useCallback(async (id: number) => {
    console.log(id)
}, [array_de_depencias])
```

# Formatação de dados
## Não fazer cálculos ou formatações na hora de renderizar
    - So fazer se for algo extremamente simples
## Dar preferencia pra formatar dados assim que buscar eles e não no momento qeu vai exibir as informações

# Pq ao iterar um array, precisar da key
    - Item unico do el
    - É dificil do react comparar sem saber algo unico daquele componente
    - Para react seria tudo diferente e iria recriar tudo do zero
    - Com key, consegue perceber qual foi alterado, excluido
        - Não pode pasar index
            - Pois com id sabe exatamente qual é qual
            - Com index, se mudar a ordem, o index muda e tudo é recalculado

# Dynamic import (Code spliting)
- Importar arquivo / componente somente no momente que for utilizar
- Tanto pra componentes tanto para funções
- Diferença no bundle.js
    - Onde tem todas funcionalidades dentro app
    - Tem algums funcionalidades que so vão ser utilizadas caso o usuário tome alguma ação la dentro
        - Ex: mostrar data formatada dentro de um modal se o user clicar p abrir modal
            - Não precisa da funcionalidade caso o usuário não clique na funcionalidade
## Usar
- Importação no react app
```ts
import { lazy } from 'react'
```

- Importação no next
```ts
import dynamic from 'next/dynamic'
```
```tsx
// exportar o tipo do componets para tipar
const AddProductToWishlist = dynamic<AddProductToWishlistProps>(() => {
    return import('./AddProductToWishlist') // export default
    // segundo parametro opcional, mas quando tiver com internet lenta e bom ter um loading
}, {
    loading: () => <span>Carregando...</span>
})
const AddProductToWishlist = dynamic<AddProductToWishlistProps>(() => {
    return import('./AddProductToWishlist').then(mod => mod.AddProductToWishlist) // so o export
}, {
    loading: () => <span>Carregando...</span>
})
```

- Em funções
```ts
async function showFormattedDate() {
    const { format } = await import('date-fns')
    format()
}
```

# Virtualização
- Quando tem muita informação é pesado p navegador e react 
    - E mt informação que as vezes nem vai ver
- Em casos com muita informação, que so vai ver as informações quando ela dar scroll, pode trabalhar com virtualização
    - Permite mostrar em tela somente os items que estão visiveis no navegador do usuários
- Pode usar lib pra não ter qeu criar tudo do zero
```sh
yarn add react-virtualized
yarn add @types/react-virtualized -D
```
## Usar
```tsx
import { List, AutoSizer, ListRowRenderer } from 'react-virtualized'
// disso
{results.map(product => {
    return (
        <ProductItem 
            key={product.id} 
            product={product} 
            onAddToWishlist={onAddToWishlist}
        />
    )
})}

// para
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
```

# Bundle Analyzer
- Usado antes de jogar pra prod
    - Analisar o  quanto as dependencias estão empactando no app
- Ver oq ta pesando
- Ex: libs grandes sendo mal utilizadas
    - lodash
- [Install next bundle analyzer](https://github.com/vercel/next.js/tree/canary/packages/next-bundle-analyzer)
- Colocar dentro de next.config.js
```js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
module.exports = withBundleAnalyzer({})
```

```sh
ANALYZE=true yarn build
```
# Dicas gerais
## Javascript
- Pure Functional Componets
        - Funçoes que dados os mesmo params, sempre retornam o mesmo resultado
            - Ex: se passar um produto, com mesmo id, mesmo nome e mesmo preço, sempre vai devolver o mesmo html
            - Ex de quando não é: mostrar a quanto tempo um evento foi criado, informação depende do horário do usuário
                - Algo não é pruo quando não ta conectado com algo externo do app que pode devolver um valor dirente 

- Quando compara dois objetos ou dois arrays {} === {} retorna false
    - Pois é feita uma **igualdade referencial**
        - Não compara o conteúdo, compara se estão ocupando mesma posição na memória