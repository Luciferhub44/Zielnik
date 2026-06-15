import { ShieldCheck, Download, AlertCircle } from 'lucide-react'

const PATIENT = {
  name: 'Jan Kowalski',
  pesel: '••••••••••• ',
  code: '7842',
  pharmacy: 'Apteka Centrum, Warszawa',
  invoiceRef: 'FV/2024/08/00123',
}

const LEGAL =
  'Art. 62a Ustawy z dnia 29 lipca 2005 r. o przeciwdziałaniu narkomanii: ' +
  'Nie podlega karze za posiadanie środka odurzającego lub substancji psychotropowej ' +
  'w ilości nieznacznej, przeznaczonej na własny użytek, osoba, której zarzucono ' +
  'popełnienie tego przestępstwa, jeżeli orzeczenie wobec niej kary byłoby niecelowe ' +
  'ze względu na okoliczności popełnienia czynu, a także stopień jego społecznej szkodliwości.'

export default function WalletPage() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-[#020d07] to-[#0a1f12] text-white flex flex-col pt-14">
      <div className="flex-1 flex flex-col max-w-sm mx-auto w-full px-5 py-8 gap-5">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
            <ShieldCheck size={22} className="text-green-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Tryb Policyjny</h1>
            <p className="text-xs text-slate-400">Dokumenty pacjenta medycznego</p>
          </div>
        </div>

        {/* Identity */}
        <div className="bg-white/8 rounded-2xl p-5 border border-white/10 space-y-4 backdrop-blur-sm">
          <Field label="Pacjent" value={PATIENT.name} large />
          <Field label="PESEL" value={PATIENT.pesel} />
          <hr className="border-white/10" />
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-2">
              Kod e-recepty
            </p>
            <p
              className="text-5xl font-black tracking-[0.35em] text-green-400 animate-code-pulse"
              aria-live="polite"
              aria-label={`Kod e-recepty: ${PATIENT.code.split('').join(' ')}`}
            >
              {PATIENT.code}
            </p>
          </div>
        </div>

        {/* Pharmacy / invoice */}
        <div className="bg-white/8 rounded-2xl p-5 border border-white/10 space-y-4 backdrop-blur-sm">
          <Field label="Apteka realizująca" value={PATIENT.pharmacy} />
          <Field label="Nr faktury imiennej" value={PATIENT.invoiceRef} />
          <button className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/18 transition-colors duration-150 rounded-xl py-3 text-sm font-medium cursor-pointer border border-white/10">
            <Download size={14} />
            Pobierz fakturę (PDF)
          </button>
        </div>

        {/* Legal */}
        <div className="bg-white/5 rounded-2xl p-5 border border-white/8 space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            <AlertCircle size={12} />
            Podstawa prawna
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{LEGAL}</p>
        </div>

      </div>
    </div>
  )
}

function Field({ label, value, large }: { label: string; value: string; large?: boolean }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
      <p className={`font-semibold ${large ? 'text-xl' : 'text-base'}`}>{value}</p>
    </div>
  )
}
