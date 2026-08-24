# `logos-corpus-mcp-server` — Especificación + esqueleto de referencia

### Servidor MCP para exponer el corpus completo del programa Triángulo Fristoniano al project space "Logos and the Platonic Space"
**Preparado por:** Dr. AIFET · Para: Manuel "Manny" Cadena Ortiz de Montellano, MA, MBA
**Estado global:** `PROPUESTA NO EJECUTADA` — esto es diseño + esqueleto, no un servidor construido ni probado. Las secciones de código son referencia para implementar en tu entorno (Node/TS + pgvector). `[Confianza media-alta en el diseño; verificar invocación dentro de un project en sesión de prueba.]`

---

## 1. Propósito

Convertir el conocimiento consultable del space en **prácticamente ilimitado** y de **mayor calidad de recuperación** que el RAG nativo del project. El servidor expone, vía MCP sobre Streamable HTTP, una búsqueda semántica con *contextual retrieval* + *reranking* sobre todo el corpus del programa (el del space agotado + Omniscient, 227K+ docs), sin que nada de eso cuente contra el cap del project. Es la **palanca 4** de la Parte XIV §14.0/§14.5 de la referencia maestra.

**Decisión de stack** (alineada con la guía MCP del entorno y con tu infra): TypeScript SDK (`@modelcontextprotocol/sdk`), transporte **Streamable HTTP stateless JSON** (remoto, multi-cliente), **PostgreSQL + pgvector** (ya en tu stack), embeddings y reranking vía los proveedores que ya usas (OpenAI / Cohere a través de Chatita). `[ESTABLISHED]` que esta es la combinación recomendada por la guía.

---

## 2. Arquitectura

```
Claude (project "Logos and the Platonic Space")
        │  MCP (Streamable HTTP, Bearer auth)
        ▼
logos-corpus-mcp-server  (Express + @modelcontextprotocol/sdk)
        │
        ├── embed(query)         → OpenAI/Cohere embeddings
        ├── vector search        → PostgreSQL + pgvector (HNSW/IVFFlat)
        ├── rerank(top_k)        → Cohere rerank (opcional, mejora calidad)
        └── format + cite        → chunks con contexto + cita de fuente
```

**Contextual retrieval (no negociable para calidad):** cada chunk se almacena con un `context_prefix` — un resumen breve, generado por LLM, de dónde encaja el chunk en su documento — *antes* de embeber. Anthropic reporta reducción de fallos de recuperación ~49%, y ~67% combinado con reranking. `[STRONG EVIDENCE — investigación Anthropic]`

**Scoping / "vistas":** cada chunk lleva un `scope` (`logos`, `volumenes`, `corpus_fep`, `kaira`, `citrusmax`, `aion`, `trading`, `consciencia`) para acotar búsquedas — evita la fragmentación del RAG genérico (referencia maestra §14.1).

---

