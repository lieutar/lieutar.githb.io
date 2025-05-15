import jss, { type Styles }  from 'jss';
import preset from 'jss-preset-default';

export function printCss( style : Styles ) {
  jss.setup(preset());
  const ss = jss.createStyleSheet( style );
  console.log(String(ss));
};
