import { getLocale, getTranslations } from "next-intl/server";
import { assignWeapons } from "@/components/engravings/weapons";
import { Marg } from "@/components/ui/marg";
import { CHANTS } from "@/components/voyage/chants";
import { RevealTitle } from "@/components/voyage/reveal/reveal-title";
import { getTechnologies } from "@/lib/data/technologies";
import { roman } from "@/lib/format/roman";
import { ArsenalIndex, type Tool } from "./arsenal-index";
import { ArsenalStage } from "./arsenal-stage";

/**
 * Chant III · The arsenal (STORYBOARD §5): a book index of the tools, each
 * pointing to the trials where it served, and the shrine of the active
 * tool's weapon. Everything is generated from `technologies`.
 */
export async function Arsenal() {
  const locale = await getLocale();
  const [t, tv, technologies] = await Promise.all([
    getTranslations("arsenal"),
    getTranslations("voyage"),
    getTechnologies(locale),
  ]);

  const weapons = assignWeapons(technologies.map((tool) => tool.weapon));
  const tools: Tool[] = technologies.map((tool, i) => {
    const weapon = weapons[i];
    const weaponName = t(`weapons.${weapon}`);
    return {
      id: tool.id,
      name: tool.name,
      since: tool.yearsOfUse
        ? t("years", { count: tool.yearsOfUse })
        : tool.durationLabel || tv("todo"),
      role: tool.role || tv("todo"),
      context: tool.context || t("contextMissing"),
      weapon,
      kicker: t("instrument", { n: roman(i + 1), weapon: weaponName }),
      weaponName,
      refs: tool.projects.map((p) => ({
        n: roman(p.index),
        href: `#traversee-${p.index}`,
        label: t("refLink", { n: roman(p.index), title: p.title }),
      })),
    };
  });

  return (
    <ArsenalStage labelledBy="arsenal-title">
      <div className="grid-12">
        <Marg
          chant={tv("chants.arsenal.n")}
          folio={CHANTS.indexOf("arsenal") + 1}
          note={t("margin")}
        />
        <header className="chant-head">
          <RevealTitle id="arsenal-title" className="display">
            {tv("chants.arsenal.title")}
          </RevealTitle>
          <p className="lead">{t("lead")}</p>
        </header>
        <div className="chant-body">
          {tools.length ? (
            <ArsenalIndex
              tools={tools}
              indexLabel={t("indexLabel")}
              refsLabel={t("refsLabel")}
            />
          ) : (
            <p className="todo">{tv("todo")}</p>
          )}
        </div>
      </div>
    </ArsenalStage>
  );
}