## 3. Modelo de datos (PostgreSQL + pgvector)

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE corpus_documents (
  doc_id        TEXT PRIMARY KEY,            -- p.ej. 'volume_iv_platonic_topos'
  title         TEXT NOT NULL,
  scope         TEXT NOT NULL,               -- logos | volumenes | corpus_fep | ...
  source_uri    TEXT,                        -- Drive/GitHub/Omniscient origin
  doc_status    TEXT,                        -- HECHO VERIFICADO | PROPUESTA NO EJECUTADA | ...
  metadata      JSONB DEFAULT '{}'::jsonb,
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE corpus_chunks (
  id              BIGSERIAL PRIMARY KEY,
  doc_id          TEXT REFERENCES corpus_documents(doc_id) ON DELETE CASCADE,
  scope           TEXT NOT NULL,
  section         TEXT,                       -- p.ej. '§4.5'
  chunk_index     INT NOT NULL,
  content         TEXT NOT NULL,
  context_prefix  TEXT,                       -- contextual retrieval prefix
  source_citation TEXT,                       -- 'Volume IV §4.5 (Cadena 2026d)'
  embedding       VECTOR(1536) NOT NULL,      -- ajustar dim al modelo elegido
  metadata        JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX ON corpus_chunks USING hnsw (embedding vector_cosine_ops);
CREATE INDEX ON corpus_chunks (scope);
CREATE INDEX ON corpus_chunks (doc_id);
```

---

## 4. Pipeline de ingesta (script aparte, una vez + incremental)

1. **Fuentes:** corpus del space agotado (los ~80 archivos), más export de Omniscient. Para Omniscient, lo ideal es que este servidor consulte su índice directamente si ya expone uno; si no, se ingiere su export.
2. **Chunking:** ~500–800 tokens con solape ~15%, respetando límites de sección (headers `#`, `##`).
3. **Context prefix:** por cada chunk, un LLM genera 1–2 frases situándolo en su documento; se antepone al `content` antes de embeber.
4. **Embed:** OpenAI `text-embedding-3-small` (1536-dim) o Cohere `embed-v4`; fijar `VECTOR(dim)` en consecuencia.
5. **Upsert** en `corpus_chunks` con `scope`, `section`, `source_citation`, `metadata`.
6. **Incremental:** re-ingestar solo documentos con `updated_at` posterior al último run (igual que la reindexación incremental de Omniscient).

---

## 5. Tools (cuatro, con prefijo de servicio y snake_case)

| Tool | Anotaciones | Función |
|---|---|---|
| `corpus_search` | readOnly, idempotent, openWorld | Búsqueda semántica con scope + reranking; devuelve chunks con cita |
| `corpus_fetch_document` | readOnly, idempotent | Documento completo o sección por `doc_id` |
| `corpus_list_documents` | readOnly, idempotent | Catálogo (paginado) filtrable por scope |
| `corpus_get_status` | readOnly, idempotent | Estado "current/on the horizon" por iniciativa |

`CHARACTER_LIMIT` = 25000 por respuesta; truncar con mensaje claro y sugerir paginación/scope.

---

## 6. Esqueleto de referencia (TypeScript SDK — APIs modernas)

> Estructura: `logos-corpus-mcp-server/{package.json, tsconfig.json, src/{index.ts, constants.ts, schemas/, services/db.ts, tools/}}`. A continuación, el entry point + el tool nuclear `corpus_search` completo; los otros tres siguen el mismo patrón.

### `src/constants.ts`
```typescript
export const CHARACTER_LIMIT = 25_000;
export const DEFAULT_LIMIT = 8;
export const SCOPES = ["logos","volumenes","corpus_fep","kaira","citrusmax","aion","trading","consciencia"] as const;
```

### `src/schemas/search.ts`
```typescript
import { z } from "zod";
import { SCOPES } from "../constants.js";

export enum ResponseFormat { MARKDOWN = "markdown", JSON = "json" }

export const CorpusSearchInput = z.object({
  query: z.string().min(2).max(500)
    .describe("Consulta en lenguaje natural; usa términos de contenido (no meta-palabras)."),
  scope: z.enum(SCOPES).optional()
    .describe("Acota la búsqueda a una vista del corpus. Omitir = buscar en todo."),
  limit: z.number().int().min(1).max(20).default(8)
    .describe("Máximo de chunks a devolver (default 8)."),
  rerank: z.boolean().default(true)
    .describe("Aplicar reranking sobre los candidatos vectoriales (mejora precisión)."),
  response_format: z.nativeEnum(ResponseFormat).default(ResponseFormat.MARKDOWN)
    .describe("'markdown' legible o 'json' estructurado.")
}).strict();

export type CorpusSearchInput = z.infer<typeof CorpusSearchInput>;
```

### `src/tools/corpusSearch.ts`
```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CorpusSearchInput, ResponseFormat } from "../schemas/search.js";
import { embed, vectorSearch, rerank } from "../services/db.js";
import { CHARACTER_LIMIT } from "../constants.js";

export function registerCorpusSearch(server: McpServer): void {
  server.registerTool(
    "corpus_search",
    {
      title: "Buscar en el corpus Triángulo Fristoniano",
      description: `Búsqueda semántica sobre el corpus completo del programa (manuscritos,
Volúmenes, papers FEP, KAIRA, CitrusMax, AION, trading, consciencia) con contextual
retrieval y reranking. Solo lectura; no modifica nada.

Args:
  - query (string): consulta en lenguaje natural (términos de contenido).
  - scope (enum, opcional): logos | volumenes | corpus_fep | kaira | citrusmax | aion | trading | consciencia.
  - limit (number 1-20, default 8): máximo de chunks.
  - rerank (boolean, default true): reranking sobre candidatos vectoriales.
  - response_format ('markdown' | 'json', default 'markdown').

Returns (json):
  { "count": number, "scope": string|null, "results": [
     { "doc_id": string, "title": string, "section": string,
       "citation": string, "score": number, "content": string } ] }

Examples:
  - "derivación de Λ como distancia Fisher-Rao" -> scope="volumenes"
  - "criterios pre-registrados de abandono del sistema de trading" -> scope="trading"
  - "por qué nunca completar las palabras del usuario en Patpou" -> scope="kaira"
Error handling:
  - "No se encontraron resultados para '<query>'" si la búsqueda viene vacía.`,
      inputSchema: CorpusSearchInput,
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true }
    },
    async (params: CorpusSearchInput) => {
      const qvec = await embed(params.query);
      let hits = await vectorSearch(qvec, { scope: params.scope, k: Math.max(params.limit * 4, 20) });
      if (params.rerank && hits.length) hits = await rerank(params.query, hits);
      hits = hits.slice(0, params.limit);

      if (!hits.length) {
        return { content: [{ type: "text", text: `No se encontraron resultados para '${params.query}'` }] };
      }

      const output = {
        count: hits.length,
        scope: params.scope ?? null,
        results: hits.map(h => ({
          doc_id: h.doc_id, title: h.title, section: h.section ?? "",
          citation: h.source_citation, score: Number(h.score.toFixed(4)),
          content: h.content
        }))
      };

      let text: string;
      if (params.response_format === ResponseFormat.JSON) {
        text = JSON.stringify(output);
      } else {
        text = output.results.map(r =>
          `**${r.citation}** _(score ${r.score})_\n${r.content}`).join("\n\n---\n\n");
      }
      if (text.length > CHARACTER_LIMIT) {
        text = text.slice(0, CHARACTER_LIMIT) +
          `\n\n[...truncado en ${CHARACTER_LIMIT} chars — acota con 'scope' o baja 'limit'.]`;
      }
      return { content: [{ type: "text", text }], structuredContent: output };
    }
  );
}
```

### `src/index.ts` (entry + Streamable HTTP stateless + Bearer auth)
```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import { registerCorpusSearch } from "./tools/corpusSearch.js";
// import { registerCorpusFetch, registerCorpusList, registerCorpusStatus } from "./tools/*.js";

const server = new McpServer({ name: "logos-corpus-mcp-server", version: "1.0.0" });
registerCorpusSearch(server);
// registerCorpusFetch(server); registerCorpusList(server); registerCorpusStatus(server);

const app = express();
app.use(express.json({ limit: "4mb" }));

// Auth simple por token (el servidor expone corpus privado → protégelo)
app.use((req, res, next) => {
  const token = req.header("authorization")?.replace(/^Bearer\s+/i, "");
  if (token !== process.env.CORPUS_MCP_TOKEN) return res.status(401).json({ error: "unauthorized" });
  next();
});

app.post("/mcp", async (req, res) => {
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
  res.on("close", () => transport.close());
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

const port = parseInt(process.env.PORT || "8787");
app.listen(port, () => console.error(`logos-corpus-mcp-server on :${port}/mcp`));
```

### `src/services/db.ts` (firmas a implementar)
```typescript
export interface Hit {
  doc_id: string; title: string; section?: string;
  source_citation: string; content: string; score: number;
}
export async function embed(text: string): Promise<number[]> { /* OpenAI/Cohere */ throw new Error("impl"); }
export async function vectorSearch(qvec: number[], opts: { scope?: string; k: number }): Promise<Hit[]> {
  /* SELECT ... ORDER BY embedding <=> $1 LIMIT k, filtrando por scope si viene */ throw new Error("impl");
}
export async function rerank(query: string, hits: Hit[]): Promise<Hit[]> { /* Cohere rerank */ throw new Error("impl"); }
```

---

## 7. Configuración de proyecto

**`package.json`** (esencial): `"type": "module"`, deps `@modelcontextprotocol/sdk`, `express`, `zod`, `pg`, `pgvector`; script `"build": "tsc"`, `"start": "node dist/index.js"`. **`tsconfig.json`**: `strict: true`, `module: "NodeNext"`, `outDir: "dist"`. Build: `npm run build` debe pasar limpio antes de considerar completo. Probar con `npx @modelcontextprotocol/inspector`.

---

## 8. Conectar al project space

1. Desplegar el servidor (Railway/Render — ya en tu stack) con `CORPUS_MCP_TOKEN`, `DATABASE_URL`, claves de embeddings/rerank.
2. En Claude → Settings → Connectors → añadir custom connector con la URL `https://<host>/mcp` y el header `Authorization: Bearer <token>`.
3. En "Logos and the Platonic Space", la tabla de ruteo (referencia maestra §14.3) ya apunta "búsqueda profunda sobre todo el acervo → MCP del corpus".

> **`[Confianza media]`** sobre el flujo exacto de alta de un custom MCP connector y su disponibilidad *dentro* de un project (vs. a nivel cuenta) en la versión actual de Claude — verificar en Settings → Connectors y con una sesión de prueba.

---

## 9. Evaluación (stub, Fase 4 de la guía MCP)

Crear ~10 preguntas verificables, read-only, que requieran varias búsquedas (formato XML del skill). Ejemplo:

```xml
<evaluation>
  <qa_pair>
    <question>¿Cuál es el valor de β/ν en el régimen Griffiths del Teorema 2 de Volumen I?</question>
    <answer>0.21</answer>
  </qa_pair>
  <qa_pair>
    <question>¿Cuántos criterios pre-registrados de abandono tiene el sistema FEP-Nasdaq?</question>
    <answer>6</answer>
  </qa_pair>
</evaluation>
```

---

## 10. Checklist de calidad antes de declarar `HECHO VERIFICADO`

- [ ] `npm run build` pasa sin errores; `node dist/index.js` levanta.
- [ ] Las 4 tools registradas con `registerTool`, Zod `.strict()`, anotaciones y descripciones completas.
- [ ] Contextual prefix aplicado en ingesta; reranking funcional.
- [ ] `CHARACTER_LIMIT` y paginación respetados.
- [ ] Auth por Bearer activa; corpus privado protegido.
- [ ] Probado con MCP Inspector y conectado a una sesión real de Claude.
- [ ] Evaluación de 10 preguntas pasa.

Hasta cumplir esto: `PROPUESTA NO EJECUTADA`.
