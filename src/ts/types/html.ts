type attrSpT = { [attributeName: string]: string };
type elemOrTnSpecT = string | elemSpT;
type elemSpT = [string, attrSpT, ...elemOrTnSpecT[]] |
        [string,  ...elemOrTnSpecT[]];

export type AttributeSpecType = attrSpT;
export type ElementSpecType   = elemSpT;
