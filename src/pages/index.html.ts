import { printHtml } from '@lib/html';
import type { ElementSpecType } from '@lib/types/html';
const TITLE = "lieutar looper";

function icon(type:string, href:string) : ElementSpecType {
  return ['link',{rel: 'icon', type, href}];
}

printHtml (
  {'lang': 'en'},
  ['head',
    ['title', TITLE ],
    ['meta',{charset: 'UTF-8'}],
    ['link',{rel: 'stylesheet', type: 'text/css', href: 'rsc/css/index.css'}],
    icon('image/xvg+xml', 'rsc/img/favicon.svg'),
    icon('image/x-icon',  '/favicon.ico') ],
  ['body',
    ['header', [ 'h1', TITLE] ],
    ['ul', ['li', ['a', {href: 'looper-elpa'}, "looper-elpa"]]]]
);
