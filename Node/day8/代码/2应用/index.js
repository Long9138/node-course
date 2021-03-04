let {write,read,readdir} = require('johnnyfs');

readdir('../').then((files)=>{
  console.log(files)
})

async function test(){
  let files = await readdir('../../');
  console.log(files)
}

test()