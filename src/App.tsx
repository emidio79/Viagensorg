import { useState } from "react";
import type { ReactNode } from "react";

type Viagem = {
  dentroDoEstado: boolean;
  alimentacao: number;
  uber: number;
  passagemAerea: number;
  hospedagem: number;
  repasseProfessor: number;
};

const moeda = (valor: number) =>
  valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const estilos = {
  card:
    "rounded-[17px] border border-[#e9ebf1] bg-white p-6 " +
    "shadow-[0_3px_8px_#222d4803] max-[540px]:px-4 max-[540px]:py-5",

  eyebrow:
    "text-[10px] font-bold tracking-[1.6px] text-[#89909f]",

  helper:
    "mt-[13px] text-[10px] leading-[1.7] text-[#9096a3]",

  campos:
    "fields-grid grid grid-cols-2 gap-[18px] " +
    "max-[540px]:grid-cols-1 max-[540px]:gap-5",

  label:
    "text-xs font-medium text-[#5c6371]",

  foco:
    "focus-visible:outline-[3px] focus-visible:outline-offset-[3px] " +
    "focus-visible:outline-[#8bbcff]",
};

export default function App() {
  const [viagem, setViagem] = useState<Viagem>({
    dentroDoEstado: true,
    alimentacao: 0,
    uber: 0,
    passagemAerea: 0,
    hospedagem: 0,
    repasseProfessor: 0,
  });

  const [nomeAnalista, setNomeAnalista] = useState("");

  function atualizar<K extends keyof Viagem>(
    campo: K,
    valor: Viagem[K],
  ) {
    setViagem((atual) => ({ ...atual, [campo]: valor }));
  }

  function gerarFormulario() {
    if (!nomeAnalista.trim()) return;

    window.print();
  }

  const gastosProfessor = viagem.alimentacao + viagem.uber;

  const custosViagem = viagem.dentroDoEstado
    ? 0
    : viagem.passagemAerea + viagem.hospedagem;

  const saldo = viagem.repasseProfessor - gastosProfessor;
  const totalViagem = gastosProfessor + custosViagem;
  const saldoNegativo = saldo < 0;

  const percentual =
    viagem.repasseProfessor > 0
      ? Math.min(
          (gastosProfessor / viagem.repasseProfessor) * 100,
          100,
        )
      : 0;

  return (
    <div
      className="
        app min-h-screen bg-[#eef0f5] px-6 py-10
        bg-[radial-gradient(ellipse_at_15%_0%,#dce7ff_0%,transparent_45%),radial-gradient(ellipse_at_95%_80%,#e4def1_0%,transparent_40%)]
        min-[1600px]:pt-[70px]
        max-[540px]:p-3
      "
    >
      <div
        className="
          window mx-auto max-w-[1180px] overflow-hidden
          rounded-[20px] border border-[#ffffffd9] bg-[#f8f9fc]
          shadow-[0_30px_90px_#27355314,0_4px_16px_#2735530a]
          max-[540px]:rounded-[15px]
        "
      >
        <main
          className="
            workspace p-[42px]
            max-[900px]:p-7
            max-[540px]:px-[15px] max-[540px]:py-6
          "
        >
          <header
            className="
              page-header mb-[34px] flex items-center
              justify-between gap-6 max-[540px]:mb-6
            "
          >
            <div>
              <span className={estilos.eyebrow}>
                CONTROLE FINANCEIRO
              </span>

              <h1
                className="
                  my-[10px] text-[clamp(26px,4vw,34px)]
                  leading-[1.2] font-[650]
                  tracking-[-1.3px] text-[#20232d]
                "
              >
                Sua viagem, em dia.
              </h1>

              <p className="text-[13px] leading-[1.6] text-[#818694]">
                Organize as despesas e confira a prestação de contas.
              </p>
            </div>

            <span
              className="
                inline-flex shrink-0 items-center gap-[7px]
                rounded-[20px] border border-[#e6e9ef]
                bg-white px-[11px] py-2
                text-[10px] text-[#767d8a]
                max-[900px]:hidden print:hidden
              "
            >
              <span className="size-[6px] rounded-full bg-[#35b47a]" />
              Cálculo em tempo real
            </span>
          </header>

          <div
            className="
              layout grid grid-cols-[minmax(0,1fr)_330px]
              items-start gap-[22px]
              max-[900px]:grid-cols-1
            "
          >
            <div className="form-column grid gap-[18px]">
              <Card>
                <CabecalhoSecao
                  icone="↗"
                  titulo="Destino da viagem"
                  descricao="Selecione o tipo de deslocamento."
                />

                <div
                  className="
                    flex gap-1 rounded-[11px]
                    border border-[#e9ebf0] bg-[#f1f3f7] p-1
                  "
                  role="group"
                  aria-label="Tipo de viagem"
                >
                  <BotaoDestino
                    selecionado={viagem.dentroDoEstado}
                    onClick={() => atualizar("dentroDoEstado", true)}
                  >
                    Dentro do estado
                  </BotaoDestino>

                  <BotaoDestino
                    selecionado={!viagem.dentroDoEstado}
                    onClick={() => atualizar("dentroDoEstado", false)}
                  >
                    Outro estado
                  </BotaoDestino>
                </div>

                <p className={estilos.helper}>
                  {viagem.dentroDoEstado
                    ? "Registre alimentação, transporte e o repasse recebido."
                    : "Inclua também os custos de passagem aérea e hospedagem."}
                </p>
              </Card>

              <Card>
                <CabecalhoSecao
                  icone="▤"
                  titulo="Despesas do professor"
                  descricao="Valores utilizados durante a viagem."
                />

                {!viagem.dentroDoEstado && (
                  <div
                    className="
                      extra-fields mb-6 border-b
                      border-[#eef0f4] pb-[21px]
                    "
                  >
                    <div
                      className="
                        mb-4 text-[11px] font-semibold text-[#7d8593]
                      "
                    >
                      Custos adicionais da viagem
                    </div>

                    <div className={estilos.campos}>
                      <Campo
                        label="Passagem aérea"
                        descricao="Valor total das passagens"
                        valor={viagem.passagemAerea}
                        onChange={(v) => atualizar("passagemAerea", v)}
                      />

                      <Campo
                        label="Hospedagem"
                        descricao="Valor total das diárias"
                        valor={viagem.hospedagem}
                        onChange={(v) => atualizar("hospedagem", v)}
                      />
                    </div>

                    <p className={estilos.helper}>
                      Esses custos entram no total da viagem, mas não são
                      descontados do repasse ao professor.
                    </p>
                  </div>
                )}

                <div className={estilos.campos}>
                  <Campo
                    label="Alimentação"
                    descricao="Refeições e lanches"
                    valor={viagem.alimentacao}
                    onChange={(v) => atualizar("alimentacao", v)}
                  />

                  <Campo
                    label="Transporte"
                    descricao="Uber e deslocamentos"
                    valor={viagem.uber}
                    onChange={(v) => atualizar("uber", v)}
                  />
                </div>
              </Card>

              <Card>
                <CabecalhoSecao
                  icone="↔"
                  titulo="Repasse ao professor"
                  descricao="Valor repassado para o professor"
                />

                <Campo
                  label="Valor recebido"
                  valor={viagem.repasseProfessor}
                  onChange={(v) => atualizar("repasseProfessor", v)}
                />
              </Card>
            </div>

            <aside className="summary sticky top-6 max-[900px]:static">
              <Card ariaLive="polite">
                <span className={estilos.eyebrow}>
                  PRESTAÇÃO DE CONTAS
                </span>

                <h2
                  className="
                    mt-3 text-[19px] font-[650]
                    tracking-[-0.5px]
                  "
                >
                  Resumo da viagem
                </h2>

                <p className="mt-[7px] mb-[26px] text-[11px] text-[#939aa6]">
                  Tudo o que você precisa conferir.
                </p>

                <div className="grid gap-4">
                  <Linha
                    label="Repasse recebido"
                    valor={viagem.repasseProfessor}
                  />
                  <Linha label="Alimentação" valor={viagem.alimentacao} />
                  <Linha label="Uber e transporte" valor={viagem.uber} />

                  <div className="h-px bg-[#eef0f5]" />

                  <Linha
                    label="Gasto pelo professor"
                    valor={gastosProfessor}
                  />
                </div>

                <div
                  className="
                    mt-[26px] flex justify-between
                    text-[10px] text-[#9098a5]
                  "
                >
                  <span>Utilização do repasse</span>
                  <span>{percentual.toFixed(0)}%</span>
                </div>

                <div
                  className="
                    mt-[9px] mb-6 h-[5px] overflow-hidden
                    rounded-[10px] bg-[#edf1f7]
                  "
                  aria-hidden="true"
                >
                  <div
                    className="
                      h-full rounded-[inherit] bg-[#4388f5]
                      transition-[width] duration-250 ease-in-out
                    "
                    style={{ width: `${percentual}%` }}
                  />
                </div>

                <div
                  className={[
                    "balance rounded-[13px] border px-[18px] py-[22px]",
                    saldoNegativo
                      ? "negative border-[#f5ddcf] bg-[#fff6ef]"
                      : "border-[#deebff] bg-[linear-gradient(135deg,#f3f8ff,#edf4ff)]",
                  ].join(" ")}
                >
                  <span
                    className={`text-[11px] ${
                      saldoNegativo
                        ? "text-[#ae805e]"
                        : "text-[#6282b5]"
                    }`}
                  >
                    {saldoNegativo ? "Valor excedente" : "Valor a devolver"}
                  </span>

                  <strong
                    className={`
                      mt-[7px] block text-[clamp(25px,3vw,31px)]
                      font-[650] tracking-[-1px] tabular-nums
                      [overflow-wrap:anywhere]
                      ${
                        saldoNegativo
                          ? "text-[#bd7134]"
                          : "text-[#2864c6]"
                      }
                    `}
                  >
                    {moeda(Math.abs(saldo))}
                  </strong>

                  <p
                    className={`mt-[10px] text-[10px] leading-[1.6] ${
                      saldoNegativo
                        ? "text-[#ae805e]"
                        : "text-[#849ab9]"
                    }`}
                  >
                    {saldoNegativo
                      ? "O professor gastou mais do que o valor recebido."
                      : saldo === 0
                        ? "Não há saldo pendente de devolução."
                        : "Saldo do repasse após alimentação e transporte."}
                  </p>
                </div>

                <div
                  className="
                    mt-[23px] flex justify-between gap-3
                    text-[10px] text-[#8b93a0]
                  "
                >
                  <span>Custo total da viagem</span>
                  <strong className="text-xs font-semibold text-[#5a6576] tabular-nums">
                    {moeda(totalViagem)}
                  </strong>
                </div>

                {!viagem.dentroDoEstado && (
                  <p className={estilos.helper}>
                    Inclui {moeda(custosViagem)} em passagem e hospedagem.
                  </p>
                )}
              </Card>

              <form
                className="
                  mt-[18px] grid gap-[14px] rounded-[17px]
                  border border-[#e9ebf1] bg-white p-5
                  print:hidden
                "
                onSubmit={(event) => {
                  event.preventDefault();
                  gerarFormulario();
                }}
              >
                <label
                  className="flex min-w-0 flex-col gap-2"
                  htmlFor="nome-analista"
                >
                  <span className={estilos.label}>
                    Analista da prestação de contas
                  </span>

                  <input
                    id="nome-analista"
                    className="
                      h-[45px] w-full min-w-0 rounded-[10px]
                      border border-[#e5e8ef] bg-[#fafbfe]
                      px-[13px] text-[13px] text-[#343b49]
                      outline-none transition
                      placeholder:text-[#a4acb9]
                      focus:border-[#89b2fa] focus:bg-white
                      focus:shadow-[0_0_0_3px_#3478ef12]
                    "
                    type="text"
                    placeholder="Digite o nome do analista"
                    autoComplete="name"
                    value={nomeAnalista}
                    onChange={(event) =>
                      setNomeAnalista(event.target.value)
                    }
                    required
                  />
                </label>

                <button
                  className={`
                    min-h-11 w-full cursor-pointer rounded-[10px]
                    bg-[#3478ef] px-4 py-3 text-xs
                    font-semibold text-white transition-colors
                    enabled:hover:bg-[#2864c6]
                    disabled:cursor-not-allowed
                    disabled:bg-[#e9edf4] disabled:text-[#9ba4b3]
                    ${estilos.foco}
                  `}
                  type="submit"
                  disabled={!nomeAnalista.trim()}
                >
                  Gerar Formulário
                </button>

                {!nomeAnalista.trim() && (
                  <p className="text-center text-[10px] leading-[1.6] text-[#929aa8]">
                    Preencha o nome do analista para gerar o formulário.
                  </p>
                )}
              </form>

              <div
                className="
                  print-analyst mt-6 hidden gap-2
                  border-t border-[#d9dee7] pt-4
                  print:grid print:break-inside-avoid
                "
              >
                <span className="text-[11px] text-[#5c6371]">
                  Analista da prestação de contas
                </span>

                <strong className="text-sm text-[#20232d] [overflow-wrap:anywhere]">
                  {nomeAnalista.trim()}
                </strong>
              </div>
            </aside>
          </div>

          <footer className="mt-8 text-center text-[10px] text-[#a3a9b5] print:hidden">
            <a
              className={`
                rounded-[3px] transition-colors
                hover:text-[#3478ef] hover:underline
                ${estilos.foco}
              `}
              href="https://www.instagram.com/kauaemidio_/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Desenvolvido por Kauã Emidio
            </a>
          </footer>
        </main>
      </div>
    </div>
  );
}

function Card({
  children,
  ariaLive,
}: {
  children: ReactNode;
  ariaLive?: "polite" | "assertive" | "off";
}) {
  return (
    <section className={`print-card ${estilos.card}`} aria-live={ariaLive}>
      {children}
    </section>
  );
}

function CabecalhoSecao({
  icone,
  titulo,
  descricao,
}: {
  icone: string;
  titulo: string;
  descricao: string;
}) {
  return (
    <div className="mb-[22px] flex items-center gap-3">
      <div
        className="
          grid size-[37px] shrink-0 place-items-center
          rounded-[11px] border border-[#e5edff]
          bg-[#f1f6ff] text-xl text-[#3478ef]
        "
        aria-hidden="true"
      >
        {icone}
      </div>

      <div>
        <h2 className="text-sm font-[650] tracking-[-0.25px]">
          {titulo}
        </h2>
        <p className="mt-[5px] text-[11px] leading-[1.5] text-[#9095a1]">
          {descricao}
        </p>
      </div>
    </div>
  );
}

function BotaoDestino({
  children,
  selecionado,
  onClick,
}: {
  children: ReactNode;
  selecionado: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selecionado}
      onClick={onClick}
      className={[
        "flex-1 cursor-pointer rounded-lg px-2 py-[10px]",
        "text-xs font-medium transition duration-150",
        estilos.foco,
        selecionado
          ? "bg-white text-[#303644] shadow-[0_1px_4px_#202d4814,0_0_0_1px_#202d4805] print:font-bold"
          : "bg-transparent text-[#838997] print:hidden",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Campo({
  label,
  descricao,
  valor,
  onChange,
}: {
  label: string;
  descricao?: string;
  valor: number;
  onChange: (valor: number) => void;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-2">
      <span className={estilos.label}>{label}</span>

      <div
        className="
          money-input flex items-center gap-[10px]
          rounded-[10px] border border-[#e5e8ef]
          bg-[#fafbfe] px-[13px] transition
          focus-within:border-[#89b2fa]
          focus-within:bg-white
          focus-within:shadow-[0_0_0_3px_#3478ef12]
        "
      >
        <span className="text-xs text-[#9ba2af]">R$</span>

        <input
          className="
            h-[45px] w-full min-w-0 appearance-none
            border-0 bg-transparent p-0
            text-[15px] font-medium text-[#343b49]
            tabular-nums outline-none
            [appearance:textfield]
            placeholder:text-[#b3b9c5]
            [&::-webkit-inner-spin-button]:m-0
            [&::-webkit-inner-spin-button]:appearance-none
            [&::-webkit-outer-spin-button]:m-0
            [&::-webkit-outer-spin-button]:appearance-none
          "
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          placeholder="0,00"
          value={valor === 0 ? "" : valor}
          onChange={(event) => {
            const numero = Number(event.target.value);
            onChange(
              Number.isFinite(numero) ? Math.max(0, numero) : 0,
            );
          }}
        />
      </div>

      {descricao && (
        <span className="text-[10px] text-[#9ba1ad]">
          {descricao}
        </span>
      )}
    </label>
  );
}

function Linha({ label, valor }: { label: string; valor: number }) {
  return (
    <div className="flex justify-between gap-3 text-[11px] text-[#838b98]">
      <span>{label}</span>
      <span className="shrink-0 font-medium text-[#48515f] tabular-nums">
        {moeda(valor)}
      </span>
    </div>
  );
}