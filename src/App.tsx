import { useId, useRef, useState } from "react";
import type { ReactNode } from "react";

type Comprovante = {
  id: string;
  centavos: number;
};

type Viagem = {
  dentroDoEstado: boolean;
  estadoDestino: string;
  nomeCompeticao: string;
  passagemAerea: number;
  hospedagem: number;
  repasseProfessor: number;
  valorCreditadoCompeticao: number;
  comprovantesAlimentacao: Comprovante[];
  comprovantesTransporte: Comprovante[];
};

const moeda = (valor: number) =>
  valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const paraCentavos = (valor: number) =>
  Math.round((valor + Number.EPSILON) * 100);

const somarComprovantes = (itens: Comprovante[]) =>
  itens.reduce((total, item) => total + item.centavos, 0);

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

  inputContainer:
    "money-input flex items-center gap-[10px] rounded-[10px] " +
    "border border-[#e5e8ef] bg-[#fafbfe] px-[13px] transition " +
    "focus-within:border-[#89b2fa] focus-within:bg-white " +
    "focus-within:shadow-[0_0_0_3px_#3478ef12]",

  input:
    "h-[45px] w-full min-w-0 border-0 bg-transparent p-0 " +
    "text-[15px] font-medium text-[#343b49] tabular-nums outline-none " +
    "placeholder:text-[#b3b9c5]",
};

