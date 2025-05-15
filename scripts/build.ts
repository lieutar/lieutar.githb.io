import { fileURLToPath } from 'url';
import * as path from 'path';
import * as fs from 'fs/promises';
import {exec} from 'child_process';

const here = path.dirname( fileURLToPath( import.meta.url ) );
const projectRoot = path.join(here, '..');
const src = path.join(projectRoot, 'src/pages');
const dst = path.join(projectRoot, 'dist/pages');

type planSlotT = [string, string];

async function plan( dir : string ) : Promise<planSlotT[]> {
  const stats = await fs.stat( dir );
  if( !stats.isDirectory() ){
    throw new Error( `${dir} is not a directory.` );
  }
  const entries = await fs.readdir( dir, { withFileTypes: true } );
  const result = [] as planSlotT[];
  for( const entry of entries ){
    const {name} = entry;
    const epath = path.join( dir, name );
    if ( entry.isDirectory() ){
      result.push(  ... await plan( epath ) );
    } else {
      if( name.match(/\.\w+\.ts$/) ){
        result.push( [epath, path.join( dst,
          path.relative(src, epath.replace(/\.ts$/, '') ) )]
        );
      }
    }
  }
  return result;
}

for ( const pair of await plan(src) ){
  const [ from, to ] = pair;
  const dstpath = path.dirname(to);
  if( ! await fs.exists(to) ) await fs.mkdir(dstpath, {recursive: true});
  if( ! (await fs.stat( dstpath )).isDirectory() )
    throw new Error(`${dstpath} isn't a directory`);

  exec(`bun run ${from}`, (err , stdout, stderr)=>{
    if(err){
      console.error( err );
      console.error( stderr );
    }else{
      fs.writeFile( to, stdout ).then( (_) => {
        console.log(`Wrote: ${path.relative(dst, to)}`);
      });
    }
  });
}
