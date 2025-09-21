# Chatbot Flow Builder

A minimal, extensible **chatbot flow builder** built with **React + TypeScript** and **React Flow**.

## Features
- Drag-and-drop **Message (Text)** node from the side panel.
- Connect nodes with edges.
- Enforce **one outgoing edge** per node; multiple incoming edges allowed.
- Selecting a node opens a **Settings Panel** to edit its text.
- **Save** the flow to `localStorage` with validation:
  - If more than one node exists and **more than one node has no incoming edge**, saving shows an error.

## Tech
- React 18 + Vite + TypeScript
- reactflow
- zustand for state
- react-hot-toast for feedback

## Scripts
```bash
npm run dev      # start dev server
npm run build    # production build
npm run preview  # preview build
npm run lint     # lint the project
```

## Notes
- State is persisted to `localStorage` under the key `bitespeed.flow.v1`.
- The code is organized so that new node types can be added easily (see `src/components/Canvas/nodeTypes` and the node catalog in `NodesPanel`).

© 2025 Amrit RAj
