import { JSDOM } from 'jsdom';
import type { AttributeSpecType, ElementSpecType } from './types/html';
type attrSpT = AttributeSpecType;
type elemSpT = ElementSpecType;
type elemOrTnSpecT = elemSpT | string;

function isAttrSpecType ( o: any ) : o is attrSpT {
  return o.constructor === Object;
}

export function setAttributes( elem: Element, attrs: attrSpT ){
  for ( const attrName of Object.keys( attrs ) ){
    const attrValue = attrs[ attrName as keyof attrSpT ];
    if(typeof attrValue === 'string') elem.setAttribute( attrName, attrValue );
  }
}

export function makeElement ( doc : Document,  src :elemSpT ) : Element {
  const [ elementName, attrs, content ]  = isAttrSpecType( src[1] ) ?
    [ src[0], src[1],        src.slice(2) as elemOrTnSpecT[] ] :
    [ src[0], {} as attrSpT, src.slice(1) as elemOrTnSpecT[] ];
  const elem = doc.createElement( elementName );
  setAttributes( elem, attrs );
  for ( const cspec of content ){
    elem.appendChild( typeof cspec === 'string'
      ? doc.createTextNode(cspec)
      : makeElement( doc, cspec ));
  }
  return elem;
}

export function makeFragment (
  doc: Document, ... srcs : elemSpT[]): DocumentFragment
{
  const retval = doc.createDocumentFragment();
  for( const src of srcs ){
    retval.appendChild( makeElement(doc, src) );
  }
  return retval;
}

export function updateElement( elem: Element, attrs: attrSpT, ... srcs: elemSpT[] ){
  while(elem.firstChild) elem.removeChild( elem.firstChild );
  setAttributes( elem, attrs );
  elem.appendChild(makeFragment(elem.ownerDocument, ... srcs ));
}

export function printHtml ( htmlAttrs: attrSpT, ... srcs: elemSpT[] ) {
  const jsdom = new JSDOM('<!DOCTYPE HTML><html></html>');
  const document = jsdom.window.document;
  const html = document.documentElement;
  updateElement( html, htmlAttrs, ... srcs );
  console.log( jsdom.serialize() );
}
