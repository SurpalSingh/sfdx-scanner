export enum FilterType {
	RULENAME,
	CATEGORY,
	LANGUAGE,
	SOURCEPACKAGE,
	ENGINE
}

export class RuleFilter {
    readonly filterType: FilterType;
    readonly filterValues: ReadonlyArray<string>;

    constructor(filterType: FilterType, filterValues: string[]) {
        this.filterType = filterType;
        this.filterValues = filterValues.map(v => v.trim());
    }
}
