import { StartClient } from '@tanstack/react-start/client'
import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import './index.css'

// TanStack Start owns the entire <html> document (rendered by __root.tsx during
// SSR). We hydrate the document itself, not a sub-element. Real SSR — the
// server returns rendered HTML and this code attaches React's event handlers.
hydrateRoot(document, <StrictMode><StartClient /></StrictMode>)
