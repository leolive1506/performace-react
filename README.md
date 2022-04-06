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

## Faz uma comparação shallow compare (comparação rasa)
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



# Dicas gerais
## Javascript
- Pure Functional Componets
        - Funçoes que dados os mesmo params, sempre retornam o mesmo resultado
            - Ex: se passar um produto, com mesmo id, mesmo nome e mesmo preço, sempre vai devolver o mesmo html
            - Ex de quando não é: mostrar a quanto tempo um evento foi criado, informação depende do horário do usuário
                - Algo não é pruo quando não ta conectado com algo externo do app que pode devolver um valor dirente 

- Quando compara dois objetos ou dois arrays {} === {} retorna false
    - Pois é feita uma **igualdade referencial**
        - Não compara o conteúdo, compara se estão ocupanod mesma posição na memória