'use client'

import { useState, useEffect, useTransition, useActionState, useRef } from 'react'
import JsBarcode from 'jsbarcode'
import {
  ShieldCheck, Plus, Pencil, Trash2, Clock,
  CheckCircle2, XCircle, AlertCircle, Download,
} from 'lucide-react'
import { addPrescription, deletePrescription, upsertDocument } from '@/app/actions/patient'
import type { Database } from '@/lib/database.types'

type Doc = Database['public']['Tables']['patient_documents']['Row'] | null
type Rx  = Database['public']['Tables']['prescriptions']['Row']

const LEGAL =
  'Art. 62a Ustawy z dnia 29 lipca 2005 r. o przeciwdziałaniu narkomanii: ' +
  'Nie podlega karze za posiadanie środka odurzającego lub substancji psychotropowej ' +
  'w ilości nieznacznej, przeznaczonej na własny użytek, osoba, której zarzucono ' +
  'popełnienie tego przestępstwa, jeżeli orzeczenie wobec niej kary byłoby niecelowe ' +
  'ze względu na okoliczności popełnienia czynu, a także stopień jego społecznej szkodliwości.'

const INPUT =
  'w-full bg-white/10 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white ' +
  'placeholder:text-slate-500 focus:outline-none focus:border-green-500/60 transition-colors'

const isActive = (d: string) => new Date(d) >= new Date()

