import { forwardRef } from '@angular/core';

export interface QueryDefinition {
  prefixes?: QueryDefinitionPrefixes;
  select?: string[];
  distinct?: boolean;
  where?: QueryDefinitionWhere[];
  filter?: string[];
  group?: string;
  order?: string;
  limit?: number;
  offset?: number;
}

export type QueryDefinitionPrefixes = { [prefix: string]: string };

export type QueryDefinitionWhere = ({ s: string, type?: string, p?: string, o?: string, optional?: boolean } | { s: string, type?: string, po: { p: string, o: string }[], optional?: boolean });


function buildQuery(def: QueryDefinition): string {

  const prefixes: string = def.prefixes ? Object.entries(def.prefixes).map(([prefix, iri]) => `PREFIX ${prefix}: <${iri}>`).join("\n") : "";
  const select = typeof def.select === "string" ? def.select : def.select?.map(item => item.indexOf(" ") !== -1 ? "(" + item + ")" : item).join(" ");
  const where = def.where?.map(item => buildQueryWhere(item)).join("\n") || "";
  const filter = def.filter?.map(item => `FILTER (${item}) .`).join("\n") || "";

  return `${prefixes}
SELECT ${def.distinct ? "DISTINCT " : ""}${select || ""}
WHERE
{
  ${where || ""}
  ${filter || ""}
}
${def.group !== undefined ? "GROUP BY " + def.group : ""}
${def.order ? "ORDER BY " + def.order : ""}
${def.offset !== undefined ? "OFFSET " + def.offset : ""}
${def.limit !== undefined ? "LIMIT " + def.limit : ""}`;

}

function buildQueryWhere(def: QueryDefinitionWhere) {

  let where = `${def.s}`;

  if (def.type) where += ` a ${def.type} ;`;

  if ("po" in def) {
    const po = def.po.map(item => {
      if (typeof item === "string") return item;
      else return `${item.p} ${item.o}`;
    });
    where += ` ${po.join(" ; ")} .`;
  }
  else {
    where += ` ${def.p} ${def.o} .`;
  }

  return def.optional ? `OPTIONAL { ${where} }` : where;
}

function extendQuery(...defs: QueryDefinition[]): QueryDefinition {
  const base = {
    prefix: {} as { [prefix: string]: string },
    select: [] as string[],
    where: [] as QueryDefinitionWhere[],
    filter: [] as string[],
    group: undefined as (string | undefined),
    limit: undefined as (number | undefined),
    offset: undefined as (number | undefined),
  };

  defs.forEach(def => {
    if (def.prefixes) Object.assign(base.prefix, def.prefixes);
    if (def.select) base.select!.push(...def.select);
    if (def.where) base.where!.push(...def.where);
    if (def.filter) base.filter!.push(...def.filter);
    if (def.group) base.group = def.group;
    if (def.limit) base.limit = def.limit;
    if (def.offset) base.offset = def.offset;
  })

  return base;
}

export const Builder = {
  buildQuery,
  buildQueryWhere,
  extendQuery
};