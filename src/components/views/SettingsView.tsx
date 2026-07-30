import { Check } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useSettings } from "../../contexts/SettingsContext";
import { useI18n, languageNames } from "../../i18n";
import type { LanguageCode, ThemeMode, VerificationMode } from "../../types/disk";

const THEMES: { key: ThemeMode; swatch: string }[] = [
  { key: "dark", swatch: "#0d0d0d" },
  { key: "light", swatch: "#fafafa" },
  { key: "milktea", swatch: "#e8dec8" },
];

const VERIFICATIONS: VerificationMode[] = ["none", "md5", "sha256", "bitwise"];

export default function SettingsView() {
  const { t, lang, setLang } = useI18n();
  const { theme, setTheme } = useTheme();
  const { defaultVerification, setDefaultVerification } = useSettings();

  const themeLabel: Record<ThemeMode, string> = {
    dark: t.settings.themeDark,
    light: t.settings.themeLight,
    milktea: t.settings.themeMilktea,
  };

  const verificationLabel: Record<VerificationMode, string> = {
    none: t.clone.verificationFast,
    md5: t.clone.verificationMd5,
    sha256: t.clone.verificationSha256,
    bitwise: t.clone.verificationBitwise,
  };

  return (
    <div className="max-w-[640px] mx-auto py-10 px-8">
      <header className="mb-8">
        <h1 className="text-[20px] font-semibold tracking-tight">{t.settings.title}</h1>
      </header>

      <Section title={t.settings.appearance}>
        <div className="flex gap-3">
          {THEMES.map((th) => {
            const active = theme === th.key;
            return (
              <button
                key={th.key}
                onClick={() => setTheme(th.key)}
                className="flex-1 rounded-[10px] p-3 flex flex-col items-center gap-2"
                style={{ border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`, background: "var(--bg-elev)" }}
              >
                <div
                  className="w-full h-10 rounded-[6px] relative overflow-hidden"
                  style={{ background: th.swatch, border: "1px solid var(--border)" }}
                >
                  {active && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check size={14} color="var(--accent)" />
                    </div>
                  )}
                </div>
                <span className="text-[12px]">{themeLabel[th.key]}</span>
              </button>
            );
          })}
        </div>
      </Section>

      <Section title={t.settings.language}>
        <select
          className="input w-full rounded-[8px] px-3 py-2 text-[13px]"
          value={lang}
          onChange={(e) => setLang(e.target.value as LanguageCode)}
        >
          {(Object.keys(languageNames) as LanguageCode[]).map((code) => (
            <option key={code} value={code}>
              {languageNames[code]}
            </option>
          ))}
        </select>
      </Section>

      <Section title={t.settings.defaultVerification}>
        <select
          className="input w-full rounded-[8px] px-3 py-2 text-[13px]"
          value={defaultVerification}
          onChange={(e) => setDefaultVerification(e.target.value as VerificationMode)}
        >
          {VERIFICATIONS.map((v) => (
            <option key={v} value={v}>
              {verificationLabel[v]}
            </option>
          ))}
        </select>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-7">
      <div className="text-[12px] font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--text-secondary)" }}>
        {title}
      </div>
      {children}
    </div>
  );
}
