# React Components Library

Biblioteca de componentes React reutilizáveis com Tailwind CSS.

## Instalação

```bash
npm install @seu-namespace/react-components
# ou
pnpm add @seu-namespace/react-components
```

## Uso

```tsx
import { Button } from '@seu-namespace/react-components'
import '@seu-namespace/react-components/css'

export default function App() {
  return <Button>Clique aqui</Button>
}
```

## Desenvolvimento

```bash
# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm dev

# Build da biblioteca
pnpm build

# Lint
pnpm lint
```

## Estrutura

```
src/
├── components/     # Componentes da biblioteca
├── index.ts        # Ponto de entrada
└── index.css       # Estilos globais
```

## Publicação

Para publicar no npm:

```bash
npm publish
```

Certifique-se de atualizar a versão em `package.json` antes de publicar.
