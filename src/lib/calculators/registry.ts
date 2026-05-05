import { glasgowEngine } from "./engines/glasgow";
import { imcEngine } from "./engines/imc";
import { news2Engine } from "./engines/news2";
import { pamEngine } from "./engines/pam";
import { qsofaEngine } from "./engines/qsofa";
import { rassEngine } from "./engines/rass";
import { sofaEngine } from "./engines/sofa";
import { wellsTepEngine } from "./engines/wells-tep";
import { wellsTvpEngine } from "./engines/wells-tvp";

export const calculatorRegistry = {
  qSOFA: qsofaEngine,
  SOFA: sofaEngine,
  NEWS2: news2Engine,
  Glasgow: glasgowEngine,
  RASS: rassEngine,
  Wells_TEP: wellsTepEngine,
  Wells_TVP: wellsTvpEngine,
  PAM: pamEngine,
  IMC: imcEngine,
} as const;