export default function App() {
  const [viagem, setViagem] = useState<Viagem>({
    dentroDoEstado: true,
    estadoDestino: "",
    nomeCompeticao: "",
    passagemAerea: 0,
    hospedagem: 0,
    repasseProfessor: 0,
    valorCreditadoCompeticao: 0,
    comprovantesAlimentacao: [],
    comprovantesTransporte: [],
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

  const alimentacaoCentavos = somarComprovantes(
    viagem.comprovantesAlimentacao,
  );

  const transporteCentavos = somarComprovantes(
    viagem.comprovantesTransporte,
  );

  const gastosProfessorCentavos =
    alimentacaoCentavos + transporteCentavos;

  const custosViagemCentavos = viagem.dentroDoEstado
    ? 0
    : paraCentavos(viagem.passagemAerea) +
      paraCentavos(viagem.hospedagem);

  const saldoCentavos =
    paraCentavos(viagem.repasseProfessor) - gastosProfessorCentavos;

  const alimentacao = alimentacaoCentavos / 100;
  const transporte = transporteCentavos / 100;
  const gastosProfessor = gastosProfessorCentavos / 100;
  const custosViagem = custosViagemCentavos / 100;
  const saldo = saldoCentavos / 100;

  const totalViagem =
    (gastosProfessorCentavos + custosViagemCentavos) / 100;

  const saldoNegativo = saldoCentavos < 0;

  const percentual =
    viagem.repasseProfessor > 0
      ? (gastosProfessorCentavos /
          paraCentavos(viagem.repasseProfessor)) *
        100
      : 0;

  return (
    <div
      className="
        app min-h-screen bg-[#eef0f5] px-6 py-10
        bg-[radial-gradient(ellipse_at_15%_0%,#dce7ff_0%,transparent_45%),radial-gradient(ellipse_at_95%_80%,#e4def1_0%,transparent_40%)]
        min-[1600px]:pt-[70px] max-[540px]:p-3
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
            workspace p-[42px] max-[900px]:p-7
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
              items-start gap-[22px] max-[900px]:grid-cols-1
            "
          >
            <div className="form-column grid gap-[18px]">
              <Card>
                <CabecalhoSecao
                  icone="↔"
                  titulo="Crédito e repasse"
                  descricao="Valor creditado para a competição e repasse ao professor"
                />

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Campo
                    label="Total creditado para a competição"
                    valor={viagem.valorCreditadoCompeticao}
                    onChange={(v) =>
                      atualizar("valorCreditadoCompeticao", v)
                    }
                  />

                  <Campo
                    label="Repasse ao professor"
                    valor={viagem.repasseProfessor}
                    onChange={(v) => atualizar("repasseProfessor", v)}
                  />
                </div>
              </Card>

              <Card>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Coluna esquerda: destino */}
                  <div className="min-w-0">
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

                    {!viagem.dentroDoEstado && (
                      <label className="mt-5 flex min-w-0 flex-col gap-2">
                        <span className={estilos.label}>
                          Estado de destino
                        </span>

                        <input
                          type="text"
                          placeholder="Ex.: Pernambuco"
                          value={viagem.estadoDestino}
                          onChange={(event) =>
                            atualizar("estadoDestino", event.target.value)
                          }
                          className="
                            h-[45px] w-full min-w-0 rounded-[10px]
                            border border-[#e5e8ef] bg-[#fafbfe]
                            px-[13px] text-[13px] text-[#343b49]
                            outline-none transition
                            placeholder:text-[#a4acb9]
                            focus:border-[#89b2fa] focus:bg-white
                            focus:shadow-[0_0_0_3px_#3478ef12]
                          "
                        />
                      </label>
                    )}
                  </div>

                  {/* Coluna direita: competição */}
                  <div
                    className="
                      min-w-0 border-t border-[#eef0f4] pt-6
                      sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6
                    "
                  >
                    <CabecalhoSecao
                      icone="⚑"
                      titulo="Competição"
                      descricao="Informe o nome da competição."
                    />

                    <label className="block">
                      <span className="sr-only">
                        Nome da competição
                      </span>

                      <input
                        type="text"
                        placeholder="Ex.: Jogos Universitários"
                        value={viagem.nomeCompeticao}
                        onChange={(event) =>
                          atualizar("nomeCompeticao", event.target.value)
                        }
                        className="
                          h-[46px] w-full min-w-0 rounded-[10px]
                          border border-[#e5e8ef] bg-[#fafbfe]
                          px-[13px] text-[13px] text-[#343b49]
                          outline-none transition
                          placeholder:text-[#a4acb9]
                          focus:border-[#89b2fa] focus:bg-white
                          focus:shadow-[0_0_0_3px_#3478ef12]
                        "
                      />
                    </label>

                    <p className={estilos.helper}>
                      Nome do evento ao qual esta prestação de contas se refere.
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <CabecalhoSecao
                  icone="▤"
                  titulo="Despesas do professor"
                  descricao="Adicione os valores dos comprovantes da viagem."
                />

                {!viagem.dentroDoEstado && (
                  <div
                    className="
                      extra-fields mb-6 border-b
                      border-[#eef0f4] pb-[21px]
                    "
                  >
                    <div className="mb-4 text-[11px] font-semibold text-[#7d8593]">
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
                      Esses custos entram no total da viagem, mas não
                      são descontados do repasse ao professor.
                    </p>
                  </div>
                )}

                <div className={estilos.campos}>
                  <CampoComprovantes
                    label="Alimentação"
                    descricao="Refeições e lanches"
                    comprovantes={viagem.comprovantesAlimentacao}
                    onChange={(itens) =>
                      atualizar("comprovantesAlimentacao", itens)
                    }
                  />

                  <CampoComprovantes
                    label="Transporte"
                    descricao="Uber e deslocamentos"
                    comprovantes={viagem.comprovantesTransporte}
                    onChange={(itens) =>
                      atualizar("comprovantesTransporte", itens)
                    }
                  />
                </div>
              </Card>
            </div>

            <aside className="summary sticky top-6 max-[900px]:static print:static">
              <Card ariaLive="polite">
                <span className={estilos.eyebrow}>
                  PRESTAÇÃO DE CONTAS
                </span>

                <h2 className="mt-3 text-[19px] font-[650] tracking-[-0.5px]">
                  Resumo da viagem
                </h2>

                <p className="mt-[7px] mb-[26px] text-[11px] text-[#939aa6]">
                  Tudo o que você precisa conferir.
                </p>

                <div className="grid gap-4">
                  <Linha
                    label="Total creditado"
                    valor={viagem.valorCreditadoCompeticao}
                  />

                  <Linha
                    label="Repasse recebido"
                    valor={viagem.repasseProfessor}
                  />

                  <Linha label="Alimentação" valor={alimentacao} />

                  <Linha label="Uber e transporte" valor={transporte} />

                  <div className="h-px bg-[#eef0f5]" />

                  <Linha
                    label="Gasto pelo professor"
                    valor={gastosProfessor}
                  />
                </div>

                <div className="mt-[26px] flex justify-between text-[10px] text-[#9098a5]">
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
                      transition-[width] duration-200 ease-in-out
                    "
                    style={{
                      width: `${Math.min(percentual, 100)}%`,
                    }}
                  />
                </div>

                {/* Valor a devolver: acima do card azul */}
                <div className="mb-4 flex items-center justify-between gap-3 text-[11px] text-[#8b93a0]">
                  <span>
                    {saldoNegativo ? "Valor excedente" : "Valor a devolver"}
                  </span>

                  <strong
                    className={`text-xs font-semibold tabular-nums ${
                      saldoNegativo
                        ? "text-[#bd7134]"
                        : "text-[#5a6576]"
                    }`}
                  >
                    {moeda(Math.abs(saldo))}
                  </strong>
                </div>

                {/* Card azul: total gasto na viagem */}
                <div
                  className="
                    balance rounded-[13px] border border-[#deebff]
                    bg-[linear-gradient(135deg,#f3f8ff,#edf4ff)]
                    px-[18px] py-[22px]
                  "
                >
                  <span className="text-[11px] text-[#6282b5]">
                    Total gasto na viagem
                  </span>

                  <strong
                    className="
                      mt-[7px] block text-[clamp(25px,3vw,31px)]
                      font-[650] tracking-[-1px] text-[#2864c6]
                      tabular-nums [overflow-wrap:anywhere]
                    "
                  >
                    {moeda(totalViagem)}
                  </strong>

                  <p className="mt-[10px] text-[10px] leading-[1.6] text-[#849ab9]">
                    {viagem.dentroDoEstado
                      ? "Total das despesas com alimentação e transporte."
                      : "Total das despesas com alimentação, transporte, passagem e hospedagem."}
                  </p>
                </div>

                {/* Passagem e hospedagem: abaixo do card azul */}
                {!viagem.dentroDoEstado && (
                  <p className={estilos.helper}>
                    Inclui {moeda(custosViagem)} em passagem e hospedagem.
                  </p>
                )}
              </Card>

              <form
                className="
                  mt-[18px] grid gap-[14px] rounded-[17px]
                  border border-[#e9ebf1] bg-white p-5 print:hidden
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
                    Preencha o nome do analista para gerar o
                    formulário.
                  </p>
                )}
              </form>

              <p className="mt-3 px-2 text-center text-[10px] leading-relaxed text-[#929aa8] print:hidden">
                Os dados ficam apenas nesta sessão. Recarregar a
                página limpa os lançamentos.
              </p>

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
    <section
      className={`print-card ${estilos.card}`}
      aria-live={ariaLive}
    >
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

      <div className={estilos.inputContainer}>
        <span className="text-xs text-[#9ba2af]">R$</span>

        <input
          className={`
            ${estilos.input}
            appearance-none [appearance:textfield]
            [&::-webkit-inner-spin-button]:m-0
            [&::-webkit-inner-spin-button]:appearance-none
            [&::-webkit-outer-spin-button]:m-0
            [&::-webkit-outer-spin-button]:appearance-none
          `}
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          placeholder="0,00"
          value={valor === 0 ? "" : valor}
          onChange={(event) => {
            const numero = Number(event.target.value);

            onChange(
              Number.isFinite(numero)
                ? Math.max(0, numero)
                : 0,
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

function CampoComprovantes({
  label,
  descricao,
  comprovantes,
  onChange,
}: {
  label: string;
  descricao: string;
  comprovantes: Comprovante[];
  onChange: (comprovantes: Comprovante[]) => void;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const contador = useRef(0);

  const [entrada, setEntrada] = useState("");
  const [aberto, setAberto] = useState(false);
  const [idEdicao, setIdEdicao] = useState<string | null>(null);
  const [erro, setErro] = useState("");

  const total = somarComprovantes(comprovantes) / 100;
  const editando = idEdicao !== null;

  function limparEntrada() {
    setEntrada("");
    setIdEdicao(null);
    setErro("");
  }

  function confirmar() {
    const texto = entrada.trim();

    // Aceita 25,50 ou 25.50, sem separadores de milhar.
    if (!/^\d+(?:[.,]\d{1,2})?$/.test(texto)) {
      setErro("Digite um valor como 25,50, sem pontos de milhar.");
      inputRef.current?.focus();
      return;
    }

    const centavos = paraCentavos(
      Number(texto.replace(",", ".")),
    );

    if (!Number.isSafeInteger(centavos) || centavos <= 0) {
      setErro("Digite um valor válido, a partir de R$ 0,01.");
      inputRef.current?.focus();
      return;
    }

    if (idEdicao !== null) {
      onChange(
        comprovantes.map((item) =>
          item.id === idEdicao
            ? { ...item, centavos }
            : item,
        ),
      );
    } else {
      contador.current += 1;

      onChange([
        ...comprovantes,
        {
          id: `${id}-${contador.current}`,
          centavos,
        },
      ]);
    }

    limparEntrada();
    inputRef.current?.focus();
  }

  function editar(item: Comprovante) {
    setIdEdicao(item.id);
    setEntrada(
      (item.centavos / 100).toFixed(2).replace(".", ","),
    );
    setErro("");
    setAberto(true);
    inputRef.current?.focus();
  }

  function excluir(idComprovante: string) {
    onChange(
      comprovantes.filter((item) => item.id !== idComprovante),
    );

    if (idEdicao === idComprovante) {
      limparEntrada();
    }
  }

  return (
    <div className="min-w-0">
      <div className="print:hidden">
        <label
          className={`mb-2 block ${estilos.label}`}
          htmlFor={`${id}-entrada`}
        >
          {label}
        </label>

        <div className={estilos.inputContainer}>
          <span className="text-xs text-[#9ba2af]">R$</span>

          <input
            ref={inputRef}
            id={`${id}-entrada`}
            className={estilos.input}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            placeholder="0,00"
            value={entrada}
            aria-invalid={Boolean(erro)}
            aria-describedby={`${id}-ajuda`}
            onChange={(event) => {
              setEntrada(event.target.value);
              setErro("");
            }}
            onKeyDown={(event) => {
              if (event.nativeEvent.isComposing) return;

              if (event.key === "Enter") {
                event.preventDefault();
                confirmar();
              }

              if (event.key === "Escape") {
                limparEntrada();
              }
            }}
          />

          <button
            type="button"
            onClick={confirmar}
            aria-label={
              editando
                ? `Salvar edição de ${label}`
                : `Adicionar comprovante de ${label}`
            }
            className={`
              shrink-0 cursor-pointer rounded-lg
              border border-[#e5e8ef] bg-white
              px-2.5 py-1.5 text-[11px] font-medium
              text-[#3478ef] transition hover:bg-[#edf4ff]
              ${estilos.foco}
            `}
          >
            {editando ? "Salvar" : "+"}
          </button>
        </div>

        <p
          id={`${id}-ajuda`}
          role={erro ? "alert" : undefined}
          className={`mt-2 text-[10px] leading-relaxed ${
            erro ? "text-red-600" : "text-[#9ba1ad]"
          }`}
        >
          {erro ||
            (editando
              ? "Editando comprovante · Enter para salvar"
              : `${descricao} · Enter para adicionar`)}
        </p>

        {editando && (
          <button
            type="button"
            onClick={() => {
              limparEntrada();
              inputRef.current?.focus();
            }}
            className={`
              mt-2 cursor-pointer rounded text-[11px]
              text-[#7d8593] hover:text-[#343b49]
              ${estilos.foco}
            `}
          >
            Cancelar edição
          </button>
        )}
      </div>

      <span className={`hidden print:block ${estilos.label}`}>
        {label}
      </span>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] text-[#838b98]">
          Total:{" "}
          <span className="font-semibold text-[#48515f] tabular-nums">
            {moeda(total)}
          </span>
        </span>

        <button
          type="button"
          aria-expanded={aberto}
          aria-controls={`${id}-historico`}
          onClick={() => setAberto((atual) => !atual)}
          className={`
            flex cursor-pointer items-center gap-1
            rounded-md px-1 py-1 text-[10px]
            text-[#838b98] transition hover:text-[#3478ef]
            print:hidden ${estilos.foco}
          `}
        >
          {comprovantes.length} comprovante
          {comprovantes.length !== 1 ? "s" : ""}

          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className={`size-4 transition-transform duration-200 ${
              aberto ? "rotate-180" : ""
            }`}
          >
            <path d="m5 7.5 5 5 5-5" />
          </svg>
        </button>
      </div>

      <div
        id={`${id}-historico`}
        className={`
          mt-3 rounded-xl border border-[#e9ebf1]
          bg-[#fafbfe] print:block print:bg-white
          ${aberto ? "block" : "hidden"}
        `}
      >
        {comprovantes.length === 0 ? (
          <p className="p-4 text-center text-[11px] text-[#9ba1ad]">
            Nenhum comprovante adicionado.
          </p>
        ) : (
          <ul
            className="
              max-h-60 divide-y divide-[#e9ebf1]
              overflow-y-auto print:max-h-none print:overflow-visible
            "
          >
            {comprovantes.map((item, indice) => (
              <li
                key={item.id}
                className={`
                  flex flex-wrap items-center justify-between
                  gap-2 px-3 py-3 print:break-inside-avoid
                  ${
                    idEdicao === item.id
                      ? "bg-[#edf4ff]"
                      : ""
                  }
                `}
              >
                <div>
                  <p className="text-[10px] text-[#9ba1ad]">
                    Comprovante {indice + 1}
                  </p>

                  <p className="mt-1 text-xs font-medium text-[#48515f] tabular-nums">
                    {moeda(item.centavos / 100)}
                  </p>
                </div>

                <div className="flex gap-1 print:hidden">
                  <button
                    type="button"
                    onClick={() => editar(item)}
                    aria-label={`Editar comprovante ${indice + 1} de ${label}`}
                    className={`
                      cursor-pointer rounded-md px-2 py-1.5
                      text-[10px] text-[#3478ef]
                      hover:bg-[#e2edff] ${estilos.foco}
                    `}
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => excluir(item.id)}
                    aria-label={`Excluir comprovante ${indice + 1} de ${label}`}
                    className={`
                      cursor-pointer rounded-md px-2 py-1.5
                      text-[10px] text-red-500
                      hover:bg-red-50 ${estilos.foco}
                    `}
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Linha({
  label,
  valor,
}: {
  label: string;
  valor: number;
}) {
  return (
    <div className="flex justify-between gap-3 text-[11px] text-[#838b98]">
      <span>{label}</span>

      <span className="shrink-0 font-medium text-[#48515f] tabular-nums">
        {moeda(valor)}
      </span>
    </div>
  );
}