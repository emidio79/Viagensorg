import { useState } from "react";
import "./App.css";

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

export default function App() {
  const [viagem, setViagem] = useState<Viagem>({
    dentroDoEstado: true,
    alimentacao: 0,
    uber: 0,
    passagemAerea: 0,
    hospedagem: 0,
    repasseProfessor: 0,
  });

  function atualizar<K extends keyof Viagem>(
    campo: K,
    valor: Viagem[K],
  ) {
    setViagem((atual) => ({ ...atual, [campo]: valor }));
  }

  const gastosProfessor = viagem.alimentacao + viagem.uber;

  const custosViagem = viagem.dentroDoEstado
    ? 0
    : viagem.passagemAerea + viagem.hospedagem;

  // Aqui, apenas alimentação e Uber são descontados do repasse.
  const saldo = viagem.repasseProfessor - gastosProfessor;
  const totalViagem = gastosProfessor + custosViagem;

  const percentual =
    viagem.repasseProfessor > 0
      ? Math.min((gastosProfessor / viagem.repasseProfessor) * 100, 100)
      : 0;

  return (
    <div className="app">
      <div className="window">
        <header className="window-bar">
          <div className="window-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <span>Viagens</span>
          <div className="window-spacer" />
        </header>

        <main className="workspace">
          <header className="page-header">
            <div>
              <span className="eyebrow">CONTROLE FINANCEIRO</span>
              <h1>Sua viagem, em dia.</h1>
              <p>Organize as despesas e confira a prestação de contas.</p>
            </div>

            <span className="status">
              <span />
              Cálculo em tempo real
            </span>
          </header>

          <div className="layout">
            <div className="form-column">
              <section className="card">
                <div className="section-header">
                  <div className="section-icon">↗</div>
                  <div>
                    <h2>Destino da viagem</h2>
                    <p>Selecione o tipo de deslocamento.</p>
                  </div>
                </div>

                <div className="segmented" role="group" aria-label="Tipo de viagem">
                  <button
                    type="button"
                    aria-pressed={viagem.dentroDoEstado}
                    className={viagem.dentroDoEstado ? "selected" : ""}
                    onClick={() => atualizar("dentroDoEstado", true)}
                  >
                    Dentro do estado
                  </button>

                  <button
                    type="button"
                    aria-pressed={!viagem.dentroDoEstado}
                    className={!viagem.dentroDoEstado ? "selected" : ""}
                    onClick={() => atualizar("dentroDoEstado", false)}
                  >
                    Outro estado
                  </button>
                </div>

                <p className="helper">
                  {viagem.dentroDoEstado
                    ? "Registre alimentação, transporte e o repasse recebido."
                    : "Inclua também os custos de passagem aérea e hospedagem."}
                </p>
              </section>

              <section className="card">
                <div className="section-header">
                  <div className="section-icon">▤</div>
                  <div>
                    <h2>Despesas do professor</h2>
                    <p>Valores utilizados durante a viagem.</p>
                  </div>
                </div>

                <div className="fields-grid">
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

                {!viagem.dentroDoEstado && (
                  <div className="extra-fields">
                    <div className="subsection-title">
                      Custos adicionais da viagem
                    </div>

                    <div className="fields-grid">
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

                    <p className="helper">
                      Esses custos entram no total da viagem, mas não são
                      descontados do repasse ao professor.
                    </p>
                  </div>
                )}
              </section>

              <section className="card">
                <div className="section-header">
                  <div className="section-icon">↔</div>
                  <div>
                    <h2>Repasse ao professor</h2>
                    <p>Valor adiantado para alimentação e transporte.</p>
                  </div>
                </div>

                <Campo
                  label="Valor recebido"
                  valor={viagem.repasseProfessor}
                  onChange={(v) => atualizar("repasseProfessor", v)}
                />
              </section>
            </div>

            <aside className="summary">
              <section className="card summary-card" aria-live="polite">
                <span className="eyebrow">PRESTAÇÃO DE CONTAS</span>

                <h2>Resumo da viagem</h2>
                <p className="summary-description">
                  Tudo o que você precisa conferir.
                </p>

                <div className="summary-rows">
                  <Linha label="Repasse recebido" valor={viagem.repasseProfessor} />
                  <Linha label="Alimentação" valor={viagem.alimentacao} />
                  <Linha label="Uber e transporte" valor={viagem.uber} />

                  <div className="summary-divider" />

                  <Linha label="Gasto pelo professor" valor={gastosProfessor} />
                </div>

                <div className="progress-heading">
                  <span>Utilização do repasse</span>
                  <span>{percentual.toFixed(0)}%</span>
                </div>

                <div className="progress-track" aria-hidden="true">
                  <div style={{ width: `${percentual}%` }} />
                </div>

                <div className={`balance ${saldo < 0 ? "negative" : ""}`}>
                  <span>
                    {saldo < 0 ? "Valor excedente" : "Valor a devolver"}
                  </span>

                  <strong>{moeda(Math.abs(saldo))}</strong>

                  <p>
                    {saldo < 0
                      ? "O professor gastou mais do que o valor recebido."
                      : saldo === 0
                        ? "Não há saldo pendente de devolução."
                        : "Saldo do repasse após alimentação e transporte."}
                  </p>
                </div>

                <div className="trip-total">
                  <span>Custo total da viagem</span>
                  <strong>{moeda(totalViagem)}</strong>
                </div>

                {!viagem.dentroDoEstado && (
                  <p className="helper">
                    Inclui {moeda(custosViagem)} em passagem e hospedagem.
                  </p>
                )}
              </section>

              <p className="local-notice">
                Os valores ainda não são salvos. Recarregar a página limpa o
                formulário.
              </p>
            </aside>
          </div>

          <footer className="page-footer">
            Viagens · Controle simples, contas claras.
          </footer>
        </main>
      </div>
    </div>
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
    <label className="field">
      <span className="field-label">{label}</span>

      <div className="money-input">
        <span>R$</span>
        <input
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          placeholder="0,00"
          value={valor === 0 ? "" : valor}
          onChange={(e) => {
            const numero = Number(e.target.value);
            onChange(Number.isFinite(numero) ? Math.max(0, numero) : 0);
          }}
        />
      </div>

      {descricao && <span className="field-description">{descricao}</span>}
    </label>
  );
}

function Linha({ label, valor }: { label: string; valor: number }) {
  return (
    <div className="summary-row">
      <span>{label}</span>
      <span>{moeda(valor)}</span>
    </div>
  );
}