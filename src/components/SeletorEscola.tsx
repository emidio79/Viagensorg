import { useId, useState } from "react";
import escolasJson from "../data/escolas.json";

export type Escola = {
  id: string;
  nome: string;
  cnpj: string;
  regional: string;
};

type Props = {
  value: Escola | null;
  onChange: (escola: Escola | null) => void;
};

const escolas: Escola[] = escolasJson;

function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export default function SeletorEscola({
  value,
  onChange,
}: Props) {
  const id = useId();

  const [busca, setBusca] = useState(value?.nome ?? "");
  const [aberto, setAberto] = useState(false);
  const [indiceAtivo, setIndiceAtivo] = useState(-1);

  const termo = normalizar(busca);
  const digitos = busca.replace(/\D/g, "");

  const resultados =
    termo.length >= 2
      ? escolas
          .filter((escola) => {
            const correspondeNome = normalizar(escola.nome)
              .includes(termo);

            const correspondeCnpj =
              digitos.length >= 2 &&
              escola.cnpj.replace(/\D/g, "").includes(digitos);

            return correspondeNome || correspondeCnpj;
          })
          .slice(0, 20)
      : [];

  const mostrarLista = aberto && termo.length >= 2;

  function selecionar(escola: Escola) {
    onChange(escola);
    setBusca(escola.nome);
    setAberto(false);
    setIndiceAtivo(-1);
  }

  return (
    <div
      className="relative min-w-0"
      onBlur={(event) => {
        const proximoElemento = event.relatedTarget;

        if (
          !proximoElemento ||
          !event.currentTarget.contains(proximoElemento)
        ) {
          setAberto(false);
        }
      }}
    >
      <label
        htmlFor={`${id}-input`}
        className="mb-2 block text-xs font-medium text-[#5c6371]"
      >
        Escola
      </label>

      <div
        className="
          flex items-center gap-2 rounded-[10px]
          border border-[#e5e8ef] bg-white px-3
          transition focus-within:border-[#89b2fa]
          focus-within:shadow-[0_0_0_3px_#3478ef12]
        "
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          className="size-4 shrink-0 text-[#9ba2af]"
        >
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m16 16 4.5 4.5" />
        </svg>

        <input
          id={`${id}-input`}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={mostrarLista}
          aria-controls={`${id}-lista`}
          aria-activedescendant={
            mostrarLista && indiceAtivo >= 0
              ? `${id}-opcao-${indiceAtivo}`
              : undefined
          }
          aria-describedby={`${id}-ajuda`}
          autoComplete="off"
          placeholder="Busque pelo nome ou CNPJ..."
          value={busca}
          onFocus={() => setAberto(true)}
          onChange={(event) => {
            setBusca(event.target.value);
            setAberto(true);
            setIndiceAtivo(-1);

            // Ao editar, a escolha anterior deixa de estar confirmada.
            if (value) onChange(null);
          }}
          onKeyDown={(event) => {
            if (event.nativeEvent.isComposing) return;

            if (event.key === "Escape") {
              setAberto(false);
              setIndiceAtivo(-1);
            }

            if (event.key === "ArrowDown") {
              event.preventDefault();
              setAberto(true);

              setIndiceAtivo((atual) =>
                Math.min(atual + 1, resultados.length - 1),
              );
            }

            if (event.key === "ArrowUp") {
              event.preventDefault();
              setAberto(true);

              setIndiceAtivo((atual) =>
                Math.max(atual - 1, 0),
              );
            }

            if (event.key === "Enter") {
              event.preventDefault();

              if (
                mostrarLista &&
                indiceAtivo >= 0 &&
                resultados[indiceAtivo]
              ) {
                selecionar(resultados[indiceAtivo]);
              }
            }
          }}
          className="
            h-[45px] w-full min-w-0
            border-0 bg-transparent text-[12px]
            text-[#343b49] outline-none
            placeholder:text-[#a4acb9]
          "
        />

        {busca && (
          <button
            type="button"
            aria-label="Limpar escola selecionada"
            onClick={() => {
              setBusca("");
              onChange(null);
              setIndiceAtivo(-1);
              setAberto(false);
            }}
            className="
              shrink-0 cursor-pointer rounded px-1
              text-lg text-[#9ba2af]
              hover:text-[#343b49]
              focus-visible:outline-2
              focus-visible:outline-blue-500
            "
          >
            ×
          </button>
        )}
      </div>

      <p
        id={`${id}-ajuda`}
        className="mt-2 text-[10px] leading-relaxed text-[#9096a3]"
      >
        {value
          ? `CNPJ: ${value.cnpj} · ${value.regional}`
          : "Digite pelo menos 2 caracteres e selecione uma escola."}
      </p>

      {mostrarLista && (
        <div
          className="
            absolute top-full right-0 left-0 z-50 mt-2
            overflow-hidden rounded-xl
            border border-[#e5e8ef] bg-white
            shadow-[0_12px_35px_#27355320]
          "
        >
          <ul
            id={`${id}-lista`}
            role="listbox"
            aria-label="Escolas encontradas"
            className="max-h-64 overflow-y-auto overscroll-contain p-1"
          >
            {resultados.map((escola, indice) => (
              <li
                key={escola.id}
                id={`${id}-opcao-${indice}`}
                role="option"
                aria-selected={indiceAtivo === indice}
                onMouseDown={(event) => {
                  // Mantém o foco no campo durante a seleção.
                  event.preventDefault();
                }}
                onClick={() => selecionar(escola)}
                className={`
                  cursor-pointer rounded-lg px-3 py-3
                  transition hover:bg-[#f1f6ff]
                  ${
                    indiceAtivo === indice
                      ? "bg-[#f1f6ff]"
                      : ""
                  }
                `}
              >
                <span className="block text-[11px] font-medium leading-relaxed text-[#343b49]">
                  {escola.nome}
                </span>

                <span className="mt-1 block text-[10px] text-[#89909f]">
                  {escola.cnpj} · {escola.regional}
                </span>
              </li>
            ))}
          </ul>

          {resultados.length === 0 ? (
            <p
              role="status"
              className="px-4 py-4 text-center text-xs text-[#9096a3]"
            >
              Nenhuma escola encontrada.
            </p>
          ) : (
            <p className="border-t border-[#eef0f4] px-3 py-2 text-[10px] text-[#9096a3]">
              Até 20 sugestões. Refine a busca ou use ↑ ↓ e Enter.
            </p>
          )}
        </div>
      )}
    </div>
  );
}