export default function WalletClient({ doc, prescriptions }: { doc: Doc; prescriptions: Rx[] }) {
  const [tab, setTab]           = useState<'police' | 'history'>('police')
  const [editDoc, setEditDoc]   = useState(!doc)
  const [showAddRx, setShowRx]  = useState(false)
  const [, startDelete]         = useTransition()

  const [docState, docAction, docPending] = useActionState(upsertDocument, null)
  const [rxState,  rxAction,  rxPending]  = useActionState(addPrescription, null)

  useEffect(() => { if (docState?.success) setEditDoc(false) }, [docState])
  useEffect(() => { if (rxState?.success)  setShowRx(false)  }, [rxState])

  const active  = prescriptions.filter(rx => isActive(rx.valid_until))
  const expired = prescriptions.filter(rx => !isActive(rx.valid_until))

  return (
    <div className="min-h-dvh bg-gradient-to-b from-[#020d07] to-[#0a1f12] text-white flex flex-col pt-14">
      <div className="flex-1 flex flex-col max-w-sm mx-auto w-full px-5 py-6 gap-4">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
            <ShieldCheck size={22} className="text-green-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Portfel Pacjenta</h1>
            <p className="text-xs text-slate-400">Dokumenty · Historia recept</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1">
          {[
            { id: 'police'  as const, label: 'Tryb Policyjny' },
            { id: 'history' as const, label: `Historia (${prescriptions.length})` },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
                tab === t.id ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Police Mode ── */}
        {tab === 'police' && (
          <>
            {editDoc ? (
              <form action={docAction} className="bg-white/8 rounded-2xl p-5 border border-white/10 space-y-4 backdrop-blur-sm">
                <p className="text-sm font-semibold">{doc ? 'Zaktualizuj dane' : 'Dodaj dane dokumentu'}</p>
                {docState?.error && <Err msg={docState.error} />}
                <Field name="patient_pesel"     label="PESEL"                    placeholder="12345678901" defaultValue={doc?.patient_pesel}     inputMode="numeric" maxLength={11} />
                <Field name="prescription_code" label="Kod e-recepty (4 cyfry)"  placeholder="0000"        defaultValue={doc?.prescription_code}  inputMode="numeric" maxLength={4}  />
                <div className="flex gap-2">
                  <button type="submit" disabled={docPending}
                    className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
                    {docPending ? 'Zapisuję…' : 'Zapisz dokument'}
                  </button>
                  {doc && (
                    <button type="button" onClick={() => setEditDoc(false)}
                      className="px-4 text-sm text-slate-400 hover:text-white bg-white/5 rounded-xl transition-colors">
                      Anuluj
                    </button>
                  )}
                </div>
              </form>
            ) : doc ? (
              <div className="bg-white/8 rounded-2xl p-5 border border-white/10 space-y-4 backdrop-blur-sm">
                <div>
                  <Lbl>PESEL</Lbl>
                  <p className="font-semibold text-base">{doc.patient_pesel}</p>
                </div>
                <hr className="border-white/10" />
                <div>
                  <Lbl>Kod e-recepty</Lbl>
                  <p
                    className="text-5xl font-black tracking-[0.35em] text-green-400 mt-2"
                    aria-label={`Kod: ${doc.prescription_code.split('').join(' ')}`}
                  >
                    {doc.prescription_code}
                  </p>
                </div>
                <hr className="border-white/10" />
                {/* Scannable Code 128 barcode — encodes PESEL + access code as P1 system expects */}
                <div>
                  <Lbl>Kod kreskowy (skan apteczny)</Lbl>
                  <Barcode128 value={doc.patient_pesel + doc.prescription_code} />
                </div>
                {doc.invoice_url && (
                  <a
                    href={doc.invoice_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-white/8 hover:bg-white/15 border border-white/10 rounded-xl py-2.5 text-xs font-medium transition-colors"
                  >
                    <Download size={13} /> Pobierz fakturę (PDF)
                  </a>
                )}
                <button onClick={() => setEditDoc(true)}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
                  <Pencil size={11} /> Edytuj dane
                </button>
              </div>
            ) : null}

            <details className="bg-white/5 rounded-2xl border border-white/8 group">
              <summary className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400 cursor-pointer p-5 select-none list-none">
                Podstawa prawna
                <span className="ml-auto transition-transform group-open:rotate-180">▾</span>
              </summary>
              <p className="text-xs text-slate-300 leading-relaxed px-5 pb-5">{LEGAL}</p>
            </details>
          </>
        )}

        {/* ── History Tab ── */}
        {tab === 'history' && (
          <>
            {active.length > 0 && (
              <section className="space-y-2">
                <SecLabel>Aktywne ({active.length})</SecLabel>
                {active.map(rx => (
                  <RxCard key={rx.id} rx={rx}
                    onDelete={id => startDelete(async () => { await deletePrescription(id) })} />
                ))}
              </section>
            )}

            {expired.length > 0 && (
              <section className="space-y-2">
                <SecLabel>Wygasłe ({expired.length})</SecLabel>
                {expired.map(rx => (
                  <RxCard key={rx.id} rx={rx} expired
                    onDelete={id => startDelete(async () => { await deletePrescription(id) })} />
                ))}
              </section>
            )}

            {prescriptions.length === 0 && !showAddRx && (
              <p className="text-center text-xs text-slate-500 py-2">Brak recept w historii.</p>
            )}

            {showAddRx ? (
              <form action={rxAction} className="bg-white/8 rounded-2xl p-5 border border-white/10 space-y-3 backdrop-blur-sm">
                <p className="text-sm font-semibold">Nowa recepta</p>
                {rxState?.error && <Err msg={rxState.error} />}
                <Field name="strain_name" label="Nazwa preparatu" placeholder="Aurora 22/1" required />
                <Field name="brand"       label="Producent"        placeholder="Aurora Cannabis" />
                <Field name="dose"        label="Dawkowanie"       placeholder="0,5g · 3× dziennie" />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest block mb-1">Ważna do</label>
                    <input name="valid_until" type="date" required className={INPUT} />
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest block mb-1">Refundacje</label>
                    <input name="refills_left" type="number" min="0" defaultValue="0" className={INPUT} />
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button type="submit" disabled={rxPending}
                    className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
                    {rxPending ? 'Dodaję…' : 'Dodaj receptę'}
                  </button>
                  <button type="button" onClick={() => setShowRx(false)}
                    className="px-4 text-sm text-slate-400 hover:text-white bg-white/5 rounded-xl transition-colors">
                    Anuluj
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowRx(true)}
                className="flex items-center justify-center gap-2 w-full border border-dashed border-white/15 hover:border-green-500/50 rounded-2xl py-4 text-sm text-slate-400 hover:text-green-400 transition-colors"
              >
                <Plus size={16} /> Dodaj receptę
              </button>
            )}
          </>
        )}

      </div>
    </div>
  )
}

/* ── Small helpers ── */

function Lbl({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-0.5">{children}</p>
}

function SecLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">{children}</p>
}

function Err({ msg }: { msg: string }) {
  return (
    <p className="text-xs text-red-400 flex items-center gap-1">
      <AlertCircle size={12} />{msg}
    </p>
  )
}

function Field({
  name, label, placeholder, defaultValue, required, inputMode, maxLength,
}: {
  name: string; label: string; placeholder?: string; defaultValue?: string
  required?: boolean; inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']; maxLength?: number
}) {
  return (
    <div>
      <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest block mb-1">{label}</label>
      <input
        name={name} type="text" placeholder={placeholder} defaultValue={defaultValue}
        required={required} inputMode={inputMode} maxLength={maxLength}
        className={INPUT}
      />
    </div>
  )
}

function Barcode128({ value }: { value: string }) {
  const ref = useRef<SVGSVGElement>(null)
  useEffect(() => {
    if (!ref.current) return
    JsBarcode(ref.current, value, {
      format: 'CODE128',
      displayValue: true,
      fontSize: 11,
      height: 64,
      margin: 10,
      background: '#ffffff',
      lineColor: '#111827',
      font: 'monospace',
      textMargin: 4,
    })
  }, [value])
  return (
    <div className="rounded-xl overflow-hidden mt-2">
      <svg ref={ref} className="w-full" />
    </div>
  )
}

function RxCard({ rx, expired, onDelete }: { rx: Rx; expired?: boolean; onDelete: (id: string) => void }) {
  return (
    <div className={`bg-white/8 rounded-2xl p-4 border backdrop-blur-sm ${expired ? 'border-white/5 opacity-60' : 'border-white/10'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            {expired
              ? <XCircle     size={13} className="text-red-400   shrink-0" />
              : <CheckCircle2 size={13} className="text-green-400 shrink-0" />}
            <p className="font-semibold text-sm truncate">{rx.strain_name}</p>
          </div>
          {(rx.brand || rx.dose) && (
            <p className="text-xs text-slate-400">{[rx.brand, rx.dose].filter(Boolean).join(' · ')}</p>
          )}
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <Clock size={10} />
            {new Date(rx.valid_until).toLocaleDateString('pl-PL')}
            {!expired && rx.refills_left > 0 && ` · ${rx.refills_left} refundacji`}
          </p>
        </div>
        <button onClick={() => onDelete(rx.id)} aria-label="Usuń receptę"
          className="shrink-0 p-1.5 text-slate-600 hover:text-red-400 transition-colors">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}
